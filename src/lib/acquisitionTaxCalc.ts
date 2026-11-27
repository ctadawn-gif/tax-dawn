// 부동산 취득세 계산 로직
// 2026년 현행법 기준 (지방세법 제11조, 제13조의2)

export type PropertyType = "house" | "farmland" | "land" | "commercial";
export type AcquisitionType = "purchase" | "inheritance" | "gift";
export type HouseCount = "1" | "2" | "3" | "4plus" | "corp";

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  house: "주택",
  farmland: "농지",
  land: "토지 (농지 외)",
  commercial: "상가·건축물",
};

export const HOUSE_COUNT_LABELS: Record<HouseCount, string> = {
  "1": "1주택",
  "2": "2주택",
  "3": "3주택",
  "4plus": "4주택 이상",
  corp: "법인",
};

export interface AcquisitionTaxInput {
  propertyType: PropertyType;
  acquisitionType: AcquisitionType;
  price: number;
  houseCount: HouseCount;
  isAdjustedArea: boolean;
  areaOver85: boolean;
  isFirstHome: boolean;
  /** (주택 증여) 시가표준액(공시가격) 3억원 이상 — 조정대상지역이면 12% 중과 대상 (지방세법 §13의2②, 시행령 §28의6①) */
  standardPriceOver3?: boolean;
  /** (주택 증여) 1세대 1주택자가 소유 주택을 배우자·직계존비속에게 증여 — 중과 제외 (§13의2② 단서) */
  donorSingleHomeToFamily?: boolean;
}

export interface AcquisitionTaxResult {
  price: number;
  acquisitionTaxRate: number;
  localEduTaxRate: number;
  ruralSpecialTaxRate: number;
  totalRate: number;
  acquisitionTax: number;
  localEduTax: number;
  ruralSpecialTax: number;
  firstHomeDiscount: number;
  totalTax: number;
  rateDescription: string;
}

// 1주택 매매 - 취득가액 구간별 세율 (%)
// 6억 초과 9억 이하: (취득가액 × 2/3억 − 3) × 1/100, 소수점 이하 다섯째 자리에서 반올림해 넷째 자리까지 (지방세법 §11①8나)
//   → 소수 세율을 넷째 자리까지 = 퍼센트로 둘째 자리까지. 예) 7억 → 0.0167 = 1.67%
//   price 는 만원. 소수 세율 × 10000 = (2 × price − 90000) ÷ 300 → 정수로 반올림
function calcHouseRate1(price: number): number {
  if (price <= 60000) return 1.0;
  if (price <= 90000) {
    const q = 2 * price - 90000;
    const r4 = Math.floor((2 * q + 300) / 600);
    return r4 / 100;
  }
  return 3.0;
}

/** 퍼센트 세율 → 10만분의 1 단위 정수 (1% = 1,000) */
const toUnit = (pct: number) => Math.round(pct * 1000);

// 주택 취득세율
function calcHouseAcquisitionRate(
  price: number,
  houseCount: HouseCount,
  isAdjustedArea: boolean,
): number {
  if (houseCount === "1") return calcHouseRate1(price);
  if (houseCount === "2") return isAdjustedArea ? 8 : calcHouseRate1(price);
  if (houseCount === "3") return isAdjustedArea ? 12 : 8;
  return 12;
}

// 지방교육세율 (지방세법 §151①1) — (표준세율 − 2%) × 20%
//   · 주택 유상거래 1~3% 특례: 해당 세율 × 50% × 20% = 세율 × 10%
//   · 중과(8%·12%): 0.4%
//   예) 증여 3.5% → 0.3%, 상속 2.8% → 0.16%, 농지 매매 3% → 0.2%, 농지 상속 2.3% → 0.06%, 비주택 매매 4% → 0.4%
//   · 6~9억 구간은 세율의 10%를 반올림하지 않는다. 예) 1.67% → 0.167%
function calcLocalEduRate(acquisitionRate: number, propertyType: PropertyType, acquisitionType: AcquisitionType): number {
  if (propertyType === "house" && acquisitionRate >= 8) return 0.4;
  if (propertyType === "house" && acquisitionType === "purchase") return toUnit(acquisitionRate) / 10 / 1000;
  return Math.max(0, toUnit(acquisitionRate) - 2000) / 5 / 1000;
}

// 농특세율
function calcRuralSpecialRate(
  acquisitionRate: number,
  propertyType: PropertyType,
  areaOver85: boolean,
): number {
  // 주택 85㎡ 이하: 비과세
  if (propertyType === "house" && !areaOver85) return 0;

  // 주택 85㎡ 초과
  if (propertyType === "house") {
    if (acquisitionRate >= 12) return 1.0;
    if (acquisitionRate >= 8) return 0.6;
    return 0.2;
  }

  // 비주택: 0.2%
  return 0.2;
}

export function calculateAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxResult {
  const {
    propertyType,
    acquisitionType,
    price,
    houseCount,
    isAdjustedArea,
    areaOver85,
    isFirstHome,
  } = input;

  let acquisitionTaxRate: number;
  let rateDescription: string;

  if (propertyType === "house" && acquisitionType === "purchase") {
    // 주택 매매
    acquisitionTaxRate = calcHouseAcquisitionRate(price, houseCount, isAdjustedArea);
    if (houseCount === "1") {
      if (price <= 60000) rateDescription = "1주택 6억 이하 (1%)";
      else if (price <= 90000) rateDescription = `1주택 6~9억 구간 (${Math.round(acquisitionTaxRate * 100) / 100}%)`;
      else rateDescription = "1주택 9억 초과 (3%)";
    } else if (houseCount === "2") {
      rateDescription = isAdjustedArea ? "2주택 조정대상지역 (8%)" : `2주택 비조정 (${Math.round(acquisitionTaxRate * 100) / 100}%)`;
    } else if (houseCount === "3") {
      rateDescription = isAdjustedArea ? "3주택 조정대상지역 (12%)" : "3주택 비조정 (8%)";
    } else if (houseCount === "4plus") {
      rateDescription = "4주택 이상 (12%)";
    } else {
      rateDescription = "법인 취득 (12%)";
    }
  } else if (propertyType === "house" && acquisitionType === "inheritance") {
    acquisitionTaxRate = 2.8;
    rateDescription = "주택 상속 (2.8%)";
  } else if (propertyType === "house" && acquisitionType === "gift") {
    // 조정대상지역 + 시가표준액 3억 이상 → 12% 중과. 단, 1세대1주택자가 배우자·직계존비속에게 증여하면 제외
    if (isAdjustedArea && input.standardPriceOver3 && !input.donorSingleHomeToFamily) {
      acquisitionTaxRate = 12;
      rateDescription = "조정대상지역 3억 이상 주택 증여 중과 (12%)";
    } else {
      acquisitionTaxRate = 3.5;
      rateDescription = "주택 증여 (3.5%)";
    }
  } else if (propertyType === "farmland") {
    // 농지 (지방세법 제11조)
    if (acquisitionType === "purchase") {
      acquisitionTaxRate = 3;
      rateDescription = "농지 매매 (3%)";
    } else if (acquisitionType === "inheritance") {
      acquisitionTaxRate = 2.3;
      rateDescription = "농지 상속 (2.3%)";
    } else {
      acquisitionTaxRate = 3.5;
      rateDescription = "농지 증여 (3.5%)";
    }
  } else if (propertyType === "land") {
    // 농지 외 토지
    if (acquisitionType === "purchase") {
      acquisitionTaxRate = 4;
      rateDescription = "토지 매매 (4%)";
    } else if (acquisitionType === "inheritance") {
      acquisitionTaxRate = 2.8;
      rateDescription = "토지 상속 (2.8%)";
    } else {
      acquisitionTaxRate = 3.5;
      rateDescription = "토지 증여 (3.5%)";
    }
  } else {
    // 상가·건축물
    if (acquisitionType === "purchase") {
      acquisitionTaxRate = 4;
      rateDescription = "상가·건축물 매매 (4%)";
    } else if (acquisitionType === "inheritance") {
      acquisitionTaxRate = 2.8;
      rateDescription = "상가·건축물 상속 (2.8%)";
    } else {
      acquisitionTaxRate = 3.5;
      rateDescription = "상가·건축물 증여 (3.5%)";
    }
  }

  const localEduTaxRate = calcLocalEduRate(acquisitionTaxRate, propertyType, acquisitionType);
  const ruralSpecialTaxRate = calcRuralSpecialRate(acquisitionTaxRate, propertyType, areaOver85);
  // 세액은 원 단위로 계산하고 원 미만을 버린 뒤, 화면과 맞추려고 만원 단위로 돌려준다 (예: 864.5 = 8,645,000원)
  const acqUnit = toUnit(acquisitionTaxRate);
  const eduUnit = toUnit(localEduTaxRate);
  const ruralUnit = toUnit(ruralSpecialTaxRate);
  const totalRate = (acqUnit + eduUnit + ruralUnit) / 1000;

  const priceWon = Math.max(0, Math.floor((price || 0) * 10000));
  const taxWon = (unit: number) => Math.floor((priceWon * unit) / 100000);
  const acqWon = taxWon(acqUnit);
  const eduWon = taxWon(eduUnit);
  const ruralWon = taxWon(ruralUnit);

  // 생애최초 감면: 1주택 매매만, 취득가액 12억 이하, 한도 200만원
  let discountWon = 0;
  if (
    isFirstHome &&
    propertyType === "house" &&
    acquisitionType === "purchase" &&
    houseCount === "1" &&
    price <= 120000
  ) {
    discountWon = Math.min(2_000_000, acqWon);
  }

  const totalWon = Math.max(0, acqWon + eduWon + ruralWon - discountWon);
  const acquisitionTax = acqWon / 10000;
  const localEduTax = eduWon / 10000;
  const ruralSpecialTax = ruralWon / 10000;
  const firstHomeDiscount = discountWon / 10000;
  const totalTax = totalWon / 10000;

  return {
    price,
    acquisitionTaxRate: acqUnit / 1000,
    localEduTaxRate: eduUnit / 1000,
    ruralSpecialTaxRate: ruralUnit / 1000,
    totalRate,
    acquisitionTax,
    localEduTax,
    ruralSpecialTax,
    firstHomeDiscount,
    totalTax,
    rateDescription,
  };
}

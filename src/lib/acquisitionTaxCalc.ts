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

// 1주택 매매 - 취득가액 구간별 세율
function calcHouseRate1(price: number): number {
  if (price <= 60000) return 1.0;
  if (price <= 90000) {
    const priceEok = price / 10000;
    return (priceEok * 2 / 3 - 3);
  }
  return 3.0;
}

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

// 지방교육세율
function calcLocalEduRate(acquisitionRate: number, propertyType: PropertyType): number {
  if (propertyType === "house") {
    if (acquisitionRate >= 8) return 0.4;
    return Math.round(acquisitionRate * 10) / 100;
  }
  // 비주택: 취득세율의 20% (농지 3% → 0.6%, 일반 4% → 0.4% 등)
  // 지방세법 시행령에 따라 비주택은 0.4% 고정이 일반적
  return 0.4;
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
    acquisitionTaxRate = 3.5;
    rateDescription = "주택 증여 (3.5%)";
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

  const localEduTaxRate = calcLocalEduRate(acquisitionTaxRate, propertyType);
  const ruralSpecialTaxRate = calcRuralSpecialRate(acquisitionTaxRate, propertyType, areaOver85);
  const totalRate = Math.round((acquisitionTaxRate + localEduTaxRate + ruralSpecialTaxRate) * 100) / 100;

  const acquisitionTax = Math.round(price * acquisitionTaxRate / 100);
  const localEduTax = Math.round(price * localEduTaxRate / 100);
  const ruralSpecialTax = Math.round(price * ruralSpecialTaxRate / 100);

  // 생애최초 감면: 1주택 매매만, 취득가액 12억 이하, 한도 200만원
  let firstHomeDiscount = 0;
  if (
    isFirstHome &&
    propertyType === "house" &&
    acquisitionType === "purchase" &&
    houseCount === "1" &&
    price <= 120000
  ) {
    firstHomeDiscount = Math.min(200, acquisitionTax);
  }

  const totalTax = Math.max(0, acquisitionTax + localEduTax + ruralSpecialTax - firstHomeDiscount);

  return {
    price,
    acquisitionTaxRate: Math.round(acquisitionTaxRate * 100) / 100,
    localEduTaxRate: Math.round(localEduTaxRate * 100) / 100,
    ruralSpecialTaxRate: Math.round(ruralSpecialTaxRate * 100) / 100,
    totalRate,
    acquisitionTax,
    localEduTax,
    ruralSpecialTax,
    firstHomeDiscount,
    totalTax,
    rateDescription,
  };
}

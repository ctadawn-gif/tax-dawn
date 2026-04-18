// 상속세·증여세 계산 로직
// 현행법 기준 (상속세 및 증여세법)
// 정부 개정안(자녀공제 5억, 최고세율 40%)은 2024.12 국회 부결 → 현행 유지

// === 공통 세율표 (상속세 = 증여세 동일) ===
const TAX_BRACKETS = [
  { limit: 10000, rate: 0.10, deduction: 0 },      // 1억 이하
  { limit: 50000, rate: 0.20, deduction: 1000 },    // 5억 이하
  { limit: 100000, rate: 0.30, deduction: 6000 },   // 10억 이하
  { limit: 300000, rate: 0.40, deduction: 16000 },  // 30억 이하
  { limit: Infinity, rate: 0.50, deduction: 46000 }, // 30억 초과
];

function calcTax(taxable: number): number {
  if (taxable <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.limit) {
      return taxable * b.rate - b.deduction;
    }
  }
  return 0;
}

function findRate(taxable: number): string {
  if (taxable <= 0) return "0%";
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.limit) return `${b.rate * 100}%`;
  }
  return "50%";
}

// =====================
// 상속세
// =====================

export interface InheritanceTaxInput {
  totalAssets: number;        // 총 상속재산 (만원)
  debtsAndExpenses: number;   // 채무·공과금·장례비용 (만원)
  hasSpouse: boolean;         // 배우자 유무
  spouseInheritance: number;  // 배우자 실제 상속액 (만원) - 0이면 최소 5억 적용
  children: number;           // 자녀 수
  minorChildren: number;      // 미성년 자녀 수 (19세까지 잔여연수 필요)
  minorRemainingYears: number; // 미성년자 잔여연수 평균
  elderlyCount: number;       // 연로자(65세 이상) 수
  priorGiftsToHeir: number;   // 10년 내 상속인 사전증여 (만원)
  priorGiftsToSpouse: number; // 10년 내 배우자 사전증여 (만원)
  generationSkip: boolean;    // 세대생략 상속 여부
}

export interface InheritanceTaxResult {
  totalAssets: number;
  debtsAndExpenses: number;
  taxableBase: number;          // 상속세 과세가액
  basicDeduction: number;       // 기초공제 (2억)
  childDeduction: number;       // 자녀공제
  minorDeduction: number;       // 미성년자공제
  elderlyDeduction: number;     // 연로자공제
  personalDeductionTotal: number; // 기초+인적공제 합계
  lumpSumDeduction: number;     // 일괄공제 (5억)
  appliedDeduction: string;     // 적용된 공제 방식
  spouseDeduction: number;      // 배우자상속공제
  totalDeduction: number;       // 공제 합계
  taxableIncome: number;        // 과세표준
  taxRate: string;
  computedTax: number;          // 산출세액
  generationSkipSurcharge: number; // 세대생략 할증
  reportDiscount: number;       // 신고세액공제 (3%)
  finalTax: number;             // 최종 납부세액
  localTax: number;             // 없음 (상속세는 지방소득세 없음)
}

export function calculateInheritanceTax(input: InheritanceTaxInput): InheritanceTaxResult {
  const {
    totalAssets,
    debtsAndExpenses,
    hasSpouse,
    spouseInheritance,
    children,
    minorChildren,
    minorRemainingYears,
    elderlyCount,
    priorGiftsToHeir,
    priorGiftsToSpouse,
    generationSkip,
  } = input;

  // 1. 상속세 과세가액
  const taxableBase = Math.max(0, totalAssets - debtsAndExpenses + priorGiftsToHeir + priorGiftsToSpouse);

  // 2. 공제 계산

  // 기초공제: 2억
  const basicDeduction = 20000;

  // 인적공제
  const childDeduction = children * 5000; // 자녀 1인당 5,000만원
  const minorDeduction = minorChildren * 1000 * minorRemainingYears; // 미성년자 1,000만원 x 잔여연수
  const elderlyDeduction = elderlyCount * 5000; // 연로자 1인당 5,000만원

  const personalDeductionTotal = basicDeduction + childDeduction + minorDeduction + elderlyDeduction;

  // 일괄공제: 5억
  const lumpSumDeduction = 50000;

  // 기초+인적 vs 일괄 중 큰 쪽 선택
  const appliedBasicPersonal = Math.max(personalDeductionTotal, lumpSumDeduction);
  const appliedDeduction = personalDeductionTotal > lumpSumDeduction
    ? "기초공제 + 인적공제"
    : "일괄공제 (5억)";

  // 배우자상속공제
  let spouseDeduction = 0;
  if (hasSpouse) {
    if (spouseInheritance > 0) {
      // 실제 상속액 기준, 최소 5억 ~ 최대 30억
      spouseDeduction = Math.max(50000, Math.min(spouseInheritance, 300000));
    } else {
      // 입력 안 하면 최소 5억
      spouseDeduction = 50000;
    }
  }

  // 총 공제
  // 상속공제 적용한도: 상속세 과세가액 - 사전증여 과세표준
  const deductionLimit = Math.max(0, taxableBase - priorGiftsToHeir - priorGiftsToSpouse);
  const rawTotalDeduction = appliedBasicPersonal + spouseDeduction;
  const totalDeduction = Math.min(rawTotalDeduction, deductionLimit);

  // 3. 과세표준
  const taxableIncome = Math.max(0, taxableBase - totalDeduction);

  // 4. 산출세액
  const computedTax = calcTax(taxableIncome);

  // 5. 세대생략 할증 (30%)
  const generationSkipSurcharge = generationSkip ? computedTax * 0.3 : 0;

  const taxAfterSurcharge = computedTax + generationSkipSurcharge;

  // 6. 신고세액공제 (3%)
  const reportDiscount = taxAfterSurcharge * 0.03;

  // 7. 최종 납부세액
  const finalTax = Math.max(0, taxAfterSurcharge - reportDiscount);

  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    totalAssets,
    debtsAndExpenses,
    taxableBase: Math.round(taxableBase),
    basicDeduction,
    childDeduction,
    minorDeduction,
    elderlyDeduction,
    personalDeductionTotal,
    lumpSumDeduction,
    appliedDeduction,
    spouseDeduction,
    totalDeduction: Math.round(totalDeduction),
    taxableIncome: Math.round(taxableIncome),
    taxRate: findRate(taxableIncome),
    computedTax: r(computedTax),
    generationSkipSurcharge: r(generationSkipSurcharge),
    reportDiscount: r(reportDiscount),
    finalTax: r(finalTax),
    localTax: 0,
  };
}

// =====================
// 증여세
// =====================

export type GiftRelation =
  | "spouse"          // 배우자: 6억
  | "linealAdult"     // 직계존속→성년 직계비속: 5,000만
  | "linealMinor"     // 직계존속→미성년 직계비속: 2,000만
  | "linealAscendant" // 직계비속→직계존속: 5,000만
  | "otherRelative"   // 기타친족(6촌 혈족, 4촌 인척): 1,000만
  | "other";          // 기타: 0

const GIFT_EXEMPTIONS: Record<GiftRelation, number> = {
  spouse: 60000,        // 6억
  linealAdult: 5000,    // 5,000만
  linealMinor: 2000,    // 2,000만
  linealAscendant: 5000, // 5,000만
  otherRelative: 1000,  // 1,000만
  other: 0,
};

const GIFT_RELATION_LABELS: Record<GiftRelation, string> = {
  spouse: "배우자",
  linealAdult: "직계존속 → 성년 자녀",
  linealMinor: "직계존속 → 미성년 자녀",
  linealAscendant: "자녀 → 부모(직계존속)",
  otherRelative: "기타 친족 (6촌/4촌)",
  other: "기타",
};

export { GIFT_RELATION_LABELS };

export interface GiftTaxInput {
  giftAmount: number;          // 증여재산가액 (만원)
  relation: GiftRelation;      // 증여자-수증자 관계
  priorGifts10yr: number;      // 10년 내 동일인 사전증여 합산 (만원)
  debtAssumption: number;      // 채무 인수액 (만원)
  generationSkip: boolean;     // 세대생략 증여 여부
  isMinorOver20: boolean;      // 미성년자이면서 증여재산 20억 초과 (할증 40%)
}

export interface GiftTaxResult {
  giftAmount: number;
  debtAssumption: number;
  taxableBase: number;          // 증여세 과세가액
  exemption: number;            // 증여재산공제
  exemptionLabel: string;       // 공제 설명
  priorGifts10yr: number;
  taxableIncome: number;        // 과세표준
  taxRate: string;
  computedTax: number;          // 산출세액
  priorGiftTax: number;         // 기납부 증여세 (사전증여분)
  generationSkipSurcharge: number;
  reportDiscount: number;       // 신고세액공제 (3%)
  finalTax: number;             // 최종 납부세액
}

export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult {
  const {
    giftAmount,
    relation,
    priorGifts10yr,
    debtAssumption,
    generationSkip,
    isMinorOver20,
  } = input;

  // 1. 증여세 과세가액
  const taxableBase = Math.max(0, giftAmount - debtAssumption);

  // 2. 증여재산공제 (10년 합산)
  const exemptionTotal = GIFT_EXEMPTIONS[relation];
  const exemptionLabel = `${GIFT_RELATION_LABELS[relation]} (${(exemptionTotal / 10000 >= 1) ? `${exemptionTotal / 10000}억` : `${exemptionTotal}만원`} 한도, 10년 합산)`;

  // 이미 사전증여로 공제를 썼으면 남은 공제액만 적용
  const remainingExemption = Math.max(0, exemptionTotal - priorGifts10yr);
  const appliedExemption = Math.min(remainingExemption, taxableBase);

  // 3. 과세표준 (이번 증여 + 사전증여 합산 - 공제)
  const totalGiftAmount = taxableBase + priorGifts10yr;
  const taxableIncome = Math.max(0, totalGiftAmount - exemptionTotal);

  // 4. 산출세액 (합산 과세표준 기준)
  const totalComputedTax = calcTax(taxableIncome);

  // 5. 사전증여분에 대한 기납부세액
  const priorTaxableIncome = Math.max(0, priorGifts10yr - exemptionTotal);
  const priorGiftTax = calcTax(priorTaxableIncome);

  // 이번 증여분 세액 = 전체 세액 - 기납부 세액
  const computedTax = Math.max(0, totalComputedTax - priorGiftTax);

  // 6. 세대생략 할증
  const surchargeRate = generationSkip ? (isMinorOver20 ? 0.4 : 0.3) : 0;
  const generationSkipSurcharge = computedTax * surchargeRate;

  const taxAfterSurcharge = computedTax + generationSkipSurcharge;

  // 7. 신고세액공제 (3%)
  const reportDiscount = taxAfterSurcharge * 0.03;

  // 8. 최종 납부세액
  const finalTax = Math.max(0, taxAfterSurcharge - reportDiscount);

  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    giftAmount,
    debtAssumption,
    taxableBase: Math.round(taxableBase),
    exemption: Math.round(appliedExemption),
    exemptionLabel,
    priorGifts10yr,
    taxableIncome: Math.round(taxableIncome),
    taxRate: findRate(taxableIncome),
    computedTax: r(computedTax),
    priorGiftTax: r(priorGiftTax),
    generationSkipSurcharge: r(generationSkipSurcharge),
    reportDiscount: r(reportDiscount),
    finalTax: r(finalTax),
  };
}

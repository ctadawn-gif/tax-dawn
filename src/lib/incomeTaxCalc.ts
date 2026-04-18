// 종합소득세 계산 로직
// 2025년 귀속 (2026년 신고) 기준
// 소득세법 제55조(세율), 제47조(기본공제), 제51조(추가공제)

import { type IndustryRate, calcExpenseByRate } from "./industryRates";

// === 세율표 ===
const TAX_BRACKETS = [
  { limit: 1400, rate: 0.06, deduction: 0 },
  { limit: 5000, rate: 0.15, deduction: 126 },
  { limit: 8800, rate: 0.24, deduction: 576 },
  { limit: 15000, rate: 0.35, deduction: 1544 },
  { limit: 30000, rate: 0.38, deduction: 1994 },
  { limit: 50000, rate: 0.40, deduction: 2594 },
  { limit: 100000, rate: 0.42, deduction: 3594 },
  { limit: Infinity, rate: 0.45, deduction: 6594 },
];

// === 근로소득공제 (소득세법 제47조) ===
function calcEarnedIncomeDeduction(totalSalary: number): number {
  if (totalSalary <= 500) return totalSalary * 0.7;
  if (totalSalary <= 1500) return 350 + (totalSalary - 500) * 0.4;
  if (totalSalary <= 4500) return 750 + (totalSalary - 1500) * 0.15;
  if (totalSalary <= 10000) return 1200 + (totalSalary - 4500) * 0.05;
  return Math.min(2000, 1475 + (totalSalary - 10000) * 0.02);
}

// === 근로소득세액공제 (소득세법 제59조) ===
function calcEarnedIncomeTaxCredit(
  computedTax: number,
  totalSalary: number
): number {
  let credit: number;
  if (computedTax <= 130) {
    credit = computedTax * 0.55;
  } else {
    credit = 71.5 + (computedTax - 130) * 0.3;
  }

  let limit: number;
  if (totalSalary <= 3300) {
    limit = 74;
  } else if (totalSalary <= 7000) {
    limit = Math.max(66, 74 - (totalSalary - 3300) * 0.008);
  } else if (totalSalary <= 12000) {
    limit = Math.max(50, 66 - (totalSalary - 7000) * 0.5 / 100);
  } else {
    limit = 50;
  }

  return Math.min(credit, limit);
}

// === 산출세액 계산 ===
function calcComputedTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return taxableIncome * bracket.rate - bracket.deduction;
    }
  }
  return 0;
}

// === 소득 유형 ===
export type IncomeType = "business" | "salary" | "combined";
export type ExpenseMethod = "simple" | "standard" | "book";

export interface IncomeTaxInput {
  incomeType: IncomeType;

  // 사업/프리랜서 소득
  businessRevenue: number; // 사업소득 총수입금액 (만원)
  expenseMethod: ExpenseMethod;
  industryRate: IndustryRate | null; // 업종코드 선택 시
  manualExpenseRate: number; // 직접 입력 경비율 (%)
  bookExpense: number; // 장부상 필요경비 (만원)
  hasWithholding: boolean; // 3.3% 원천징수 여부

  // 근로소득
  salaryRevenue: number; // 총급여액 (만원)

  // 인적공제
  hasSpouse: boolean;
  dependents: number;
  elderly: number;
  disabled: number;

  // 국민연금·건강보험료
  socialInsurance: number;

  // 기납부세액
  prepaidTax: number;
}

export interface IncomeTaxResult {
  // 사업소득
  businessRevenue: number;
  businessExpense: number;
  businessIncome: number;

  // 근로소득
  salaryRevenue: number;
  salaryDeduction: number;
  salaryIncome: number;

  // 종합
  totalIncome: number;
  personalDeduction: number;
  socialInsuranceDeduction: number;
  totalDeduction: number;
  taxableIncome: number;
  computedTax: number;
  taxCredit: number;
  determinedTax: number;
  localTax: number;
  totalTax: number;
  prepaidTax: number;
  finalTax: number;
  taxRate: string;
  appliedExpenseRate: string;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const {
    incomeType,
    businessRevenue,
    expenseMethod,
    industryRate,
    manualExpenseRate,
    bookExpense,
    hasWithholding,
    salaryRevenue,
    hasSpouse,
    dependents,
    elderly,
    disabled,
    socialInsurance,
    prepaidTax,
  } = input;

  // 1. 사업소득 계산
  let businessExpense = 0;
  let businessIncome = 0;
  let appliedExpenseRate = "-";
  const hasBusiness = incomeType === "business" || incomeType === "combined";

  if (hasBusiness && businessRevenue > 0) {
    if (expenseMethod === "book") {
      businessExpense = bookExpense;
      appliedExpenseRate = "장부작성";
    } else if (industryRate) {
      businessExpense = calcExpenseByRate(businessRevenue, industryRate, expenseMethod);
      if (expenseMethod === "simple" && industryRate.simpleExcessRate != null) {
        appliedExpenseRate = `${industryRate.simpleRate}% / ${industryRate.simpleExcessRate}%`;
      } else {
        const rate = expenseMethod === "simple" ? industryRate.simpleRate : industryRate.standardRate;
        appliedExpenseRate = `${rate}%`;
      }
    } else if (manualExpenseRate > 0) {
      businessExpense = businessRevenue * (manualExpenseRate / 100);
      appliedExpenseRate = `${manualExpenseRate}%`;
    }
    businessIncome = Math.max(0, businessRevenue - businessExpense);
  }

  // 2. 근로소득 계산
  let salaryDeduction = 0;
  let salaryIncome = 0;
  const hasSalary = incomeType === "salary" || incomeType === "combined";

  if (hasSalary && salaryRevenue > 0) {
    salaryDeduction = calcEarnedIncomeDeduction(salaryRevenue);
    salaryIncome = Math.max(0, salaryRevenue - salaryDeduction);
  }

  // 3. 종합소득금액
  const totalIncome = businessIncome + salaryIncome;

  // 4. 소득공제
  const basicDeduction = 150;
  const spouseDeduction = hasSpouse ? 150 : 0;
  const dependentDeduction = dependents * 150;
  const elderlyDeduction = elderly * 100;
  const disabledDeduction = disabled * 200;
  const personalDeduction =
    basicDeduction + spouseDeduction + dependentDeduction + elderlyDeduction + disabledDeduction;

  const socialInsuranceDeduction = socialInsurance;
  const totalDeduction = personalDeduction + socialInsuranceDeduction;

  // 5. 과세표준
  const taxableIncome = Math.max(0, totalIncome - totalDeduction);

  // 6. 산출세액
  const computedTax = calcComputedTax(taxableIncome);

  // 7. 세액공제
  let taxCredit = 0;
  if (incomeType === "salary") {
    taxCredit = calcEarnedIncomeTaxCredit(computedTax, salaryRevenue);
  } else if (incomeType === "combined" && salaryRevenue > 0) {
    const salaryPortion = salaryIncome / (totalIncome || 1);
    const salaryTax = computedTax * salaryPortion;
    taxCredit = calcEarnedIncomeTaxCredit(salaryTax, salaryRevenue) + 7;
  } else {
    taxCredit = 7; // 표준세액공제
  }

  // 8. 적용 세율
  let taxRate = "0%";
  if (taxableIncome > 0) {
    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= bracket.limit) {
        taxRate = `${bracket.rate * 100}%`;
        break;
      }
    }
  }

  // 9. 결정세액
  const determinedTax = Math.max(0, computedTax - taxCredit);

  // 10. 지방소득세
  const localTax = determinedTax * 0.1;

  // 11. 총 세액
  const totalTax = determinedTax + localTax;

  // 12. 기납부세액
  let actualPrepaid = prepaidTax;
  if (hasWithholding && hasBusiness && prepaidTax === 0) {
    actualPrepaid = businessRevenue * 0.033;
  }

  const finalTax = totalTax - actualPrepaid;

  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    businessRevenue,
    businessExpense: Math.round(businessExpense),
    businessIncome: Math.round(businessIncome),
    salaryRevenue,
    salaryDeduction: Math.round(salaryDeduction),
    salaryIncome: Math.round(salaryIncome),
    totalIncome: Math.round(totalIncome),
    personalDeduction,
    socialInsuranceDeduction,
    totalDeduction,
    taxableIncome: Math.round(taxableIncome),
    computedTax: r(computedTax),
    taxCredit: r(taxCredit),
    determinedTax: r(determinedTax),
    localTax: r(localTax),
    totalTax: r(totalTax),
    prepaidTax: r(actualPrepaid),
    finalTax: r(finalTax),
    taxRate,
    appliedExpenseRate,
  };
}

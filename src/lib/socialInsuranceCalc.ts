// 4대보험료 계산 로직
// 2026년 기준 요율 (4대사회보험 정보연계센터)

// === 국민연금 ===
const NPS_RATE = 0.095;
const NPS_MIN = 400000;
const NPS_MAX = 6370000;

// === 건강보험 ===
const HI_RATE = 0.0719;
const HI_MIN = 280528;
const HI_MAX = 127725730;

// === 장기요양보험 ===
const LTC_RATE_OVER_HI = 0.009448 / 0.0719;

// === 고용보험 ===
const EI_UNEMPLOYMENT_RATE = 0.009;
const EI_STABILITY_RATES: Record<string, number> = {
  under150: 0.0025,
  over150priority: 0.0045,
  "150to1000": 0.0065,
  over1000: 0.0085,
};

// === 산재보험 (업종별 요율, 천분율 ‰) ===
export type IndustryType =
  | "office"
  | "retail"
  | "manufacturing_light"
  | "manufacturing_heavy"
  | "construction"
  | "it"
  | "finance"
  | "transport"
  | "education"
  | "health";

export const INDUSTRY_LABELS: Record<IndustryType, string> = {
  office: "사무직 (일반)",
  retail: "도소매·음식·숙박업",
  manufacturing_light: "제조업 (경공업·전자)",
  manufacturing_heavy: "제조업 (중공업·금속·화학)",
  construction: "건설업",
  it: "IT·소프트웨어·전자제품",
  finance: "금융 및 보험업",
  transport: "운수·창고·통신",
  education: "교육서비스업",
  health: "보건·사회복지",
};

// 산재보험료율 (‰, 천분율) + 출퇴근재해 0.6‰
const INDUSTRIAL_ACCIDENT_RATES: Record<IndustryType, number> = {
  office: 7,      // 기타 각종 사업 7‰
  retail: 8,      // 도소매·음식·숙박업 8‰
  manufacturing_light: 6,  // 전기·전자제품 6‰
  manufacturing_heavy: 13, // 기계·금속 13‰
  construction: 35,        // 건설업 35‰
  it: 6,                   // 전기·전자제품 6‰
  finance: 5,              // 금융·보험 5‰
  transport: 13,           // 운수·창고·통신 13‰
  education: 7,            // 교육서비스 7‰
  health: 9,               // 보건·사회복지 9‰
};
const COMMUTE_ACCIDENT_RATE = 0.6; // 출퇴근재해 ‰

export type CompanySize = "under150" | "over150priority" | "150to1000" | "over1000";

export const COMPANY_SIZE_LABELS: Record<CompanySize, string> = {
  under150: "150인 미만",
  over150priority: "150인 이상 (우선지원)",
  "150to1000": "150 ~ 1,000인 미만",
  over1000: "1,000인 이상 / 공공기관",
};

export interface SocialInsuranceInput {
  monthlySalary: number;     // 월 총 급여 (원)
  taxFreeMeal: number;       // 비과세 식대 (원)
  taxFreeCarAllowance: number; // 비과세 차량유지비 (원)
  taxFreeChildcare: number;  // 비과세 출산보육수당 (원)
  taxFreeOther: number;      // 기타 비과세 (원)
  companySize: CompanySize;
  industryType: IndustryType;
  dependents: number;        // 부양가족 수 (본인 포함)
}

export interface InsuranceItem {
  name: string;
  total: number;
  employee: number;
  employer: number;
}

export interface SocialInsuranceResult {
  grossSalary: number;
  totalTaxFree: number;
  taxableSalary: number;
  items: InsuranceItem[];
  totalEmployee: number;
  totalEmployer: number;
  grandTotal: number;
  incomeTax: number;       // 소득세 원천징수 (근로자)
  localIncomeTax: number;  // 지방소득세 원천징수 (근로자)
  totalWithholding: number; // 근로자 총 공제액 (4대보험 + 소득세 + 지방소득세)
  netPay: number;           // 실수령액
}

function floor(v: number): number {
  return Math.floor(v);
}

/** 원단위 절사 — 4대보험·세금 실제 납부 단위(10원) */
function floor10(v: number): number {
  return Math.floor(v / 10) * 10;
}

// === 소득세 간이세액 계산 (간이세액표 기반 간편 계산) ===
// 월 급여 → 연간 환산 → 근로소득공제 → 인적공제 → 세율 적용 → 월 환산
const TAX_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
];

function calcEarnedIncomeDeduction(annualSalary: number): number {
  if (annualSalary <= 5000000) return annualSalary * 0.7;
  if (annualSalary <= 15000000) return 3500000 + (annualSalary - 5000000) * 0.4;
  if (annualSalary <= 45000000) return 7500000 + (annualSalary - 15000000) * 0.15;
  if (annualSalary <= 100000000) return 12000000 + (annualSalary - 45000000) * 0.05;
  return Math.min(20000000, 14750000 + (annualSalary - 100000000) * 0.02);
}

function calcMonthlyIncomeTax(monthlySalary: number, taxFreeSalary: number, dependents: number): number {
  const taxableMonthly = Math.max(0, monthlySalary - taxFreeSalary);
  if (taxableMonthly === 0) return 0;

  const annualSalary = taxableMonthly * 12;
  const earnedDeduction = calcEarnedIncomeDeduction(annualSalary);
  const incomeAmount = Math.max(0, annualSalary - earnedDeduction);

  // 인적공제: 부양가족 수 × 150만원
  const personalDeduction = dependents * 1500000;
  // 국민연금 공제 — 간이세액표 추정 방식: 총 월급여 기준 NPS 가정
  // (비과세 차감 전 monthlySalary 사용 → 공식 간이세액표 값과 일치)
  const npsBasis = Math.max(NPS_MIN, Math.min(NPS_MAX, monthlySalary));
  const npsDeduction = floor(npsBasis * NPS_RATE / 2) * 12;

  const taxableIncome = Math.max(0, incomeAmount - personalDeduction - npsDeduction);

  // 산출세액
  let computedTax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      computedTax = taxableIncome * bracket.rate - bracket.deduction;
      break;
    }
  }
  computedTax = Math.max(0, computedTax);

  // 근로소득세액공제
  let taxCredit: number;
  if (computedTax <= 1300000) {
    taxCredit = computedTax * 0.55;
  } else {
    taxCredit = 715000 + (computedTax - 1300000) * 0.3;
  }
  let creditLimit: number;
  if (annualSalary <= 33000000) creditLimit = 740000;
  else if (annualSalary <= 70000000) creditLimit = Math.max(660000, 740000 - (annualSalary - 33000000) * 0.008);
  else if (annualSalary <= 120000000) creditLimit = Math.max(500000, 660000 - (annualSalary - 70000000) * 0.005);
  else creditLimit = 500000;
  taxCredit = Math.min(taxCredit, creditLimit);

  const determinedTax = Math.max(0, computedTax - taxCredit);
  return floor10(determinedTax / 12);
}

export function calculateSocialInsurance(input: SocialInsuranceInput): SocialInsuranceResult {
  const {
    monthlySalary,
    taxFreeMeal,
    taxFreeCarAllowance,
    taxFreeChildcare,
    taxFreeOther,
    companySize,
    industryType,
    dependents,
  } = input;

  const totalTaxFree = taxFreeMeal + taxFreeCarAllowance + taxFreeChildcare + taxFreeOther;
  const taxableSalary = Math.max(0, monthlySalary - totalTaxFree);

  const items: InsuranceItem[] = [];

  // 1. 국민연금 — 10원 단위 절사
  const npsBasis = Math.max(NPS_MIN, Math.min(NPS_MAX, taxableSalary));
  const npsEmployee = floor10(npsBasis * NPS_RATE / 2);
  const npsEmployer = floor10(npsBasis * NPS_RATE / 2);
  const npsTotal = npsEmployee + npsEmployer;
  items.push({ name: "국민연금", total: npsTotal, employee: npsEmployee, employer: npsEmployer });

  // 2. 건강보험 — 10원 단위 절사
  const hiBasis = Math.max(HI_MIN, Math.min(HI_MAX, taxableSalary));
  const hiEmployee = floor10(hiBasis * HI_RATE / 2);
  const hiEmployer = floor10(hiBasis * HI_RATE / 2);
  const hiTotal = hiEmployee + hiEmployer;
  items.push({ name: "건강보험", total: hiTotal, employee: hiEmployee, employer: hiEmployer });

  // 3. 장기요양보험 — 10원 단위 절사
  const ltcTotalRaw = hiTotal * LTC_RATE_OVER_HI;
  const ltcEmployee = floor10(ltcTotalRaw / 2);
  const ltcEmployer = floor10(ltcTotalRaw / 2);
  const ltcTotal = ltcEmployee + ltcEmployer;
  items.push({ name: "장기요양보험", total: ltcTotal, employee: ltcEmployee, employer: ltcEmployer });

  // 4. 고용보험 — 10원 단위 절사
  const eiEmployeeRate = EI_UNEMPLOYMENT_RATE;
  const eiEmployerRate = EI_UNEMPLOYMENT_RATE + EI_STABILITY_RATES[companySize];
  const eiEmployee = floor10(taxableSalary * eiEmployeeRate);
  const eiEmployer = floor10(taxableSalary * eiEmployerRate);
  const eiTotal = eiEmployee + eiEmployer;
  items.push({ name: "고용보험", total: eiTotal, employee: eiEmployee, employer: eiEmployer });

  // 5. 산재보험 (사업주 전액 부담) — 10원 단위 절사
  const wiRate = (INDUSTRIAL_ACCIDENT_RATES[industryType] + COMMUTE_ACCIDENT_RATE) / 1000;
  const wiEmployer = floor10(taxableSalary * wiRate);
  items.push({ name: "산재보험", total: wiEmployer, employee: 0, employer: wiEmployer });

  const totalEmployee = items.reduce((s, i) => s + i.employee, 0);
  const totalEmployer = items.reduce((s, i) => s + i.employer, 0);
  const grandTotal = totalEmployee + totalEmployer;

  // 6. 소득세·지방소득세 원천징수 (100% 기준) — 10원 단위 절사
  const incomeTax = calcMonthlyIncomeTax(monthlySalary, totalTaxFree, dependents);
  const localIncomeTax = floor10(incomeTax * 0.1);
  const totalWithholding = totalEmployee + incomeTax + localIncomeTax;
  const netPay = Math.max(0, monthlySalary - totalWithholding);

  return {
    grossSalary: monthlySalary,
    totalTaxFree,
    taxableSalary,
    items,
    totalEmployee,
    totalEmployer,
    grandTotal,
    incomeTax,
    localIncomeTax,
    totalWithholding,
    netPay,
  };
}

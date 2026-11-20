/**
 * 증여·차용 혼합 계산 (화면과 떼어 둔 순수 계산)
 *
 * - 가족에게서 받는 돈을 얼마는 증여, 얼마는 차용으로 할 때
 *   "가족 전체가 밖으로 내는 돈"(증여세 + 이자에서 떼는 세금 + 빌려준 사람의 종합소득세 추가분 어림 + 건강보험료 증가분)을
 *   5년, 10년, 15년으로 견준다.
 * - 숫자(세율 등)는 이 파일에 두지 않는다. officeRates.ts 의 설정값을 받아 쓴다.
 * - 원 단위 오차가 없도록 금액 계산은 정수(BigInt)로만 한다. 한 해 금액마다 원 미만을 버린다.
 */
import type { MixSettings, GiftBracket } from "./officeRates";

export type MixRelation = "adultLineal" | "minorLineal" | "spouse" | "other";
export type InsuranceType = "regional" | "employee" | "dependent";

export interface MixInput {
  /** 받는 돈 전체 (원) */
  total: number;
  /** 증여로 처리할 금액 (원) */
  gift: number;
  relation: MixRelation;
  /** 최근 10년 같은 사람에게서 이미 받은 증여 (원) */
  priorGift: number;
  useMarriageBirth: boolean;
  /** 약정 이자율 (%) */
  ratePct: number;
  /** 매달 갚는 원금 (원). 0 이면 만기에 한 번에 */
  monthlyPrincipal: number;
  insuranceType: InsuranceType;
  /** 빌려주는 사람의 이미 있는 이자·배당 소득 (한 해, 원) */
  existingFinancialIncome: number;
  /** 직장가입자의 그 밖의 급여 외 소득 (한 해, 원) */
  employeeOtherIncome: number;
  /** 종합소득세 한계세율 (%). 모르면 null */
  marginalRatePct: number | null;
}

export interface MixYear {
  year: number;
  startBalance: number;
  endBalance: number;
  interest: number;
  withholding: number;
  /** 종합소득세 추가분 어림 */
  incomeTaxExtra: number;
  /** 건강보험료 증가분 (장기요양 포함) */
  insuranceExtra: number;
  /** 이자 차액 (적정 이자율 - 약정 이자율 기준) */
  gap: number;
  gapOver: boolean;
}

export interface MixPeriod {
  years: number;
  giftTax: number;
  interest: number;
  withholding: number;
  incomeTaxExtra: number;
  insuranceExtra: number;
  /** 증여세 + 뗀 세금 + 종합소득세 추가분 + 건강보험료 증가분 */
  total: number;
  remainingPrincipal: number;
}

export interface MixResult {
  gift: number;
  loan: number;
  deduction: number;
  giftTaxBase: number;
  /** 신고세액공제 전 이번 증여분 세액 */
  giftTaxBeforeCredit: number;
  filingCredit: number;
  giftTax: number;
  /** 첫 달 이자 (원 미만 버림) */
  firstMonthInterest: number;
  /** 빌린 사람의 첫 달 부담 = 첫 달 이자 + 매달 원금 */
  firstMonthBurden: number;
  years: MixYear[];
  periods: MixPeriod[];
  /** 어느 해든 이자 차액이 기준 이상이면 true */
  gapWarning: boolean;
  /** 피부양자라 건강보험료를 계산하지 않았으면 true */
  dependentNotice: boolean;
  /** 한계세율을 몰라 기본값을 썼으면 true */
  marginalRateAssumed: boolean;
}

const PERIODS = [5, 10, 15];
const MAX_YEARS = 15;
const SCALE = BigInt(100_000_000); // % 값에 1e6 을 곱해 쓰므로, 비율로 바꾸려면 1e8 로 나눈다
const ZERO = BigInt(0);

/** % 값을 정수(백만분의 1 %)로 */
const P = (pct: number): bigint => BigInt(Math.round(pct * 1_000_000));
const B = (won: number): bigint => BigInt(Math.max(0, Math.floor(won || 0)));
const N = (v: bigint): number => Number(v);
const bmax = (a: bigint, b: bigint) => (a > b ? a : b);
const bmin = (a: bigint, b: bigint) => (a < b ? a : b);

export function deductionFor(input: Pick<MixInput, "relation" | "useMarriageBirth">, s: MixSettings): number {
  return s.deductions[input.relation] + (input.useMarriageBirth ? s.marriageBirthDeduction : 0);
}

/** 과세표준에 대한 누진 산출세액 (원 미만 버림) */
export function progressiveGiftTax(base: number, brackets: GiftBracket[]): number {
  const b = B(base);
  if (b <= ZERO) return 0;
  for (const br of brackets) {
    if (br.upTo === null || b <= B(br.upTo)) {
      return N(bmax(ZERO, (b * P(br.ratePct)) / SCALE - B(br.deduction)));
    }
  }
  return 0;
}

/** 낮출 수 있는 가장 낮은 이자율(%) = 적정 이자율 - 기준 금액 ÷ 차입금. 이 값보다 높아야 차액이 기준 미만 */
export function minRatePctExact(loan: number, s: MixSettings): number {
  if (loan <= 0) return 0;
  return Math.max(0, s.adequateRatePct - (s.gapThreshold / loan) * 100);
}

/** 한 해 이자 차액 (원 미만 버림). 약정 이자율이 적정 이자율 이상이면 0 */
export function yearlyGap(balance: number, ratePct: number, s: MixSettings): number {
  const diff = P(s.adequateRatePct) - P(ratePct);
  if (diff <= ZERO) return 0;
  return N((B(balance) * diff) / SCALE);
}

/** 권장 최저 이자율(%) : 차액이 기준 "미만"이 되는, 소수 둘째 자리까지의 가장 낮은 이자율 */
export function recommendedRatePct(loan: number, s: MixSettings): number {
  if (loan <= 0) return 0;
  let hundredths = Math.max(0, Math.ceil(minRatePctExact(loan, s) * 100 - 1e-9));
  while (yearlyGap(loan, hundredths / 100, s) >= s.gapThreshold) hundredths += 1;
  return hundredths / 100;
}

/** 무이자로 빌려도 차액이 기준 미만인 한도 (이 금액 이하) */
export function interestFreeLimit(s: MixSettings): number {
  let limit = Math.floor((s.gapThreshold / s.adequateRatePct) * 100);
  while (limit > 0 && yearlyGap(limit, 0, s) >= s.gapThreshold) limit -= 1;
  return limit;
}

/** 증여세 10% 구간을 다 쓰는 증여 금액 */
export function tenPercentBandGift(input: Pick<MixInput, "relation" | "useMarriageBirth" | "priorGift">, s: MixSettings): number {
  const firstBand = s.brackets[0]?.upTo ?? 0;
  return Math.max(0, deductionFor(input, s) + firstBand - Math.max(0, input.priorGift));
}

export function calculateMix(input: MixInput, s: MixSettings): MixResult {
  const total = B(input.total);
  const gift = bmin(B(input.gift), total);
  const loan = total - gift;
  const prior = B(input.priorGift);
  const deduction = B(deductionFor(input, s));

  // 가. 증여세
  const baseAll = bmax(ZERO, gift + prior - deduction);
  const basePrior = bmax(ZERO, prior - deduction);
  const taxAll = progressiveGiftTax(N(baseAll), s.brackets);
  const taxPrior = progressiveGiftTax(N(basePrior), s.brackets);
  const beforeCredit = B(taxAll - taxPrior);
  const filingCredit = (beforeCredit * P(s.filingCreditPct)) / SCALE;
  const giftTax = beforeCredit - filingCredit;

  // 나~바. 해마다
  const rate = P(input.ratePct);
  const monthly = B(input.monthlyPrincipal);
  const twelve = BigInt(12);
  const F = B(input.existingFinancialIncome);
  const O = input.insuranceType === "employee" ? B(input.employeeOtherIncome) : ZERO;
  const marginal = input.marginalRatePct ?? s.marginalRateUnknownPct;
  const extraRate = P(Math.max(0, marginal - s.withheldIncomeTaxPct));
  const T = B(s.financialIncomeThreshold);
  const regionalT = B(s.regionalFinancialIncomeThreshold);
  const employeeT = B(s.employeeOtherIncomeThreshold);
  const insuranceFactor = P(s.healthRatePct) * (SCALE + P(s.longTermCareOfHealthPct));

  const years: MixYear[] = [];
  let balance = loan;
  for (let y = 1; y <= MAX_YEARS; y++) {
    const start = balance;
    let balanceSum = ZERO;
    for (let m = 0; m < 12; m++) {
      balanceSum += balance;
      balance = bmax(ZERO, balance - monthly);
    }
    const interest = (balanceSum * rate) / (twelve * SCALE);
    const withholding = (interest * P(s.withholdingPct)) / SCALE;

    const overAfter = bmax(ZERO, interest + F - T);
    const overBefore = bmax(ZERO, F - T);
    const incomeTaxExtra = ((overAfter - overBefore) * extraRate * P(s.localTaxMultiplierPct)) / (SCALE * SCALE);

    let insuranceBase = ZERO;
    if (input.insuranceType === "regional") {
      const after = interest + F > regionalT ? interest + F : ZERO;
      const before = F > regionalT ? F : ZERO;
      insuranceBase = after - before;
    } else if (input.insuranceType === "employee") {
      insuranceBase = bmax(ZERO, interest + F + O - employeeT) - bmax(ZERO, F + O - employeeT);
    }
    const insuranceExtra = (insuranceBase * insuranceFactor) / (SCALE * SCALE);

    const gap = yearlyGap(N(start), input.ratePct, s);
    years.push({
      year: y,
      startBalance: N(start),
      endBalance: N(balance),
      interest: N(interest),
      withholding: N(withholding),
      incomeTaxExtra: N(incomeTaxExtra),
      insuranceExtra: N(insuranceExtra),
      gap,
      gapOver: N(start) > 0 && gap >= s.gapThreshold,
    });
  }

  const periods: MixPeriod[] = PERIODS.map((n) => {
    const slice = years.slice(0, n);
    const sum = (k: "interest" | "withholding" | "incomeTaxExtra" | "insuranceExtra") => slice.reduce((a, r) => a + r[k], 0);
    const withholding = sum("withholding");
    const incomeTaxExtra = sum("incomeTaxExtra");
    const insuranceExtra = sum("insuranceExtra");
    return {
      years: n,
      giftTax: N(giftTax),
      interest: sum("interest"),
      withholding,
      incomeTaxExtra,
      insuranceExtra,
      total: N(giftTax) + withholding + incomeTaxExtra + insuranceExtra,
      remainingPrincipal: slice[slice.length - 1].endBalance,
    };
  });

  const firstMonthInterest = N((loan * rate) / (twelve * SCALE));
  return {
    gift: N(gift),
    loan: N(loan),
    deduction: N(deduction),
    giftTaxBase: N(baseAll),
    giftTaxBeforeCredit: N(beforeCredit),
    filingCredit: N(filingCredit),
    giftTax: N(giftTax),
    firstMonthInterest,
    firstMonthBurden: firstMonthInterest + N(bmin(monthly, loan)),
    years,
    periods,
    gapWarning: years.some((r) => r.gapOver),
    dependentNotice: input.insuranceType === "dependent" && N(loan) > 0 && input.ratePct > 0,
    marginalRateAssumed: input.marginalRatePct === null,
  };
}

export interface MixScenario {
  key: string;
  label: string;
  gift: number;
  loan: number;
  ratePct: number;
  result: MixResult;
}

/** 혼합 비교표 : 증여 금액을 다섯 가지 + 사용자가 넣은 값으로 바꿨을 때 */
export function mixScenarios(input: MixInput, s: MixSettings, autoRate: boolean): MixScenario[] {
  const total = Math.max(0, Math.floor(input.total));
  const clamp = (v: number) => Math.min(total, Math.max(0, Math.floor(v)));
  const candidates: { key: string; label: string; gift: number }[] = [
    { key: "allLoan", label: "전액 차용", gift: 0 },
    { key: "deduction", label: "공제만큼 증여", gift: clamp(deductionFor(input, s) - Math.max(0, input.priorGift)) },
    { key: "tenPct", label: "10% 구간까지 증여", gift: clamp(tenPercentBandGift(input, s)) },
    { key: "freeLimit", label: "무이자 한도만 남기고 증여", gift: clamp(total - interestFreeLimit(s)) },
    { key: "allGift", label: "전액 증여", gift: total },
    { key: "user", label: "지금 넣은 값", gift: clamp(input.gift) },
  ];
  return candidates.map((c) => {
    const loan = total - c.gift;
    const ratePct = autoRate ? recommendedRatePct(loan, s) : input.ratePct;
    return { ...c, loan, ratePct, result: calculateMix({ ...input, gift: c.gift, ratePct }, s) };
  });
}

export interface MixCurvePoint {
  gift: number;
  ratePct: number;
  /** 5년, 10년, 15년 합계 */
  totals: number[];
}

/** 그래프용 : 증여 금액을 0부터 전체까지 나눠 본 합계 */
export function mixCurve(input: MixInput, s: MixSettings, autoRate: boolean, steps = 40): MixCurvePoint[] {
  const total = Math.max(0, Math.floor(input.total));
  const points: MixCurvePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const gift = Math.floor((total * i) / steps);
    const loan = total - gift;
    const ratePct = autoRate ? recommendedRatePct(loan, s) : input.ratePct;
    const r = calculateMix({ ...input, gift, ratePct }, s);
    points.push({ gift, ratePct, totals: r.periods.map((p) => p.total) });
  }
  return points;
}

export interface MixRecommendation {
  years: number; // 5, 10, 15
  gift: number;
  loan: number;
  ratePct: number;
  giftTax: number;
  total: number; // 그 기간의 세금·보험료 합계
  allLoanTotal: number; // 전액 차용일 때의 합계
  allGiftTotal: number; // 전액 증여일 때의 합계
  step: number; // 찾은 간격(원)
}

/**
 * 추천 설정 : 증여 금액을 step(기본 1,000만 원) 간격으로 바꿔 가며 세금·보험료 합계가 가장 작은 곳을 기간별로 찾는다.
 * - 이자율은 차액이 기준 미만이 되는 가장 낮은 이자율(recommendedRatePct)로 둔다.
 * - 매달 갚는 원금 등 나머지는 넣은 값 그대로 둔다.
 * - 합계가 같으면 증여 금액이 작은 쪽을 고른다.
 * - 계산기가 세는 네 가지(증여세, 뗀 세금, 종합소득세 추가분, 건강보험료)만의 합계다.
 */
export function recommendMix(input: MixInput, s: MixSettings, step = 10_000_000): MixRecommendation[] {
  const total = Math.max(0, Math.floor(input.total));
  let unit = Math.max(1, Math.floor(step));
  while (total / unit > 2000) unit *= 10; // 너무 큰 금액이면 간격을 넓힌다
  const gifts: number[] = [];
  for (let g = 0; g < total; g += unit) gifts.push(g);
  gifts.push(total);
  const best: (MixRecommendation | null)[] = [null, null, null];
  let allLoan: number[] = [];
  let allGift: number[] = [];
  for (const gift of gifts) {
    const loan = total - gift;
    const ratePct = recommendedRatePct(loan, s);
    const r = calculateMix({ ...input, gift, ratePct }, s);
    if (gift === 0) allLoan = r.periods.map((p) => p.total);
    if (gift === total) allGift = r.periods.map((p) => p.total);
    r.periods.forEach((p, k) => {
      const cur = best[k];
      if (!cur || p.total < cur.total) {
        best[k] = { years: p.years, gift, loan, ratePct, giftTax: p.giftTax, total: p.total, allLoanTotal: 0, allGiftTotal: 0, step: unit };
      }
    });
  }
  return best.filter((x): x is MixRecommendation => x != null).map((x, k) => ({ ...x, allLoanTotal: allLoan[k] ?? 0, allGiftTotal: allGift[k] ?? 0 }));
}

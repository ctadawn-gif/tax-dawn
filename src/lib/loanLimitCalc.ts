/**
 * 대출 가능액, DSR · DTI · LTV 간단 계산 (화면과 떼어 둔 계산 부분)
 *
 * 규제 숫자는 이 파일에 두지 않는다. 화면이 officeRates.ts 의 값을 골라 넘겨 준다.
 * 계산식은 대출 명세 4-나～마.
 */
// @ts-expect-error -- 검사 파일을 node 로 바로 돌리려고 확장자(.ts)를 붙였다
import { annuityPaymentExact, calculateRepayment, principalFromPayment, type RepayMethod } from "./loanRepaymentCalc.ts";

/** 비율(%)을 소수 둘째 자리까지 (반올림) */
const pct2 = (v: number) => Math.round(v * 10000 + 1e-7) / 100;
const floorWon = (v: number) => Math.floor(v + 1e-6);

/** LTV(%) = (대출금 + 선순위·보증금 등) ÷ 담보가치 */
export function ltvPct(loan: number, senior: number, value: number): number {
  if (value <= 0) return 0;
  return pct2((Math.max(0, loan) + Math.max(0, senior)) / value);
}

export interface ThisLoan {
  principal: number;
  ratePct: number; // 실제 금리
  months: number;
  method: RepayMethod;
}

/**
 * 이번 대출의 한 해 원리금 (DSR·DTI 계산용)
 * - 원리금균등 : 한 달 상환액(원 미만 버림 전) × 12
 * - 원금균등 : 첫 12회차 상환액의 합 (가장 많이 내는 첫해 기준)
 * - 만기 일시상환 : 원금 ÷ min(대출 햇수, bulletMaxYears) + 한 해 이자
 */
export function annualDebtService(loan: ThisLoan, addPct: number, bulletMaxYears: number): number {
  const P = Math.floor(loan.principal || 0);
  const n = Math.floor(loan.months || 0);
  if (P <= 0 || n <= 0) return 0;
  const rate = Math.max(0, loan.ratePct) + Math.max(0, addPct);
  if (loan.method === "annuity") return floorWon(annuityPaymentExact(P, rate, n) * 12);
  if (loan.method === "equalPrincipal") {
    const r = calculateRepayment({ principal: P, ratePct: rate, months: n, graceMonths: 0, method: "equalPrincipal" });
    return r.valid ? r.years[0].payment : 0;
  }
  const years = Math.max(1, Math.min(n / 12, bulletMaxYears));
  return floorWon(P / years + (P * rate) / 100);
}

export interface RatioInput {
  income: number; // 연소득
  loan: ThisLoan;
  stressPct: number; // 더할 %포인트
  otherAnnualDebtService: number; // 다른 대출의 한 해 원리금
  otherAnnualInterest: number; // 다른 대출의 한 해 이자 (DTI용)
  collateralValue: number;
  senior: number; // 선순위·보증금 등
  bulletMaxYears: number;
}

export interface RatioResult {
  annualThisLoan: number; // 스트레스 금리를 더한 한 해 원리금
  annualThisLoanNoStress: number;
  dsrPct: number;
  dtiPct: number;
  ltvPct: number;
}

export function calculateRatios(i: RatioInput): RatioResult {
  const annualThisLoan = annualDebtService(i.loan, i.stressPct, i.bulletMaxYears);
  const annualThisLoanNoStress = annualDebtService(i.loan, 0, i.bulletMaxYears);
  const income = Math.max(0, i.income);
  return {
    annualThisLoan,
    annualThisLoanNoStress,
    dsrPct: income > 0 ? pct2((annualThisLoan + Math.max(0, i.otherAnnualDebtService)) / income) : 0,
    dtiPct: income > 0 ? pct2((annualThisLoanNoStress + Math.max(0, i.otherAnnualInterest)) / income) : 0,
    ltvPct: ltvPct(i.loan.principal, i.senior, i.collateralValue),
  };
}

export interface LimitInput {
  collateralValue: number; // 집값(담보가치)
  senior: number;
  ltvRatioPct: number;
  income: number;
  dsrLimitPct: number;
  otherAnnualDebtService: number;
  ratePct: number;
  stressPct: number;
  months: number;
  /** 금액 한도(원). 없으면 null */
  amountCap: number | null;
}

export type LimitKind = "ltv" | "dsr" | "cap";

export interface LimitResult {
  ltvLimit: number;
  dsrLimit: number;
  capLimit: number | null;
  annualRoom: number; // 한 해에 쓸 수 있는 원리금
  monthlyRoom: number;
  final: number;
  binding: LimitKind;
}

/** 세 가지 한도 가운데 가장 작은 값. DSR 한도는 원리금균등으로 거꾸로 구한다 */
export function calculateLimit(i: LimitInput): LimitResult {
  const ltvLimit = Math.max(0, floorWon((Math.max(0, i.collateralValue) * Math.max(0, i.ltvRatioPct)) / 100) - Math.max(0, i.senior));
  const annualRoom = Math.max(0, floorWon((Math.max(0, i.income) * Math.max(0, i.dsrLimitPct)) / 100) - Math.max(0, i.otherAnnualDebtService));
  const monthlyRoom = annualRoom / 12;
  const dsrLimit = principalFromPayment(monthlyRoom, Math.max(0, i.ratePct) + Math.max(0, i.stressPct), Math.floor(i.months || 0));
  const capLimit = i.amountCap;
  let final = ltvLimit;
  let binding: LimitKind = "ltv";
  if (dsrLimit < final) {
    final = dsrLimit;
    binding = "dsr";
  }
  if (capLimit != null && capLimit < final) {
    final = capLimit;
    binding = "cap";
  }
  return { ltvLimit, dsrLimit, capLimit, annualRoom, monthlyRoom: Math.floor(monthlyRoom), final, binding };
}

/** 집값 구간표에서 금액 한도를 고른다 */
export function pickAmountCap(price: number, table: { upTo: number | null; cap: number }[]): number {
  for (const row of table) if (row.upTo == null || price <= row.upTo) return row.cap;
  return table[table.length - 1].cap;
}

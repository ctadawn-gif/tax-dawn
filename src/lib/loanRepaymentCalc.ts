/**
 * 대출 원리금 상환 계산 (화면과 떼어 둔 계산 부분)
 *
 * 계산 원칙 (명세 4-가)
 * - 한 달 이율 = 연 이자율 ÷ 12. 날짜 수로 나누지 않고 달 단위로 계산한다.
 * - 원리금균등 : 한 달 상환액 = 원금 × i ÷ (1 - (1 + i)^(-n)), 원 미만 버림.
 * - 원금균등 : 매달 원금 = 원금 ÷ n (원 미만 버림), 그달 이자 = 남은 원금 × i.
 * - 만기 일시상환 : 매달 이자만 내고 마지막 달에 원금 전부.
 * - 거치기간 동안은 이자만 낸다. n = 전체 기간 - 거치기간.
 * - 이자는 달마다 원 미만을 버린다. 마지막 회차에서 남은 원금을 모두 갚아 끝자리를 맞춘다.
 * - 이자율이 0%면 원금 ÷ n.
 * 세율이나 규제 숫자는 쓰지 않는다. 은행마다 끝자리 처리가 달라 몇 원 차이가 날 수 있다.
 */

export type RepayMethod = "annuity" | "equalPrincipal" | "bullet";

export const REPAY_METHOD_LABEL: Record<RepayMethod, string> = {
  annuity: "원리금균등",
  equalPrincipal: "원금균등",
  bullet: "만기 일시상환",
};

export const MAX_MONTHS = 600; // 50년

export interface RepayInput {
  principal: number; // 원
  ratePct: number; // 연 이자율 %, 4.5 = 연 4.5%
  months: number; // 전체 기간(개월)
  graceMonths: number; // 거치기간(개월). 만기 일시상환에서는 쓰지 않는다
  method: RepayMethod;
}

export interface RepayRow {
  no: number; // 회차
  payment: number; // 그달 상환액 = 원금 + 이자
  principal: number;
  interest: number;
  balance: number; // 갚은 뒤 남은 원금
}

export interface RepayYear {
  year: number; // 1년차, 2년차 …
  months: number; // 그해에 든 회차 수
  payment: number;
  principal: number;
  interest: number;
  endBalance: number;
}

export interface RepayResult {
  valid: boolean;
  message: string; // 계산하지 못한 까닭
  method: RepayMethod;
  repayMonths: number; // n = 전체 기간 - 거치기간
  graceMonths: number;
  /** 거치기간의 한 달 이자 (거치기간이 없으면 0) */
  gracePayment: number;
  /** 원금을 갚기 시작한 첫 달 상환액 */
  firstPayment: number;
  /** 마지막 달 상환액 */
  lastPayment: number;
  /** 원리금균등의 한 달 상환액. 다른 방식은 0 */
  levelPayment: number;
  /** 원금균등의 매달 원금. 다른 방식은 0 */
  monthlyPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  rows: RepayRow[];
  years: RepayYear[];
}

/* ────────────── 정수 계산 헬퍼 ────────────── */

const RATE_SCALE = 1_000_000; // 이자율 % 를 소수 여섯째 자리까지 정수로
const MONTH_DIV = BigInt(100 * 12 * RATE_SCALE); // % → 비율, 연 → 월

function scaledRate(ratePct: number): bigint {
  return BigInt(Math.round((ratePct > 0 ? ratePct : 0) * RATE_SCALE));
}

/** 한 달 이자 = 남은 원금 × 연 이자율 ÷ 12, 원 미만 버림 */
export function monthlyInterest(balance: number, ratePct: number): number {
  if (balance <= 0) return 0;
  return Number((BigInt(Math.floor(balance)) * scaledRate(ratePct)) / MONTH_DIV);
}

/** 원리금균등 한 달 상환액 (원 미만 버림 전) */
export function annuityPaymentExact(principal: number, ratePct: number, n: number): number {
  if (principal <= 0 || n <= 0) return 0;
  const i = ratePct > 0 ? ratePct / 1200 : 0;
  if (i === 0) return principal / n;
  return (principal * i) / (1 - Math.pow(1 + i, -n));
}

/** 한 달 상환액으로 빌릴 수 있는 원금 (원리금균등, 원 미만 버림) — 대출 가능액 계산에서 쓴다 */
export function principalFromPayment(monthlyPayment: number, ratePct: number, n: number): number {
  if (monthlyPayment <= 0 || n <= 0) return 0;
  const i = ratePct > 0 ? ratePct / 1200 : 0;
  if (i === 0) return Math.floor(monthlyPayment * n);
  return Math.floor((monthlyPayment * (1 - Math.pow(1 + i, -n))) / i + 1e-6);
}

const floorWon = (v: number) => Math.floor(v + 1e-6);

/**
 * 끝자리를 버리기 전의 전체 이자 (식으로 바로 구한 값, 원 미만 버림).
 * 상환표의 합계와 몇 원에서 몇백 원까지 다를 수 있다. 검산용.
 */
export function formulaTotalInterest(input: RepayInput): number {
  const P = Math.floor(input.principal || 0);
  const months = Math.floor(input.months || 0);
  const grace = input.method === "bullet" ? 0 : Math.max(0, Math.floor(input.graceMonths || 0));
  const n = months - grace;
  if (P <= 0 || n <= 0) return 0;
  const r = scaledRate(input.ratePct);
  const big = BigInt(P);
  const graceInterest = Number((big * r * BigInt(grace)) / MONTH_DIV);
  if (input.method === "bullet") return Number((big * r * BigInt(months)) / MONTH_DIV);
  if (input.method === "equalPrincipal") {
    // 원금 × i × (n + 1) ÷ 2
    return graceInterest + Number((big * r * BigInt(n + 1)) / (MONTH_DIV * BigInt(2)));
  }
  return graceInterest + floorWon(annuityPaymentExact(P, input.ratePct, n) * n - P);
}

/* ────────────── 메인 ────────────── */

function emptyResult(method: RepayMethod, message: string): RepayResult {
  return {
    valid: false, message, method, repayMonths: 0, graceMonths: 0, gracePayment: 0,
    firstPayment: 0, lastPayment: 0, levelPayment: 0, monthlyPrincipal: 0,
    totalInterest: 0, totalPayment: 0, rows: [], years: [],
  };
}

export function calculateRepayment(input: RepayInput): RepayResult {
  const method = input.method;
  const P = Math.floor(input.principal || 0);
  const months = Math.floor(input.months || 0);
  const ratePct = input.ratePct > 0 ? input.ratePct : 0;
  const grace = method === "bullet" ? 0 : Math.max(0, Math.floor(input.graceMonths || 0));

  if (P <= 0) return emptyResult(method, "대출 금액을 넣어 주세요.");
  if (months <= 0) return emptyResult(method, "기간을 넣어 주세요.");
  if (months > MAX_MONTHS) return emptyResult(method, `기간은 ${MAX_MONTHS}개월까지 계산합니다.`);
  if (grace >= months) return emptyResult(method, "거치기간은 전체 기간보다 짧아야 합니다.");

  const n = months - grace;
  const levelPayment = method === "annuity" ? floorWon(annuityPaymentExact(P, ratePct, n)) : 0;
  const monthlyPrincipal = method === "equalPrincipal" ? Math.floor(P / n) : 0;

  const rows: RepayRow[] = [];
  let balance = P;
  for (let no = 1; no <= months; no++) {
    const interest = monthlyInterest(balance, ratePct);
    const isLast = no === months;
    let principal = 0;
    if (isLast) principal = balance; // 마지막 회차에서 남은 원금을 맞춘다
    else if (no > grace) {
      if (method === "annuity") principal = Math.min(balance, Math.max(0, levelPayment - interest));
      else if (method === "equalPrincipal") principal = Math.min(balance, monthlyPrincipal);
    }
    balance -= principal;
    rows.push({ no, payment: principal + interest, principal, interest, balance });
  }

  const years: RepayYear[] = [];
  for (let s = 0; s < rows.length; s += 12) {
    const part = rows.slice(s, s + 12);
    years.push({
      year: s / 12 + 1,
      months: part.length,
      payment: part.reduce((a, x) => a + x.payment, 0),
      principal: part.reduce((a, x) => a + x.principal, 0),
      interest: part.reduce((a, x) => a + x.interest, 0),
      endBalance: part[part.length - 1].balance,
    });
  }

  const totalInterest = rows.reduce((a, x) => a + x.interest, 0);
  return {
    valid: true,
    message: "",
    method,
    repayMonths: n,
    graceMonths: grace,
    gracePayment: grace > 0 ? rows[0].payment : 0,
    firstPayment: rows[grace].payment,
    lastPayment: rows[rows.length - 1].payment,
    levelPayment,
    monthlyPrincipal,
    totalInterest,
    totalPayment: P + totalInterest,
    rows,
    years,
  };
}

/** 세 가지 상환 방식을 같은 조건으로 한 번에 */
export function compareMethods(input: Omit<RepayInput, "method">): RepayResult[] {
  return (["annuity", "equalPrincipal", "bullet"] as RepayMethod[]).map((method) => calculateRepayment({ ...input, method }));
}

/**
 * 차용증 상환 스케줄표 — 회차별 원금·이자·원천징수세액·실송금액
 *
 * 계산 원칙
 * - 이자는 잔액에 대해 일할 계산 (연 365일 기준, 초일산입·말일불산입).
 *   → 달마다 28~31일로 일수가 달라 회차별 이자가 조금씩 다르다.
 * - 지급일이 31일인데 그 달이 30일까지면 말일로 당긴다 (2월은 28/29일).
 * - 이자 지급일과 원금 상환일이 다르면 두 날짜 모두 회차가 생기고,
 *   원금만 내는 날에 쌓인 이자는 다음 이자 지급일에 합산해 낸다.
 * - 원천징수: 비영업대금의 이익 — 소득세 25%, 지방소득세는 소득세의 10%.
 *   각각 10원 미만 절사(국고금관리법 §47·지방세법 §103조의13).
 *   채무자(을)가 이자를 줄 때 떼고, 다음 달 10일까지 신고·납부한다.
 * - 이자소득은 소액부징수(1천원 미만 불징수) 적용 제외 → 금액이 작아도 뗀다.
 * - 변제기일에 잔액이 남아 있으면 만기 회차에서 전액 상환으로 둔다.
 */

export const WITHHOLDING_INCOME_RATE = 0.25; // 소득세
export const WITHHOLDING_LOCAL_RATE = 0.1; // 지방소득세 (소득세의 10%)
const DAYS_PER_YEAR = 365;
const MAX_ROWS = 1200; // 100년 월납 — 안전장치

export type RepayType = "lump" | "installment";

export interface ScheduleInput {
  principal: number; // 원
  annualRate: number; // 0.046 = 연 4.6%
  loanDate: string; // YYYY-MM-DD 차용일(이자 기산일)
  dueDate: string; // YYYY-MM-DD 변제기일
  repayType: RepayType;
  monthlyPrincipal: number; // 분할상환 월 원금 (installment)
  repayDay: number; // 1~31 매월 상환일 (installment)
  interestDay: number; // 1~31 매월 이자 지급일 (annualRate > 0)
}

export interface ScheduleRow {
  no: number;
  date: string;
  /** 이 회차 이자 기간 시작일 (이자가 없는 회차면 null) */
  periodStart: string | null;
  days: number; // 이자 계산 일수
  balanceBefore: number;
  principal: number; // 원금 상환
  interest: number; // 세전 이자
  incomeTax: number; // 소득세
  localTax: number; // 지방소득세
  netInterest: number; // 갑 실수령 이자
  payment: number; // 을 실제 송금액 = 원금 + 세후 이자
  balance: number; // 회차 후 잔액
  taxDueDate: string | null; // 원천세 납부기한 (이자 지급 다음 달 10일)
  isMaturity: boolean;
}

export interface ScheduleTotals {
  principal: number;
  interest: number;
  incomeTax: number;
  localTax: number;
  netInterest: number;
  payment: number;
  days: number;
}

export interface ScheduleResult {
  rows: ScheduleRow[];
  totals: ScheduleTotals;
  /** 연도별 세전 이자 — 채권자(갑) 금융소득 종합과세(2천만원) 판단용 */
  byYear: { year: number; interest: number }[];
  warnings: string[];
  /** 만기 회차 원금 상환액 (분할상환에서 만기 행이 있을 때). 0이면 만기 전 완납 */
  balloonAtMaturity: number;
  /** 만기 회차 상환액 중 '월 상환액 1회분'을 넘는 초과분 — 0이면 월 상환액으로 만기에 딱 맞게 끝남 */
  balloonExcess: number;
  /** 분할상환 원금 납부 슬롯 수 (매월 상환일 + 만기). 권장 월상환액 = 원금 ÷ 슬롯 */
  installmentSlots: number;
  /** 만기 전 일반 회차 수·합계 (만기 행 제외) */
  scheduledInstallments: number;
  installmentTotal: number;
}

/* ────────────── 날짜 헬퍼 (UTC 기준 — 타임존 영향 제거) ────────────── */

const DAY_MS = 86400000;

function parse(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(t);
  // 2026-02-31 같은 비정상 날짜 거부
  if (d.getUTCMonth() !== +m[2] - 1) return null;
  return t;
}

function fmt(t: number): string {
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function daysInMonth(y: number, m0: number): number {
  return new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
}

/** y년 m0월(0-based)의 day일 — 그 달에 없는 날이면 말일 */
function dateInMonth(y: number, m0: number, day: number): number {
  const yy = y + Math.floor(m0 / 12);
  const mm = ((m0 % 12) + 12) % 12;
  return Date.UTC(yy, mm, Math.min(day, daysInMonth(yy, mm)));
}

/** start(미포함) 이후 매월 day일에 해당하는 날짜들 — end(미포함) 전까지 */
function monthlyDates(start: number, end: number, day: number): number[] {
  const out: number[] = [];
  const s = new Date(start);
  let y = s.getUTCFullYear();
  let m0 = s.getUTCMonth();
  for (let i = 0; i < MAX_ROWS; i++) {
    const t = dateInMonth(y, m0, day);
    if (t >= end) break;
    if (t > start) out.push(t);
    m0 += 1;
    if (m0 === 12) {
      m0 = 0;
      y += 1;
    }
  }
  return out;
}

/** 다음 달 10일. 토·일이면 다음 월요일 (공휴일은 미반영) */
function withholdingDueDate(payDate: number): string {
  const d = new Date(payDate);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 10);
  const dow = new Date(t).getUTCDay();
  if (dow === 6) t += 2 * DAY_MS;
  else if (dow === 0) t += DAY_MS;
  return fmt(t);
}

const floor10 = (v: number) => Math.floor(v / 10) * 10;

/** 원천징수세액 분해 — 소득세 25%, 지방소득세는 소득세의 10%, 각 10원 미만 절사 */
export function withholding(interest: number): { incomeTax: number; localTax: number; net: number } {
  if (interest <= 0) return { incomeTax: 0, localTax: 0, net: 0 };
  const incomeTax = floor10(interest * WITHHOLDING_INCOME_RATE);
  const localTax = floor10(incomeTax * WITHHOLDING_LOCAL_RATE);
  return { incomeTax, localTax, net: interest - incomeTax - localTax };
}

/* ────────────── 메인 ────────────── */

export function buildSchedule(input: ScheduleInput): ScheduleResult {
  const empty: ScheduleResult = {
    rows: [],
    totals: { principal: 0, interest: 0, incomeTax: 0, localTax: 0, netInterest: 0, payment: 0, days: 0 },
    byYear: [],
    warnings: [],
    balloonAtMaturity: 0,
    balloonExcess: 0,
    installmentSlots: 0,
    scheduledInstallments: 0,
    installmentTotal: 0,
  };
  const P = Math.floor(input.principal || 0);
  const r = input.annualRate > 0 ? input.annualRate : 0;
  const start = parse(input.loanDate);
  const end = parse(input.dueDate);
  if (P <= 0 || start == null || end == null) return empty;
  if (end <= start) return { ...empty, warnings: ["변제기일이 차용일보다 뒤여야 합니다."] };

  const clampDay = (d: number, fallback: number) => (d >= 1 && d <= 31 ? Math.floor(d) : fallback);
  const loanDay = new Date(start).getUTCDate();
  const installmentMode = input.repayType === "installment";
  const installment = installmentMode && input.monthlyPrincipal > 0;
  const repayDay = clampDay(input.repayDay, loanDay);
  // 이자 지급일 미입력 시: 분할상환이면 상환일과 같은 날, 일시상환이면 차용일과 같은 날
  const interestDay = clampDay(input.interestDay, installment ? repayDay : loanDay);

  // 이벤트 날짜 수집
  const interestDates = r > 0 ? new Set(monthlyDates(start, end, interestDay)) : new Set<number>();
  // 상환일 집합은 금액 미입력(0)이어도 만들어 슬롯 수를 알 수 있게 한다 (금액 0이면 원금 행은 생기지 않음)
  const principalDates = installmentMode ? new Set(monthlyDates(start, end, repayDay)) : new Set<number>();
  const installmentSlots = installmentMode ? principalDates.size + 1 : 0; // +1 = 만기
  const allDates = [...new Set([...interestDates, ...principalDates, end])].sort((a, b) => a - b);

  const rows: ScheduleRow[] = [];
  let balance = P;
  let accrued = 0; // 미지급 발생이자 (원 단위 미반올림)
  let periodStart = start; // 마지막 이자 지급일
  let lastDate = start;
  let no = 0;

  for (const t of allDates) {
    if (balance <= 0 && accrued === 0) break;
    const isMaturity = t === end;
    const days = Math.round((t - lastDate) / DAY_MS);
    accrued += (balance * r * days) / DAYS_PER_YEAR;
    const balanceBefore = balance;

    const payInterest = r > 0 && (interestDates.has(t) || isMaturity);
    let interest = 0;
    let pStart: string | null = null;
    let periodDays = 0;
    if (payInterest) {
      interest = Math.round(accrued);
      accrued = 0;
      pStart = fmt(periodStart);
      periodDays = Math.round((t - periodStart) / DAY_MS);
      periodStart = t;
    }

    let principal = 0;
    if (isMaturity) principal = balance;
    else if (principalDates.has(t)) principal = Math.min(balance, Math.floor(input.monthlyPrincipal));
    balance -= principal;

    lastDate = t;
    if (principal === 0 && interest === 0) continue; // 빈 회차 생략

    const w = withholding(interest);
    rows.push({
      no: ++no,
      date: fmt(t),
      periodStart: pStart,
      days: periodDays,
      balanceBefore,
      principal,
      interest,
      incomeTax: w.incomeTax,
      localTax: w.localTax,
      netInterest: w.net,
      payment: principal + w.net,
      balance,
      taxDueDate: interest > 0 ? withholdingDueDate(t) : null,
      isMaturity,
    });
  }

  const totals = rows.reduce<ScheduleTotals>(
    (a, x) => ({
      principal: a.principal + x.principal,
      interest: a.interest + x.interest,
      incomeTax: a.incomeTax + x.incomeTax,
      localTax: a.localTax + x.localTax,
      netInterest: a.netInterest + x.netInterest,
      payment: a.payment + x.payment,
      days: a.days + x.days,
    }),
    { principal: 0, interest: 0, incomeTax: 0, localTax: 0, netInterest: 0, payment: 0, days: 0 }
  );

  const yearMap = new Map<number, number>();
  for (const x of rows) {
    if (x.interest > 0) {
      const y = +x.date.slice(0, 4);
      yearMap.set(y, (yearMap.get(y) ?? 0) + x.interest);
    }
  }
  const byYear = [...yearMap.entries()].sort((a, b) => a[0] - b[0]).map(([year, interest]) => ({ year, interest }));

  const last = rows[rows.length - 1];
  const balloonAtMaturity = installment && last?.isMaturity ? last.principal : 0;
  const balloonExcess = Math.max(0, balloonAtMaturity - Math.floor(input.monthlyPrincipal));
  const regular = rows.filter((x) => x.principal > 0 && !x.isMaturity);
  const scheduledInstallments = installment ? regular.length : 0;
  const installmentTotal = installment ? regular.reduce((a, x) => a + x.principal, 0) : 0;

  const warnings: string[] = [];
  if (installment && balloonExcess > 0)
    warnings.push(
      // 괄호 뒤 조사("…회차)에")가 줄바꿈으로 떨어지지 않게 괄호 없이 표기
      `월 상환액만으로는 다 갚지 못해, 만기 ${last.no}회차에 ${balloonAtMaturity.toLocaleString("ko-KR")}원을 일시 상환하는 것으로 잡았습니다.`
    );
  if (r > 0 && byYear.some((y) => y.interest > 20_000_000))
    warnings.push("한 해 이자가 2,000만원을 넘는 연도가 있습니다. 채권자(갑)는 다른 금융소득과 합산해 종합과세 대상이 될 수 있습니다.");

  return { rows, totals, byYear, warnings, balloonAtMaturity, balloonExcess, installmentSlots, scheduledInstallments, installmentTotal };
}

/** 스케줄표 CSV (엑셀에서 바로 열림 — UTF-8 BOM) */
export function scheduleToCsv(res: ScheduleResult): string {
  const head = ["회차", "지급일", "이자기간", "일수", "상환 전 잔액", "원금 상환", "이자(세전)", "소득세", "지방소득세", "이자(세후)", "실송금액", "상환 후 잔액", "원천세 납부기한"];
  const lines = res.rows.map((x) =>
    [
      x.no,
      x.date,
      x.periodStart ? `${x.periodStart}~${x.date}` : "",
      x.days || "",
      x.balanceBefore,
      x.principal,
      x.interest,
      x.incomeTax,
      x.localTax,
      x.netInterest,
      x.payment,
      x.balance,
      x.taxDueDate ?? "",
    ].join(",")
  );
  const t = res.totals;
  lines.push(["합계", "", "", t.days, "", t.principal, t.interest, t.incomeTax, t.localTax, t.netInterest, t.payment, "", ""].join(","));
  return "﻿" + [head.join(","), ...lines].join("\r\n");
}

/* ───────────── 증여세 안전 체크 — 상증법 §41조의4 (대출일 기준 1년 단위, 그해 시작 잔액으로 재계산) ─────────────
   차액_k = (k년차 시작 잔액 × 4.6% × 기간) − k년차에 지급한 이자(세전).  차액 < 1,000만원이면 과세 제외.
   만기 일시상환이면 잔액이 일정해 loanCalc.giftBenefit 과 같고, 분할상환이면 잔액이 줄어 실제 이자가 작아져 차액이 커진다.
   첫해 최소 안전 이자율 = (원금 × 4.6% − 1,000만원) ÷ Σ(잔액 × 일수 ÷ 365)  — 0.01% 단위 올림 */

const GIFT_ADEQUATE_RATE = 0.046;
const GIFT_THRESHOLD = 10_000_000;

export interface GiftYear {
  no: number; // 1년차, 2년차 …
  from: string; // 기간 시작(미포함)
  to: string; // 기간 끝(포함)
  startBalance: number; // 그해 시작 잔액
  adequate: number; // 적정이자 = 시작 잔액 × 4.6% (마지막 해가 1년 미만이면 일수 비례)
  actual: number; // 그해 지급 이자(세전) 합
  diff: number; // 증여 의제 차액
  safe: boolean; // 차액 < 1,000만원
  /** Σ(잔액 × 일수 ÷ 365) — 이자율 역산용 */
  balanceYears: number;
}

export interface GiftCheck {
  years: GiftYear[];
  firstYear: GiftYear | null;
  /** 첫해 차액이 1,000만원 미만이 되는 최소 이자율 (0.01% 단위 올림, 0이면 무이자 가능) */
  firstYearMinSafeRate: number;
}

function addYearsUTC(t: number, k: number): number {
  const d = new Date(t);
  const y = d.getUTCFullYear() + k;
  const m = d.getUTCMonth();
  return Date.UTC(y, m, Math.min(d.getUTCDate(), daysInMonth(y, m)));
}

export function giftCheck(
  res: ScheduleResult,
  input: Pick<ScheduleInput, "principal" | "annualRate" | "loanDate" | "dueDate">
): GiftCheck {
  const empty: GiftCheck = { years: [], firstYear: null, firstYearMinSafeRate: 0 };
  const start = parse(input.loanDate);
  const end = parse(input.dueDate);
  const P = Math.floor(input.principal || 0);
  if (P <= 0 || start == null || end == null || end <= start || res.rows.length === 0) return empty;

  // 잔액 타임라인: [prev, row.date) 구간 동안 잔액 = row.balanceBefore
  const intervals = res.rows.map((x, i) => ({
    from: i === 0 ? start : parse(res.rows[i - 1].date)!,
    to: parse(x.date)!,
    balance: x.balanceBefore,
  }));

  const years: GiftYear[] = [];
  for (let k = 1; k <= 200; k++) {
    const from = addYearsUTC(start, k - 1);
    if (from >= end) break;
    const fullTo = addYearsUTC(start, k);
    const to = Math.min(fullTo, end);
    const full = to === fullTo;

    let balanceYears = 0;
    let startBalance = k === 1 ? P : 0;
    for (const iv of intervals) {
      const a = Math.max(iv.from, from);
      const b = Math.min(iv.to, to);
      if (b > a) balanceYears += (iv.balance * ((b - a) / DAY_MS)) / DAYS_PER_YEAR;
      if (k > 1 && iv.from <= from && from < iv.to) startBalance = iv.balance;
    }
    const factor = full ? 1 : (to - from) / DAY_MS / DAYS_PER_YEAR;
    const adequate = Math.round(startBalance * GIFT_ADEQUATE_RATE * factor);
    const actual = res.rows.reduce((a, x) => {
      const t = parse(x.date)!;
      return t > from && t <= to ? a + x.interest : a;
    }, 0);
    const diff = adequate - actual;
    years.push({ no: k, from: fmt(from), to: fmt(to), startBalance, adequate, actual, diff, safe: diff < GIFT_THRESHOLD, balanceYears });
  }

  const firstYear = years[0] ?? null;
  let firstYearMinSafeRate = 0;
  if (firstYear && firstYear.balanceYears > 0) {
    const raw = (firstYear.adequate - GIFT_THRESHOLD) / firstYear.balanceYears;
    firstYearMinSafeRate = raw <= 0 ? 0 : Math.min(GIFT_ADEQUATE_RATE, Math.ceil(raw * 10000 - 1e-9) / 10000);
  }
  return { years, firstYear, firstYearMinSafeRate };
}

/** 연차 목록을 범위로 — [1,2,3,5] → "1~3·5년차" */
export function yearRangeLabel(nos: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < nos.length; ) {
    let j = i;
    while (j + 1 < nos.length && nos[j + 1] === nos[j] + 1) j++;
    parts.push(j > i ? `${nos[i]}~${nos[j]}` : `${nos[i]}`);
    i = j + 1;
  }
  return parts.length ? `${parts.join("·")}년차` : "";
}

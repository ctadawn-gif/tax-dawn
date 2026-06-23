/**
 * 차용증(금전소비대차) 관련 순수 계산 헬퍼
 *
 * 세법 근거
 * - 상증법 제41조의4: 가족 등 특수관계인 간 금전 무상/저리 대출 시
 *   (적정이자율로 계산한 이자 − 실제 지급이자)를 증여로 본다.
 * - 적정이자율(당좌대출이자율) = 연 4.6%
 * - 단, 위 차액이 연 1,000만원 미만이면 증여세 과세 대상에서 제외.
 *   → 무이자라면 원금 약 2억 1,739만원까지는 증여세 안전.
 * - 이자를 받으면 빌려준 사람(채권자)에게 비영업대금이익 → 27.5% 원천징수.
 */

export const ADEQUATE_RATE = 0.046; // 세법상 적정이자율 4.6%
export const GIFT_THRESHOLD = 10_000_000; // 증여 의제 제외 임계 (연 1,000만원)
export const INTEREST_FREE_LIMIT = Math.floor(GIFT_THRESHOLD / ADEQUATE_RATE); // 217,391,304원
export const INTEREST_INCOME_TAX_RATE = 0.275; // 비영업대금이익 원천징수 (소득세25%+지방세2.5%)

/* ────────────────────────────────────────────────
   정식 한글 금액 변환 (차용증 "일금 ○○○원정"용)
   123,456,789 → "일억이천삼백사십오만육천칠백팔십구"
   ──────────────────────────────────────────────── */
const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const SMALL_UNITS = ["", "십", "백", "천"];
const BIG_UNITS = ["", "만", "억", "조"];

function readUnder10000(n: number): string {
  let s = "";
  for (let i = 3; i >= 0; i--) {
    const d = Math.floor(n / Math.pow(10, i)) % 10;
    if (d === 0) continue;
    if (i === 0) s += DIGITS[d];
    else if (d === 1) s += SMALL_UNITS[i]; // 십·백·천은 '일' 생략 (자연스러운 읽기)
    else s += DIGITS[d] + SMALL_UNITS[i];
  }
  return s;
}

export function numberToKoreanFormal(won: number): string {
  if (won == null || isNaN(won)) return "";
  if (won === 0) return "영";
  let n = Math.floor(Math.abs(won));
  let result = "";
  let group = 0;
  while (n > 0 && group < BIG_UNITS.length) {
    const part = n % 10000;
    if (part > 0) result = readUnder10000(part) + BIG_UNITS[group] + result;
    n = Math.floor(n / 10000);
    group++;
  }
  return (won < 0 ? "마이너스 " : "") + result;
}

/* ────────────────────────────────────────────────
   증여세(증여 의제) 관련
   ──────────────────────────────────────────────── */

/** 연간 증여 의제 차액 = 원금 × (4.6% − 실제이자율). 적정이자율 이상이면 0 */
export function giftBenefit(principal: number, rate: number): number {
  if (!principal || principal <= 0) return 0;
  const diff = ADEQUATE_RATE - rate;
  return diff > 0 ? Math.round(principal * diff) : 0;
}

/** 증여세 안전 여부 (차액이 연 1,000만원 미만이면 안전) */
export function isGiftSafe(principal: number, rate: number): boolean {
  return giftBenefit(principal, rate) < GIFT_THRESHOLD;
}

/**
 * 최소 안전 이자율 = 4.6% − (1,000만원 ÷ 원금)
 * 원금이 무이자 한도(2.17억) 이하면 0 (무이자 가능)
 */
export function minSafeRate(principal: number): number {
  if (!principal || principal <= INTEREST_FREE_LIMIT) return 0;
  const exact = ADEQUATE_RATE - GIFT_THRESHOLD / principal;
  // 차액은 '미만'이어야 안전 → 0.01%P 한 칸 올려 엄격히 안전한 이자율 반환
  const stepped = (Math.floor(exact * 10000) + 1) / 10000;
  return Math.min(ADEQUATE_RATE, Math.max(0, stepped));
}

/** 빌려준 사람(채권자)의 연간 이자소득세(원천징수) = 원금 × 이자율 × 27.5% */
export function lenderInterestTax(principal: number, rate: number): number {
  if (!principal || rate <= 0) return 0;
  return Math.round(principal * rate * INTEREST_INCOME_TAX_RATE);
}

/* ────────────────────────────────────────────────
   상환계획 정합성
   ──────────────────────────────────────────────── */

/** 두 날짜(YYYY-MM-DD) 사이 개월 수 */
export function monthsBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  let m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() < s.getDate()) m -= 1;
  return Math.max(0, m);
}

export interface RepaymentResult {
  months: number; // 상환기간(개월)
  totalScheduled: number; // 월상환액 × 개월
  fullyRepaid: boolean; // 기간 내 완납 가능?
  payoffMonths: number | null; // 실제 완납 회차
  lastPayment: number | null; // 마지막 회차 보정액
  shortfall: number; // 만기 잔액(부족분)
  balloonRatio: number; // 잔액 ÷ 원금
  recommendedMonthly: number; // 기간 내 완납하려면 권장 월상환액
}

/** 분할상환 계획이 변제기일까지 원금을 다 갚는지 점검 */
export function checkRepayment(
  principal: number,
  monthly: number,
  months: number
): RepaymentResult {
  const base: RepaymentResult = {
    months: months || 0,
    totalScheduled: 0,
    fullyRepaid: false,
    payoffMonths: null,
    lastPayment: null,
    shortfall: principal || 0,
    balloonRatio: principal ? 1 : 0,
    recommendedMonthly: 0,
  };
  if (!principal || principal <= 0 || !months || months <= 0) return base;

  const recommendedMonthly = Math.ceil(principal / months);
  if (!monthly || monthly <= 0) return { ...base, recommendedMonthly };

  const totalScheduled = monthly * months;
  if (totalScheduled >= principal) {
    const payoffMonths = Math.ceil(principal / monthly);
    const lastPayment = principal - monthly * (payoffMonths - 1);
    return {
      months,
      totalScheduled,
      fullyRepaid: true,
      payoffMonths,
      lastPayment,
      shortfall: 0,
      balloonRatio: 0,
      recommendedMonthly,
    };
  }
  const shortfall = principal - totalScheduled;
  return {
    months,
    totalScheduled,
    fullyRepaid: false,
    payoffMonths: null,
    lastPayment: null,
    shortfall,
    balloonRatio: shortfall / principal,
    recommendedMonthly,
  };
}

/** 퍼센트 표시 헬퍼 (0.026 → "2.6") */
export function ratePct(rate: number): string {
  return (rate * 100).toFixed(2).replace(/\.?0+$/, "");
}

// 신고 시즌 일정 — 날짜로 "다음 마감"을 자동 계산해서 시즌 문구가 낡지 않게 한다.
// 마감일이 토·일이면 다음 월요일로 미룬다(공휴일은 미반영 — 필요하면 HOLIDAY_SHIFT에 추가).

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
const KST = 9 * 3600000;

// 공휴일로 기한이 밀리는 예외: "YYYY-MM-DD" → 실제 마감 "YYYY-MM-DD"
const HOLIDAY_SHIFT: Record<string, string> = {};

/** KST 기준 y-m-d 23:59:59 를 Date로 (주말이면 다음 월요일) */
function deadlineOf(y: number, m: number, d: number): Date {
  const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  if (HOLIDAY_SHIFT[key]) {
    const [yy, mm, dd] = HOLIDAY_SHIFT[key].split("-").map(Number);
    return new Date(Date.UTC(yy, mm - 1, dd, 23, 59, 59) - KST);
  }
  const date = new Date(Date.UTC(y, m - 1, d, 23, 59, 59) - KST);
  const dow = new Date(date.getTime() + KST).getUTCDay();
  if (dow === 6) return new Date(date.getTime() + 2 * 86400000);
  if (dow === 0) return new Date(date.getTime() + 86400000);
  return date;
}

function kstParts(d: Date) {
  const k = new Date(d.getTime() + KST);
  return { y: k.getUTCFullYear(), m: k.getUTCMonth() + 1, d: k.getUTCDate(), dow: DOW[k.getUTCDay()] };
}

export interface Season {
  deadline: Date;
  year: number; // 신고하는 해
  label: string; // "5월 31일(월)"
  fullLabel: string; // "2027년 5월 31일(월)"
  short: string; // "2027.05.31"
  /** 신고기간 중인지 (시작일~마감일) */
  isOpen: boolean;
  daysLeft: number;
}

function toSeason(deadline: Date, start: Date, now: Date): Season {
  const p = kstParts(deadline);
  return {
    deadline,
    year: p.y,
    label: `${p.m}월 ${p.d}일(${p.dow})`,
    fullLabel: `${p.y}년 ${p.m}월 ${p.d}일(${p.dow})`,
    short: `${p.y}.${String(p.m).padStart(2, "0")}.${String(p.d).padStart(2, "0")}`,
    isOpen: now >= start && now <= deadline,
    daysLeft: Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 86400000)),
  };
}

/** 다음 종합소득세 확정신고 마감 (5월 1일 ~ 5월 31일) */
export function getIncomeTaxSeason(now = new Date()): Season {
  let y = kstParts(now).y;
  if (now > deadlineOf(y, 5, 31)) y += 1;
  const start = new Date(Date.UTC(y, 4, 1) - KST);
  return toSeason(deadlineOf(y, 5, 31), start, now);
}

export interface VatSeason extends Season {
  /** "2026년 2기 확정신고" */
  period: string;
}

/** 다음 부가가치세 확정신고 마감 (1기 7.1~7.25 / 2기 1.1~1.25) */
export function getVatSeason(now = new Date()): VatSeason {
  const y = kstParts(now).y;
  const candidates = [
    { dl: deadlineOf(y, 1, 25), start: new Date(Date.UTC(y, 0, 1) - KST), period: `${y - 1}년 2기 확정신고` },
    { dl: deadlineOf(y, 7, 25), start: new Date(Date.UTC(y, 6, 1) - KST), period: `${y}년 1기 확정신고` },
    { dl: deadlineOf(y + 1, 1, 25), start: new Date(Date.UTC(y + 1, 0, 1) - KST), period: `${y}년 2기 확정신고` },
  ];
  const c = candidates.find((x) => now <= x.dl)!;
  return { ...toSeason(c.dl, c.start, now), period: c.period };
}

export interface NavPromo {
  href: string;
  badge: string;
  label: string;
}

/** 네비게이션 시즌 버튼 — 기간 밖이면 null (버튼 숨김) */
export function getNavPromo(now = new Date()): NavPromo | null {
  const { m, d } = kstParts(now);
  const md = m * 100 + d;
  if (md >= 415 && md <= 601) return { href: "/income-tax", badge: "5월", label: "종합소득세 신고대행" };
  if ((md >= 615 && md <= 726) || md >= 1216 || md <= 126)
    return { href: "/vat", badge: md >= 1216 || md <= 126 ? "1월" : "7월", label: "부가가치세 신고접수" };
  if (md >= 1015 && md <= 1215) return { href: "/calculator/holding-tax", badge: "12월", label: "종부세 미리 계산" };
  return null;
}

export interface Announcement {
  text: string; // 모바일에서도 한 줄로 끝나는 짧은 문장
  pcExtra?: string; // PC에서만 덧붙이는 보조 문구
  href: string;
  cta: string;
}

/** 홈 상단 안내 바 — 시즌에 맞춰 자동 전환, 비시즌엔 블로그 새 글 안내 */
export function getAnnouncement(now = new Date()): Announcement {
  const promo = getNavPromo(now);
  if (promo?.href === "/calculator/holding-tax")
    return { text: "올해 종부세, 미리 계산해보세요", pcExtra: " · 2026 세제개편 수정안(9/1) 반영", href: promo.href, cta: "계산해보기 →" };
  if (promo?.href === "/vat") {
    const v = getVatSeason(now);
    return { text: `부가세 신고접수 · ${v.label} 마감`, pcExtra: ` · ${v.period}`, href: "/vat", cta: "접수하기 →" };
  }
  if (promo?.href === "/income-tax") {
    const i = getIncomeTaxSeason(now);
    return { text: `종소세 신고대행 · ${i.label} 마감`, pcExtra: " · 대표세무사 2인 크로스체크", href: "/income-tax", cta: "자세히 보기 →" };
  }
  return { text: "세무사가 직접 쓰는 세금 이야기", pcExtra: " · 블로그 새 글이 매주 올라옵니다", href: "/blog", cta: "읽어보기 →" };
}

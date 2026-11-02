/**
 * 계산기 결과 → 상담 신청 폼으로 넘기기
 *
 * 계산기에서 '상담 신청하기'를 누르면 입력·결과 요약을 sessionStorage에 저장하고,
 * 상담 폼(ContactForm)이 이를 읽어 "함께 보낼 계산 결과"로 보여준 뒤 접수 문자·메일에 붙인다.
 * 금액은 URL에 싣지 않는다(브라우저 기록·로그에 남지 않도록). 탭을 닫으면 사라진다.
 */

export type CalcSummary = {
  /** 계산기 이름 — 예: "증여세 계산기" */
  source: string;
  /** 상담 폼 '상담 주제' 미리 선택값 (목록에 없으면 무시) */
  topic: string;
  /** 요약 줄 — 예: "증여 금액: 3억 원" */
  lines: string[];
};

export const CALC_SUMMARY_KEY = "dawn:calc-summary";
const MAX_LINES = 12;
const MAX_LINE_LEN = 80;

export function saveCalcSummary(summary: CalcSummary | null) {
  try {
    if (summary && summary.lines.length > 0) {
      sessionStorage.setItem(CALC_SUMMARY_KEY, JSON.stringify(summary));
    } else {
      sessionStorage.removeItem(CALC_SUMMARY_KEY);
    }
  } catch {
    // 사생활 보호 모드 등 저장소를 못 쓰면 요약 없이 이동
  }
}

export function parseCalcSummary(raw: string | null): CalcSummary | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Partial<CalcSummary>;
    if (typeof s.source !== "string" || !Array.isArray(s.lines)) return null;
    const lines = s.lines
      .filter((l): l is string => typeof l === "string" && l.trim() !== "")
      .slice(0, MAX_LINES)
      .map((l) => l.slice(0, MAX_LINE_LEN));
    if (lines.length === 0) return null;
    return { source: s.source.slice(0, 40), topic: typeof s.topic === "string" ? s.topic : "", lines };
  } catch {
    return null;
  }
}

/** 문자·메일에 붙일 텍스트 */
export function calcSummaryText(s: CalcSummary) {
  return [`[${s.source}]`, ...s.lines].join("\n");
}

/** 원 → "1억 2,857만 원" (만 원 단위 반올림, 1만 원 미만은 원 단위 그대로) */
export function wonKo(won: number): string {
  const w = Math.round(won);
  if (Math.abs(w) < 10000) return `${w.toLocaleString("ko-KR")}원`;
  const sign = w < 0 ? "-" : "";
  const man = Math.round(Math.abs(w) / 10000);
  const eok = Math.floor(man / 10000);
  const rest = man % 10000;
  const parts = [eok > 0 ? `${eok.toLocaleString("ko-KR")}억` : "", rest > 0 ? `${rest.toLocaleString("ko-KR")}만` : ""];
  return `${sign}${parts.filter(Boolean).join(" ")} 원`;
}

/** 만원 단위 값 → "1억 2,857만 원" */
export const manKo = (man: number) => wonKo(man * 10000);

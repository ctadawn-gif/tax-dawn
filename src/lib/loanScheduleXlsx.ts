// 상환 스케줄표 → 엑셀(.xlsx) 다운로드
// SheetJS는 용량이 커서 버튼을 눌렀을 때만 동적 로드한다.
// 시트1 "상환스케줄": 회차표 + 합계(SUM 수식 — 사용자가 수정해도 합계 유지) + 납부 체크·비고 열
// 시트2 "차용조건": 원금·이자율·기간·당사자·계산 기준
import type { ScheduleResult } from "./loanSchedule";
import type { ScheduleMeta } from "@/components/loan/RepaymentSchedule";

const MONEY = "#,##0";
const DATE = "yyyy-mm-dd";

/** "YYYY-MM-DD" → 로컬 Date (SheetJS가 로컬 시각 기준으로 엑셀 날짜 직렬값을 만들므로 UTC 쓰면 하루 밀림) */
function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export async function downloadScheduleXlsx(res: ScheduleResult, meta: ScheduleMeta): Promise<void> {
  const XLSX = await import("xlsx");
  const hasInterest = meta.annualRate > 0;
  const n = res.rows.length;

  /* ── 시트1: 상환스케줄 ── */
  const header = hasInterest
    ? ["회차", "지급일", "이자기간 시작", "일수", "상환 전 잔액", "원금 상환", "이자(세전)", "소득세", "지방소득세", "이자(세후)", "실송금액", "상환 후 잔액", "원천세 납부기한", "납부 체크", "비고"]
    : ["회차", "지급일", "상환 전 잔액", "원금 상환", "실송금액", "상환 후 잔액", "납부 체크", "비고"];

  const body = res.rows.map((x) =>
    hasInterest
      ? [
          x.no,
          toDate(x.date),
          x.periodStart ? toDate(x.periodStart) : "",
          x.days || "",
          x.balanceBefore,
          x.principal,
          x.interest,
          x.incomeTax,
          x.localTax,
          x.netInterest,
          x.payment,
          x.balance,
          x.taxDueDate ? toDate(x.taxDueDate) : "",
          "",
          x.isMaturity ? "만기" : "",
        ]
      : [x.no, toDate(x.date), x.balanceBefore, x.principal, x.payment, x.balance, "", x.isMaturity ? "만기" : ""]
  );

  // 합계행: 데이터 범위 SUM 수식
  const first = 2;
  const last = n + 1;
  const sum = (col: string) => ({ t: "n", f: `SUM(${col}${first}:${col}${last})` });
  const totalRow = hasInterest
    ? ["합계", "", "", sum("D"), "", sum("F"), sum("G"), sum("H"), sum("I"), sum("J"), sum("K"), "", "", "", ""]
    : ["합계", "", "", sum("D"), sum("E"), "", "", ""];

  const ws = XLSX.utils.aoa_to_sheet([header, ...body, totalRow], { cellDates: true });

  // 서식: 날짜·금액 열
  const dateCols = hasInterest ? ["B", "C", "M"] : ["B"];
  const moneyCols = hasInterest ? ["E", "F", "G", "H", "I", "J", "K", "L"] : ["C", "D", "E", "F"];
  for (let r = first; r <= last + 1; r++) {
    for (const c of dateCols) {
      const cell = ws[`${c}${r}`];
      if (cell && cell.t === "d") cell.z = DATE;
    }
    for (const c of moneyCols) {
      const cell = ws[`${c}${r}`];
      if (cell && cell.t === "n") cell.z = MONEY;
    }
  }
  ws["!cols"] = (hasInterest
    ? [6, 12, 13, 6, 15, 14, 13, 11, 11, 13, 15, 15, 15, 10, 14]
    : [6, 12, 15, 14, 15, 15, 10, 14]
  ).map((wch) => ({ wch }));
  ws["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(header.length - 1)}${last}` };

  /* ── 시트2: 차용조건 ── */
  const pct = (meta.annualRate * 100).toFixed(2).replace(/\.?0+$/, "");
  const t = res.totals;
  const info: (string | number | Date)[][] = [
    ["항목", "내용"],
    ["차용 원금", meta.principal],
    ["연 이자율", `${pct}%`],
    ["차용일", toDate(meta.loanDate)],
    ["변제기일", toDate(meta.dueDate)],
    ["상환 방식", meta.repayType === "installment" ? `매월 ${meta.monthlyPrincipal.toLocaleString("ko-KR")}원 분할상환` : "만기 일시상환"],
    ["채권자(갑)", meta.lenderName || ""],
    ["채무자(을)", meta.borrowerName || ""],
    ["", ""],
    ["총 상환 원금", t.principal],
    ["총 이자(세전)", t.interest],
    ["총 소득세(25%)", t.incomeTax],
    ["총 지방소득세(소득세의 10%)", t.localTax],
    ["원천징수 합계(27.5%)", t.incomeTax + t.localTax],
    ["총 이자(세후)", t.netInterest],
    ["채무자 총 송금액", t.payment],
    ["", ""],
    ["계산 기준", "이자 = 상환 후 잔액 × 연 이자율 × 일수 ÷ 365 (초일산입·말일불산입). 지급일이 그 달에 없으면 말일."],
    ["원천징수", "채무자(을)가 이자 지급 시 소득세 25% + 지방소득세 2.5%를 떼고, 다음 달 10일까지 홈택스 원천세 신고·납부. 이듬해 2월 말 지급명세서 제출. 이자소득은 1천원 미만도 징수(소득세법 §86)."],
    ["세액 절사", "소득세·지방소득세 각 10원 미만 절사. 실제 신고 시 원 단위 차이 가능."],
    ["유의", "참고용 자료이며 중도상환·연체·이자율 변경은 반영되지 않습니다. 세무회계 새벽 (www.dawntax.com)"],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(info, { cellDates: true });
  for (const addr of ["B4", "B5"]) if (ws2[addr]?.t === "d") ws2[addr].z = DATE;
  for (const addr of ["B2", "B10", "B11", "B12", "B13", "B14", "B15", "B16"]) if (ws2[addr]?.t === "n") ws2[addr].z = MONEY;
  ws2["!cols"] = [{ wch: 26 }, { wch: 90 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "상환스케줄");
  XLSX.utils.book_append_sheet(wb, ws2, "차용조건");
  XLSX.writeFile(wb, `상환스케줄표_${meta.loanDate.replace(/-/g, "")}.xlsx`, { compression: true });
}

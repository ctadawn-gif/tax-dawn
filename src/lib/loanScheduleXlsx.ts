// 상환 스케줄표 → 엑셀(.xlsx) — ExcelJS (셀 서식 지원). 용량이 커서 버튼을 눌렀을 때만 동적 로드.
//
// 시트1 "상환스케줄": 제목·조건 요약 → 2단 머리글(그룹/열 이름, 남색 채움·고정·자동필터)
//                   → 회차 행(줄무늬·만기 강조·금액 서식) → 합계(SUM 수식) · 납부 체크는 드롭다운(✓)
// 시트2 "차용조건":  [계약 조건] [정산 요약] [연도별 이자] 작은 표 3개 + 아래에 ※ 주석
import type ExcelJSNS from "exceljs";
import type { GiftCheck, ScheduleResult } from "./loanSchedule";
import type { ScheduleMeta } from "@/components/loan/RepaymentSchedule";

type Workbook = ExcelJSNS.Workbook;
type Cell = ExcelJSNS.Cell;
type Borders = Partial<ExcelJSNS.Borders>;

const MONEY = "#,##0";
const NAVY = "FF1E293B";
const WHITE = "FFFFFFFF";
const LINE = "FFCBD5E1";
const ZEBRA = "FFF8FAFC";
const BLUE_LIGHT = "FFEFF6FF";
const RED = "FFDC2626";
const GRAY = "FF64748B";
const LABEL_FILL = "FFF1F5F9";

const thin = { style: "thin" as const, color: { argb: LINE } };
const BOX: Borders = { top: thin, left: thin, bottom: thin, right: thin };
const fill = (argb: string): ExcelJSNS.Fill => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

/** "YYYY-MM-DD" → UTC 자정 Date (ExcelJS는 UTC 기준으로 엑셀 날짜 직렬값을 만들어 로컬 Date면 하루 밀림) */
function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
const pct = (r: number) => (r * 100).toFixed(2).replace(/\.?0+$/, "");
/** [1,2,3,5] → "1~3·5년차" (loanSchedule.yearRangeLabel과 동일 — 이 파일은 타입만 import) */
function rangeLabel(nos: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < nos.length; ) {
    let j = i;
    while (j + 1 < nos.length && nos[j + 1] === nos[j] + 1) j++;
    parts.push(j > i ? `${nos[i]}~${nos[j]}` : `${nos[i]}`);
    i = j + 1;
  }
  return `${parts.join("·")}년차`;
}

function styleHeader(c: Cell) {
  c.font = { bold: true, color: { argb: WHITE }, size: 10 };
  c.fill = fill(NAVY);
  c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  c.border = BOX;
}

/* ───────────────────── 시트1 ───────────────────── */
function buildScheduleSheet(wb: Workbook, res: ScheduleResult, meta: ScheduleMeta): { totalRow: number; cols: Record<string, string> } {
  const hasInterest = meta.annualRate > 0;
  const ws = wb.addWorksheet("상환스케줄", { properties: { defaultRowHeight: 18 } });

  // 열 정의 (key → 머리글, 너비)
  const defs: { key: string; h: string; w: number }[] = hasInterest
    ? [
        { key: "no", h: "회차", w: 6 },
        { key: "date", h: "지급일", w: 12 },
        { key: "period", h: "이자 기간", w: 24 },
        { key: "days", h: "일수", w: 6 },
        { key: "before", h: "상환 전 잔액", w: 15 },
        { key: "principal", h: "원금 상환", w: 14 },
        { key: "interest", h: "이자 (세전)", w: 13 },
        { key: "tax1", h: "소득세 (25%)", w: 12 },
        { key: "tax2", h: "지방소득세 (2.5%)", w: 13 },
        { key: "net", h: "이자 (세후)", w: 13 },
        { key: "pay", h: "실송금액", w: 15 },
        { key: "after", h: "상환 후 잔액", w: 15 },
        { key: "due", h: "원천세 납부기한", w: 15 },
        { key: "check", h: "납부 체크", w: 10 },
        { key: "memo", h: "비고", w: 16 },
      ]
    : [
        { key: "no", h: "회차", w: 6 },
        { key: "date", h: "지급일", w: 12 },
        { key: "before", h: "상환 전 잔액", w: 15 },
        { key: "principal", h: "원금 상환", w: 14 },
        { key: "pay", h: "실송금액", w: 15 },
        { key: "after", h: "상환 후 잔액", w: 15 },
        { key: "check", h: "납부 체크", w: 10 },
        { key: "memo", h: "비고", w: 16 },
      ];
  ws.columns = defs.map((d) => ({ key: d.key, width: d.w }));
  const col: Record<string, string> = {};
  defs.forEach((d, i) => (col[d.key] = ws.getColumn(i + 1).letter));
  const lastCol = col[defs[defs.length - 1].key];

  // 1~2행: 제목·조건 요약
  ws.mergeCells(`A1:${lastCol}1`);
  const title = ws.getCell("A1");
  title.value = "상환 스케줄표";
  title.font = { bold: true, size: 14 };
  title.alignment = { vertical: "middle" };
  ws.getRow(1).height = 26;
  ws.mergeCells(`A2:${lastCol}2`);
  const sub = ws.getCell("A2");
  sub.value =
    `금전소비대차 계약서 별첨 · 차용 원금 ${meta.principal.toLocaleString("ko-KR")}원 · ` +
    (hasInterest ? `연 ${pct(meta.annualRate)}%` : "무이자") +
    ` · ${meta.loanDate.replace(/-/g, ".")} ~ ${meta.dueDate.replace(/-/g, ".")} · ` +
    (meta.repayType === "installment" ? `매월 ${meta.monthlyPrincipal.toLocaleString("ko-KR")}원 분할상환` : "만기 일시상환") +
    (meta.lenderName || meta.borrowerName ? ` · 채권자 ${meta.lenderName || "-"} / 채무자 ${meta.borrowerName || "-"}` : "");
  sub.font = { size: 9, color: { argb: GRAY } };

  // 3행: 그룹 머리글, 4행: 열 머리글
  const GROUP_ROW = 3;
  const HEAD_ROW = 4;
  if (hasInterest) {
    const groups: [string, string, string][] = [
      [col.no, col.days, "회차"],
      [col.before, col.principal, "원금"],
      [col.interest, col.net, "이자 — 갑에게 지급 (27.5% 원천징수)"],
      [col.pay, col.after, "송금·잔액"],
      [col.due, col.memo, "세무 처리·관리"],
    ];
    for (const [a, b, label] of groups) {
      ws.mergeCells(`${a}${GROUP_ROW}:${b}${GROUP_ROW}`);
      const c = ws.getCell(`${a}${GROUP_ROW}`);
      c.value = label;
      styleHeader(c);
      c.fill = fill("FF334155");
    }
  } else {
    ws.mergeCells(`A${GROUP_ROW}:${lastCol}${GROUP_ROW}`);
    const c = ws.getCell(`A${GROUP_ROW}`);
    c.value = "무이자 분할상환 일정";
    styleHeader(c);
    c.fill = fill("FF334155");
  }
  defs.forEach((d, i) => {
    const c = ws.getCell(HEAD_ROW, i + 1);
    c.value = d.h;
    styleHeader(c);
  });
  ws.getRow(GROUP_ROW).height = 20;
  ws.getRow(HEAD_ROW).height = 30;

  // 데이터
  const first = HEAD_ROW + 1;
  res.rows.forEach((x, i) => {
    const r = first + i;
    const row = ws.getRow(r);
    const v: Record<string, unknown> = {
      no: x.no,
      date: toDate(x.date),
      before: x.balanceBefore,
      principal: x.principal || null,
      pay: x.payment,
      after: x.balance,
      check: null,
      memo: x.isMaturity ? "만기" : null,
    };
    if (hasInterest) {
      v.period = x.periodStart ? `${x.periodStart} ~ ${x.date}` : null;
      v.days = x.days || null;
      v.interest = x.interest || null;
      v.tax1 = x.interest ? x.incomeTax : null;
      v.tax2 = x.interest ? x.localTax : null;
      v.net = x.interest ? x.netInterest : null;
      v.due = x.taxDueDate ? toDate(x.taxDueDate) : null;
    }
    defs.forEach((d, ci) => (row.getCell(ci + 1).value = (v[d.key] as ExcelJSNS.CellValue) ?? null));

    const zebra = i % 2 === 1;
    defs.forEach((d, ci) => {
      const c = row.getCell(ci + 1);
      c.border = BOX;
      c.font = { size: 10, bold: x.isMaturity || d.key === "pay" };
      if (x.isMaturity) c.fill = fill(BLUE_LIGHT);
      else if (d.key === "pay") c.fill = fill("FFF5F9FF");
      else if (zebra) c.fill = fill(ZEBRA);
      if (["before", "principal", "interest", "tax1", "tax2", "net", "pay", "after"].includes(d.key)) {
        c.numFmt = MONEY;
        c.alignment = { horizontal: "right" };
      } else if (d.key === "date" || d.key === "due") {
        c.numFmt = "yyyy-mm-dd";
        c.alignment = { horizontal: "center" };
      } else if (["no", "days", "check", "period"].includes(d.key)) {
        c.alignment = { horizontal: "center" };
      }
      if (d.key === "tax1" || d.key === "tax2") c.font = { ...c.font, color: { argb: RED } };
      if (d.key === "check") {
        c.dataValidation = { type: "list", allowBlank: true, formulae: ['"✓,✗"'] };
        c.font = { ...c.font, size: 12 };
      }
    });
  });

  // 합계
  const last = first + res.rows.length - 1;
  const totalRow = last + 1;
  const t = res.totals;
  const sum = (k: string, result: number) => ({ formula: `SUM(${col[k]}${first}:${col[k]}${last})`, result });
  const tv: Record<string, unknown> = {
    no: "합계",
    principal: sum("principal", t.principal),
    pay: sum("pay", t.payment),
  };
  if (hasInterest) {
    tv.days = sum("days", t.days);
    tv.interest = sum("interest", t.interest);
    tv.tax1 = sum("tax1", t.incomeTax);
    tv.tax2 = sum("tax2", t.localTax);
    tv.net = sum("net", t.netInterest);
  }
  const trow = ws.getRow(totalRow);
  defs.forEach((d, ci) => {
    const c = trow.getCell(ci + 1);
    c.value = (tv[d.key] as ExcelJSNS.CellValue) ?? null;
    c.font = { bold: true, size: 10, color: d.key === "tax1" || d.key === "tax2" ? { argb: RED } : undefined };
    c.fill = fill(LABEL_FILL);
    c.border = { ...BOX, top: { style: "double", color: { argb: "FF94A3B8" } } };
    if (["principal", "interest", "tax1", "tax2", "net", "pay"].includes(d.key)) {
      c.numFmt = MONEY;
      c.alignment = { horizontal: "right" };
    } else c.alignment = { horizontal: "center" };
  });
  ws.mergeCells(`A${totalRow}:B${totalRow}`);
  trow.height = 20;

  // 고정·필터·인쇄
  ws.views = [{ state: "frozen", ySplit: HEAD_ROW, xSplit: 2 }];
  ws.autoFilter = { from: `A${HEAD_ROW}`, to: `${lastCol}${HEAD_ROW}` };
  ws.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: `${GROUP_ROW}:${HEAD_ROW}` };

  return { totalRow, cols: col };
}

/* ───────────────────── 시트2 ───────────────────── */
function buildTermsSheet(
  wb: Workbook,
  res: ScheduleResult,
  meta: ScheduleMeta,
  s1: { totalRow: number; cols: Record<string, string> },
  g?: GiftCheck
) {
  const hasInterest = meta.annualRate > 0;
  const t = res.totals;
  const ws = wb.addWorksheet("차용조건", { properties: { defaultRowHeight: 18 } });
  ws.columns = [{ width: 26 }, { width: 22 }, { width: 3 }, { width: 14 }, { width: 16 }];

  let r = 1;
  const title = ws.getCell(`A${r}`);
  title.value = "차용 조건 · 정산 요약";
  title.font = { bold: true, size: 14 };
  ws.getRow(r).height = 26;
  r += 2;

  const ref = (k: string) => (s1.cols[k] ? `상환스케줄!${s1.cols[k]}${s1.totalRow}` : null);
  type Item = { l: string; v: ExcelJSNS.CellValue; fmt?: string; bold?: boolean; red?: boolean };
  const table = (heading: string, items: Item[]) => {
    for (const [i, h] of ["항목", "내용"].entries()) {
      const c = ws.getCell(r, i + 1);
      c.value = i === 0 ? heading : h;
      styleHeader(c);
      c.alignment = { horizontal: i === 0 ? "left" : "center", vertical: "middle" };
    }
    ws.getRow(r).height = 20;
    r += 1;
    for (const it of items) {
      const a = ws.getCell(r, 1);
      const b = ws.getCell(r, 2);
      a.value = it.l;
      a.font = { size: 10, bold: true };
      a.fill = fill(LABEL_FILL);
      a.border = BOX;
      a.alignment = { vertical: "middle" };
      b.value = it.v;
      b.font = { size: 10, bold: !!it.bold, color: it.red ? { argb: RED } : undefined };
      b.border = BOX;
      b.alignment = { horizontal: typeof it.v === "number" || it.fmt === MONEY ? "right" : "left", vertical: "middle" };
      if (it.fmt) b.numFmt = it.fmt;
      r += 1;
    }
    r += 1;
  };

  table("계약 조건", [
    { l: "차용 원금", v: meta.principal, fmt: MONEY },
    { l: "연 이자율", v: hasInterest ? `${pct(meta.annualRate)}%` : "무이자" },
    { l: "차용일", v: toDate(meta.loanDate), fmt: "yyyy-mm-dd" },
    { l: "변제기일", v: toDate(meta.dueDate), fmt: "yyyy-mm-dd" },
    { l: "상환 방식", v: meta.repayType === "installment" ? `매월 ${meta.monthlyPrincipal.toLocaleString("ko-KR")}원 분할상환` : "만기 일시상환" },
    ...(meta.repayType === "installment" && meta.repayDay ? [{ l: "원금 상환일", v: `매월 ${meta.repayDay}일` } as Item] : []),
    ...(hasInterest && meta.interestDay ? [{ l: "이자 지급일", v: `매월 ${meta.interestDay}일` } as Item] : []),
    { l: "채권자(갑)", v: meta.lenderName || null },
    { l: "채무자(을)", v: meta.borrowerName || null },
  ]);

  const f = (k: string, result: number): ExcelJSNS.CellValue => {
    const rf = ref(k);
    return rf ? { formula: rf, result } : result;
  };
  table(
    "정산 요약",
    hasInterest
      ? [
          { l: "상환 회차", v: `${res.rows.length}회` },
          { l: "총 상환 원금", v: f("principal", t.principal), fmt: MONEY },
          { l: "총 이자 (세전)", v: f("interest", t.interest), fmt: MONEY },
          { l: "소득세 (25%)", v: f("tax1", t.incomeTax), fmt: MONEY, red: true },
          { l: "지방소득세 (2.5%)", v: f("tax2", t.localTax), fmt: MONEY, red: true },
          { l: "원천징수 합계 (27.5%)", v: t.incomeTax + t.localTax, fmt: MONEY, red: true, bold: true },
          { l: "총 이자 (세후)", v: f("net", t.netInterest), fmt: MONEY },
          { l: "채무자 총 송금액", v: f("pay", t.payment), fmt: MONEY, bold: true },
        ]
      : [
          { l: "상환 회차", v: `${res.rows.length}회` },
          { l: "총 상환 원금", v: f("principal", t.principal), fmt: MONEY },
          { l: "채무자 총 송금액", v: f("pay", t.payment), fmt: MONEY, bold: true },
        ]
  );

  // 증여세 안전 체크 — 상증법 §41조의4 (빌린 사람 을에게 과세, 대출일부터 1년 단위). 값은 화면과 같은 giftCheck 결과를 받아 씀
  if (g && g.years.length > 0) {
    const unsafe = g.years.filter((y) => !y.safe);
    table("증여세 안전 체크 (연도별 차액)", [
      ...g.years.map((y) => ({ l: `${y.no}년차 (~${y.to.replace(/-/g, ".")})`, v: y.diff, fmt: MONEY, red: !y.safe }) as Item),
      {
        l: "판정",
        v: unsafe.length ? `${rangeLabel(unsafe.map((y) => y.no))} 1,000만원 이상 ⚠️` : "전 기간 1,000만원 미만 ✅",
        bold: true,
        red: unsafe.length > 0,
      },
      ...(g.firstYearMinSafeRate > 0
        ? [{ l: "첫해 최소 안전 이자율", v: `연 ${(g.firstYearMinSafeRate * 100).toFixed(2)}%` } as Item]
        : []),
    ]);
  }

  if (hasInterest && res.byYear.length > 0) {
    table(
      "연도별 이자 (세전)",
      res.byYear.map((y) => ({ l: `${y.year}년`, v: y.interest, fmt: MONEY }))
    );
  }

  // ※ 주석 — 작은 회색 글씨, 테두리 없음
  const notes = [
    "이자는 상환 후 잔액 × 연 이자율 × 일수 ÷ 365로 계산합니다(초일산입·말일불산입). 달마다 일수가 달라 회차별 이자가 조금씩 다릅니다.",
    "지급일이 그 달에 없으면(예: 31일) 말일로 당깁니다.",
    ...(hasInterest
      ? [
          "채무자(을)는 이자를 줄 때 소득세 25% + 지방소득세 2.5%(소득세의 10%)를 떼고 세후 금액만 보냅니다. 각각 10원 미만 절사.",
          "뗀 세금은 다음 달 10일까지 홈택스에서 원천세 신고·납부하고, 이듬해 2월 말까지 이자소득 지급명세서를 제출합니다.",
          "이자소득은 소액부징수(1천원 미만 불징수) 대상이 아니므로 금액이 작아도 뗍니다(소득세법 제86조).",
          "채권자(갑)는 한 해 이자가 다른 금융소득과 합쳐 2,000만원을 넘으면 종합소득세 신고 대상입니다.",
        ]
      : []),
    "증여세 안전 체크: 빌린 사람(을)에게 과세됩니다(상증법 제41조의4). 대출일부터 1년마다 '그해 시작 잔액 × 4.6%'와 '그해 실제 이자'의 차액이 1,000만원 미만이면 과세 제외. 참고용.",
    "정산 요약의 금액은 '상환스케줄' 시트 합계를 참조하므로, 시트1 금액을 고치면 함께 바뀝니다.",
    "본 자료는 참고용이며 중도상환·연체·이자율 변경은 반영되지 않습니다. 세무회계 새벽 · www.dawntax.com",
  ];
  for (const n of notes) {
    const c = ws.getCell(`A${r}`);
    c.value = `※ ${n}`;
    c.font = { size: 9, color: { argb: GRAY } };
    c.alignment = { vertical: "middle" };
    r += 1;
  }

  ws.pageSetup = { orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
}

/* ───────────────────── 공개 API ───────────────────── */

export async function buildScheduleWorkbook(res: ScheduleResult, meta: ScheduleMeta, gift?: GiftCheck): Promise<Workbook> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "세무회계 새벽 (dawntax.com)";
  wb.created = new Date();
  const s1 = buildScheduleSheet(wb, res, meta);
  buildTermsSheet(wb, res, meta, s1, gift);
  return wb;
}

/** 브라우저: 파일 다운로드 */
export async function downloadScheduleXlsx(res: ScheduleResult, meta: ScheduleMeta, gift?: GiftCheck): Promise<void> {
  const wb = await buildScheduleWorkbook(res, meta, gift);
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `상환스케줄표_${meta.loanDate.replace(/-/g, "")}.xlsx`;
  a.click();
  // 다운로드가 시작된 뒤 해제 (즉시 해제하면 일부 브라우저에서 저장 실패)
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
}

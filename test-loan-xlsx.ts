// 상환 스케줄 엑셀(ExcelJS) 생성 검증 — 실행: node test-loan-xlsx.ts (임시 폴더에 파일 생성 후 읽어서 확인)
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { buildSchedule } from "./src/lib/loanSchedule.ts";
import { buildScheduleWorkbook } from "./src/lib/loanScheduleXlsx.ts";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "loan-xlsx-"));
let pass = 0, fail = 0;
const ok = (n: string, c: boolean, d = "") => { c ? pass++ : fail++; console.log(`${c ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`); };

const meta = {
  principal: 50_000_000, annualRate: 0.03, loanDate: "2026-03-05", dueDate: "2029-03-05",
  repayType: "installment" as const, monthlyPrincipal: 1_000_000, lenderName: "홍길동", borrowerName: "홍아들",
  repayDay: 10, interestDay: 25,
};
const res = buildSchedule({ ...meta, repayDay: 10, interestDay: 25 });
const file = path.join(dir, "schedule.xlsx");
await (await buildScheduleWorkbook(res, meta)).xlsx.writeFile(file);
ok("파일 생성", fs.existsSync(file) && fs.statSync(file).size > 10_000, `${fs.statSync(file).size} bytes`);

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(file);
ok("시트 2개 (상환스케줄·차용조건)", wb.worksheets.map((w) => w.name).join(",") === "상환스케줄,차용조건", wb.worksheets.map((w) => w.name).join(","));
const ws = wb.getWorksheet("상환스케줄")!;
const HEAD = 4, FIRST = 5, LAST = FIRST + res.rows.length - 1, TOTAL = LAST + 1;
ok("제목·조건 요약 행", String(ws.getCell("A1").value) === "상환 스케줄표" && String(ws.getCell("A2").value).includes("홍길동"), String(ws.getCell("A2").value).slice(0, 60));
const h = ws.getCell(`A${HEAD}`);
ok("머리글: 남색 채움 + 흰색 굵게", h.fill?.type === "pattern" && (h.fill as ExcelJS.FillPattern).fgColor?.argb === "FF1E293B" && h.font?.bold === true && h.font?.color?.argb === "FFFFFFFF", JSON.stringify({ fill: (h.fill as ExcelJS.FillPattern).fgColor, font: h.font }));
ok("머리글 15열", ws.getRow(HEAD).cellCount === 15, `${ws.getRow(HEAD).cellCount}`);
ok("그룹 머리글(이자 묶음)", String(ws.getCell(`G3`).value).includes("이자") && ws.model.merges.some((m) => m === "G3:J3"), ws.model.merges.join(" "));
ok("머리글 아래 고정(틀 고정)", ws.views[0]?.state === "frozen" && (ws.views[0] as ExcelJS.WorksheetViewFrozen).ySplit === HEAD, JSON.stringify(ws.views[0]));
ok("자동 필터", !!ws.autoFilter, JSON.stringify(ws.autoFilter));
const d1 = ws.getCell(`B${FIRST}`).value as Date;
ok("지급일 날짜 셀 2026-03-10 (yyyy-mm-dd)", d1 instanceof Date && d1.getUTCFullYear() === 2026 && d1.getUTCMonth() === 2 && d1.getUTCDate() === 10 && ws.getCell(`B${FIRST}`).numFmt === "yyyy-mm-dd", `${d1} ${ws.getCell(`B${FIRST}`).numFmt}`);
const g = ws.getCell(`G${FIRST + 1}`);
ok("이자 금액 서식 #,##0", g.value === res.rows[1].interest && g.numFmt === "#,##0", `${g.value} ${g.numFmt}`);
const tot = ws.getCell(`F${TOTAL}`).value as ExcelJS.CellFormulaValue;
ok("합계 원금 SUM 수식 + 캐시값", tot?.formula === `SUM(F${FIRST}:F${LAST})` && tot.result === 50_000_000, JSON.stringify(tot));
const pay = ws.getCell(`K${TOTAL}`).value as ExcelJS.CellFormulaValue;
ok("합계 송금액 = 엔진 합계", pay?.result === res.totals.payment, `${pay?.result} vs ${res.totals.payment}`);
ok("납부 체크 드롭다운(✓)", JSON.stringify(ws.getCell(`N${FIRST}`).dataValidation?.formulae) === JSON.stringify(['"✓,✗"']), JSON.stringify(ws.getCell(`N${FIRST}`).dataValidation));
ok("만기 행 비고 '만기'", ws.getCell(`O${LAST}`).value === "만기");
ok("줄무늬(짝수 행 채움)", (ws.getCell(`A${FIRST + 1}`).fill as ExcelJS.FillPattern)?.fgColor?.argb === "FFF8FAFC");

const ws2 = wb.getWorksheet("차용조건")!;
const texts = (c: string) => String(ws2.getCell(c).value ?? "");
ok("시트2 제목", texts("A1") === "차용 조건 · 정산 요약");
ok("시트2 '계약 조건' 표 머리글 서식", texts("A3") === "계약 조건" && (ws2.getCell("A3").fill as ExcelJS.FillPattern)?.fgColor?.argb === "FF1E293B");
ok("시트2 차용 원금 5,000만", ws2.getCell("B4").value === 50_000_000 && ws2.getCell("B4").numFmt === "#,##0");
ok("시트2 채권자 홍길동", [...Array(16)].some((_, i) => texts(`A${i + 1}`) === "채권자(갑)" && texts(`B${i + 1}`) === "홍길동"));
const sumLabelRow = [...Array(30)].findIndex((_, i) => texts(`A${i + 1}`) === "원천징수 합계 (27.5%)") + 1;
ok("시트2 원천징수 합계(27.5%) 행", sumLabelRow > 0 && ws2.getCell(`B${sumLabelRow}`).value === res.totals.incomeTax + res.totals.localTax, `row ${sumLabelRow}`);
const payRow = [...Array(30)].findIndex((_, i) => texts(`A${i + 1}`) === "채무자 총 송금액") + 1;
const payV = ws2.getCell(`B${payRow}`).value as ExcelJS.CellFormulaValue;
ok("시트2 송금액은 시트1 합계 참조 수식", payV?.formula === `상환스케줄!K${TOTAL}` && payV.result === res.totals.payment, JSON.stringify(payV));
const noteRows = [...Array(60)].map((_, i) => texts(`A${i + 1}`)).filter((v) => v.startsWith("※ "));
ok("※ 주석 6개 이상·작은 회색 글씨", noteRows.length >= 6 && ws2.getCell(`A${[...Array(60)].findIndex((_, i) => texts(`A${i + 1}`).startsWith("※ ")) + 1}`).font?.size === 9, `${noteRows.length}`);
ok("시트2 B열 폭 작게(≤ 24)", (ws2.getColumn(2).width ?? 99) <= 24, `${ws2.getColumn(2).width}`);

// 무이자 분할 — 8열 버전
const meta0 = { ...meta, annualRate: 0, dueDate: "2028-03-05", monthlyPrincipal: 2_000_000, interestDay: 0 };
const file0 = path.join(dir, "schedule0.xlsx");
await (await buildScheduleWorkbook(buildSchedule({ ...meta0, repayDay: 31, interestDay: 0 }), meta0)).xlsx.writeFile(file0);
const wb0 = new ExcelJS.Workbook();
await wb0.xlsx.readFile(file0);
const h0 = wb0.getWorksheet("상환스케줄")!.getRow(4);
ok("무이자: 8열 (세금 열 없음)", h0.cellCount === 8 && !h0.values.toString().includes("소득세"), `${h0.cellCount}`);

process.chdir(os.tmpdir());
fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);

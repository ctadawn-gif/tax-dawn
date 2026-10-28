// 상환 스케줄 엑셀 생성 검증 — 실행: node test-loan-xlsx.ts (임시 폴더에 파일 생성 후 읽어서 확인)
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { buildSchedule } from "./src/lib/loanSchedule.ts";
import { downloadScheduleXlsx } from "./src/lib/loanScheduleXlsx.ts";

XLSX.set_fs(fs); // ESM 빌드는 Node에서 fs를 직접 주입해야 writeFile 동작 (브라우저는 불필요)
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "loan-xlsx-"));
process.chdir(dir);

const meta = {
  principal: 50_000_000, annualRate: 0.03, loanDate: "2026-03-05", dueDate: "2029-03-05",
  repayType: "installment" as const, monthlyPrincipal: 1_000_000, lenderName: "홍길동", borrowerName: "홍아들",
};
const res = buildSchedule({ ...meta, repayDay: 10, interestDay: 25 });
await downloadScheduleXlsx(res, meta);

const file = path.join(dir, "상환스케줄표_20260305.xlsx");
let pass = 0, fail = 0;
const ok = (n: string, c: boolean, d = "") => { c ? pass++ : fail++; console.log(`${c ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`); };

ok("파일 생성", fs.existsSync(file), file);
const wb = XLSX.readFile(file, { cellDates: true, cellNF: true, cellStyles: true }); // cellStyles 없으면 열너비(!cols)를 안 읽음
ok("시트 2개 (상환스케줄·차용조건)", wb.SheetNames.join(",") === "상환스케줄,차용조건", wb.SheetNames.join(","));
const ws = wb.Sheets["상환스케줄"];
const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { header: 1 }) as unknown[][];
ok("행 수 = 헤더 + 73회차 + 합계", rows.length === 75, `${rows.length}`);
ok("헤더 15열", (rows[0] as string[]).length === 15, `${(rows[0] as string[]).length}`);
const b2 = ws["B2"];
ok("지급일이 실제 날짜 셀 (2026-03-10, 서식 yyyy-mm-dd)", b2?.t === "d" && (b2.v as Date).getFullYear() === 2026 && (b2.v as Date).getMonth() === 2 && (b2.v as Date).getDate() === 10 && b2.z === "yyyy-mm-dd", `${b2?.t} ${b2?.v} ${b2?.z}`);
const g3 = ws["G3"];
ok("이자 금액 서식 #,##0", g3?.t === "n" && g3.v === res.rows[1].interest && g3.z === "#,##0", `${g3?.v} ${g3?.z}`);
const totalRow = 75;
ok("합계 원금 SUM 수식", ws[`F${totalRow}`]?.f === "SUM(F2:F74)", ws[`F${totalRow}`]?.f);
ok("합계 송금액 SUM 수식", ws[`K${totalRow}`]?.f === "SUM(K2:K74)", ws[`K${totalRow}`]?.f);
// 수식 결과를 직접 합산해 엔진 합계와 대조
const sumCol = (c: string) => { let s = 0; for (let r = 2; r <= 74; r++) s += Number(ws[`${c}${r}`]?.v ?? 0); return s; };
ok("원금 합 = 5,000만", sumCol("F") === 50_000_000, `${sumCol("F")}`);
ok("송금액 합 = 엔진 합계", sumCol("K") === res.totals.payment, `${sumCol("K")} vs ${res.totals.payment}`);
ok("자동필터·열너비 설정", !!ws["!autofilter"] && (ws["!cols"]?.length ?? 0) === 15);
const ws2 = wb.Sheets["차용조건"];
ok("차용조건: 원금·차용일", ws2["B2"]?.v === 50_000_000 && ws2["B4"]?.t === "d", `${ws2["B2"]?.v} ${ws2["B4"]?.t}`);
ok("차용조건: 채권자", ws2["B7"]?.v === "홍길동", `${ws2["B7"]?.v}`);

// 무이자 분할 — 8열 버전
const meta0 = { ...meta, annualRate: 0, dueDate: "2028-03-05", monthlyPrincipal: 2_000_000 };
await downloadScheduleXlsx(buildSchedule({ ...meta0, repayDay: 31, interestDay: 0 }), meta0);
const wb0 = XLSX.readFile(file);
const h0 = XLSX.utils.sheet_to_json(wb0.Sheets["상환스케줄"], { header: 1 })[0] as string[];
ok("무이자: 8열 (세금 열 없음)", h0.length === 8 && !h0.includes("소득세"), h0.join("|"));

process.chdir(os.tmpdir()); // 현재 폴더는 삭제 불가(Windows)
fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);

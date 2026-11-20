// 대출 가능액, DSR·LTV 검증 (대출 명세 7번 예시 4~6) — 실행: node test-loan-limit.ts
import { calculateRatios, calculateLimit, ltvPct, pickAmountCap, type RatioInput } from "./src/lib/loanLimitCalc.ts";
import { annuityPaymentExact } from "./src/lib/loanRepaymentCalc.ts";
import { LOAN_AMOUNT_CAP } from "./src/lib/officeRates.ts";

let pass = 0;
let fail = 0;
const w = (v: number) => v.toLocaleString("ko-KR");
const eq = (name: string, got: number, want: number) => {
  const ok = got === want;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name} : ${w(got)}${ok ? "" : "  (명세 " + w(want) + ")"}`);
};

const base: RatioInput = {
  income: 180_000_000,
  loan: { principal: 400_000_000, ratePct: 4.5, months: 360, method: "annuity" },
  stressPct: 0, otherAnnualDebtService: 0, otherAnnualInterest: 0,
  collateralValue: 1_820_000_000, senior: 0, bulletMaxYears: 10,
};

console.log("== 예시 4. DSR");
const a = calculateRatios(base);
eq("한 해 원리금", a.annualThisLoan, 24_320_894);
eq("DSR ×100", Math.round(a.dsrPct * 100), 1351);
const b = calculateRatios({ ...base, stressPct: 3.0 });
eq("7.5% 한 달 상환액", Math.floor(annuityPaymentExact(400_000_000, 7.5, 360)), 2_796_858);
eq("7.5% 한 해 원리금", b.annualThisLoan, 33_562_296);
eq("7.5% DSR ×100", Math.round(b.dsrPct * 100), 1865);

console.log("\n== 예시 5. DSR로 거꾸로 구한 대출 가능액");
const lim = { collateralValue: 100_000_000_000, senior: 0, ltvRatioPct: 100, income: 180_000_000, dsrLimitPct: 40, otherAnnualDebtService: 0, ratePct: 4.5, stressPct: 0, months: 360, amountCap: null };
const l1 = calculateLimit(lim);
eq("한 해에 쓸 수 있는 원리금", l1.annualRoom, 72_000_000);
eq("한 달", l1.monthlyRoom, 6_000_000);
eq("4.5% 가능액", l1.dsrLimit, 1_184_166_954);
eq("7.5% 가능액", calculateLimit({ ...lim, stressPct: 3.0 }).dsrLimit, 858_105_763);

console.log("\n== 예시 6. LTV");
eq("LTV ×100", Math.round(ltvPct(400_000_000, 0, 1_820_000_000) * 100), 2198);
eq("계산 묶음의 LTV ×100", Math.round(a.ltvPct * 100), 2198);

console.log("\n== 명세에 없는 점검");
const cap = LOAN_AMOUNT_CAP.value;
eq("금액 한도 : 15억 원", pickAmountCap(1_500_000_000, cap), 600_000_000);
eq("금액 한도 : 15억 1원", pickAmountCap(1_500_000_001, cap), 400_000_000);
eq("금액 한도 : 25억 원", pickAmountCap(2_500_000_000, cap), 400_000_000);
eq("금액 한도 : 25억 1원", pickAmountCap(2_500_000_001, cap), 200_000_000);
const m = calculateLimit({ collateralValue: 1_820_000_000, senior: 0, ltvRatioPct: 40, income: 180_000_000, dsrLimitPct: 40, otherAnnualDebtService: 0, ratePct: 4.5, stressPct: 3.0, months: 360, amountCap: 400_000_000 });
eq("세 한도 : LTV", m.ltvLimit, 728_000_000);
eq("세 한도 : DSR", m.dsrLimit, 858_105_763);
eq("세 한도 : 최종 (금액 한도에 걸림)", m.final, 400_000_000);
eq("걸린 한도가 금액 한도인지", m.binding === "cap" ? 1 : 0, 1);
eq("만기 일시상환 한 해 원리금 (원금 ÷ 10년 + 이자)", calculateRatios({ ...base, loan: { ...base.loan, method: "bullet" } }).annualThisLoan, 58_000_000);

console.log(`\n결과 : 통과 ${pass}건, 실패 ${fail}건`);
if (fail > 0) process.exit(1);

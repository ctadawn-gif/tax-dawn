// 대출 원리금 상환 계산 검증 (대출 명세 7번 예시 1~3) — 실행: node test-loan-repayment.ts
import { calculateRepayment, formulaTotalInterest, annuityPaymentExact, type RepayInput } from "./src/lib/loanRepaymentCalc.ts";

let pass = 0;
let fail = 0;
const w = (v: number) => v.toLocaleString("ko-KR");
const eq = (name: string, got: number, want: number) => {
  const ok = got === want;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name} : ${w(got)}${ok ? "" : "  (명세 " + w(want) + ")"}`);
};
const info = (name: string, got: number, spec: number) =>
  console.log(`참고 ${name} : ${w(got)}  (명세 ${w(spec)}, 차이 ${got - spec >= 0 ? "+" : ""}${w(got - spec)}원)`);

const base: Omit<RepayInput, "method"> = { principal: 400_000_000, ratePct: 4.5, months: 360, graceMonths: 0 };

console.log("== 예시 1. 원리금균등");
const a = calculateRepayment({ ...base, method: "annuity" });
eq("한 달 상환액", a.levelPayment, 2_026_741);
eq("버림 전 상환액 ×10000", Math.round(annuityPaymentExact(400_000_000, 4.5, 360) * 10000), 20_267_412_393);
eq("첫 달 이자", a.rows[0].interest, 1_500_000);
eq("첫 달 원금", a.rows[0].principal, 526_741);
eq("전체 이자 (식으로 구한 값)", formulaTotalInterest({ ...base, method: "annuity" }), 329_626_846);
info("전체 이자 (상환표 합계)", a.totalInterest, 329_626_846);
eq("원금 합계", a.rows.reduce((s, x) => s + x.principal, 0), 400_000_000);
eq("마지막 남은 원금", a.rows[359].balance, 0);

console.log("\n== 예시 2. 원금균등");
const b = calculateRepayment({ ...base, method: "equalPrincipal" });
eq("매달 원금", b.monthlyPrincipal, 1_111_111);
eq("첫 달 이자", b.rows[0].interest, 1_500_000);
eq("첫 달 상환액", b.firstPayment, 2_611_111);
eq("전체 이자 (식으로 구한 값)", formulaTotalInterest({ ...base, method: "equalPrincipal" }), 270_750_000);
info("전체 이자 (상환표 합계)", b.totalInterest, 270_750_000);
eq("원금 합계", b.rows.reduce((s, x) => s + x.principal, 0), 400_000_000);
eq("마지막 남은 원금", b.rows[359].balance, 0);

console.log("\n== 예시 3. 만기 일시상환");
const c = calculateRepayment({ ...base, method: "bullet" });
eq("한 달 이자", c.rows[0].interest, 1_500_000);
eq("전체 이자", c.totalInterest, 540_000_000);
eq("전체 이자 (식으로 구한 값)", formulaTotalInterest({ ...base, method: "bullet" }), 540_000_000);
eq("만기 원금", c.rows[359].principal, 400_000_000);
eq("마지막 남은 원금", c.rows[359].balance, 0);

console.log("\n== 명세에 없는 점검 (거치기간, 0%, 연도별 합계)");
const g = calculateRepayment({ ...base, method: "annuity", graceMonths: 12 });
eq("거치 12개월 : 거치 중 한 달 이자", g.gracePayment, 1_500_000);
eq("거치 12개월 : 12회차 남은 원금", g.rows[11].balance, 400_000_000);
eq("거치 12개월 : 상환 개월 수", g.repayMonths, 348);
eq("거치 12개월 : 마지막 남은 원금", g.rows[359].balance, 0);
const z = calculateRepayment({ principal: 120_000_000, ratePct: 0, months: 120, graceMonths: 0, method: "annuity" });
eq("0% : 한 달 상환액", z.levelPayment, 1_000_000);
eq("0% : 전체 이자", z.totalInterest, 0);
for (const r of [a, b, c, g]) {
  eq(`${r.method} 연도별 이자 합 = 전체 이자`, r.years.reduce((s, y) => s + y.interest, 0), r.totalInterest);
  eq(`${r.method} 연도별 원금 합`, r.years.reduce((s, y) => s + y.principal, 0), 400_000_000);
}
eq("거치기간이 기간 이상이면 계산 안 함", calculateRepayment({ ...base, method: "annuity", graceMonths: 360 }).valid ? 1 : 0, 0);

console.log(`\n결과 : 통과 ${pass}건, 실패 ${fail}건`);
if (fail > 0) process.exit(1);

// 상환 스케줄 검증 — 실행: node test-loan-schedule.ts
import { buildSchedule, withholding, giftCheck, type ScheduleInput } from "./src/lib/loanSchedule.ts";

let pass = 0;
let fail = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (cond) pass++;
  else fail++;
  console.log(`${cond ? "✅" : "❌"} ${name}${detail ? " — " + detail : ""}`);
};
const base: ScheduleInput = {
  principal: 100_000_000,
  annualRate: 0.046,
  loanDate: "2026-01-15",
  dueDate: "2027-01-15",
  repayType: "lump",
  monthlyPrincipal: 0,
  repayDay: 0,
  interestDay: 15,
};

// 1. 만기일시 + 이자 매월 15일 — 1억·4.6%·1년
{
  const s = buildSchedule(base);
  ok("1-rows: 12회차", s.rows.length === 12, `${s.rows.length}`);
  const r1 = s.rows[0];
  // 1/15~2/15 = 31일 → 1억×4.6%×31/365 = 390,684.93
  ok("1-r1 날짜·일수", r1.date === "2026-02-15" && r1.days === 31, `${r1.date} ${r1.days}일`);
  ok("1-r1 이자 390,685", r1.interest === 390_685, `${r1.interest}`);
  ok("1-r1 소득세 97,670 (10원 절사)", r1.incomeTax === 97_670, `${r1.incomeTax}`);
  ok("1-r1 지방소득세 9,760", r1.localTax === 9_760, `${r1.localTax}`);
  ok("1-r1 세후 283,255", r1.netInterest === 283_255, `${r1.netInterest}`);
  ok("1-r1 원천세 기한 2026-03-10", r1.taxDueDate === "2026-03-10", `${r1.taxDueDate}`);
  const r2 = s.rows[1];
  ok("1-r2 2월은 28일 → 352,877", r2.days === 28 && r2.interest === 352_877, `${r2.days}일 ${r2.interest}`);
  ok("1-총 일수 365", s.totals.days === 365, `${s.totals.days}`);
  ok("1-총 이자 ≈ 460만 (±12원 반올림)", Math.abs(s.totals.interest - 4_600_000) <= 12, `${s.totals.interest}`);
  const last = s.rows[11];
  ok("1-만기 회차 원금 1억·잔액 0", last.isMaturity && last.principal === 100_000_000 && last.balance === 0);
  ok("1-원금 합계 = 원금", s.totals.principal === 100_000_000);
  ok("1-경고 없음", s.warnings.length === 0, s.warnings.join(" / "));
}

// 2. 무이자 분할 — 31일 상환일의 말일 처리, 기간 내 완납이면 만기 빈 회차 없음
{
  const s = buildSchedule({
    ...base,
    principal: 24_000_000,
    annualRate: 0,
    loanDate: "2026-01-10",
    dueDate: "2028-01-10",
    repayType: "installment",
    monthlyPrincipal: 1_000_000,
    repayDay: 31,
    interestDay: 0,
  });
  const d = s.rows.map((x) => x.date);
  ok("2-rows: 24회차 (만기 빈 회차 생략)", s.rows.length === 24, `${s.rows.length}`);
  ok("2-말일 클램프", d[0] === "2026-01-31" && d[1] === "2026-02-28" && d[3] === "2026-04-30", d.slice(0, 4).join(" "));
  ok("2-이자·세금 0", s.totals.interest === 0 && s.totals.incomeTax === 0);
  ok("2-원금 합계 2,400만·잔액 0", s.totals.principal === 24_000_000 && s.rows[23].balance === 0);
  ok("2-만기 일시상환 없음", s.balloonAtMaturity === 0 && s.warnings.length === 0);
}

// 3. 이자일(25)·상환일(10)이 다른 분할상환 — 일할 누적이 브루트포스와 일치
{
  const inp: ScheduleInput = {
    principal: 50_000_000,
    annualRate: 0.03,
    loanDate: "2026-03-05",
    dueDate: "2027-03-05",
    repayType: "installment",
    monthlyPrincipal: 3_000_000,
    repayDay: 10,
    interestDay: 25,
  };
  const s = buildSchedule(inp);
  // 브루트포스: 날마다 잔액×r/365 누적
  const DAY = 86400000;
  const t0 = Date.UTC(2026, 2, 5);
  const t1 = Date.UTC(2027, 2, 5);
  const principalByDate = new Map(s.rows.map((x) => [x.date, x.principal]));
  let bal = inp.principal;
  let brute = 0;
  for (let t = t0; t < t1; t += DAY) {
    brute += (bal * inp.annualRate) / 365;
    const d = new Date(t + DAY);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    bal -= principalByDate.get(key) ?? 0;
  }
  ok("3-총 이자 = 브루트포스 (±회차수 원)", Math.abs(s.totals.interest - brute) <= s.rows.length, `${s.totals.interest} vs ${brute.toFixed(0)}`);
  const onlyPrincipal = s.rows.filter((x) => x.principal > 0 && x.interest === 0);
  const onlyInterest = s.rows.filter((x) => x.principal === 0 && x.interest > 0);
  ok("3-원금만 회차·이자만 회차 모두 존재", onlyPrincipal.length > 0 && onlyInterest.length > 0, `${onlyPrincipal.length}/${onlyInterest.length}`);
  ok("3-원금 합계 = 원금", s.totals.principal === 50_000_000, `${s.totals.principal}`);
  ok("3-만기 잔액 1,700만 일시상환 경고", s.balloonAtMaturity === 14_000_000 && s.warnings.length === 1, `${s.balloonAtMaturity}`);
  ok("3-매 회차 송금액 = 원금 + 세후이자", s.rows.every((x) => x.payment === x.principal + x.netInterest));
  ok("3-잔액 연속성", s.rows.every((x) => x.balance === x.balanceBefore - x.principal));
}

// 4. 원천징수 절사·소액도 징수
{
  const w = withholding(1234);
  ok("4-1,234원 이자: 소득세 300·지방세 30 (소액부징수 미적용)", w.incomeTax === 300 && w.localTax === 30 && w.net === 904, JSON.stringify(w));
  const w2 = withholding(1_000_000);
  ok("4-100만원: 250,000 / 25,000 / 725,000", w2.incomeTax === 250_000 && w2.localTax === 25_000 && w2.net === 725_000);
}

// 5. 원천세 기한 주말 이월 — 2026-12 지급 → 2027-01-10(일) → 01-11(월)
{
  const s = buildSchedule({ ...base, loanDate: "2026-11-15", dueDate: "2026-12-15" });
  ok("5-주말 이월", s.rows[0].taxDueDate === "2027-01-11", `${s.rows[0].taxDueDate}`);
}

// 6. 잘못된 입력
{
  ok("6-만기 ≤ 차용일 경고", buildSchedule({ ...base, dueDate: "2026-01-15" }).warnings.length === 1);
  ok("6-원금 0 → 빈 결과", buildSchedule({ ...base, principal: 0 }).rows.length === 0);
  ok("6-2월 31일 거부", buildSchedule({ ...base, loanDate: "2026-02-31" }).rows.length === 0);
}

// 7. 만기 회차와 상환일이 겹치는 경우 — 3억·10년·월 100만: 119회 + 만기(120회차) 181,000,000
{
  const inp: ScheduleInput = { principal: 300_000_000, annualRate: 0, loanDate: "2026-10-25", dueDate: "2036-10-25", repayType: "installment", monthlyPrincipal: 1_000_000, repayDay: 25, interestDay: 0 };
  const s = buildSchedule(inp);
  const last = s.rows[s.rows.length - 1];
  ok("7-120회차(만기) 181,000,000", s.rows.length === 120 && last.isMaturity && last.principal === 181_000_000, `${s.rows.length} ${last.principal}`);
  ok("7-일반 회차 119회 × 100만 = 119,000,000", s.scheduledInstallments === 119 && s.installmentTotal === 119_000_000, `${s.scheduledInstallments} ${s.installmentTotal}`);
  ok("7-초과분 180,000,000·슬롯 120·경고 1", s.balloonExcess === 180_000_000 && s.installmentSlots === 120 && s.warnings.length === 1, `${s.balloonExcess} ${s.installmentSlots} ${s.warnings[0]}`);
  const s2 = buildSchedule({ ...inp, monthlyPrincipal: 2_500_000 });
  const l2 = s2.rows[s2.rows.length - 1];
  ok("7-250만이면 120회차 2,500,000으로 완납·초과분 0·경고 없음", s2.rows.length === 120 && l2.principal === 2_500_000 && l2.balance === 0 && s2.balloonExcess === 0 && s2.warnings.length === 0, `${l2.principal} ${s2.balloonExcess} ${s2.warnings.length}`);
  ok("7-권장 월상환액 = 원금 ÷ 슬롯 = 2,500,000", Math.ceil(inp.principal / s.installmentSlots) === 2_500_000);
}

// 8. 증여세 안전 체크(분할상환 첫해 기준) — 검산값: 3억 · 2026.10.25~2036.10.25 · 이자 25일 · 상환 25일
{
  const base: ScheduleInput = { principal: 300_000_000, annualRate: 0.013, loanDate: "2026-10-25", dueDate: "2036-10-25", repayType: "installment", monthlyPrincipal: 1_000_000, repayDay: 25, interestDay: 25 };
  const g1 = giftCheck(buildSchedule(base), base);
  ok("8-1.3%·100만: 첫해 실제 이자 3,828,483", g1.firstYear?.actual === 3_828_483, `${g1.firstYear?.actual}`);
  ok("8-1.3%·100만: 차액 9,971,517 ✅", g1.firstYear?.diff === 9_971_517 && g1.firstYear.safe, `${g1.firstYear?.diff}`);
  ok("8-1.3%·100만: 최소 안전 이자율 1.30%", g1.firstYearMinSafeRate === 0.013, `${g1.firstYearMinSafeRate}`);
  ok("8-연도별: 1년차 9,971,517 · 2년차 9,565,402 · 3년차 9,179,518", g1.years[1]?.diff === 9_565_402 && g1.years[2]?.diff === 9_179_518, `${g1.years.slice(0, 3).map((y) => y.diff).join(" ")}`);
  ok("8-10년치·마지막 해도 1년", g1.years.length === 10 && g1.years[9].to === "2036-10-25", `${g1.years.length} ${g1.years[9]?.to}`);
  const b2 = { ...base, annualRate: 0.0127 };
  const g2 = giftCheck(buildSchedule(b2), b2);
  ok("8-1.27%·100만: 차액 10,059,867 ⚠️", g2.firstYear?.diff === 10_059_867 && !g2.firstYear.safe, `${g2.firstYear?.diff}`);
  const b3 = { ...base, monthlyPrincipal: 2_500_000 };
  const g3 = giftCheck(buildSchedule(b3), b3);
  ok("8-1.3%·250만: 차액 10,078,795 ⚠️ · 최소 1.33%", g3.firstYear?.diff === 10_078_795 && !g3.firstYear.safe && g3.firstYearMinSafeRate === 0.0133, `${g3.firstYear?.diff} ${g3.firstYearMinSafeRate}`);
  const b4 = { ...base, annualRate: 0 };
  const g4 = giftCheck(buildSchedule(b4), b4);
  ok("8-0%·100만: 차액 13,800,000 ⚠️ · 최소 1.30%", g4.firstYear?.diff === 13_800_000 && !g4.firstYear.safe && g4.firstYearMinSafeRate === 0.013, `${g4.firstYear?.diff} ${g4.firstYearMinSafeRate}`);
  // 만기 일시상환이면 기존 giftBenefit(원금 × (4.6% − r))과 같은 결과여야 함
  const b5: ScheduleInput = { ...base, repayType: "lump", monthlyPrincipal: 0, repayDay: 0 };
  const g5 = giftCheck(buildSchedule(b5), b5);
  ok("8-일시상환: 첫해 차액 = 9,900,000 (원금 × 3.3%, ±12원)", Math.abs((g5.firstYear?.diff ?? 0) - 9_900_000) <= 12, `${g5.firstYear?.diff}`);
}

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);

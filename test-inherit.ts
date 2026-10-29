// 상속세 — 배우자상속공제 법정상속분 한도 · 금융재산상속공제 검증 — 실행: node test-inherit.ts
import { calculateInheritanceTax, type InheritanceTaxInput } from "./src/lib/inheritGiftTaxCalc.ts";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  console.log(`${c ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
};
const base: InheritanceTaxInput = {
  totalAssets: 0, debtsAndExpenses: 0, hasSpouse: true, spouseInheritance: 0, children: 0, minorChildren: 0,
  minorRemainingYears: 0, elderlyCount: 0, priorGiftsToHeir: 0, priorGiftsToSpouse: 0, generationSkip: false,
};
const t = (o: Partial<InheritanceTaxInput>) => calculateInheritanceTax({ ...base, ...o });

// 1. 배우자 법정상속분 한도
{
  const a = t({ totalAssets: 300000, children: 3, spouseInheritance: 200000 });
  ok("1-30억·자녀 3·배우자 실제 20억 → 한도 10억 (1.5/4.5)", a.spouseDeduction === 100000 && a.spouseLegalLimit === 100000 && a.spouseDeductionBasis === "법정상속분 한도", `${a.spouseDeduction} ${a.spouseLegalLimit} ${a.spouseDeductionBasis}`);
  const b = t({ totalAssets: 300000, children: 1, spouseInheritance: 200000 });
  ok("1-30억·자녀 1·실제 20억 → 한도 18억 (1.5/2.5)", b.spouseDeduction === 180000, `${b.spouseDeduction}`);
  const c = t({ totalAssets: 300000, children: 2, spouseInheritance: 80000 });
  ok("1-실제 8억 < 한도 12.86억 → 실제 8억", c.spouseDeduction === 80000 && c.spouseDeductionBasis === "실제 상속받은 금액", `${c.spouseDeduction} ${c.spouseDeductionBasis}`);
  const d = t({ totalAssets: 300000, children: 2 });
  ok("1-미입력 → 5억", d.spouseDeduction === 50000 && d.spouseDeductionBasis === "미입력 → 최소 5억");
  const e = t({ totalAssets: 300000, children: 2, spouseInheritance: 30000 });
  ok("1-실제 3억 → 최소 5억", e.spouseDeduction === 50000);
  const f = t({ totalAssets: 1200000, children: 1, spouseInheritance: 600000 });
  ok("1-120억·자녀 1·실제 60억 → 한도 72억이지만 30억 상한", f.spouseDeduction === 300000 && f.spouseDeductionBasis === "최대 30억 한도", `${f.spouseDeduction} ${f.spouseDeductionBasis}`);
  const g = t({ totalAssets: 100000, children: 5, spouseInheritance: 60000 });
  ok("1-10억·자녀 5 → 한도 2.3억 < 5억 → 최소 5억", g.spouseDeduction === 50000 && g.spouseDeductionBasis.includes("최소 5억"), `${g.spouseDeduction} ${g.spouseLegalLimit} ${g.spouseDeductionBasis}`);
  const h = t({ totalAssets: 300000, debtsAndExpenses: 30000, children: 3, spouseInheritance: 200000 });
  ok("1-채무 3억 차감 후 27억 × 1/3 = 9억", h.spouseDeduction === 90000, `${h.spouseDeduction}`);
  const i = t({ totalAssets: 300000, children: 0, parentsAlive: 2, spouseInheritance: 200000 });
  ok("1-자녀 없음·부모 2 → 1.5/3.5 = 12.86억", i.spouseDeduction === Math.round(300000 * 1.5 / 3.5), `${i.spouseDeduction}`);
  const j = t({ totalAssets: 300000, children: 0, parentsAlive: 0, spouseInheritance: 200000 });
  ok("1-자녀·부모 없음 → 배우자 단독 → 실제 20억", j.spouseDeduction === 200000 && j.spouseLegalShare === 1, `${j.spouseDeduction}`);
  const k = t({ hasSpouse: false, totalAssets: 300000, children: 3 });
  ok("1-배우자 없음 → 0", k.spouseDeduction === 0);
}
// 2. 금융재산상속공제
{
  const fin = (v: number) => t({ totalAssets: 300000, children: 2, netFinancialAssets: v }).financialDeduction;
  ok("2-1,500만 → 전액 1,500만", fin(1500) === 1500, `${fin(1500)}`);
  ok("2-5천만 → 2천만", fin(5000) === 2000, `${fin(5000)}`);
  ok("2-5억 → 20% 1억", fin(50000) === 10000, `${fin(50000)}`);
  ok("2-15억 → 2억 한도", fin(150000) === 20000, `${fin(150000)}`);
  ok("2-총재산보다 크게 넣어도 총재산까지만", t({ totalAssets: 30000, netFinancialAssets: 80000 }).financialDeduction === 6000);
}
// 3. 세액까지 — 30억 · 자녀 3 · 배우자 실제 20억 · 순금융 5억
{
  const r = t({ totalAssets: 300000, children: 3, spouseInheritance: 200000, netFinancialAssets: 50000 });
  // 공제 = 일괄 5억 + 배우자 10억 + 금융 1억 = 16억 → 과표 14억 → 14억×40% − 1.6억 = 4.0억 → ×0.97 = 3.88억
  ok("3-공제 16억 · 과표 14억 · 납부 38,800만", r.totalDeduction === 160000 && r.taxableIncome === 140000 && Math.abs(r.finalTax - 38800) < 0.1, `${r.totalDeduction} ${r.taxableIncome} ${r.finalTax}`);
  const before = t({ totalAssets: 300000, children: 3, spouseInheritance: 200000 });
  ok("3-(참고) 금융 없이: 공제 15억 → 납부 42,680만", before.totalDeduction === 150000 && Math.abs(before.finalTax - 42680) < 0.1, `${before.totalDeduction} ${before.finalTax}`);
}

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);

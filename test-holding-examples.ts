import { calculateHoldingTax, type HoldingTaxInput, type YearMode } from "./src/lib/holdingTaxCalc.ts";

const 억 = 10000;
const MODES: YearMode[] = ["2026", "2027", "2028"];

type S = { title: string; note: string; base: Omit<HoldingTaxInput, "yearMode"> };

const single = (o: Partial<HoldingTaxInput>): Omit<HoldingTaxInput, "yearMode"> => ({
  publicPrice: 0, household: "single", houseCount: 1, reinforced: false,
  isResident: true, residentHousePrice: 0, age: 0, holdYears: 0, resideYears: 0,
  prevYearHoldingTax: 0, ...o,
});

const scenarios: S[] = [
  {
    title: "① 1주택 · 공시 12억 · 거주 (55세, 8년)",
    note: "현행 12억 공제 → 종부세 없음. 개편 후에도 문턱 14억 미만이라 계속 비과세",
    base: single({ publicPrice: 12 * 억, age: 55, holdYears: 8, resideYears: 8 }),
  },
  {
    title: "② 1주택 · 공시 15억 · 거주 (60세, 10년)",
    note: "개편 수혜 구간 — 공제 12억→14억으로 늘어 종부세 감소",
    base: single({ publicPrice: 15 * 억, age: 60, holdYears: 10, resideYears: 10 }),
  },
  {
    title: "③ 1주택 · 공시 15억 · 비거주 (60세, 10년 보유)",
    note: "★ 비거주 역풍 — 공제 9억 + 거주공제 소멸(‘28 거주만 인정)",
    base: single({ publicPrice: 15 * 억, age: 60, holdYears: 10, resideYears: 0, isResident: false }),
  },
  {
    title: "④ 1주택 · 공시 30억 · 거주 (70세, 10년)",
    note: "고가주택 — 세액공제 80%지만 금액한도(‘27 800만·‘28 600만)에 걸림",
    base: single({ publicPrice: 30 * 억, age: 70, holdYears: 10, resideYears: 10 }),
  },
  {
    title: "⑤ 2주택 · 공시 합산 20억 (거주주택 10억) · 비조정",
    note: "개편 공제 = 4억 + 5억×(10/20) = 6.5억",
    base: single({ publicPrice: 20 * 억, household: "multi", houseCount: 2, residentHousePrice: 10 * 억, age: 55 }),
  },
  {
    title: "⑥ 3주택 · 공시 합산 30억 (거주주택 10억) · 조정지역",
    note: "★ 강화그룹 — ‘28 공정시장가액비율 80% 적용",
    base: single({ publicPrice: 30 * 억, household: "multi", houseCount: 3, reinforced: true, residentHousePrice: 10 * 억, age: 55 }),
  },
];

const w = (v: number) => Math.round(v * 10000).toLocaleString("ko-KR");
const man = (v: number) => v.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

for (const s of scenarios) {
  console.log("\n" + "=".repeat(72));
  console.log(s.title);
  console.log("  → " + s.note);
  console.log("-".repeat(72));
  console.log("연도      | 재산세      | 종부세      | 보유세 합계  | 현행 대비");
  const baseTotal = calculateHoldingTax({ ...s.base, yearMode: "2026" }).holdingTaxTotal;
  for (const m of MODES) {
    const r = calculateHoldingTax({ ...s.base, yearMode: m });
    const diff = r.holdingTaxTotal - baseTotal;
    const label = m === "2026" ? "현행'26" : m === "2027" ? "'27년 " : "'28년~";
    const d = m === "2026" ? "—" : (diff >= 0 ? "+" : "") + man(diff) + "만";
    console.log(
      `${label}   | ${man(r.propertyTaxTotal).padStart(9)}만 | ${man(r.jongbuTotal).padStart(9)}만 | ${man(r.holdingTaxTotal).padStart(9)}만 | ${d}`,
    );
  }
  // 상세 (28년 기준)
  const f = calculateHoldingTax({ ...s.base, yearMode: "2028" });
  console.log(`  [‘28 상세] 종부과표 ${man(f.jongbuBase)}만 · 산출 ${man(f.jongbuGross)}만 · 재산세공제 ${man(f.propertyTaxCredit)}만 · 세액공제 ${man(f.taxCredit)}만(${Math.round(f.taxCreditRate*100)}%) · 농특세 ${man(f.ruralTax)}만`);
}
console.log("\n" + "=".repeat(72));

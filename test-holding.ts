import { calculateHoldingTax, calculateHoldingTaxAll, type HoldingTaxInput, type YearMode } from "./src/lib/holdingTaxCalc.ts";

const 억 = 10000;

type Case = {
  name: string;
  mode: YearMode;
  price: number; // 억
  resident: boolean;
  age: number;
  hold: number;
  reside: number;
  expJongbu: number; // 종부세(농특 포함)
  expHolding: number; // 보유세
};

const base = (c: Case): HoldingTaxInput => ({
  yearMode: c.mode,
  publicPrice: c.price * 억,
  household: "single",
  houseCount: 1,
  reinforced: false,
  isResident: c.resident,
  residentHousePrice: 0,
  age: c.age,
  holdYears: c.hold,
  resideYears: c.reside,
  prevYearHoldingTax: 0,
});

const cases: Case[] = [
  // 케이스 A — 60세·10년 거주 (60% 공제)
  { name: "A 15억 현행", mode: "2026", price: 15, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 27.6, expHolding: 370.5 },
  { name: "A 20억 현행", mode: "2026", price: 20, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 91.0, expHolding: 573.4 },
  { name: "A 35억 현행", mode: "2026", price: 35, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 453.9, expHolding: 1354.8 },
  { name: "A 50억 현행", mode: "2026", price: 50, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 937.7, expHolding: 2257.1 },
  { name: "A 15억 '28 ", mode: "2028", price: 15, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 10.8, expHolding: 353.7 },
  { name: "A 20억 '28 ", mode: "2028", price: 20, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 76.0, expHolding: 558.4 },
  { name: "A 35억 '28 ", mode: "2028", price: 35, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 978.5, expHolding: 1879.4 },
  { name: "A 50억 '28 ", mode: "2028", price: 50, resident: true, age: 60, hold: 10, reside: 10, expJongbu: 3295.7, expHolding: 4615.1 },
  // 케이스 B — 50세·2년 거주 (세액공제 0%)
  { name: "B 15억 현행", mode: "2026", price: 15, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 69.1, expHolding: 412.0 },
  { name: "B 20억 현행", mode: "2026", price: 20, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 227.5, expHolding: 709.9 },
  { name: "B 35억 현행", mode: "2026", price: 35, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 1134.7, expHolding: 2035.6 },
  { name: "B 15억 '28 ", mode: "2028", price: 15, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 26.9, expHolding: 369.8 },
  { name: "B 20억 '28 ", mode: "2028", price: 20, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 190.1, expHolding: 672.5 },
  { name: "B 35억 '28 ", mode: "2028", price: 35, resident: true, age: 50, hold: 2, reside: 2, expJongbu: 1698.5, expHolding: 2599.4 },
  // 케이스 C — 70세
  { name: "C1 30억 거주 현행", mode: "2026", price: 30, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 154.9, expHolding: 916.3 },
  { name: "C1 30억 거주 '27 ", mode: "2027", price: 30, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 200.3, expHolding: 961.7 },
  { name: "C1 30억 거주 '28 ", mode: "2028", price: 30, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 281.3, expHolding: 1042.7 },
  { name: "C2 30억 보유만 현행", mode: "2026", price: 30, resident: false, age: 70, hold: 10, reside: 0, expJongbu: 154.9, expHolding: 916.3 },
  // C2 '27·'28 — 정부 문답(614.6/1019.1)은 원안(비거주 공제 9억) 기준. 9/1 수정안(12억) 손계산값으로 교체:
  //   '27 과표 (30−12)억×70%=12.6억 → 산출 1,230 − 재산세공제 226.8 = 1,003.2 × (1−60%) = 401.3 ×1.2 = 481.5
  //   '28 산출 1,260 − 226.8 = 1,033.2 × (1−40%) = 619.9 ×1.2 = 743.9  (재산세 합계 761.4 동일)
  { name: "C2 30억 보유만 '27 ", mode: "2027", price: 30, resident: false, age: 70, hold: 10, reside: 0, expJongbu: 481.5, expHolding: 1242.9 },
  { name: "C2 30억 보유만 '28 ", mode: "2028", price: 30, resident: false, age: 70, hold: 10, reside: 0, expJongbu: 743.9, expHolding: 1505.3 },
  { name: "C3 50억 거주 현행", mode: "2026", price: 50, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 468.9, expHolding: 1788.3 },
  { name: "C3 50억 거주 '27 ", mode: "2027", price: 50, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 1942.1, expHolding: 3261.5 },
  { name: "C3 50억 거주 '28 ", mode: "2028", price: 50, resident: true, age: 70, hold: 10, reside: 10, expJongbu: 3295.7, expHolding: 4615.1 },
];

const f = (n: number) => n.toFixed(1).padStart(8);
let pass = 0;
console.log("사례                    | 종부(계산/정답/Δ)        | 보유(계산/정답/Δ)");
console.log("-".repeat(78));
for (const c of cases) {
  const r = calculateHoldingTax(base(c));
  const j = r.jongbuTotal / 1; // 만원
  const h = r.holdingTaxTotal;
  const dj = j - c.expJongbu;
  const dh = h - c.expHolding;
  const ok = Math.abs(dj) <= Math.max(1, c.expJongbu * 0.02) && Math.abs(dh) <= Math.max(1, c.expHolding * 0.02);
  if (ok) pass++;
  console.log(
    `${c.name.padEnd(20)} | ${f(j)} /${f(c.expJongbu)} /${f(dj)} | ${f(h)} /${f(c.expHolding)} /${f(dh)}  ${ok ? "✅" : "❌"}`,
  );
}
console.log("-".repeat(78));
console.log(`통과: ${pass}/${cases.length}`);

/* ── 연쇄(세부담상한) 검증 — 압구정한양2차 공시 58.09억 · 70세 · 10년 거주 ──
   기준: 사용자 제공 정밀 시트(원 단위). 상한 비교는 재산세 본세+종부세 본세 기준.
   (원안 200% 시절 정밀 시트와 '27 차감 904.3만까지 일치 확인 → 9/1 수정안 상한 150%로 기대값 재산출)
   '26 본세 983+510.1=1,493.1 ×150% = 2,240 → '27 종부 본세 1,257 ×1.2 = 1,508.4
   '27 본세 2,240 ×150% = 3,360 → '28 종부 본세 2,377 ×1.2 = 2,852.4. 허용오차 ±2만원. */
const apg = calculateHoldingTaxAll({
  publicPrice: 580900,
  household: "single",
  houseCount: 1,
  reinforced: false,
  isResident: true,
  residentHousePrice: 0,
  age: 70,
  holdYears: 10,
  resideYears: 10,
  prevYearHoldingTax: 0,
});
const apgExp: [YearMode, number, number, boolean][] = [
  ["2026", 612.1, 2157.2, false],
  ["2027", 1508.4, 3054.0, true],
  ["2028", 2852.4, 4398.0, true],
];
let apgPass = 0;
console.log("\n압구정 연쇄 사례      | 종부(계산/정답)      | 보유(계산/정답)      | 상한");
for (const [m, ej, eh, ecap] of apgExp) {
  const r = apg[m];
  const ok = Math.abs(r.jongbuTotal - ej) <= 2 && Math.abs(r.holdingTaxTotal - eh) <= 2 && r.burdenCapApplied === ecap;
  if (ok) apgPass++;
  console.log(
    `${m}                 | ${f(r.jongbuTotal)} /${f(ej)} | ${f(r.holdingTaxTotal)} /${f(eh)} | ${r.burdenCapApplied ? "적용" : "미적용"}(기대 ${ecap ? "적용" : "미적용"})  ${ok ? "✅" : "❌"}`,
  );
}
console.log(`연쇄 통과: ${apgPass}/3 (‘27 차감 ${apg["2027"].burdenCapCut}만 · 상한 ${apg["2027"].burdenCap}만)`);

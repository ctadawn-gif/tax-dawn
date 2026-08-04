import { calculateHoldingTax, type HoldingTaxInput, type YearMode } from "./src/lib/holdingTaxCalc.ts";

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
  { name: "C2 30억 보유만 '27 ", mode: "2027", price: 30, resident: false, age: 70, hold: 10, reside: 0, expJongbu: 614.6, expHolding: 1376.0 },
  { name: "C2 30억 보유만 '28 ", mode: "2028", price: 30, resident: false, age: 70, hold: 10, reside: 0, expJongbu: 1019.1, expHolding: 1780.5 },
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

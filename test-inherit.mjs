const TAX_BRACKETS = [
  { limit: 10000, rate: 0.10, deduction: 0 },
  { limit: 50000, rate: 0.20, deduction: 1000 },
  { limit: 100000, rate: 0.30, deduction: 6000 },
  { limit: 300000, rate: 0.40, deduction: 16000 },
  { limit: Infinity, rate: 0.50, deduction: 46000 },
];
function calcTax(t) { if(t<=0)return 0; for(const b of TAX_BRACKETS){if(t<=b.limit)return t*b.rate-b.deduction;} return 0; }
function findRate(t) { if(t<=0)return"0%"; for(const b of TAX_BRACKETS){if(t<=b.limit)return`${b.rate*100}%`;} return"50%"; }
const r = v => Math.round(v*10)/10;

console.log("═══════════════════════════════════════");
console.log("상속세 검산");
console.log("═══════════════════════════════════════\n");

// 케이스1: 상속재산 10억, 배우자 있음, 자녀 2명
{
  const total = 100000, debt = 0, spouse = true, children = 2;
  const taxableBase = total;
  const basic = 20000, childDed = children * 5000; // 2억 + 1억
  const personal = basic + childDed; // 3억
  const lump = 50000; // 5억
  const applied = Math.max(personal, lump); // 5억
  const spouseDed = 50000; // 최소 5억
  const totalDed = applied + spouseDed; // 10억
  const taxable = Math.max(0, taxableBase - totalDed); // 0
  const tax = calcTax(taxable);
  const final_ = Math.max(0, tax * 0.97);
  console.log("케이스1: 상속재산 10억 / 배우자O / 자녀2");
  console.log(`과세가액: ${taxableBase}만 → 공제: ${totalDed}만 (일괄5억+배우자5억)`);
  console.log(`과세표준: ${taxable}만 → 세액: ${r(final_)}만원`);
  console.log(`→ 상속세 0원 (공제 합계 10억이 재산 10억 이상)\n`);
}

// 케이스2: 상속재산 20억, 배우자 있음, 자녀 2명
{
  const total = 200000, debt = 5000;
  const taxableBase = total - debt; // 19.5억
  const lump = 50000; // 일괄 5억
  const spouseDed = 50000; // 최소 5억
  const totalDed = lump + spouseDed; // 10억
  const taxable = taxableBase - totalDed; // 9.5억
  const tax = calcTax(taxable);
  const surcharge = 0;
  const discount = tax * 0.03;
  const final_ = Math.max(0, tax - discount);
  console.log("케이스2: 상속재산 20억 / 채무 5천만 / 배우자O / 자녀2");
  console.log(`과세가액: ${taxableBase}만 → 공제: ${totalDed}만`);
  console.log(`과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`산출세액: ${r(tax)}만 → 신고공제3%: ${r(discount)}만 → 납부: ${r(final_)}만원\n`);
  // 수기: 95000 * 30% - 6000 = 22500
  // 22500 * 0.97 = 21825
}

// 케이스3: 상속재산 30억, 배우자 없음, 자녀 1명
{
  const total = 300000;
  const taxableBase = total;
  const lump = 50000;
  const spouseDed = 0;
  const totalDed = lump;
  const taxable = taxableBase - totalDed; // 25억
  const tax = calcTax(taxable);
  const final_ = Math.max(0, tax * 0.97);
  console.log("케이스3: 상속재산 30억 / 배우자X / 자녀1");
  console.log(`과세가액: ${total}만 → 공제: ${totalDed}만 (일괄5억)`);
  console.log(`과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`산출세액: ${r(tax)}만 → 납부(3%공제): ${r(final_)}만원\n`);
  // 수기: 250000 * 40% - 16000 = 84000
  // 84000 * 0.97 = 81480
}

console.log("═══════════════════════════════════════");
console.log("증여세 검산");
console.log("═══════════════════════════════════════\n");

// 케이스4: 부모→성년자녀 1억 증여, 사전증여 없음
{
  const gift = 10000, exempt = 5000, prior = 0;
  const taxable = Math.max(0, gift + prior - exempt); // 5000만
  const tax = calcTax(taxable);
  const final_ = Math.max(0, tax * 0.97);
  console.log("케이스4: 부모→성년자녀 1억 / 사전증여 없음");
  console.log(`과세가액: ${gift}만 → 공제: ${exempt}만`);
  console.log(`과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`산출세액: ${r(tax)}만 → 납부(3%공제): ${r(final_)}만원\n`);
  // 수기: 5000 * 10% = 500, 500 * 0.97 = 485
}

// 케이스5: 부모→성년자녀 3억 증여, 10년 내 5천만 사전증여
{
  const gift = 30000, exempt = 5000, prior = 5000;
  const taxable = Math.max(0, gift + prior - exempt); // 3억
  const totalTax = calcTax(taxable);
  const priorTaxable = Math.max(0, prior - exempt); // 0
  const priorTax = calcTax(priorTaxable);
  const thisTax = totalTax - priorTax;
  const final_ = Math.max(0, thisTax * 0.97);
  console.log("케이스5: 부모→성년자녀 3억 / 사전증여 5천만");
  console.log(`합산과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`합산세액: ${r(totalTax)}만 - 기납부: ${r(priorTax)}만 = 이번분: ${r(thisTax)}만`);
  console.log(`납부(3%공제): ${r(final_)}만원\n`);
  // 수기: 30000 * 20% - 1000 = 5000, 기납부 0 → 5000 * 0.97 = 4850
}

// 케이스6: 배우자 증여 7억
{
  const gift = 70000, exempt = 60000, prior = 0;
  const taxable = Math.max(0, gift + prior - exempt); // 1억
  const tax = calcTax(taxable);
  const final_ = Math.max(0, tax * 0.97);
  console.log("케이스6: 배우자 증여 7억 / 사전증여 없음");
  console.log(`과세가액: ${gift}만 → 공제: ${exempt}만`);
  console.log(`과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`산출세액: ${r(tax)}만 → 납부(3%공제): ${r(final_)}만원\n`);
  // 수기: 10000 * 10% = 1000, 1000 * 0.97 = 970
}

// 케이스7: 부모→미성년자녀 5천만 증여
{
  const gift = 5000, exempt = 2000, prior = 0;
  const taxable = Math.max(0, gift + prior - exempt); // 3000만
  const tax = calcTax(taxable);
  const final_ = Math.max(0, tax * 0.97);
  console.log("케이스7: 부모→미성년자녀 5천만 / 사전증여 없음");
  console.log(`과세가액: ${gift}만 → 공제: ${exempt}만`);
  console.log(`과세표준: ${taxable}만 (${findRate(taxable)})`);
  console.log(`산출세액: ${r(tax)}만 → 납부(3%공제): ${r(final_)}만원\n`);
  // 수기: 3000 * 10% = 300, 300 * 0.97 = 291
}

function calcRate1(p) {
  if (p <= 60000) return 1.0;
  if (p <= 90000) { const e = p / 10000; return (e * 2 / 3 - 3); }
  return 3.0;
}
function calcRate(p, cnt, adj) {
  if (cnt === "1") return calcRate1(p);
  if (cnt === "2") return adj ? 8 : calcRate1(p);
  if (cnt === "3") return adj ? 12 : 8;
  return 12;
}
function eduRate(r, isHouse) {
  if (!isHouse) return 0.4;
  if (r >= 8) return 0.4;
  return Math.round(r * 10) / 100;
}
function ruralRate(r, isHouse, over85) {
  if (isHouse && !over85) return 0;
  if (!isHouse) return 0.2;
  if (r >= 12) return 1.0;
  if (r >= 8) return 0.6;
  return 0.2;
}
const fmt = v => v.toLocaleString("ko-KR");

function test(name, p, cnt, adj, over85, first) {
  const r = calcRate(p, cnt, adj);
  const edu = eduRate(r, true);
  const rural = ruralRate(r, true, over85);
  const total = r + edu + rural;
  const tax = Math.round(p * r / 100);
  const eduTax = Math.round(p * edu / 100);
  const ruralTax = Math.round(p * rural / 100);
  let discount = 0;
  if (first && p <= 120000) discount = Math.min(200, tax);
  const finalTax = tax + eduTax + ruralTax - discount;
  console.log(`━━━ ${name} ━━━`);
  console.log(`취득가: ${fmt(p)}만 | 세율: ${Math.round(r*100)/100}% + 교육${edu}% + 농특${rural}% = ${Math.round(total*100)/100}%`);
  console.log(`취득세: ${fmt(tax)}만 | 교육세: ${fmt(eduTax)}만 | 농특세: ${fmt(ruralTax)}만`);
  if (discount > 0) console.log(`생애최초 감면: -${fmt(discount)}만`);
  console.log(`총 납부: ${fmt(finalTax)}만원\n`);
}

test("1주택 5억 (85㎡이하)", 50000, "1", false, false, false);
// 1% + 0.1% + 0% = 1.1%, 550만

test("1주택 7억 (85㎡초과)", 70000, "1", false, true, false);
// (7*2/3-3)=1.667% + 0.17% + 0.2% = 2.037%

test("1주택 10억 (85㎡초과)", 100000, "1", false, true, false);
// 3% + 0.3% + 0.2% = 3.5%, 3500만

test("2주택 조정지역 8억", 80000, "2", true, true, false);
// 8% + 0.4% + 0.6% = 9%, 7200만

test("3주택 조정지역 15억", 150000, "3", true, true, false);
// 12% + 0.4% + 1.0% = 13.4%

test("1주택 5억 생애최초 (85㎡이하)", 50000, "1", false, false, true);
// 1% + 0.1% = 1.1%, 550만 - 200만 = 350만

test("상가 3억", 30000, "1", false, false, false);
// 비주택이므로 별도 계산 필요
console.log("━━━ 상가 3억 (비주택) ━━━");
console.log(`4% + 0.4% + 0.2% = 4.6%`);
console.log(`총 납부: ${fmt(Math.round(30000*4.6/100))}만원\n`);

// 취득세 계산 로직 검산 (독립 실행)
// 지방세법 제11조 기준

function calcHouseRate1(p) {
  if (p <= 60000) return 1.0;
  if (p <= 90000) { const e = p / 10000; return (e * 2 / 3 - 3); }
  return 3.0;
}
function calcHouseRate(p, cnt, adj) {
  if (cnt === "1") return calcHouseRate1(p);
  if (cnt === "2") return adj ? 8 : calcHouseRate1(p);
  if (cnt === "3") return adj ? 12 : 8;
  return 12;
}
function eduRate(r, type) {
  if (type === "house") {
    if (r >= 8) return 0.4;
    return Math.round(r * 10) / 100;
  }
  return 0.4;
}
function ruralRate(r, type, over85) {
  if (type === "house" && !over85) return 0;
  if (type === "house") {
    if (r >= 12) return 1.0;
    if (r >= 8) return 0.6;
    return 0.2;
  }
  return 0.2;
}

const fmt = v => v.toLocaleString("ko-KR");
const fmtW = v => (v * 10000).toLocaleString("ko-KR");

function test(name, type, acq, p, cnt, adj, over85, first) {
  let r, desc;

  if (type === "house" && acq === "purchase") {
    r = calcHouseRate(p, cnt, adj);
    desc = `주택 매매 ${cnt} ${adj ? "조정" : "비조정"}`;
  } else if (type === "house" && acq === "inheritance") {
    r = 2.8; desc = "주택 상속";
  } else if (type === "house" && acq === "gift") {
    r = 3.5; desc = "주택 증여";
  } else if (type === "farmland" && acq === "purchase") {
    r = 3; desc = "농지 매매";
  } else if (type === "farmland" && acq === "inheritance") {
    r = 2.3; desc = "농지 상속";
  } else if (type === "farmland" && acq === "gift") {
    r = 3.5; desc = "농지 증여";
  } else if (type === "land" && acq === "purchase") {
    r = 4; desc = "토지 매매";
  } else if (type === "land" && acq === "inheritance") {
    r = 2.8; desc = "토지 상속";
  } else if (type === "land" && acq === "gift") {
    r = 3.5; desc = "토지 증여";
  } else if (type === "commercial" && acq === "purchase") {
    r = 4; desc = "상가 매매";
  } else if (type === "commercial" && acq === "inheritance") {
    r = 2.8; desc = "상가 상속";
  } else {
    r = 3.5; desc = "상가 증여";
  }

  const edu = eduRate(r, type);
  const rural = ruralRate(r, type, over85);
  const total = Math.round((r + edu + rural) * 100) / 100;
  const tax = Math.round(p * r / 100);
  const eduTax = Math.round(p * edu / 100);
  const ruralTax = Math.round(p * rural / 100);
  let discount = 0;
  if (first && type === "house" && acq === "purchase" && cnt === "1" && p <= 120000) {
    discount = Math.min(200, tax);
  }
  const finalTax = tax + eduTax + ruralTax - discount;

  console.log(`━━━ ${name} ━━━`);
  console.log(`유형: ${desc} | 취득가: ${fmt(p)}만원`);
  console.log(`취득세: ${r}% = ${fmtW(tax)}원`);
  console.log(`교육세: ${edu}% = ${fmtW(eduTax)}원`);
  console.log(`농특세: ${rural}% = ${fmtW(ruralTax)}원`);
  console.log(`합산세율: ${total}%`);
  if (discount > 0) console.log(`생애최초 감면: -${fmtW(discount)}원`);
  console.log(`총 납부: ${fmtW(finalTax)}원`);
  console.log("");
}

console.log("═══════════════════════════════════════");
console.log("주택 매매 케이스");
console.log("═══════════════════════════════════════\n");

// 수기검산: 5억 * 1% = 500만, 교육 0.1% = 50만, 농특 0 = 1.1% = 550만
test("1주택 5억 85㎡이하", "house", "purchase", 50000, "1", false, false, false);

// 7억: (7*2/3-3) = 1.6667%, 교육 0.17%, 농특 0.2% = 2.0367%
test("1주택 7억 85㎡초과", "house", "purchase", 70000, "1", false, true, false);

// 10억: 3%, 교육 0.3%, 농특 0.2% = 3.5%
test("1주택 10억 85㎡초과", "house", "purchase", 100000, "1", false, true, false);

// 8억 2주택 조정: 8%, 교육 0.4%, 농특 0.6% = 9%
test("2주택 8억 조정지역 85㎡초과", "house", "purchase", 80000, "2", true, true, false);

// 2주택 비조정 7억: 1주택과 동일 세율
test("2주택 7억 비조정 85㎡이하", "house", "purchase", 70000, "2", false, false, false);

// 3주택 조정: 12%, 교육 0.4%, 농특 1% = 13.4%
test("3주택 15억 조정지역 85㎡초과", "house", "purchase", 150000, "3", true, true, false);

// 3주택 비조정: 8%, 교육 0.4%, 농특 0.6% = 9%
test("3주택 10억 비조정 85㎡초과", "house", "purchase", 100000, "3", false, true, false);

// 4주택: 12%
test("4주택 8억 85㎡초과", "house", "purchase", 80000, "4plus", false, true, false);

// 법인: 12%
test("법인 20억 85㎡초과", "house", "purchase", 200000, "corp", false, true, false);

// 생애최초: 1% - 200만원 감면
test("1주택 5억 생애최초 85㎡이하", "house", "purchase", 50000, "1", false, false, true);

// 생애최초 12억 초과: 감면 불가
test("1주택 13억 생애최초(한도초과)", "house", "purchase", 130000, "1", false, false, true);

// 6억 정확 경계
test("1주택 6억 정확 경계", "house", "purchase", 60000, "1", false, false, false);

// 9억 정확 경계
test("1주택 9억 정확 경계", "house", "purchase", 90000, "1", false, true, false);

console.log("═══════════════════════════════════════");
console.log("주택 상속/증여");
console.log("═══════════════════════════════════════\n");

test("주택 상속 10억 85㎡초과", "house", "inheritance", 100000, "1", false, true, false);
test("주택 증여 5억 85㎡이하", "house", "gift", 50000, "1", false, false, false);

console.log("═══════════════════════════════════════");
console.log("농지/토지/상가");
console.log("═══════════════════════════════════════\n");

// 농지 매매: 3% + 0.4% + 0.2% = 3.6%
test("농지 매매 3억", "farmland", "purchase", 30000, "1", false, false, false);
// 농지 상속: 2.3% + 0.4% + 0.2% = 2.9%
test("농지 상속 5억", "farmland", "inheritance", 50000, "1", false, false, false);
// 토지 매매: 4% + 0.4% + 0.2% = 4.6%
test("토지(비농지) 매매 3억", "land", "purchase", 30000, "1", false, false, false);
// 토지 상속: 2.8% + 0.4% + 0.2% = 3.4%
test("토지 상속 5억", "land", "inheritance", 50000, "1", false, false, false);
// 상가 매매: 4% + 0.4% + 0.2% = 4.6%
test("상가 매매 10억", "commercial", "purchase", 100000, "1", false, false, false);
// 상가 증여: 3.5% + 0.4% + 0.2% = 4.1%
test("상가 증여 5억", "commercial", "gift", 50000, "1", false, false, false);

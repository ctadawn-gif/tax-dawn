const RATES = { retail: 0.15, manufacturing: 0.20, restaurant: 0.25, construction: 0.30, realestate: 0.30, service: 0.30, finance: 0.40 };
const fmt = v => v.toLocaleString("ko-KR");

function testGeneral(name, sales, cardSales, purchase, cardPurchase, isIndiv) {
  const salesTax = Math.round(sales * 0.1);
  const purchaseTax = Math.round(purchase * 0.1);
  const cardPurchaseTax = Math.round(cardPurchase * 0.1);
  const totalPurchase = purchaseTax + cardPurchaseTax;
  let cardCredit = 0;
  if (isIndiv && cardSales > 0) cardCredit = Math.min(Math.round(cardSales * 0.013), 1000);
  const eCredit = 1;
  const payable = Math.max(0, salesTax - totalPurchase - cardCredit - eCredit);

  console.log(`━━━ ${name} ━━━`);
  console.log(`매출세액: ${fmt(salesTax)}만 (매출 ${fmt(sales)}만 × 10%)`);
  console.log(`매입세액: ${fmt(totalPurchase)}만 (계산서 ${fmt(purchaseTax)}만 + 카드 ${fmt(cardPurchaseTax)}만)`);
  if (cardCredit > 0) console.log(`카드매출세액공제: ${fmt(cardCredit)}만`);
  console.log(`전자신고공제: ${fmt(eCredit)}만`);
  console.log(`납부세액: ${fmt(payable)}만원\n`);
}

function testSimplified(name, sales, purchase, industry) {
  const rate = RATES[industry];
  const salesTax = Math.round(sales * rate * 0.1);
  const purchaseCredit = Math.round(purchase * 0.005);
  const exempt = sales < 4800;
  const payable = exempt ? 0 : Math.max(0, salesTax - purchaseCredit);

  console.log(`━━━ ${name} ━━━`);
  console.log(`매출: ${fmt(sales)}만 × 부가가치율 ${rate*100}% × 10% = ${fmt(salesTax)}만`);
  console.log(`매입세액: ${fmt(purchase)}만 × 0.5% = ${fmt(purchaseCredit)}만`);
  if (exempt) console.log(`→ 납부면제 (연매출 4,800만 미만)`);
  console.log(`납부세액: ${fmt(payable)}만원\n`);
}

console.log("═══════ 일반과세자 ═══════\n");

// 매출 1억, 매입 6천만 (개인, 카드매출 8천만)
// 매출세액 1,000만, 매입세액 600만, 카드공제 8000*1.3%=104만(한도내), 전자1만
// 납부: 1000-600-104-1 = 295만
testGeneral("일반 매출1억/매입6천만/카드8천만(개인)", 10000, 8000, 6000, 0, true);

// 매출 5천만, 매입 3천만 (법인)
// 매출세액 500, 매입세액 300, 카드공제 없음, 전자1
// 납부: 500-300-1 = 199만
testGeneral("일반 매출5천만/매입3천만(법인)", 5000, 0, 3000, 0, false);

// 매출 2억, 매입 1.5억 (개인, 카드매출 1.5억, 카드매입 5천만)
testGeneral("일반 매출2억/매입1.5억+카드5천만", 20000, 15000, 15000, 5000, true);

// 매입이 매출보다 큰 경우 (환급)
testGeneral("일반 매출3천만/매입5천만(환급)", 3000, 0, 5000, 0, true);

console.log("═══════ 간이과세자 ═══════\n");

// 음식점 매출 8천만, 매입 3천만
// 8000 * 25% * 10% = 200만, 매입 3000 * 0.5% = 15만
// 납부: 200 - 15 = 185만
testSimplified("간이 음식점 매출8천만/매입3천만", 8000, 3000, "restaurant");

// 소매업 매출 6천만, 매입 4천만
// 6000 * 15% * 10% = 90만, 매입 4000 * 0.5% = 20만
// 납부: 90 - 20 = 70만
testSimplified("간이 소매업 매출6천만/매입4천만", 6000, 4000, "retail");

// 납부면제: 매출 4천만
testSimplified("간이 서비스 매출4천만(면제)", 4000, 2000, "service");

// 부동산임대 매출 9천만
testSimplified("간이 부동산임대 매출9천만", 9000, 1000, "realestate");

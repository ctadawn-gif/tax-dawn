// 부가가치세 계산 로직
// 2026년 현행법 기준 (부가가치세법)

export type TaxpayerType = "general" | "simplified";

// 간이과세자 업종별 부가가치율
export type SimplifiedIndustry =
  | "retail"
  | "manufacturing"
  | "restaurant"
  | "construction"
  | "realestate"
  | "service"
  | "finance";

export const SIMPLIFIED_INDUSTRY_LABELS: Record<SimplifiedIndustry, string> = {
  retail: "소매업·재생용 재료수집판매업",
  manufacturing: "제조업·농림어업·소화물운송업",
  restaurant: "음식점업",
  construction: "건설업·운수창고업·정보통신업",
  realestate: "부동산임대업",
  service: "그 외 서비스업",
  finance: "금융·보험·전문과학기술서비스업 등",
};

const SIMPLIFIED_RATES: Record<SimplifiedIndustry, number> = {
  retail: 0.15,
  manufacturing: 0.20,
  restaurant: 0.25,
  construction: 0.30,
  realestate: 0.30,
  service: 0.30,
  finance: 0.40,
};

export interface VatInput {
  taxpayerType: TaxpayerType;

  // 일반과세자
  salesAmount: number;        // 과세 매출액 (만원, 공급가액)
  cardSalesAmount: number;    // 그 중 신용카드 매출 (만원)
  purchaseAmount: number;     // 매입액 - 세금계산서 (만원, 공급가액)
  cardPurchaseAmount: number; // 매입액 - 신용카드 (만원)
  isIndividual: boolean;      // 개인사업자 여부

  // 간이과세자
  simplifiedIndustry: SimplifiedIndustry;
  simplifiedSales: number;    // 매출액 (만원) - 해당 과세기간(6개월)
  simplifiedPurchase: number; // 매입액 - 세금계산서 (만원)
  simplifiedCardSales: number; // 신용카드 매출 (만원)
  simplifiedMonths: number;   // 사업 영위 개월 수 (1~12)
}

export interface VatResult {
  taxpayerType: TaxpayerType;

  // 일반과세자
  salesTax: number;
  purchaseTax: number;
  cardPurchaseTax: number;
  totalPurchaseTax: number;
  cardSalesCredit: number;
  totalCredit: number;
  vatPayable: number;

  // 간이과세자
  simplifiedRate: number;
  simplifiedSalesTax: number;
  simplifiedPurchaseCredit: number;
  simplifiedCardCredit: number;  // 신용카드 발행세액공제
  simplifiedTotalCredit: number;
  simplifiedPayable: number;
  isExempt: boolean;
  annualizedSales: number;       // 환산 연매출 (월할 계산)
}

export function calculateVat(input: VatInput): VatResult {
  const {
    taxpayerType,
    salesAmount,
    cardSalesAmount,
    purchaseAmount,
    cardPurchaseAmount,
    isIndividual,
    simplifiedIndustry,
    simplifiedSales,
    simplifiedPurchase,
    simplifiedCardSales,
    simplifiedMonths,
  } = input;

  if (taxpayerType === "general") {
    // === 일반과세자 ===
    const salesTax = Math.round(salesAmount * 0.1);
    const purchaseTax = Math.round(purchaseAmount * 0.1);
    const cardPurchaseTax = Math.round(cardPurchaseAmount * 0.1);
    const totalPurchaseTax = purchaseTax + cardPurchaseTax;

    // 신용카드 매출세액공제 (개인사업자만, 1.3%, 연 1,000만원 한도)
    let cardSalesCredit = 0;
    if (isIndividual && cardSalesAmount > 0) {
      cardSalesCredit = Math.min(
        Math.round(cardSalesAmount * 0.013),
        1000 // 연 한도 1,000만원 (반기 500만원)
      );
    }

    // 전자신고세액공제 제외 (사용자 요청)
    const totalCredit = cardSalesCredit;

    const vatPayable = Math.max(0, salesTax - totalPurchaseTax - totalCredit);

    return {
      taxpayerType,
      salesTax,
      purchaseTax,
      cardPurchaseTax,
      totalPurchaseTax,
      cardSalesCredit,
      totalCredit,
      vatPayable,
      simplifiedRate: 0,
      simplifiedSalesTax: 0,
      simplifiedPurchaseCredit: 0,
      simplifiedCardCredit: 0,
      simplifiedTotalCredit: 0,
      simplifiedPayable: 0,
      isExempt: false,
      annualizedSales: 0,
    };
  } else {
    // === 간이과세자 ===
    const rate = SIMPLIFIED_RATES[simplifiedIndustry];
    const months = Math.max(1, Math.min(12, simplifiedMonths || 12));

    // 매출세액
    const simplifiedSalesTax = Math.round(simplifiedSales * rate * 0.1);

    // 매입세액공제 (매입 × 0.5%)
    const simplifiedPurchaseCredit = Math.round(simplifiedPurchase * 0.005);

    // 신용카드 발행세액공제 (1.3%, 부가가치세법 제46조)
    let simplifiedCardCredit = 0;
    if (simplifiedCardSales > 0) {
      simplifiedCardCredit = Math.min(
        Math.round(simplifiedCardSales * 0.013),
        500 // 반기 한도 500만원
      );
    }

    const simplifiedTotalCredit = simplifiedPurchaseCredit + simplifiedCardCredit;

    let simplifiedPayable = Math.max(0, simplifiedSalesTax - simplifiedTotalCredit);

    // 납부면제: 환산 연매출 4,800만원 미만 (월할 계산)
    // 과세기간 매출 ÷ 사업영위개월수 × 12 < 4,800만원
    const annualizedSales = months < 12
      ? Math.round(simplifiedSales / months * 12)
      : simplifiedSales;
    const isExempt = annualizedSales < 4800;
    if (isExempt) simplifiedPayable = 0;

    return {
      taxpayerType,
      salesTax: 0,
      purchaseTax: 0,
      cardPurchaseTax: 0,
      totalPurchaseTax: 0,
      cardSalesCredit: 0,
      totalCredit: 0,
      vatPayable: 0,
      simplifiedRate: rate * 100,
      simplifiedSalesTax,
      simplifiedPurchaseCredit,
      simplifiedCardCredit,
      simplifiedTotalCredit,
      simplifiedPayable,
      isExempt,
      annualizedSales,
    };
  }
}

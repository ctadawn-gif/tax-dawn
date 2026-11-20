/**
 * 비공개(세무사 전용) 계산기에서 쓰는 숫자 모음.
 *
 * - 세율, 공제, 이자율, 보험료율, 대출 규제 숫자는 모두 이 파일 한곳에만 둔다.
 * - verified 가 false 인 숫자는 조문·고시와 아직 대조하지 않은 값이다. 화면에 "확인 전"으로 표시된다.
 * - 세무사가 조문과 대조한 뒤 verified 를 true 로, asOf(기준일)와 source(근거)를 고친다.
 */

export interface RateItem<T = number> {
  /** 화면에 보여 줄 이름 */
  label: string;
  value: T;
  /** 기준일 (이 숫자를 적은 날 또는 확인한 날) */
  asOf: string;
  /** 조문·고시와 대조했는지 */
  verified: boolean;
  /** 대조할 근거 */
  source: string;
}

/** 이 파일의 숫자를 적은 날 */
export const RATES_AS_OF = "2026-11-20";

const item = <T,>(label: string, value: T, source: string): RateItem<T> => ({
  label,
  value,
  asOf: RATES_AS_OF,
  verified: false,
  source,
});

/** 증여세 누진세율표 : 과세표준 상한(원), 세율(%), 누진공제(원) */
export interface GiftBracket {
  upTo: number | null;
  ratePct: number;
  deduction: number;
}

export const GIFT_TAX = {
  brackets: item<GiftBracket[]>(
    "증여세 세율과 누진공제",
    [
      { upTo: 100_000_000, ratePct: 10, deduction: 0 },
      { upTo: 500_000_000, ratePct: 20, deduction: 10_000_000 },
      { upTo: 1_000_000_000, ratePct: 30, deduction: 60_000_000 },
      { upTo: 3_000_000_000, ratePct: 40, deduction: 160_000_000 },
      { upTo: null, ratePct: 50, deduction: 460_000_000 },
    ],
    "상속세 및 증여세법 제56조(제26조 준용)",
  ),
  deductionAdultLineal: item("증여재산공제 - 부모·조부모(받는 사람 성년)", 50_000_000, "상속세 및 증여세법 제53조"),
  deductionMinorLineal: item("증여재산공제 - 부모·조부모(받는 사람 미성년)", 20_000_000, "상속세 및 증여세법 제53조"),
  deductionSpouse: item("증여재산공제 - 배우자", 600_000_000, "상속세 및 증여세법 제53조"),
  deductionOtherRelative: item("증여재산공제 - 그 밖의 친족", 10_000_000, "상속세 및 증여세법 제53조"),
  deductionMarriageBirth: item("혼인·출산 증여공제", 100_000_000, "상속세 및 증여세법 제53조의2"),
  filingCreditPct: item("신고세액공제율(%)", 3, "상속세 및 증여세법 제69조"),
} as const;

export const FAMILY_LOAN = {
  adequateRatePct: item("적정 이자율(%)", 4.6, "상속세 및 증여세법 제41조의4, 시행령 제31조의4"),
  gapThreshold: item("이자 차액 과세 기준(원, 이 금액 이상이면 과세)", 10_000_000, "상속세 및 증여세법 제41조의4, 시행령 제31조의4"),
  withholdingPct: item("이자에서 떼는 세율(%, 소득세 25 + 지방소득세 2.5)", 27.5, "소득세법 제129조, 제127조"),
} as const;

export const LENDER_TAX = {
  financialIncomeThreshold: item("금융소득 종합과세 기준(원)", 20_000_000, "소득세법 제14조, 제62조"),
  /** 종합과세 때 이미 뗀 세율(%). 한계세율에서 이만큼을 뺀 차이만 추가분으로 어림한다 */
  withheldIncomeTaxPct: item("이자소득 원천징수 소득세율(%)", 25, "소득세법 제129조"),
  /** 지방소득세를 더하는 배수 (소득세의 10%) */
  localTaxMultiplierPct: item("지방소득세 포함 배수(%)", 110, "지방세법"),
  marginalRatesPct: item<number[]>("종합소득세 한계세율 선택지(%)", [6, 15, 24, 35, 38, 40, 42, 45], "소득세법 제55조"),
  marginalRateUnknownPct: item("한계세율을 모를 때 쓰는 값(%)", 24, "임의 기본값"),
} as const;

export const HEALTH_INSURANCE = {
  ratePct: item("건강보험료율(%)", 7.19, "국민건강보험법 시행령, 보건복지부 고시"),
  longTermCareOfHealthPct: item("장기요양보험료(건강보험료의 %)", 13.14, "노인장기요양보험법 시행령, 보건복지부 고시"),
  regionalFinancialIncomeThreshold: item("건강보험 금융소득 반영 기준(원, 넘으면 전액 반영)", 10_000_000, "국민건강보험법 시행규칙"),
  employeeOtherIncomeThreshold: item("직장가입자 급여 외 소득 기준(원, 넘는 부분만 반영)", 20_000_000, "국민건강보험법 시행령"),
} as const;

/** 화면의 "숫자 기준" 표에 쓰는 전체 목록 */
export function listGiftLoanMixRates(): RateItem<unknown>[] {
  return [
    ...Object.values(GIFT_TAX),
    ...Object.values(FAMILY_LOAN),
    ...Object.values(LENDER_TAX),
    ...Object.values(HEALTH_INSURANCE),
  ] as RateItem<unknown>[];
}

/** 증여·차용 혼합 계산에 넘기는 설정값 (화면의 "접어 둔 설정"에서 고칠 수 있는 값) */
export interface MixSettings {
  brackets: GiftBracket[];
  deductions: { adultLineal: number; minorLineal: number; spouse: number; other: number };
  marriageBirthDeduction: number;
  filingCreditPct: number;
  adequateRatePct: number;
  gapThreshold: number;
  withholdingPct: number;
  financialIncomeThreshold: number;
  withheldIncomeTaxPct: number;
  localTaxMultiplierPct: number;
  marginalRateUnknownPct: number;
  healthRatePct: number;
  longTermCareOfHealthPct: number;
  regionalFinancialIncomeThreshold: number;
  employeeOtherIncomeThreshold: number;
}

export function defaultMixSettings(): MixSettings {
  return {
    brackets: GIFT_TAX.brackets.value,
    deductions: {
      adultLineal: GIFT_TAX.deductionAdultLineal.value,
      minorLineal: GIFT_TAX.deductionMinorLineal.value,
      spouse: GIFT_TAX.deductionSpouse.value,
      other: GIFT_TAX.deductionOtherRelative.value,
    },
    marriageBirthDeduction: GIFT_TAX.deductionMarriageBirth.value,
    filingCreditPct: GIFT_TAX.filingCreditPct.value,
    adequateRatePct: FAMILY_LOAN.adequateRatePct.value,
    gapThreshold: FAMILY_LOAN.gapThreshold.value,
    withholdingPct: FAMILY_LOAN.withholdingPct.value,
    financialIncomeThreshold: LENDER_TAX.financialIncomeThreshold.value,
    withheldIncomeTaxPct: LENDER_TAX.withheldIncomeTaxPct.value,
    localTaxMultiplierPct: LENDER_TAX.localTaxMultiplierPct.value,
    marginalRateUnknownPct: LENDER_TAX.marginalRateUnknownPct.value,
    healthRatePct: HEALTH_INSURANCE.ratePct.value,
    longTermCareOfHealthPct: HEALTH_INSURANCE.longTermCareOfHealthPct.value,
    regionalFinancialIncomeThreshold: HEALTH_INSURANCE.regionalFinancialIncomeThreshold.value,
    employeeOtherIncomeThreshold: HEALTH_INSURANCE.employeeOtherIncomeThreshold.value,
  };
}

/* ─────────────────────────────────────────────────────────────
   대출 규제 숫자 (대출 가능액, DSR·DTI·LTV 계산기)
   2026-11-20에 금융위원회 보도자료와 은행연합회 공시를 직접 열어 대조했다.
   source 가 "참고 사이트 값"으로 시작하는 숫자는 원문을 찾지 못해 참고 사이트에 적힌 값을 넣은 것이다.
   세무사가 다시 확인하기 전에는 모두 verified = false 로 둔다.
   ───────────────────────────────────────────────────────────── */

export type LoanRegion = "regulated" | "capital" | "local";
export type LoanBuyer = "noHouse" | "firstTime" | "lowIncome" | "multiHouse";

export const LOAN_REGION_LABEL: Record<LoanRegion, string> = {
  regulated: "규제지역",
  capital: "수도권 (규제지역 아님)",
  local: "지방 (규제지역 아님)",
};

export const LOAN_BUYER_LABEL: Record<LoanBuyer, string> = {
  noHouse: "무주택 · 처분조건 1주택",
  firstTime: "생애최초 구입",
  lowIncome: "서민 · 실수요자",
  multiHouse: "다주택자",
};

const FSC_627 = "금융위원회 「가계부채 관리 강화 방안」 2025-06-27 (시행 2025-06-28) fsc.go.kr/no010101/84824";
const FSC_907 = "금융위원회 「주택공급 확대방안」 관련 긴급 가계부채 점검회의 2025-09-07 (시행 2025-09-08) fsc.go.kr/no010101/85253";
const FSC_1015 = "금융위원회 「주택시장 안정화 대책」 관련 긴급 가계부채 점검회의 2025-10-15 (시행 2025-10-16) fsc.go.kr/no010101/85432";
const FSC_260630 = "금융위원회 규제지역 추가 지정 관련 긴급 가계부채 점검회의 2026-06-30 fsc.go.kr/no010101/87222";
const KFB_STRESS = "은행연합회 스트레스 금리 공시 2026-06-30 (적용 2026-07-01～2026-12-31) portal.kfb.or.kr/compare/stress_loan.php · 금융위원회 공고 제2026-362호";
const REF_SITE = "참고 사이트 값. 금융위원회·금융감독원 원문으로 확인하지 못함";

/** LTV 비율(%) : 구입자 구분 → 지역 */
export const LOAN_LTV: Record<LoanBuyer, Record<LoanRegion, RateItem>> = {
  noHouse: {
    regulated: item("무주택·처분조건 1주택, 규제지역", 40, `${FSC_907} · ${FSC_260630}`),
    capital: item("무주택·처분조건 1주택, 수도권 비규제지역", 70, `${FSC_627} · ${FSC_260630}`),
    local: item("무주택·처분조건 1주택, 지방", 70, `${FSC_627} · ${FSC_260630}`),
  },
  firstTime: {
    regulated: item("생애최초, 규제지역", 70, FSC_627),
    capital: item("생애최초, 수도권 비규제지역", 70, FSC_627),
    local: item("생애최초, 지방", 80, `${FSC_627} (종전 전 지역 80%에서 수도권·규제지역만 70%로 낮춤)`),
  },
  lowIncome: {
    regulated: item("서민·실수요자, 규제지역", 70, `${REF_SITE}. 금융위 2026-06-30 자료에는 "60～70%"로만 나옴`),
    capital: item("서민·실수요자, 수도권 비규제지역", 70, REF_SITE),
    local: item("서민·실수요자, 지방", 70, REF_SITE),
  },
  multiHouse: {
    regulated: item("다주택자, 규제지역", 0, `${FSC_627} · ${FSC_260630}`),
    capital: item("다주택자, 수도권 비규제지역", 0, `${FSC_627} · ${FSC_260630}`),
    local: item("다주택자, 지방", 60, REF_SITE),
  },
};

/** 주택 구입 목적 주택담보대출 금액 한도 : 수도권·규제지역만. 집값(시가) 상한(원), 한도(원) */
export const LOAN_AMOUNT_CAP = item<{ upTo: number | null; cap: number }[]>(
  "수도권·규제지역 주택 구입 목적 대출 금액 한도",
  [
    { upTo: 1_500_000_000, cap: 600_000_000 },
    { upTo: 2_500_000_000, cap: 400_000_000 },
    { upTo: null, cap: 200_000_000 },
  ],
  FSC_1015,
);

/** 스트레스 금리(%포인트) : 변동형 주택담보대출 기준. 혼합형·주기형은 더 낮게 적용된다 */
export const LOAN_STRESS: Record<LoanRegion, RateItem> = {
  regulated: item("스트레스 금리, 규제지역 주택담보대출 (변동형)", 3.0, KFB_STRESS),
  capital: item("스트레스 금리, 수도권 주택담보대출 (변동형)", 3.0, KFB_STRESS),
  local: item("스트레스 금리, 지방 주택담보대출 (변동형)", 0.75, KFB_STRESS),
};

export const LOAN_DSR = {
  bankPct: item("DSR 기준, 은행", 40, `${REF_SITE} (금융위 2021년 자료에는 은행 40%, 비은행 50%로 나옴)`),
  nonBankPct: item("DSR 기준, 그 밖의 금융회사", 50, `${REF_SITE} (금융위 2021년 자료에는 은행 40%, 비은행 50%로 나옴)`),
  bulletMaxYears: item("만기 일시상환 주택담보대출의 원금을 나누는 햇수 (최대)", 10, REF_SITE),
};

/** 수도권·규제지역 주택담보대출 만기 상한(년) */
export const LOAN_MAX_TERM_YEARS = item("수도권·규제지역 주택담보대출 만기 상한(년)", 30, FSC_627);

export function listLoanRules(): RateItem<unknown>[] {
  return [
    ...Object.values(LOAN_LTV).flatMap((r) => Object.values(r)),
    LOAN_AMOUNT_CAP,
    ...Object.values(LOAN_STRESS),
    ...Object.values(LOAN_DSR),
    LOAN_MAX_TERM_YEARS,
  ];
}

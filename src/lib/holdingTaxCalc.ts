// 보유세(종합부동산세 + 재산세) 계산 — 2026 세제개편안 반영
// ⚠️ 국회 통과 전 "정부안" 기준. 확정 시 변동 가능. 결과는 참고용.
// 단위: 만원 (코드베이스 관행). 스펙 §4 정부 문답 사례 23건 중 22건 통과(오차 1만원 미만).
//
// 알려진 예외: 케이스 C3(공시 50억·70세·10년 거주)의 '27 중간모드만 정부 사례(1,942.1)보다
// 약 309만원 높게 산출된다. 단, 정부 문답이 함께 제시한 중간값(세액공제 한도 적용 전 2,141.1)은
// 본 엔진 계산과 정확히 일치하므로 산식 자체는 스펙을 따른 것으로 보이며,
// 최종값 차이는 세부담상한 기준 등 문답에 명시되지 않은 가정 차이로 추정된다.
// (정부안 확정·시행령 공개 후 재검증 필요)
//
// 연도 모드: "2026"(현행) / "2027"(중간) / "2028"(최종)

export type YearMode = "2026" | "2027" | "2028";
export type Household = "single" | "multi" | "corp"; // 1세대1주택 / 그 외 / 법인

export interface HoldingTaxInput {
  yearMode: YearMode;
  /** 인별 주택 공시가격 합산 (만원) */
  publicPrice: number;
  household: Household;
  /** 세율·FMV 그룹 판정용 주택 수 (1 / 2 / 3=3주택 이상) */
  houseCount: 1 | 2 | 3;
  /** 조정대상지역 주택 보유 등 강화그룹(‘28 FMV 80%) 여부 (1세대1주택 제외) */
  reinforced: boolean;
  /** (1세대1주택) 거주 여부 */
  isResident: boolean;
  /** (다주택) 거주주택 공시가격 (만원) — 그 외 기본공제 거주비중 배분용 */
  residentHousePrice: number;
  /** 연령 */
  age: number;
  /** (1세대1주택) 보유기간(년) */
  holdYears: number;
  /** (1세대1주택) 거주기간(년) */
  resideYears: number;
  /** 직전연도 재산세 본세+종부세 본세 합계 (만원) — 세부담상한 계산용(선택, 0이면 미적용) */
  prevYearHoldingTax: number;
  /** 도시지역(도시계획구역) 내 주택 여부 — 재산세 도시지역분 0.14% 부과 (기본 true) */
  inUrbanArea?: boolean;
}

export interface HoldingTaxResult {
  yearMode: YearMode;
  // 재산세
  propertyTaxBase: number; // 재산세 과세표준
  propertyTax: number; // 재산세 산출(본세)
  urbanAreaTax: number; // 도시지역분
  localEduTax: number; // 지방교육세
  propertyTaxTotal: number; // 재산세 합계
  // 종합부동산세
  jongbuBase: number; // 종부세 과세표준
  jongbuGross: number; // 산출세액
  propertyTaxCredit: number; // 재산세 공제액 ③
  taxCreditRate: number; // 1세대1주택 세액공제율(합산)
  taxCredit: number; // 세액공제액(한도 적용 후) ④
  jongbuTax: number; // 종부세 본세(농특세 전)
  ruralTax: number; // 농어촌특별세
  jongbuTotal: number; // 종부세 합계(농특세 포함)
  burdenCapApplied: boolean; // 세부담상한 적용 여부
  burdenCap: number; // 세부담상한액 (직전연도 본세 합계 × 상한율, 0=직전연도 미입력)
  burdenCapCut: number; // 상한 초과로 종부세 본세에서 차감된 금액
  // 합계
  holdingTaxTotal: number; // 보유세 = 재산세 + 종부세
}

const 억 = 10000; // 만원 단위에서 1억 = 10000만원

/* ────────────── 종합부동산세 파라미터 ────────────── */

// 종부세 과세표준 세율 구간 상단(만원)
const JONGBU_EDGES = [3 * 억, 6 * 억, 12 * 억, 25 * 억, 50 * 억, 94 * 억];

// [모드][그룹] 세율. 그룹: "12"=1·2주택, "3"=3주택+ (‘28은 단일이라 동일값)
const JONGBU_RATES: Record<YearMode, { "12": number[]; "3": number[] }> = {
  "2026": {
    "12": [0.005, 0.007, 0.01, 0.013, 0.015, 0.02, 0.027],
    "3": [0.005, 0.007, 0.01, 0.02, 0.03, 0.04, 0.05],
  },
  "2027": {
    "12": [0.005, 0.007, 0.013, 0.015, 0.02, 0.027, 0.035],
    "3": [0.005, 0.007, 0.013, 0.02, 0.03, 0.04, 0.05],
  },
  "2028": {
    "12": [0.005, 0.007, 0.013, 0.02, 0.03, 0.04, 0.05],
    "3": [0.005, 0.007, 0.013, 0.02, 0.03, 0.04, 0.05],
  },
};

// 종부세 공정시장가액비율(FMV). 강화그룹(3주택+·조정지역보유, 1세대1주택 제외)은 ‘28에 80%
const JONGBU_FMV: Record<YearMode, { normal: number; reinforced: number }> = {
  "2026": { normal: 0.6, reinforced: 0.6 },
  "2027": { normal: 0.7, reinforced: 0.7 },
  "2028": { normal: 0.7, reinforced: 0.8 },
};

// 1세대1주택 세액공제 금액 한도(만원). 2026 무한
const CREDIT_CAP: Record<YearMode, number> = {
  "2026": Infinity,
  "2027": 800,
  "2028": 600,
};

// 세부담상한율
const BURDEN_CAP_RATE: Record<YearMode, number> = {
  "2026": 1.5,
  "2027": 2.0,
  "2028": 2.0,
};

/* ────────────── 재산세 파라미터 (개편 없음, 현행) ────────────── */

const PROP_EDGES = [6000, 15000, 30000]; // 과세표준 구간 상단(만원): 6천만·1.5억·3억
const PROP_STD_RATES = [0.001, 0.0015, 0.0025, 0.004];
const PROP_SPECIAL_RATES = [0.0005, 0.001, 0.002, 0.0035]; // 1세대1주택 특례(공시 9억↓)
const PROP_DEDUCT = [0, 3, 18, 63]; // 누진공제(만원) — 표준·특례 공통

/* ────────────── 누진 계산 헬퍼 ────────────── */

// 구간 누진(edges: 각 구간 상단, rates: 구간별 세율) — 직접 적분
function progressive(base: number, edges: number[], rates: number[]): number {
  if (base <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (let i = 0; i < rates.length; i++) {
    const upper = i < edges.length ? edges[i] : Infinity;
    if (base > prev) {
      tax += (Math.min(base, upper) - prev) * rates[i];
    }
    prev = upper;
    if (base <= upper) break;
  }
  return tax;
}

// 재산세 과세표준의 한계세율(표준) — 재산세 공제 ③ 산식용
function propMarginalStdRate(propBase: number): number {
  if (propBase <= PROP_EDGES[0]) return PROP_STD_RATES[0];
  if (propBase <= PROP_EDGES[1]) return PROP_STD_RATES[1];
  if (propBase <= PROP_EDGES[2]) return PROP_STD_RATES[2];
  return PROP_STD_RATES[3];
}

/* ────────────── 재산세 공정시장가액비율 ────────────── */
// 1세대1주택 특례: 공시 3억↓43% / 3~6억 44% / 6억↑45% (공시가 기준). 그 외 60%
function propertyFMV(household: Household, publicPrice: number): number {
  if (household !== "single") return 0.6;
  if (publicPrice <= 3 * 억) return 0.43;
  if (publicPrice <= 6 * 억) return 0.44;
  return 0.45;
}

/* ────────────── 종부세 기본공제 ────────────── */
function jongbuDeduction(input: HoldingTaxInput): { deduction: number; threshold: number } {
  const { yearMode, household, isResident, publicPrice, residentHousePrice } = input;
  if (household === "corp") return { deduction: 0, threshold: 0 };

  if (household === "single") {
    if (yearMode === "2026") return { deduction: 12 * 억, threshold: 12 * 억 };
    // 2027~: 거주 14억 / 비거주 9억, 문턱 14억 공통
    return { deduction: isResident ? 14 * 억 : 9 * 억, threshold: 14 * 억 };
  }

  // 그 외(다주택)
  if (yearMode === "2026") return { deduction: 9 * 억, threshold: 9 * 억 };
  // 2027~: 4억 + 5억 × (거주주택 공시 ÷ 공시 합산), 문턱 9억
  const ratio = publicPrice > 0 ? Math.min(1, residentHousePrice / publicPrice) : 0;
  return { deduction: 4 * 억 + 5 * 억 * ratio, threshold: 9 * 억 };
}

/* ────────────── 1세대1주택 세액공제율 ────────────── */
function ageCredit(age: number): number {
  if (age >= 70) return 0.4;
  if (age >= 65) return 0.3;
  if (age >= 60) return 0.2;
  return 0;
}
function tierCredit(years: number, tiers: [number, number][]): number {
  for (const [y, r] of tiers) if (years >= y) return r;
  return 0;
}
function holdResideCredit(input: HoldingTaxInput): number {
  const { yearMode, holdYears, resideYears } = input;
  const resideTiers: [number, number][] = [
    [15, 0.5],
    [10, 0.4],
    [5, 0.2],
  ];
  if (yearMode === "2026") {
    return tierCredit(holdYears, [
      [15, 0.5],
      [10, 0.4],
      [5, 0.2],
    ]);
  }
  const reside = tierCredit(resideYears, resideTiers);
  if (yearMode === "2028") return reside; // 거주만
  // 2027: 거주 vs 보유(절반 10/20/25%) 중 큰 것
  const holdHalf = tierCredit(holdYears, [
    [15, 0.25],
    [10, 0.2],
    [5, 0.1],
  ]);
  return Math.max(reside, holdHalf);
}

/* ────────────── 메인 계산 ────────────── */
export function calculateHoldingTax(input: HoldingTaxInput): HoldingTaxResult {
  const { yearMode, publicPrice, household, houseCount, reinforced } = input;

  // ── 재산세 ──
  const pFMV = propertyFMV(household, publicPrice);
  const propertyTaxBase = Math.round(publicPrice * pFMV);
  const useSpecialRate = household === "single" && publicPrice <= 9 * 억;
  const pRates = useSpecialRate ? PROP_SPECIAL_RATES : PROP_STD_RATES;
  // 누진공제 방식으로 계산 후 progressive 결과와 동일
  const propertyTax = Math.round(progressive(propertyTaxBase, PROP_EDGES, pRates));
  const urbanAreaTax = input.inUrbanArea === false ? 0 : Math.round(propertyTaxBase * 0.0014); // 도시지역분
  const localEduTax = Math.round(propertyTax * 0.2); // 지방교육세
  const propertyTaxTotal = propertyTax + urbanAreaTax + localEduTax;

  // ── 종합부동산세 ──
  const { deduction, threshold } = jongbuDeduction(input);
  const fmv = reinforced ? JONGBU_FMV[yearMode].reinforced : JONGBU_FMV[yearMode].normal;

  // 문턱 미달이면 종부세 0
  const overThreshold = publicPrice > threshold;
  const jongbuBase = overThreshold ? Math.max(0, Math.round((publicPrice - deduction) * fmv)) : 0;

  const rateGroup = houseCount >= 3 ? "3" : "12";
  const rates = JONGBU_RATES[yearMode][rateGroup];
  const jongbuGross = Math.round(progressive(jongbuBase, JONGBU_EDGES, rates));

  // ③ 재산세 공제 = 종부과표 × 재산세FMV × 재산세 한계세율(전체 재산세 과표 기준)
  const propMarginal = propMarginalStdRate(propertyTaxBase);
  const propertyTaxCredit = Math.round(jongbuBase * pFMV * propMarginal);

  const afterPropCredit = Math.max(0, jongbuGross - propertyTaxCredit);

  // ④ 1세대1주택 세액공제 (연령 + 보유/거주, 상한 80%, 금액 한도)
  let taxCreditRate = 0;
  let taxCredit = 0;
  if (household === "single") {
    taxCreditRate = Math.min(0.8, ageCredit(input.age) + holdResideCredit(input));
    taxCredit = Math.min(afterPropCredit * taxCreditRate, CREDIT_CAP[yearMode]);
    taxCredit = Math.round(taxCredit);
  }

  let jongbuTax = Math.max(0, afterPropCredit - taxCredit);

  // ⑤ 세부담상한 — 비교 기준은 "주택분 재산세 본세 + 종부세 본세" (종부세법 §10 상당액 방식)
  //    도시지역분·지방교육세·농어촌특별세는 상당액에서 제외하고, 초과분은 종부세 본세에서 차감.
  //    prevYearHoldingTax 에는 직전연도의 같은 기준(재산세 본세+종부세 본세 합계)을 넣는다.
  //    (재산세 자체의 상한 105~130%는 별도 체계라 미반영 — cap이 재산세 본세보다 작아도 재산세는 유지)
  let burdenCapApplied = false;
  let burdenCap = 0;
  let burdenCapCut = 0;
  if (input.prevYearHoldingTax > 0) {
    burdenCap = Math.round(input.prevYearHoldingTax * BURDEN_CAP_RATE[yearMode]);
    if (propertyTax + jongbuTax > burdenCap) {
      const capped = Math.max(0, burdenCap - propertyTax);
      burdenCapCut = jongbuTax - capped;
      jongbuTax = capped;
      burdenCapApplied = true;
    }
  }

  // ⑥ 농어촌특별세 = 종부세액 × 20%
  const ruralTax = Math.round(jongbuTax * 0.2);
  const jongbuTotal = jongbuTax + ruralTax;

  return {
    yearMode,
    propertyTaxBase,
    propertyTax,
    urbanAreaTax,
    localEduTax,
    propertyTaxTotal,
    jongbuBase,
    jongbuGross,
    propertyTaxCredit,
    taxCreditRate,
    taxCredit,
    jongbuTax,
    ruralTax,
    jongbuTotal,
    burdenCapApplied,
    burdenCap,
    burdenCapCut,
    holdingTaxTotal: propertyTaxTotal + jongbuTotal,
  };
}

/**
 * 연도 3모드 일괄 계산 — 세부담상한 "연쇄" 적용
 *
 * 세부담상한의 기준은 각 연도의 "직전연도 재산세 본세+종부세 본세"다(공시가격 동결 가정).
 *   '26 상한 = 사용자가 입력한 직전연도('25) 본세 합계 × 150%
 *   '27 상한 = '26년 계산 결과(재산세 본세+종부 본세, 상한 적용 후) × 200%
 *   '28 상한 = '27년 계산 결과 × 200%
 * 단일 입력값을 세 모드에 그대로 꽂으면 '27·'28 상한이 실제보다 낮게 걸리므로
 * 반드시 이 함수를 쓸 것. 검증: 압구정한양2차(공시 58.09억·70세·10년 거주) 정밀 시트와
 * '27 상한 차감 904.3만원까지 일치(만원 반올림 이내).
 */
export function calculateHoldingTaxAll(
  base: Omit<HoldingTaxInput, "yearMode">
): Record<YearMode, HoldingTaxResult> {
  const r26 = calculateHoldingTax({ ...base, yearMode: "2026" });
  const r27 = calculateHoldingTax({
    ...base,
    yearMode: "2027",
    prevYearHoldingTax: r26.propertyTax + r26.jongbuTax,
  });
  const r28 = calculateHoldingTax({
    ...base,
    yearMode: "2028",
    prevYearHoldingTax: r27.propertyTax + r27.jongbuTax,
  });
  return { "2026": r26, "2027": r27, "2028": r28 };
}

// 상속세·증여세 계산 로직
// 현행법 기준 (상속세 및 증여세법)
// 정부 개정안(자녀공제 5억, 최고세율 40%)은 2024.12 국회 부결 → 현행 유지

// === 공통 세율표 (상속세 = 증여세 동일) ===
const TAX_BRACKETS = [
  { limit: 10000, rate: 0.10, deduction: 0 },      // 1억 이하
  { limit: 50000, rate: 0.20, deduction: 1000 },    // 5억 이하
  { limit: 100000, rate: 0.30, deduction: 6000 },   // 10억 이하
  { limit: 300000, rate: 0.40, deduction: 16000 },  // 30억 이하
  { limit: Infinity, rate: 0.50, deduction: 46000 }, // 30억 초과
];

function calcTax(taxable: number): number {
  if (taxable <= 0) return 0;
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.limit) {
      return taxable * b.rate - b.deduction;
    }
  }
  return 0;
}

function findRate(taxable: number): string {
  if (taxable <= 0) return "0%";
  for (const b of TAX_BRACKETS) {
    if (taxable <= b.limit) return `${b.rate * 100}%`;
  }
  return "50%";
}

// =====================
// 상속세
// =====================

export interface InheritanceTaxInput {
  totalAssets: number;        // 총 상속재산 (만원)
  debtsAndExpenses: number;   // 채무·공과금·장례비용 (만원)
  hasSpouse: boolean;         // 배우자 유무
  spouseInheritance: number;  // 배우자 실제 상속액 (만원) - 0이면 최소 5억 적용
  children: number;           // 자녀 수
  minorChildren: number;      // 미성년 자녀 수 (19세까지 잔여연수 필요)
  minorRemainingYears: number; // 미성년자 잔여연수 평균
  elderlyCount: number;       // 연로자(65세 이상) 수
  priorGiftsToHeir: number;   // 10년 내 상속인 사전증여 (만원)
  priorGiftsToSpouse: number; // 10년 내 배우자 사전증여 (만원)
  generationSkip: boolean;    // 세대생략 상속 여부
}

export interface InheritanceTaxResult {
  totalAssets: number;
  debtsAndExpenses: number;
  taxableBase: number;          // 상속세 과세가액
  basicDeduction: number;       // 기초공제 (2억)
  childDeduction: number;       // 자녀공제
  minorDeduction: number;       // 미성년자공제
  elderlyDeduction: number;     // 연로자공제
  personalDeductionTotal: number; // 기초+인적공제 합계
  lumpSumDeduction: number;     // 일괄공제 (5억)
  appliedDeduction: string;     // 적용된 공제 방식
  spouseDeduction: number;      // 배우자상속공제
  totalDeduction: number;       // 공제 합계
  taxableIncome: number;        // 과세표준
  taxRate: string;
  computedTax: number;          // 산출세액
  generationSkipSurcharge: number; // 세대생략 할증
  reportDiscount: number;       // 신고세액공제 (3%)
  finalTax: number;             // 최종 납부세액
  localTax: number;             // 없음 (상속세는 지방소득세 없음)
}

export function calculateInheritanceTax(input: InheritanceTaxInput): InheritanceTaxResult {
  const {
    totalAssets,
    debtsAndExpenses,
    hasSpouse,
    spouseInheritance,
    children,
    minorChildren,
    minorRemainingYears,
    elderlyCount,
    priorGiftsToHeir,
    priorGiftsToSpouse,
    generationSkip,
  } = input;

  // 1. 상속세 과세가액
  const taxableBase = Math.max(0, totalAssets - debtsAndExpenses + priorGiftsToHeir + priorGiftsToSpouse);

  // 2. 공제 계산

  // 기초공제: 2억
  const basicDeduction = 20000;

  // 인적공제
  const childDeduction = children * 5000; // 자녀 1인당 5,000만원
  const minorDeduction = minorChildren * 1000 * minorRemainingYears; // 미성년자 1,000만원 x 잔여연수
  const elderlyDeduction = elderlyCount * 5000; // 연로자 1인당 5,000만원

  const personalDeductionTotal = basicDeduction + childDeduction + minorDeduction + elderlyDeduction;

  // 일괄공제: 5억
  const lumpSumDeduction = 50000;

  // 기초+인적 vs 일괄 중 큰 쪽 선택
  const appliedBasicPersonal = Math.max(personalDeductionTotal, lumpSumDeduction);
  const appliedDeduction = personalDeductionTotal > lumpSumDeduction
    ? "기초공제 + 인적공제"
    : "일괄공제 (5억)";

  // 배우자상속공제
  let spouseDeduction = 0;
  if (hasSpouse) {
    if (spouseInheritance > 0) {
      // 실제 상속액 기준, 최소 5억 ~ 최대 30억
      spouseDeduction = Math.max(50000, Math.min(spouseInheritance, 300000));
    } else {
      // 입력 안 하면 최소 5억
      spouseDeduction = 50000;
    }
  }

  // 총 공제
  // 상속공제 적용한도: 상속세 과세가액 - 사전증여 과세표준
  const deductionLimit = Math.max(0, taxableBase - priorGiftsToHeir - priorGiftsToSpouse);
  const rawTotalDeduction = appliedBasicPersonal + spouseDeduction;
  const totalDeduction = Math.min(rawTotalDeduction, deductionLimit);

  // 3. 과세표준
  const taxableIncome = Math.max(0, taxableBase - totalDeduction);

  // 4. 산출세액
  const computedTax = calcTax(taxableIncome);

  // 5. 세대생략 할증 (30%)
  const generationSkipSurcharge = generationSkip ? computedTax * 0.3 : 0;

  const taxAfterSurcharge = computedTax + generationSkipSurcharge;

  // 6. 신고세액공제 (3%)
  const reportDiscount = taxAfterSurcharge * 0.03;

  // 7. 최종 납부세액
  const finalTax = Math.max(0, taxAfterSurcharge - reportDiscount);

  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    totalAssets,
    debtsAndExpenses,
    taxableBase: Math.round(taxableBase),
    basicDeduction,
    childDeduction,
    minorDeduction,
    elderlyDeduction,
    personalDeductionTotal,
    lumpSumDeduction,
    appliedDeduction,
    spouseDeduction,
    totalDeduction: Math.round(totalDeduction),
    taxableIncome: Math.round(taxableIncome),
    taxRate: findRate(taxableIncome),
    computedTax: r(computedTax),
    generationSkipSurcharge: r(generationSkipSurcharge),
    reportDiscount: r(reportDiscount),
    finalTax: r(finalTax),
    localTax: 0,
  };
}

// =====================
// 증여세
// =====================

export type GiftRelation =
  | "spouse"          // 배우자: 6억
  | "linealAdult"     // 직계존속→성년 직계비속: 5,000만
  | "linealMinor"     // 직계존속→미성년 직계비속: 2,000만
  | "linealAscendant" // 직계비속→직계존속: 5,000만
  | "otherRelative"   // 기타친족(6촌 혈족, 4촌 인척): 1,000만
  | "other";          // 기타: 0

const GIFT_EXEMPTIONS: Record<GiftRelation, number> = {
  spouse: 60000,        // 6억
  linealAdult: 5000,    // 5,000만
  linealMinor: 2000,    // 2,000만
  linealAscendant: 5000, // 5,000만
  otherRelative: 1000,  // 1,000만
  other: 0,
};

const GIFT_RELATION_LABELS: Record<GiftRelation, string> = {
  spouse: "배우자",
  linealAdult: "직계존속 → 성년 자녀",
  linealMinor: "직계존속 → 미성년 자녀",
  linealAscendant: "자녀 → 부모(직계존속)",
  otherRelative: "기타 친족 (6촌/4촌)",
  other: "기타",
};

export { GIFT_RELATION_LABELS };

export interface GiftTaxInput {
  giftAmount: number;          // 증여재산가액 (만원)
  relation: GiftRelation;      // 증여자-수증자 관계
  /** 같은 분(부·모는 한 사람)께 10년 안에 받은 금액 (만원) — 합산과세 + 기납부세액공제 (상증법 §47②) */
  priorGifts10yr: number;
  /** 같은 공제 그룹의 다른 분께 10년 안에 받아 이미 쓴 공제 (만원) — 예: 조부모 증여로 쓴 직계존속 공제 (§53) */
  otherExemptionUsed?: number;
  debtAssumption: number;      // 채무 인수액 (만원) — 부담부증여
  generationSkip: boolean;     // 세대생략 증여 여부
  isMinorOver20: boolean;      // 미성년자이면서 증여재산 20억 초과 (할증 40%)
  /** 비과세·과세가액 불산입액 (만원) */
  nonTaxable?: number;
  /** 감정평가수수료 (만원) — 500만원 한도 (상증령 §20의3③, 증여 준용) */
  appraisalFee?: number;
  /** 혼인 증여재산공제 (혼인신고일 전후 2년) — 상증법 §53의2, 직계존속 → 직계비속 */
  marriage?: boolean;
  /** 출산 증여재산공제 (자녀 출생·입양일부터 2년) — 혼인과 합쳐 1억 한도 */
  birth?: boolean;
  /** 이미 쓴 혼인·출산 공제 (만원) — 평생 1억 한도에서 차감 */
  marriageBirthUsed?: number;
  /** 사전증여 기납부세액(당시 산출세액) 직접 입력 (만원). undefined면 사전증여액으로 자동 추정 */
  priorGiftTaxPaid?: number;
  /** 증여세를 증여자가 대신 납부 — 대납한 세금도 증여재산에 포함해 다시 계산 */
  taxPaidByDonor?: boolean;
}

/** 결과 명세서 한 줄 (금액은 원) */
export interface GiftTaxLine {
  key: string;
  label: string;
  won: number;
  sign: "" | "+" | "-" | "=";
  note: string;
  strong?: boolean;
}

export interface GiftTaxResult {
  giftAmount: number;           // 증여재산가액 (만원, 대납 시 대납세액 포함)
  debtAssumption: number;
  taxableBase: number;          // 증여세 과세가액 (만원, 사전증여 가산 후)
  exemption: number;            // 적용된 기본 증여재산공제 (만원)
  exemptionLabel: string;
  marriageBirthExemption: number; // 혼인·출산 공제 (만원)
  marriageBirthLabel: string;   // "혼인" | "출산" | "혼인·출산"
  surchargeRate: number;        // 세대생략 할증률 (0 / 0.3 / 0.4)
  appraisalFee: number;         // 적용된 감정평가수수료 (만원)
  priorGifts10yr: number;
  taxableIncome: number;        // 과세표준 (만원)
  taxRate: string;
  computedTax: number;          // 산출세액 (만원, 사전증여 포함 합산 기준)
  priorGiftTax: number;         // 기납부세액공제 (만원)
  generationSkipSurcharge: number;
  reportDiscount: number;       // 신고세액공제 (만원)
  finalTax: number;             // 최종 납부세액 (만원)
  finalTaxWon: number;          // 최종 납부세액 (원, 원 미만 절사)
  /** 대납 시 증여자가 대신 낸 세금 = 최종세액 (원). 대납 아니면 0 */
  paidByDonorWon: number;
  lines: GiftTaxLine[];
}

const MARRIAGE_BIRTH_LIMIT = 10000; // 1억 (만원)
const APPRAISAL_FEE_LIMIT = 500; // 500만원 (만원)

/** 산출세액 구간 설명 — "5억원 이하 세율 20%, 누진공제 1,000만원" */
function bracketNote(taxable: number): string {
  if (taxable <= 0) return "과세표준 0원";
  const names = ["1억원 이하", "5억원 이하", "10억원 이하", "30억원 이하", "30억원 초과"];
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const b = TAX_BRACKETS[i];
    if (taxable <= b.limit) {
      return `${names[i]} 세율 ${b.rate * 100}%${b.deduction ? `, 누진공제 ${b.deduction.toLocaleString("ko-KR")}만원` : ""}`;
    }
  }
  return "";
}

/** 1회 계산 (대납 반복 없이). 금액은 원 단위 정수로 처리, 각 세액 원 미만 절사 */
function computeGiftOnce(input: GiftTaxInput, giftWonExtra = 0) {
  const W = (man: number) => Math.round((man || 0) * 10000);
  const floorWon = (v: number) => Math.floor(v + 1e-6);

  const giftWon = W(input.giftAmount) + giftWonExtra;
  const nonTaxWon = Math.min(W(input.nonTaxable ?? 0), giftWon);
  const debtWon = Math.min(W(input.debtAssumption), Math.max(0, giftWon - nonTaxWon));
  const priorWon = W(input.priorGifts10yr);
  const thisBaseWon = Math.max(0, giftWon - nonTaxWon - debtWon); // 이번 증여분 과세가액
  const baseWon = thisBaseWon + priorWon; // 합산 과세가액

  // 기본 공제 = 관계별 10년 한도 − 같은 그룹의 다른 분께 받아 이미 쓴 공제
  const relationLimitWon = Math.max(0, W(GIFT_EXEMPTIONS[input.relation]) - W(input.otherExemptionUsed ?? 0));
  const exemptionWon = Math.min(relationLimitWon, baseWon);

  const mbEligible =
    (!!input.marriage || !!input.birth) && (input.relation === "linealAdult" || input.relation === "linealMinor");
  const mbLimitWon = Math.max(0, W(MARRIAGE_BIRTH_LIMIT) - W(input.marriageBirthUsed ?? 0));
  const mbWon = mbEligible ? Math.min(mbLimitWon, thisBaseWon, Math.max(0, baseWon - exemptionWon)) : 0;

  const feeWon = Math.min(W(input.appraisalFee ?? 0), W(APPRAISAL_FEE_LIMIT), Math.max(0, baseWon - exemptionWon - mbWon));
  const taxableWon = Math.max(0, baseWon - exemptionWon - mbWon - feeWon);

  // 산출세액 (합산 과세표준 기준)
  const taxable만 = taxableWon / 10000;
  const totalTaxWon = floorWon(calcTax(taxable만) * 10000);

  // 기납부세액공제 — 직접 입력이 있으면 그 값, 없으면 사전증여액에 같은 관계 공제를 적용한 산출세액으로 추정
  const priorAutoWon = floorWon(calcTax(Math.max(0, priorWon - relationLimitWon) / 10000) * 10000);
  const priorCreditWon = Math.min(
    totalTaxWon,
    input.priorGiftTaxPaid !== undefined ? W(input.priorGiftTaxPaid) : priorAutoWon
  );
  const thisTaxWon = Math.max(0, totalTaxWon - priorCreditWon);

  const surchargeRate = input.generationSkip ? (input.isMinorOver20 ? 0.4 : 0.3) : 0;
  const surchargeWon = floorWon(thisTaxWon * surchargeRate);
  const reportWon = floorWon((thisTaxWon + surchargeWon) * 0.03);
  const finalWon = Math.max(0, thisTaxWon + surchargeWon - reportWon);

  return {
    giftWon, nonTaxWon, debtWon, priorWon, baseWon, exemptionWon, mbWon, feeWon, taxableWon,
    totalTaxWon, priorCreditWon, surchargeWon, surchargeRate, reportWon, finalWon, mbEligible,
  };
}

export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult {
  // 세금 대납: 증여자가 대신 낸 증여세도 증여재산 → 세액이 수렴할 때까지 다시 계산 (T = f(증여 + T))
  let extra = 0;
  let c = computeGiftOnce(input, 0);
  if (input.taxPaidByDonor) {
    for (let i = 0; i < 60; i++) {
      const next = computeGiftOnce(input, c.finalWon);
      if (Math.abs(next.finalWon - c.finalWon) < 1) {
        c = next;
        break;
      }
      c = next;
    }
    extra = c.giftWon - Math.round((input.giftAmount || 0) * 10000);
  }

  const 만 = (won: number) => won / 10000;
  const limit만 = GIFT_EXEMPTIONS[input.relation];
  const limitText = limit만 >= 10000 ? `${limit만 / 10000}억` : `${limit만.toLocaleString("ko-KR")}만원`;
  const usedOther = input.otherExemptionUsed ?? 0;
  const exemptionLabel = `${GIFT_RELATION_LABELS[input.relation]} 공제 (10년 ${limitText}${
    usedOther > 0 ? ` − 이미 쓴 ${usedOther.toLocaleString("ko-KR")}만원` : ""
  })`;
  const marriageBirthLabel = input.marriage && input.birth ? "혼인·출산" : input.marriage ? "혼인" : "출산";

  const lines: GiftTaxLine[] = [];
  const add = (l: GiftTaxLine, show = true) => show && lines.push(l);
  add({
    key: "gift",
    label: "증여재산가액",
    won: c.giftWon,
    sign: "",
    note: extra > 0 ? `입력값 + 대납 증여세 ${extra.toLocaleString("ko-KR")}원` : "입력값",
  });
  add({ key: "nonTax", label: "비과세·불산입", won: c.nonTaxWon, sign: "-", note: "과세가액에서 제외" }, c.nonTaxWon > 0);
  add({ key: "debt", label: "채무 인수액", won: c.debtWon, sign: "-", note: "부담부증여 — 채무분은 양도세 대상" }, c.debtWon > 0);
  add({ key: "prior", label: "10년 내 같은 분 증여", won: c.priorWon, sign: "+", note: "합산과세 (부·모는 한 사람)" }, c.priorWon > 0);
  add({
    key: "base",
    label: "증여세 과세가액",
    won: c.baseWon,
    sign: "=",
    note: "증여재산가액 − 비과세 − 채무 + 사전증여",
    strong: true,
  });
  add({ key: "exemption", label: "증여재산공제", won: c.exemptionWon, sign: "-", note: exemptionLabel });
  add({ key: "mb", label: `${marriageBirthLabel} 공제`, won: c.mbWon, sign: "-", note: "혼인·출산 합쳐 평생 1억 (상증법 §53의2)" }, c.mbEligible);
  add({ key: "fee", label: "감정평가수수료", won: c.feeWon, sign: "-", note: "500만원 한도" }, c.feeWon > 0);
  add({ key: "taxable", label: "과세표준", won: c.taxableWon, sign: "=", note: "과세가액 − 공제 − 수수료", strong: true });
  add({ key: "computed", label: "산출세액", won: c.totalTaxWon, sign: "", note: bracketNote(c.taxableWon / 10000) });
  add({ key: "priorCredit", label: "기납부세액공제", won: c.priorCreditWon, sign: "-", note: input.priorGiftTaxPaid !== undefined ? "사전증여 당시 산출세액 (입력값)" : "사전증여분 산출세액 (자동 추정)" }, c.priorWon > 0);
  add({ key: "surcharge", label: "세대생략 할증", won: c.surchargeWon, sign: "+", note: `산출세액의 ${c.surchargeRate * 100}%` }, c.surchargeWon > 0);
  add({ key: "report", label: "신고세액공제", won: c.reportWon, sign: "-", note: "기한 내 신고 시 3%" });
  add({ key: "final", label: "납부할 증여세", won: c.finalWon, sign: "=", note: input.taxPaidByDonor ? "증여자가 대신 납부 (대납분 포함 계산)" : "최종 납부액", strong: true });

  return {
    giftAmount: 만(c.giftWon),
    debtAssumption: 만(c.debtWon),
    taxableBase: 만(c.baseWon),
    exemption: 만(c.exemptionWon),
    exemptionLabel,
    marriageBirthExemption: 만(c.mbWon),
    marriageBirthLabel,
    surchargeRate: c.surchargeRate,
    appraisalFee: 만(c.feeWon),
    priorGifts10yr: 만(c.priorWon),
    taxableIncome: 만(c.taxableWon),
    taxRate: findRate(c.taxableWon / 10000),
    computedTax: 만(c.totalTaxWon),
    priorGiftTax: 만(c.priorCreditWon),
    generationSkipSurcharge: 만(c.surchargeWon),
    reportDiscount: 만(c.reportWon),
    finalTax: 만(c.finalWon),
    finalTaxWon: c.finalWon,
    paidByDonorWon: input.taxPaidByDonor ? c.finalWon : 0,
    lines,
  };
}

/* ───────── 신고·납부 일정 안내 ───────── */

// 양력 고정 공휴일 (MM-DD) — 설·추석·대체공휴일 등 음력·임시 공휴일은 미반영
const FIXED_HOLIDAYS = new Set(["01-01", "03-01", "05-05", "06-06", "08-15", "10-03", "10-09", "12-25"]);

/**
 * 증여세 신고·납부기한 = 증여일이 속하는 달의 말일부터 3개월 (상증법 §68)
 * 기한이 토·일·공휴일이면 그다음 날 (국세기본법 §5). base = 법정 기한, due = 실제 마감일
 */
export function giftReportDeadline(giftDate: string): { base: string; due: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(giftDate || "");
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2] - 1;
  const fmt = (t: Date) =>
    `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
  const base = new Date(Date.UTC(y, mo + 4, 0)); // (증여월 + 3)의 말일
  const due = new Date(base);
  for (let i = 0; i < 10; i++) {
    const dow = due.getUTCDay();
    if (dow !== 0 && dow !== 6 && !FIXED_HOLIDAYS.has(fmt(due).slice(5))) break;
    due.setUTCDate(due.getUTCDate() + 1);
  }
  return { base: fmt(base), due: fmt(due) };
}

/** 분납 가능액 (상증법 §70②): 납부세액 1천만 초과 시 2개월 내 — 2천만 이하면 1천만 초과분, 초과면 50% 이하 */
export function installmentAmountWon(finalWon: number): number {
  if (finalWon <= 10_000_000) return 0;
  if (finalWon <= 20_000_000) return finalWon - 10_000_000;
  return Math.floor(finalWon / 2);
}

// 증여·차용 혼합 계산 검증 (명세 8번 예시 A~E) — 실행: node test-gift-loan-mix.ts
import { defaultMixSettings } from "./src/lib/officeRates.ts";
import { calculateMix, minRatePctExact, recommendedRatePct, interestFreeLimit, recommendMix, mixScenarios, type MixInput } from "./src/lib/giftLoanMixCalc.ts";

const s = defaultMixSettings();
let pass = 0;
let fail = 0;
const eq = (name: string, got: number, want: number) => {
  const ok = got === want;
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name} : ${got.toLocaleString("ko-KR")}${ok ? "" : "  (명세 " + want.toLocaleString("ko-KR") + ")"}`);
};

const base: MixInput = {
  total: 820_000_000, gift: 0, relation: "adultLineal", priorGift: 0, useMarriageBirth: false,
  ratePct: 4.6, monthlyPrincipal: 0, insuranceType: "regional",
  existingFinancialIncome: 0, employeeOtherIncome: 0, marginalRatePct: 35,
};

// [기간] 증여세, 이자 합계, 뗀 세금, 종합소득세 추가, 건강보험료, 합계, 남은 원금
type Row = [number, number, number, number, number, number, number];
// [연차] 기초잔액, 이자, 뗀 세금, 추가, 보험
type Yr = [number, number, number, number, number];
const cases: { name: string; input: MixInput; periods: Row[]; years: Yr[] }[] = [
  {
    name: "A", input: base,
    periods: [
      [0, 188_600_000, 51_865_000, 9_746_000, 15_342_165, 76_953_165, 820_000_000],
      [0, 377_200_000, 103_730_000, 19_492_000, 30_684_330, 153_906_330, 820_000_000],
      [0, 565_800_000, 155_595_000, 29_238_000, 46_026_495, 230_859_495, 820_000_000],
    ],
    years: [[820_000_000, 37_720_000, 10_373_000, 1_949_200, 3_068_433], [820_000_000, 37_720_000, 10_373_000, 1_949_200, 3_068_433], [820_000_000, 37_720_000, 10_373_000, 1_949_200, 3_068_433]],
  },
  {
    name: "B", input: { ...base, ratePct: 3.4 },
    periods: [
      [0, 139_400_000, 38_335_000, 4_334_000, 11_339_860, 54_008_860, 820_000_000],
      [0, 278_800_000, 76_670_000, 8_668_000, 22_679_720, 108_017_720, 820_000_000],
      [0, 418_200_000, 115_005_000, 13_002_000, 34_019_580, 162_026_580, 820_000_000],
    ],
    years: [[820_000_000, 27_880_000, 7_667_000, 866_800, 2_267_972], [820_000_000, 27_880_000, 7_667_000, 866_800, 2_267_972], [820_000_000, 27_880_000, 7_667_000, 866_800, 2_267_972]],
  },
  {
    name: "C", input: { ...base, gift: 150_000_000, ratePct: 3.2, insuranceType: "employee", existingFinancialIncome: 30_000_000, marginalRatePct: 45 },
    periods: [
      [9_700_000, 107_200_000, 29_480_000, 23_584_000, 8_720_465, 71_484_465, 670_000_000],
      [9_700_000, 214_400_000, 58_960_000, 47_168_000, 17_440_930, 133_268_930, 670_000_000],
      [9_700_000, 321_600_000, 88_440_000, 70_752_000, 26_161_395, 195_053_395, 670_000_000],
    ],
    years: [[670_000_000, 21_440_000, 5_896_000, 4_716_800, 1_744_093], [670_000_000, 21_440_000, 5_896_000, 4_716_800, 1_744_093], [670_000_000, 21_440_000, 5_896_000, 4_716_800, 1_744_093]],
  },
  {
    name: "D", input: { ...base, gift: 150_000_000, ratePct: 3.2, insuranceType: "employee", existingFinancialIncome: 30_000_000, marginalRatePct: 45, monthlyPrincipal: 1_500_000 },
    periods: [
      [9_700_000, 100_120_000, 27_533_000, 22_026_400, 8_144_526, 67_403_926, 580_000_000],
      [9_700_000, 185_840_000, 51_106_000, 40_884_800, 15_117_645, 116_808_445, 490_000_000],
      [9_700_000, 257_160_000, 70_719_000, 56_575_200, 20_919_358, 157_913_558, 400_000_000],
    ],
    years: [[670_000_000, 21_176_000, 5_823_400, 4_658_720, 1_722_618], [652_000_000, 20_600_000, 5_665_000, 4_532_000, 1_675_761], [634_000_000, 20_024_000, 5_506_600, 4_405_280, 1_628_905]],
  },
  {
    name: "E", input: { ...base, gift: 603_000_000, ratePct: 0 },
    periods: [
      [102_723_000, 0, 0, 0, 0, 102_723_000, 217_000_000],
      [102_723_000, 0, 0, 0, 0, 102_723_000, 217_000_000],
      [102_723_000, 0, 0, 0, 0, 102_723_000, 217_000_000],
    ],
    years: [[217_000_000, 0, 0, 0, 0], [217_000_000, 0, 0, 0, 0], [217_000_000, 0, 0, 0, 0]],
  },
];

for (const c of cases) {
  const r = calculateMix(c.input, s);
  console.log(`\n== 예시 ${c.name}`);
  c.periods.forEach((want, i) => {
    const p = r.periods[i];
    const tag = `${c.name} ${p.years}년`;
    eq(`${tag} 증여세`, p.giftTax, want[0]);
    eq(`${tag} 이자 합계`, p.interest, want[1]);
    eq(`${tag} 뗀 세금`, p.withholding, want[2]);
    eq(`${tag} 종합소득세 추가`, p.incomeTaxExtra, want[3]);
    eq(`${tag} 건강보험료`, p.insuranceExtra, want[4]);
    eq(`${tag} 합계`, p.total, want[5]);
    eq(`${tag} 남은 원금`, p.remainingPrincipal, want[6]);
  });
  c.years.forEach((want, i) => {
    const y = r.years[i];
    const tag = `${c.name} ${y.year}년차`;
    eq(`${tag} 기초잔액`, y.startBalance, want[0]);
    eq(`${tag} 이자`, y.interest, want[1]);
    eq(`${tag} 뗀 세금`, y.withholding, want[2]);
    eq(`${tag} 추가`, y.incomeTaxExtra, want[3]);
    eq(`${tag} 보험`, y.insuranceExtra, want[4]);
  });
}

console.log("\n== 자동으로 구하는 값");
const r4 = (v: number) => Math.round(v * 10000);
eq("최저 이자율 8.2억 (×10000)", r4(minRatePctExact(820_000_000, s)), 33805);
eq("최저 이자율 7.7억 (×10000)", r4(minRatePctExact(770_000_000, s)), 33013);
eq("최저 이자율 6.7억 (×10000)", r4(minRatePctExact(670_000_000, s)), 31075);
eq("권장 이자율 6.7억 (×100)", Math.round(recommendedRatePct(670_000_000, s) * 100), 311);
eq("무이자 한도", interestFreeLimit(s), 217_391_304);

console.log("\n== 추천 설정 (명세에 없는 점검)");
for (const c of [base, { ...base, insuranceType: "employee" as const, existingFinancialIncome: 30_000_000, marginalRatePct: 45, monthlyPrincipal: 1_500_000 }]) {
  const rec = recommendMix(c, s);
  const sc = mixScenarios(c, s, true);
  rec.forEach((x, k) => {
    console.log(`참고 ${x.years}년 : 증여 ${x.gift.toLocaleString("ko-KR")}원, 차용 ${x.loan.toLocaleString("ko-KR")}원, 연 ${x.ratePct}%, 합계 ${x.total.toLocaleString("ko-KR")}원`);
    eq(`${x.years}년 추천 증여 금액이 천만 원 단위인지`, x.gift % 10_000_000 === 0 || x.gift === c.total ? 1 : 0, 1);
    eq(`${x.years}년 추천 합계가 전액 차용·전액 증여보다 크지 않은지`, x.total <= x.allLoanTotal && x.total <= x.allGiftTotal ? 1 : 0, 1);
    eq(`${x.years}년 전액 차용 합계가 비교표와 같은지`, x.allLoanTotal, sc[0].result.periods[k].total);
    eq(`${x.years}년 추천을 다시 계산하면 같은 합계인지`, calculateMix({ ...c, gift: x.gift, ratePct: x.ratePct }, s).periods[k].total, x.total);
  });
}

console.log(`\n결과 : 통과 ${pass}건, 실패 ${fail}건`);
if (fail > 0) process.exit(1);

// 증여세·증여 취득세 검증 — 실행: node test-gift.ts
import { calculateGiftTax, giftReportDeadline, installmentAmountWon, type GiftTaxInput } from "./src/lib/inheritGiftTaxCalc.ts";
import { calculateAcquisitionTax, type AcquisitionTaxInput } from "./src/lib/acquisitionTaxCalc.ts";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  console.log(`${c ? "✅" : "❌"} ${n}${d ? " — " + d : ""}`);
};
const base: GiftTaxInput = { giftAmount: 0, relation: "linealAdult", priorGifts10yr: 0, debtAssumption: 0, generationSkip: false, isMinorOver20: false };
const g = (o: Partial<GiftTaxInput>) => calculateGiftTax({ ...base, ...o });
const line = (r: ReturnType<typeof g>, k: string) => r.lines.find((l) => l.key === k)?.won;

// 1. 부동산계산기.com 동일 사례: 직계존속→성년 5억 → 과표 4.5억, 산출 8,000만, 신고공제 240만, 7,760만
{
  const r = g({ giftAmount: 50000 });
  ok("1-5억: 과세표준 450,000,000", line(r, "taxable") === 450_000_000, `${line(r, "taxable")}`);
  ok("1-5억: 산출세액 80,000,000", line(r, "computed") === 80_000_000);
  ok("1-5억: 신고세액공제 2,400,000", line(r, "report") === 2_400_000);
  ok("1-5억: 납부 77,600,000", r.finalTaxWon === 77_600_000, `${r.finalTaxWon}`);
}
// 2. 혼인·출산 공제
{
  const r1 = g({ giftAmount: 15000, marriage: true });
  ok("2-혼인 1.5억: 0원 (5천 + 1억)", r1.finalTaxWon === 0 && line(r1, "mb") === 100_000_000, `${r1.finalTaxWon} mb ${line(r1, "mb")}`);
  const r2 = g({ giftAmount: 20000, marriage: true });
  ok("2-혼인 2억: 과표 5천 → 500만 − 15만 = 4,850,000", r2.finalTaxWon === 4_850_000, `${r2.finalTaxWon}`);
  const r3 = g({ giftAmount: 20000, marriage: true, relation: "spouse" });
  ok("2-배우자는 혼인공제 대상 아님 (행 없음, 6억 공제로 0원)", r3.finalTaxWon === 0 && line(r3, "mb") === undefined);
  const r4 = g({ giftAmount: 8000, marriage: true });
  ok("2-혼인 8천: 공제는 남은 3천만만 사용", line(r4, "mb") === 30_000_000 && r4.finalTaxWon === 0, `${line(r4, "mb")}`);
}
// 3. 감정평가수수료 500만 한도, 비과세
{
  const r = g({ giftAmount: 50000, appraisalFee: 800 });
  ok("3-수수료 800만 → 500만 적용", line(r, "fee") === 5_000_000 && line(r, "taxable") === 445_000_000, `${line(r, "fee")} ${line(r, "taxable")}`);
  const r2 = g({ giftAmount: 50000, nonTaxable: 1000 });
  ok("3-비과세 1천만 → 과세가액 4.9억", line(r2, "base") === 490_000_000);
}
// 4. 부담부증여 — 채무 2억 → 과세가액 3억
{
  const r = g({ giftAmount: 50000, debtAssumption: 20000 });
  ok("4-부담부: 과세가액 3억 · 과표 2.5억", line(r, "base") === 300_000_000 && line(r, "taxable") === 250_000_000);
}
// 5. 10년 사전증여 — 기존 2억 + 이번 3억: 합산 과표 4.5억 → 8,000만 − 기납부 2,000만 = 6,000만 × 0.97
{
  const r = g({ giftAmount: 30000, priorGifts10yr: 20000 });
  ok("5-사전증여 자동: 기납부 20,000,000 · 납부 58,200,000", line(r, "priorCredit") === 20_000_000 && r.finalTaxWon === 58_200_000, `${line(r, "priorCredit")} ${r.finalTaxWon}`);
  const r2 = g({ giftAmount: 30000, priorGifts10yr: 20000, priorGiftTaxPaid: 1800 });
  ok("5-기납부 1,800만 직접 입력 → 60,140,000", r2.finalTaxWon === 60_140_000, `${r2.finalTaxWon}`);
}
// 6. 요청서 2번 — 할아버지께 1억(공제 소진) 후 아버지께 1억: 합산 없음, 공제 0 → 970만
{
  const r = g({ giftAmount: 10000, otherExemptionUsed: 5000 });
  ok("6-다른 직계존속 공제 소진: 9,700,000", r.finalTaxWon === 9_700_000, `${r.finalTaxWon}`);
  const r2 = g({ giftAmount: 10000, priorGifts10yr: 10000 });
  ok("6-같은 분(아버지) 1억 후 1억: 14,550,000 (기존과 동일)", r2.finalTaxWon === 14_550_000, `${r2.finalTaxWon}`);
  const r3 = g({ giftAmount: 15000, marriage: true, marriageBirthUsed: 5000 });
  ok("6-혼인공제 이미 5천 사용 → 1.5억: 공제 5천+5천, 과표 5천 → 4,850,000", r3.finalTaxWon === 4_850_000, `${r3.finalTaxWon}`);
  const r4 = g({ giftAmount: 15000, birth: true });
  ok("6-출산만 체크해도 1억 공제, 라벨 '출산 공제'", r4.finalTaxWon === 0 && r4.lines.some((l) => l.label === "출산 공제"));
}
// 6b. 요청서 7·8번 검산 — 역산(자녀 손에 X) · 실효세율용 금액
{
  const a = g({ giftAmount: 10000, taxPaidByDonor: true });
  ok("6b-1억 손에 → 세금 537만 (총 1억 537만)", Math.round(a.finalTaxWon / 10000) === 537 && Math.round((a.giftAmount * 10000) / 10000) === 10537, `${a.finalTaxWon} ${a.giftAmount}`);
  const b = g({ giftAmount: 30000, taxPaidByDonor: true });
  ok("6b-3억 손에 → 세금 4,814만 (총 3억 4,814만)", Math.round(b.finalTaxWon / 10000) === 4814 && Math.round(b.giftAmount) === 34814, `${b.finalTaxWon} ${b.giftAmount}`);
  ok("6b-1억 485만 · 3억 3,880만 · 5억 7,760만 · 10억 2억 1,825만",
    g({ giftAmount: 10000 }).finalTaxWon === 4_850_000 && g({ giftAmount: 30000 }).finalTaxWon === 38_800_000 &&
    g({ giftAmount: 50000 }).finalTaxWon === 77_600_000 && g({ giftAmount: 100000 }).finalTaxWon === 218_250_000);
}
// 7. 세대생략 30% / 미성년 20억 초과 40%
{
  const r = g({ giftAmount: 30000, generationSkip: true });
  ok("7-세대생략 30%: 4,000만 + 1,200만 → ×0.97 = 50,440,000", r.finalTaxWon === 50_440_000, `${r.finalTaxWon}`);
  const r2 = g({ giftAmount: 250000, relation: "linealMinor", generationSkip: true, isMinorOver20: true });
  ok("7-미성년 20억 초과 40% 할증", line(r2, "surcharge") === Math.floor((line(r2, "computed") ?? 0) * 0.4), `${line(r2, "surcharge")}`);
}
// 8. 세금 대납 — T = f(증여 + T)
{
  const r = g({ giftAmount: 30000, taxPaidByDonor: true });
  const check = g({ giftAmount: 30000 + r.finalTaxWon / 10000 });
  ok("8-대납 수렴", Math.abs(check.finalTaxWon - r.finalTaxWon) <= 1, `${r.finalTaxWon} vs ${check.finalTaxWon}`);
  ok("8-증여재산가액에 대납세액 포함", line(r, "gift") === 300_000_000 + r.finalTaxWon && r.paidByDonorWon === r.finalTaxWon, `${line(r, "gift")}`);
  ok("8-대납 세액 > 일반 세액", r.finalTaxWon > g({ giftAmount: 30000 }).finalTaxWon);
}
// 9. 신고기한·분납
{
  const d1 = giftReportDeadline("2026-10-29");
  ok("9-2026-10-29 → 법정 2027-01-31(일) → 2027-02-01", d1?.base === "2027-01-31" && d1?.due === "2027-02-01", JSON.stringify(d1));
  const d2 = giftReportDeadline("2026-11-15");
  ok("9-2026-11-15 → 법정 2027-02-28(일) → 3/1 공휴일 → 2027-03-02", d2?.base === "2027-02-28" && d2?.due === "2027-03-02", JSON.stringify(d2));
  const d3 = giftReportDeadline("2026-01-15");
  ok("9-2026-01-15 → 2026-04-30(목)", d3?.base === "2026-04-30" && d3?.due === "2026-04-30", JSON.stringify(d3));
  ok("9-분납 1,500만→500만 / 7,760만→3,880만 / 900만→0", installmentAmountWon(15_000_000) === 5_000_000 && installmentAmountWon(77_600_000) === 38_800_000 && installmentAmountWon(9_000_000) === 0);
}
// 10. 취득세 — 지방교육세 법정 공식 · 증여 12% 중과
{
  const a: AcquisitionTaxInput = { propertyType: "house", acquisitionType: "gift", price: 50000, houseCount: "1", isAdjustedArea: false, areaOver85: true, isFirstHome: false };
  const t = (o: Partial<AcquisitionTaxInput>) => calculateAcquisitionTax({ ...a, ...o });
  const g1 = t({});
  ok("10-주택 증여 85초과 4.0%", g1.localEduTaxRate === 0.3 && g1.totalRate === 4, `${g1.localEduTaxRate} ${g1.totalRate}`);
  ok("10-주택 증여 85이하 3.8%", t({ areaOver85: false }).totalRate === 3.8, `${t({ areaOver85: false }).totalRate}`);
  const h = t({ isAdjustedArea: true, standardPriceOver3: true });
  ok("10-조정·3억 이상 증여 13.4%", h.acquisitionTaxRate === 12 && h.totalRate === 13.4, `${h.totalRate} ${h.rateDescription}`);
  ok("10-1세대1주택자→가족 증여 중과 제외", t({ isAdjustedArea: true, standardPriceOver3: true, donorSingleHomeToFamily: true }).acquisitionTaxRate === 3.5);
  ok("10-조정 3억 미만 3.5%", t({ isAdjustedArea: true, standardPriceOver3: false }).acquisitionTaxRate === 3.5);
  const inh = t({ acquisitionType: "inheritance" });
  ok("10-주택 상속 3.16%", inh.localEduTaxRate === 0.16 && inh.totalRate === 3.16, `${inh.localEduTaxRate} ${inh.totalRate}`);
  ok("10-농지 매매 3.4%", t({ propertyType: "farmland", acquisitionType: "purchase" }).totalRate === 3.4, `${t({ propertyType: "farmland", acquisitionType: "purchase" }).totalRate}`);
  ok("10-농지 상속 2.56%", t({ propertyType: "farmland", acquisitionType: "inheritance" }).totalRate === 2.56, `${t({ propertyType: "farmland", acquisitionType: "inheritance" }).totalRate}`);
  ok("10-토지 매매 4.6% (불변)", t({ propertyType: "land", acquisitionType: "purchase" }).totalRate === 4.6);
  ok("10-1주택 매매 5억 85이하 1.1% (불변)", t({ acquisitionType: "purchase", areaOver85: false }).totalRate === 1.1);
  ok("10-3주택 조정 매매 13.4% (불변)", t({ acquisitionType: "purchase", houseCount: "3", isAdjustedArea: true }).totalRate === 13.4);
}

console.log(`\n통과 ${pass} / 실패 ${fail}`);
process.exit(fail ? 1 : 0);

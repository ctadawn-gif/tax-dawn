"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateHoldingTax,
  type HoldingTaxInput,
  type YearMode,
  type Household,
} from "@/lib/holdingTaxCalc";
import PrintButton, { PrintHeader } from "@/components/PrintButton";
import { formatNumberInput, parseNumberInput } from "@/lib/formatInput";

const fmtWon = (manwon: number) => Math.round(manwon * 10000).toLocaleString("ko-KR");
const MODES: YearMode[] = ["2026", "2027", "2028"];
const MODE_LABEL: Record<YearMode, string> = {
  "2026": "현행 ('26)",
  "2027": "'27년",
  "2028": "'28년~",
};

export default function HoldingTaxCalculator() {
  const [household, setHousehold] = useState<Household>("single");
  const [price, setPrice] = useState<number | string>("");
  const [houseCount, setHouseCount] = useState<2 | 3>(2); // 다주택일 때만
  const [residentPrice, setResidentPrice] = useState<number | string>("");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [isResident, setIsResident] = useState(true);
  const [age, setAge] = useState<number | string>("");
  const [hold, setHold] = useState<number | string>("");
  const [reside, setReside] = useState<number | string>("");
  const [prevTax, setPrevTax] = useState<number | string>("");
  const [detailMode, setDetailMode] = useState<YearMode>("2028");

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const buildInput = (mode: YearMode): HoldingTaxInput => ({
    yearMode: mode,
    publicPrice: n(price),
    household,
    houseCount: household === "single" ? 1 : houseCount,
    reinforced: household === "multi" && (houseCount === 3 || isAdjusted),
    isResident: household === "single" ? isResident : true,
    residentHousePrice: n(residentPrice),
    age: n(age),
    holdYears: n(hold),
    resideYears: household === "single" ? (isResident ? n(reside) : 0) : 0,
    prevYearHoldingTax: n(prevTax),
  });

  const results = useMemo(
    () => Object.fromEntries(MODES.map((m) => [m, calculateHoldingTax(buildInput(m))])) as Record<
      YearMode,
      ReturnType<typeof calculateHoldingTax>
    >,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [household, price, houseCount, residentPrice, isAdjusted, isResident, age, hold, reside, prevTax]
  );

  const detail = results[detailMode];
  const hasInput = n(price) > 0;

  const inputCls =
    "w-full pl-4 pr-14 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-lg";
  const Suffix = ({ t }: { t: string }) => (
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-bold">{t}</span>
  );

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid hidden md:block" />

      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between h-[48px] px-5 bg-white border-b border-slate-100">
        <Link href="/" className="no-underline text-[14px] font-medium text-slate-800 tracking-tight">세무회계 새벽</Link>
        <Link href="/contact" className="no-underline px-3 py-1.5 rounded-lg bg-brand-blue text-white text-[12px] font-bold tracking-tight">무료 상담하기 →</Link>
      </header>

      <section className="md:hidden bg-gradient-to-b from-blue-50/60 to-white pt-8 pb-10 px-5 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-brand-blue rounded-full text-[13px] font-semibold tracking-tight mb-5"><span>🏠</span><span className="pt-[1px]">보유세 계산기</span></div>
        <h1 className="text-[28px] font-extrabold text-slate-900 leading-[1.25] tracking-tight mb-3.5">보유세 계산기</h1>
        <p className="text-[15px] font-medium text-slate-500 leading-[1.5] tracking-tight">재산세·종합부동산세를 합산해<br />현행과 2026 개편안(정부안)을 비교합니다.</p>
      </section>

      <nav className="hidden md:flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors shadow-sm flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>톡톡 문의하기</a>
      </nav>

      <section className="relative pt-10 pb-32 px-5 md:px-6 overflow-hidden">
        <div className="max-w-[1000px] w-full mx-auto relative z-10">
          <div className="hidden md:block text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">무료 세금 계산기</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">보유세 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">재산세·종합부동산세를 합산해, 현행과 2026 개편안(정부안)을 연도별로 비교합니다.</p>
          </div>

          {/* 정부안 고지 */}
          <div className="no-print max-w-[700px] mx-auto mb-6 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-[13px] text-amber-800 leading-relaxed">
            <span className="text-[15px]">⚠️</span>
            <p><b>2026 세제개편안(정부안) 기준</b>입니다. 국회 통과 전이라 확정 시 세율·공제 등이 달라질 수 있으며, 결과는 <b>참고용</b>입니다. ‘27·‘28 수치는 개편안이 그대로 시행된다는 가정입니다.</p>
          </div>

          {/* 입력 */}
          <div className="no-print max-w-[700px] mx-auto mb-10">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="space-y-7">
                {/* 세대 구분 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-3">보유 형태</label>
                  <div className="flex p-1 bg-ui-surface rounded-xl border border-ui-border">
                    {([["single", "1세대 1주택"], ["multi", "다주택"]] as [Household, string][]).map(([k, l]) => (
                      <button key={k} onClick={() => setHousehold(k)} className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${household === k ? "bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-text-secondary"}`}>{l}</button>
                    ))}
                  </div>
                </div>

                {/* 공시가격 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">
                    공시가격 {household === "multi" && <span className="text-brand-blue">(보유 주택 합산)</span>}
                    <span className="text-slate-400 font-normal"> · 인별</span>
                  </label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={formatNumberInput(price)} onChange={(e) => setPrice(parseNumberInput(e.target.value))} placeholder="0" className={inputCls} />
                    <Suffix t="만원" />
                  </div>
                  {hasInput && <p className="mt-1.5 text-[12px] text-text-secondary text-right">= {fmtWon(n(price))}원</p>}
                </div>

                {household === "multi" ? (
                  <>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-3">주택 수</label>
                      <div className="grid grid-cols-2 gap-2">
                        {([[2, "2주택"], [3, "3주택 이상"]] as [2 | 3, string][]).map(([k, l]) => (
                          <button key={k} onClick={() => setHouseCount(k)} className={`py-3 rounded-xl border text-[14px] font-bold transition-all shadow-sm ${houseCount === k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border bg-white text-text-secondary"}`}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">거주 주택 공시가격 <span className="text-slate-400 font-normal">· 개편 공제 배분용</span></label>
                      <div className="relative">
                        <input type="text" inputMode="numeric" value={formatNumberInput(residentPrice)} onChange={(e) => setResidentPrice(parseNumberInput(e.target.value))} placeholder="0" className={inputCls} />
                        <Suffix t="만원" />
                      </div>
                    </div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex flex-col"><span className="text-[15px] font-bold text-text-primary">조정대상지역 주택 보유</span><span className="text-[12px] text-text-secondary">‘28년 공정시장가액비율 80% 강화 그룹</span></div>
                      <button onClick={() => setIsAdjusted(!isAdjusted)} className={`relative inline-block w-11 h-6 rounded-full transition-colors ${isAdjusted ? "bg-brand-blue" : "bg-slate-300"}`}><div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all ${isAdjusted ? "left-[22px]" : "left-[2px]"}`} /></button>
                    </label>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-3">거주 여부</label>
                      <div className="flex p-1 bg-ui-surface rounded-xl border border-ui-border">
                        {([[true, "거주"], [false, "비거주"]] as [boolean, string][]).map(([k, l]) => (
                          <button key={l} onClick={() => setIsResident(k)} className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${isResident === k ? "bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-text-secondary"}`}>{l}</button>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[12px] text-text-secondary">개편 후 기본공제: 거주 14억 / 비거주 9억 (현행 12억)</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[13px] font-bold text-text-secondary mb-2">연령</label>
                        <div className="relative"><input type="text" inputMode="numeric" value={age} onChange={(e) => setAge(parseNumberInput(e.target.value))} placeholder="0" className={inputCls.replace("pr-14", "pr-8")} /><Suffix t="세" /></div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-text-secondary mb-2">보유기간</label>
                        <div className="relative"><input type="text" inputMode="numeric" value={hold} onChange={(e) => setHold(parseNumberInput(e.target.value))} placeholder="0" className={inputCls.replace("pr-14", "pr-8")} /><Suffix t="년" /></div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-text-secondary mb-2">거주기간</label>
                        <div className="relative"><input type="text" inputMode="numeric" value={reside} onChange={(e) => setReside(parseNumberInput(e.target.value))} placeholder="0" className={inputCls.replace("pr-14", "pr-8")} disabled={!isResident} /><Suffix t="년" /></div>
                      </div>
                    </div>
                    <p className="text-[12px] text-text-secondary -mt-3">※ 연령(60/65/70세)·보유·거주기간에 따라 종부세 세액공제(최대 80%). 개편 시 거주 중심으로 전환·한도(‘27 800만·‘28 600만).</p>
                  </>
                )}

                {/* 직전연도 보유세 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">직전연도 보유세 <span className="text-slate-400 font-normal">· 선택 (세부담상한 계산)</span></label>
                  <div className="relative"><input type="text" inputMode="numeric" value={formatNumberInput(prevTax)} onChange={(e) => setPrevTax(parseNumberInput(e.target.value))} placeholder="0" className={inputCls} /><Suffix t="만원" /></div>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 */}
          <div className="print-area bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue no-print" />
            <PrintHeader title="보유세 예상 계산 결과 (2026 개편안·정부안)" />
            <div className="mx-6 md:mx-8 mt-5 mb-3 flex items-center justify-between gap-3">
              <h4 className="text-base md:text-lg font-bold text-text-primary">연도별 보유세 비교</h4>
              <PrintButton />
            </div>
            <div className="mx-6 md:mx-8 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><span>⚠️</span><span>2026 세제개편안(정부안) 기준·국회 통과 전이라 확정 시 변동 가능. 참고용이며 세무회계 새벽은 결과에 법적 책임을 지지 않습니다.</span></div>

            <div className="px-6 md:px-8 pb-8">
              {/* 연도 비교 3카드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {MODES.map((m) => {
                  const r = results[m];
                  const active = m === detailMode;
                  return (
                    <button key={m} onClick={() => setDetailMode(m)} className={`text-left rounded-2xl p-5 border transition-all ${active ? "border-brand-blue bg-blue-50/50 ring-1 ring-brand-blue" : "border-slate-200 bg-white hover:border-brand-blue/40"}`}>
                      <div className="flex items-center justify-between mb-2"><span className="text-[13px] font-bold text-text-secondary">{MODE_LABEL[m]} 보유세</span>{active && <span className="text-[10px] font-bold text-brand-blue">상세 ▼</span>}</div>
                      <div className="flex items-baseline gap-1 text-text-primary"><span className="text-[24px] font-extrabold tracking-tight">{fmtWon(r.holdingTaxTotal)}</span><span className="text-[13px] font-bold">원</span></div>
                      <div className="mt-2 text-[12px] text-text-secondary">종부세 {fmtWon(r.jongbuTotal)}원 · 재산세 {fmtWon(r.propertyTaxTotal)}원</div>
                    </button>
                  );
                })}
              </div>

              {/* 선택 모드 상세 */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-200">
                  <span className="text-[14px] font-extrabold text-text-primary">{MODE_LABEL[detailMode]} 상세</span>
                  <span className="text-[12px] text-text-secondary">공시 {hasInput ? fmtWon(n(price)) + "원" : "-"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  {/* 재산세 */}
                  <div className="p-5">
                    <div className="text-[13px] font-bold text-brand-blue mb-3">재산세</div>
                    <Row l="본세" v={detail.propertyTax} />
                    <Row l="도시지역분" v={detail.urbanAreaTax} />
                    <Row l="지방교육세" v={detail.localEduTax} />
                    <div className="h-px bg-slate-100 my-2" />
                    <Row l="재산세 합계" v={detail.propertyTaxTotal} bold />
                  </div>
                  {/* 종부세 */}
                  <div className="p-5">
                    <div className="text-[13px] font-bold text-brand-blue mb-3">종합부동산세</div>
                    <Row l="산출세액" v={detail.jongbuGross} />
                    <Row l="− 재산세 공제" v={-detail.propertyTaxCredit} />
                    {detail.taxCredit > 0 && <Row l={`− 세액공제 (${Math.round(detail.taxCreditRate * 100)}%)`} v={-detail.taxCredit} />}
                    <Row l="농어촌특별세" v={detail.ruralTax} />
                    <div className="h-px bg-slate-100 my-2" />
                    <Row l="종부세 합계" v={detail.jongbuTotal} bold />
                    {detail.burdenCapApplied && <p className="mt-2 text-[11px] text-amber-600 font-bold">※ 세부담상한 적용됨</p>}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-brand-navy to-[#0f172a] px-6 py-5 flex items-center justify-between text-white">
                  <span className="text-blue-200 text-[14px] font-bold">{MODE_LABEL[detailMode]} 보유세 합계</span>
                  <div className="flex items-baseline gap-1.5"><span className="text-[28px] lg:text-[32px] font-extrabold tracking-tight">{fmtWon(detail.holdingTaxTotal)}</span><span className="text-blue-100 font-bold">원</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mt-8 mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3">알아두세요 (참고사항)</h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li><b className="text-text-primary">보유세 = 재산세 + 종합부동산세</b>(농어촌특별세 포함). 종부세는 인별 공시가격 합산 기준입니다.</li>
              <li><b className="text-text-primary">2026 개편안 핵심:</b> 1세대1주택 기본공제 12억 → 거주 14억/비거주 9억, 공정시장가액비율 60→70(~80)%, 세율 인상, 세액공제 거주 중심 전환·금액한도(‘27 800만·‘28 600만).</li>
              <li>재산세는 이번 개편안 대상이 아니며 현행 기준으로 계산합니다(1세대1주택 공정시장가액비율 43~45% 특례 반영).</li>
              <li>다주택·공동명의·상속주택·일시적 2주택 등 특례는 단순화되어 있어 실제와 차이가 클 수 있습니다. 세부담상한(전년 대비 ‘26 150%→‘27~ 200%)은 직전연도 보유세를 입력해야 반영됩니다.</li>
              <li>본 결과는 <b className="text-text-primary">국회 통과 전 정부안</b> 기준의 개략적 예상치입니다. 정확한 세액은 반드시 세무 전문가와 상담하세요.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">종부세·보유세 절세, 공동명의·세액공제 판단이 궁금하시면 편하게 연락주세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
              <Link href="/contact" className="flex-1 px-6 py-3.5 bg-brand-blue text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors text-center no-underline">무료 상담 신청하기</Link>
              <a href="https://blog.naver.com/tax_dawn" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3.5 bg-white text-text-primary border-2 border-ui-border rounded-xl text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors text-center">블로그에서 보기</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-[13px] ${bold ? "font-bold text-text-primary" : "text-text-secondary"}`}>{l}</span>
      <span className={`text-[13px] ${bold ? "font-extrabold text-text-primary" : "font-semibold text-text-primary"}`}>
        {Math.round(v * 10000).toLocaleString("ko-KR")}원
      </span>
    </div>
  );
}

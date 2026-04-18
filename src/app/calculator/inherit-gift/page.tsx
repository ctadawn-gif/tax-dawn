"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateInheritanceTax,
  calculateGiftTax,
  GIFT_RELATION_LABELS,
  type GiftRelation,
} from "@/lib/inheritGiftTaxCalc";

const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");

function Counter({ label, sub, value, onChange }: { label: string; sub?: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-ui-surface rounded-xl border border-transparent focus-within:border-brand-blue focus-within:bg-white transition-colors">
      <label className="text-[14px] font-bold text-text-secondary">
        {label}
        {sub && <span className="text-xs font-normal text-slate-400 block mt-0.5">{sub}</span>}
      </label>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <span className="font-bold text-text-primary w-4 text-center">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </div>
    </div>
  );
}

const ArrowIcon = () => (
  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
);
const CrossIcon = () => (
  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

type Tab = "inheritance" | "gift";

export default function InheritGiftCalculator() {
  const [tab, setTab] = useState<Tab>("inheritance");

  // 상속세 입력
  const [inhAssets, setInhAssets] = useState<number | string>("");
  const [inhDebts, setInhDebts] = useState<number | string>("");
  const [inhSpouse, setInhSpouse] = useState(true);
  const [inhSpouseAmount, setInhSpouseAmount] = useState<number | string>("");
  const [inhChildren, setInhChildren] = useState(0);
  const [inhMinor, setInhMinor] = useState(0);
  const [inhMinorYears, setInhMinorYears] = useState<number | string>("");
  const [inhElderly, setInhElderly] = useState(0);
  const [inhPriorGifts, setInhPriorGifts] = useState<number | string>("");
  const [inhGenSkip, setInhGenSkip] = useState(false);

  // 증여세 입력
  const [giftAmount, setGiftAmount] = useState<number | string>("");
  const [giftRelation, setGiftRelation] = useState<GiftRelation>("linealAdult");
  const [giftDebt, setGiftDebt] = useState<number | string>("");
  const [giftPrior, setGiftPrior] = useState<number | string>("");
  const [giftGenSkip, setGiftGenSkip] = useState(false);
  const [giftMinorOver20, setGiftMinorOver20] = useState(false);

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const inhResult = useMemo(() => calculateInheritanceTax({
    totalAssets: n(inhAssets), debtsAndExpenses: n(inhDebts), hasSpouse: inhSpouse,
    spouseInheritance: n(inhSpouseAmount), children: inhChildren, minorChildren: inhMinor,
    minorRemainingYears: n(inhMinorYears), elderlyCount: inhElderly,
    priorGiftsToHeir: n(inhPriorGifts), priorGiftsToSpouse: 0, generationSkip: inhGenSkip,
  }), [inhAssets, inhDebts, inhSpouse, inhSpouseAmount, inhChildren, inhMinor, inhMinorYears, inhElderly, inhPriorGifts, inhGenSkip]);

  const giftResult = useMemo(() => calculateGiftTax({
    giftAmount: n(giftAmount), relation: giftRelation, priorGifts10yr: n(giftPrior),
    debtAssumption: n(giftDebt), generationSkip: giftGenSkip, isMinorOver20: giftMinorOver20,
  }), [giftAmount, giftRelation, giftDebt, giftPrior, giftGenSkip, giftMinorOver20]);

  const relations: { k: GiftRelation; l: string; sub?: string }[] = [
    { k: "spouse", l: "배우자 (6억)" },
    { k: "linealAdult", l: "직계존속", sub: "→ 성년자녀 (5천만)" },
    { k: "linealMinor", l: "직계존속", sub: "→ 미성년자녀 (2천만)" },
    { k: "linealAscendant", l: "자녀 → 부모 (5천만)" },
    { k: "otherRelative", l: "기타 친족 (1천만)", sub: "4촌 혈족 · 3촌 인척" },
    { k: "other", l: "기타 (0)" },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid" />

      <nav className="flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors shadow-sm flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>톡톡 문의하기</a>
      </nav>

      <section className="relative pt-12 pb-32 px-6 overflow-hidden">
        <div className="max-w-[1200px] w-full mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">무료 세금 계산기</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">상속·증여세 간편 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">상속세와 증여세 예상 세액을 간편하게 확인해보세요</p>
          </div>

          {/* 탭 */}
          <div className="bg-white rounded-2xl p-4 md:px-8 md:py-5 border border-ui-border shadow-sm flex justify-center items-center mb-12">
            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-[400px]">
              {(["inheritance", "gift"] as Tab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all ${tab === t ? "bg-white shadow-sm font-bold text-brand-blue" : "font-medium text-text-secondary hover:text-text-primary"}`}>
                  {t === "inheritance" ? "상속세" : "증여세"}
                </button>
              ))}
            </div>
          </div>

          {/* ========== 상속세 탭 ========== */}
          {tab === "inheritance" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* 상속재산 카드 */}
                <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">상속재산</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">총 상속재산가액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={inhAssets} onChange={(e) => setInhAssets(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">채무·공과금·장례비용</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={inhDebts} onChange={(e) => setInhDebts(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-ui-surface rounded-xl">
                      <span className="text-[14px] font-bold text-text-secondary">배우자 유무</span>
                      <button onClick={() => setInhSpouse(!inhSpouse)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${inhSpouse ? "bg-brand-blue" : "bg-slate-200"}`}>
                        <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${inhSpouse ? "left-[26px]" : "left-[2px]"}`} />
                      </button>
                    </div>
                    {inhSpouse && (
                      <div className="pl-4 border-l-2 border-blue-100">
                        <label className="block text-[14px] font-bold text-text-secondary mb-2">배우자 실제 상속금액 <span className="text-xs font-normal text-slate-400 ml-1">(배우자 생존 시)</span></label>
                        <div className="relative">
                          <input type="number" inputMode="numeric" value={inhSpouseAmount} onChange={(e) => setInhSpouseAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="미입력 시 최소 5억 적용" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px] placeholder-slate-400" />
                          <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                        </div>
                      </div>
                    )}
                    <Counter label="자녀 수" value={inhChildren} onChange={setInhChildren} />
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">10년 내 사전증여 합산액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={inhPriorGifts} onChange={(e) => setInhPriorGifts(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 추가 공제 카드 */}
                <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">추가 공제</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-2 items-start">
                      <svg className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                      <p className="text-xs leading-relaxed text-brand-blue font-medium">
                        기초공제(2억) + 인적공제 합산이 일괄공제(5억)보다 큰 경우에만 인적공제가 적용됩니다. 일반적으로는 일괄공제(5억)가 유리하며, 자녀가 많거나 미성년자 잔여연수가 긴 경우 인적공제가 유리할 수 있습니다.
                      </p>
                    </div>
                    <Counter label="미성년 자녀 수" value={inhMinor} onChange={setInhMinor} />
                    {inhMinor > 0 && (
                      <div className="pl-4 border-l-2 border-blue-100">
                        <label className="block text-[14px] font-bold text-text-secondary mb-2">미성년자 평균 잔여연수 <span className="text-xs font-normal text-slate-400 ml-1">(19세까지)</span></label>
                        <div className="relative">
                          <input type="number" inputMode="numeric" value={inhMinorYears} onChange={(e) => setInhMinorYears(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                          <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">년</span>
                        </div>
                      </div>
                    )}
                    <Counter label="연로자 (65세 이상) 수" value={inhElderly} onChange={setInhElderly} />
                    <div className="flex items-center justify-between p-4 bg-ui-surface rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-text-secondary">세대생략 상속</span>
                        <span className="text-[12px] text-slate-400 mt-0.5">자녀를 건너뛰고 손자녀에게 상속 (30% 할증)</span>
                      </div>
                      <button onClick={() => setInhGenSkip(!inhGenSkip)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 shrink-0 ml-4 ${inhGenSkip ? "bg-brand-blue" : "bg-slate-200"}`}>
                        <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${inhGenSkip ? "left-[26px]" : "left-[2px]"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상속세 결과 */}
              <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden mt-12 mb-12 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>
                <div className="bg-slate-50/80 p-6 md:p-8 border-b border-ui-border">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-center w-full mx-auto">
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">총상속재산</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-slate-200 pb-1">{fmt(inhResult.totalAssets)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">채무차감</span><span className="text-sm md:text-base font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(inhResult.debtsAndExpenses)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-bold text-brand-blue mb-1">과세가액</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(inhResult.taxableBase)}만원</span></div>
                    <div className="w-full h-px bg-ui-border block md:hidden my-2" />
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">공제합계</span><span className="text-sm md:text-base font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(inhResult.totalDeduction)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-bold text-brand-blue mb-1">과세표준</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(inhResult.taxableIncome)}만원</span></div>
                    <CrossIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">적용세율</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-slate-200 pb-1">{inhResult.taxRate}</span></div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h4 className="text-lg font-bold text-text-primary">예상 납부 세액 결과</h4>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue rounded-md border border-blue-100 text-xs font-bold">
                      적용 공제: {inhResult.appliedDeduction}{inhSpouse ? " + 배우자공제" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-ui-surface rounded-2xl p-6 border border-ui-border">
                      <span className="text-sm font-bold text-text-secondary mb-2 block">산출세액</span>
                      <div className="flex items-baseline gap-1"><span className="text-2xl font-extrabold text-text-primary tracking-tight">{fmt(inhResult.computedTax)}</span><span className="text-base text-text-secondary font-medium">만원</span></div>
                    </div>
                    <div className="bg-ui-surface rounded-2xl p-6 border border-ui-border">
                      <div className="flex items-center justify-between mb-2"><span className="text-sm font-bold text-text-secondary">신고세액공제</span><span className="text-[11px] font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded">3% 적용</span></div>
                      <div className="flex items-baseline gap-1 text-red-500"><span className="text-lg font-bold">-</span><span className="text-2xl font-extrabold tracking-tight">{fmt(inhResult.reportDiscount)}</span><span className="text-base font-medium">만원</span></div>
                    </div>
                    <div className="lg:col-span-2 bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 md:p-8 text-white relative shadow-lg overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-blue-200 text-[15px] font-bold mb-2 block">최종 납부세액</span>
                        <div className="flex items-baseline gap-2"><span className="text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(inhResult.finalTax)}</span><span className="text-xl text-blue-100 font-medium">만원</span></div>
                      </div>
                    </div>
                  </div>
                  {inhGenSkip && inhResult.generationSkipSurcharge > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-700 font-medium">
                      세대생략 할증과세 30% 적용: +{fmt(inhResult.generationSkipSurcharge)}만원이 산출세액에 포함되었습니다.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ========== 증여세 탭 ========== */}
          {tab === "gift" && (
            <>
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">증여 정보</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">증여재산가액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-lg md:text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-medium">만원</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 border-t border-b border-ui-border py-6 my-2">
                      <label className="block text-[14px] font-bold text-text-secondary mb-3">증여자와의 관계 <span className="text-xs font-normal text-slate-400 ml-1">(10년 합산 공제 한도)</span></label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {relations.map((r) => (
                          <button key={r.k} onClick={() => setGiftRelation(r.k)} className={`text-center py-4 px-3 rounded-xl border transition-all flex flex-col justify-center items-center gap-1 min-h-[72px] ${giftRelation === r.k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border text-text-secondary hover:border-slate-300"}`}>
                            <span className="text-[13px] md:text-sm font-bold">{r.l}</span>
                            {r.sub && <span className="text-[11px] font-normal opacity-70">{r.sub}</span>}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-text-secondary mt-3 leading-relaxed">
                        기타 친족의 범위: 4촌 이내의 혈족, 3촌 이내의 인척 (상속세 및 증여세법 제53조, 2025.3.14 개정). 예시: 삼촌·이모·조카·사촌 등. 기존 6촌 혈족·4촌 인척에서 범위가 축소되었습니다.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">채무 인수액 <span className="text-xs font-normal text-slate-400 ml-1">(부담부증여 시)</span></label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={giftDebt} onChange={(e) => setGiftDebt(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">10년 내 동일인 사전증여 합산액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={giftPrior} onChange={(e) => setGiftPrior(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>

                    <div className="md:col-span-2 p-4 bg-ui-surface rounded-xl mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-text-secondary">세대생략 증여 (할증과세)</span>
                          <span className="text-[12px] text-slate-400 mt-0.5">조부모가 손자녀에게 직접 증여하는 경우</span>
                        </div>
                        <button onClick={() => setGiftGenSkip(!giftGenSkip)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 shrink-0 ml-4 ${giftGenSkip ? "bg-brand-blue" : "bg-slate-200"}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${giftGenSkip ? "left-[26px]" : "left-[2px]"}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                        수증자가 증여자의 자녀가 아닌 직계비속(손자녀 등)인 경우 산출세액의 30%가 할증됩니다 (미성년자이면서 증여재산 20억 초과 시 40%). 다만, 자녀가 먼저 사망하여 손자녀가 대습상속인이 되는 경우에는 할증과세가 적용되지 않습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 증여세 결과 */}
              <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden mt-8 mb-12 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>
                <div className="bg-slate-50/80 p-6 md:p-8 border-b border-ui-border">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-center w-full mx-auto">
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">증여재산</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-slate-200 pb-1">{fmt(giftResult.giftAmount)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">채무차감</span><span className="text-sm md:text-base font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(giftResult.debtAssumption)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-bold text-brand-blue mb-1">과세가액</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(giftResult.taxableBase)}만원</span></div>
                    <div className="w-full h-px bg-ui-border block md:hidden my-2" />
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">공제액</span><span className="text-sm md:text-base font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(giftResult.exemption)}만원</span></div>
                    <ArrowIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-bold text-brand-blue mb-1">과세표준</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(giftResult.taxableIncome)}만원</span></div>
                    <CrossIcon />
                    <div className="flex flex-col min-w-[80px]"><span className="text-[12px] md:text-[13px] font-medium text-text-secondary mb-1">적용세율</span><span className="text-sm md:text-base font-bold text-text-primary border-b-2 border-slate-200 pb-1">{giftResult.taxRate}</span></div>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-bold text-text-primary mb-6">예상 납부 세액 결과</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    <div className="bg-ui-surface rounded-2xl p-5 border border-ui-border">
                      <span className="text-xs md:text-sm font-bold text-text-secondary mb-1 block">산출세액</span>
                      <div className="flex items-baseline gap-1"><span className="text-xl md:text-2xl font-extrabold text-text-primary tracking-tight">{fmt(giftResult.computedTax)}</span><span className="text-sm font-medium">만원</span></div>
                    </div>
                    <div className="bg-ui-surface rounded-2xl p-5 border border-ui-border">
                      <span className="text-xs md:text-sm font-bold text-text-secondary mb-1 block">사전증여 기납부세액</span>
                      <div className="flex items-baseline gap-1 text-slate-500"><span className="text-lg font-bold">-</span><span className="text-xl md:text-2xl font-extrabold tracking-tight">{fmt(giftResult.priorGiftTax)}</span><span className="text-sm font-medium">만원</span></div>
                    </div>
                    <div className="bg-ui-surface rounded-2xl p-5 border border-ui-border">
                      <div className="flex items-center justify-between mb-1"><span className="text-xs md:text-sm font-bold text-text-secondary">신고세액공제</span></div>
                      <div className="flex items-baseline gap-1 text-red-500"><span className="text-lg font-bold">-</span><span className="text-xl md:text-2xl font-extrabold tracking-tight">{fmt(giftResult.reportDiscount)}</span><span className="text-sm font-medium">만원</span></div>
                    </div>
                    <div className="md:col-span-3 lg:col-span-2 bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 md:p-8 text-white relative shadow-lg overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-blue-200 text-[15px] font-bold mb-2 block">최종 납부세액</span>
                        <div className="flex items-baseline gap-2"><span className="text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(giftResult.finalTax)}</span><span className="text-xl text-blue-100 font-medium">만원</span></div>
                      </div>
                    </div>
                  </div>
                  {giftGenSkip && giftResult.generationSkipSurcharge > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-700 font-medium">
                      세대생략 할증과세 적용: +{fmt(giftResult.generationSkipSurcharge)}만원이 산출세액에 포함되었습니다.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li>본 계산기는 개략적인 예상 세액을 산출하기 위한 참고용 도구이며, 실제 부과되는 세액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">상속세의 경우 일괄공제(5억)와 기초공제+인적공제 합산액 중 큰 금액을 자동으로 적용</strong>하여 계산합니다.</li>
              <li>가업상속공제, 영농상속공제, 동거주택 상속공제 등 특례 조항이나 금융재산상속공제, 감정평가 수수료 공제 등은 본 간편 계산기에 반영되어 있지 않습니다.</li>
              <li>증여재산공제는 동일인으로부터 10년간 합산하여 적용되며, 이미 사전증여로 공제를 사용한 경우 잔여 공제만 적용됩니다.</li>
              <li>정확한 세액 산출 및 절세 전략 수립을 위해서는 반드시 세무 전문가와 상담하시기 바랍니다.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">계산기로 간단하게 확인해보셨다면, 정확한 절세 방법은 세무사와 상담하세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
              <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3.5 bg-[#03C75A] text-white rounded-xl text-[14px] font-bold hover:bg-[#02b351] transition-colors text-center">톡톡 문의하기</a>
              <a href="https://blog.naver.com/tax_dawn" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3.5 bg-white text-text-primary border-2 border-ui-border rounded-xl text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors text-center">블로그에서 사례 보기</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

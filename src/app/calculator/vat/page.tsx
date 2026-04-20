"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateVat,
  SIMPLIFIED_INDUSTRY_LABELS,
  type TaxpayerType,
  type SimplifiedIndustry,
} from "@/lib/vatCalc";

const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");
const fmtW = (v: number) => (v * 10000).toLocaleString("ko-KR");

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

const simplifiedIndustries: { k: SimplifiedIndustry; l: string; rate: string }[] = [
  { k: "retail", l: "소매업", rate: "15%" },
  { k: "restaurant", l: "음식점업", rate: "25%" },
  { k: "manufacturing", l: "제조업·농림어업", rate: "20%" },
  { k: "construction", l: "건설·운수·정보통신", rate: "30%" },
  { k: "realestate", l: "부동산임대업", rate: "30%" },
  { k: "service", l: "기타 서비스업", rate: "30%" },
  { k: "finance", l: "금융·보험·전문서비스", rate: "40%" },
];

export default function VatCalculator() {
  const [taxpayerType, setTaxpayerType] = useState<TaxpayerType>("general");

  // 일반과세자
  const [sales, setSales] = useState<number | string>("");
  const [cardSales, setCardSales] = useState<number | string>("");
  const [purchase, setPurchase] = useState<number | string>("");
  const [cardPurchase, setCardPurchase] = useState<number | string>("");
  const [isIndividual, setIsIndividual] = useState(true);

  // 간이과세자
  const [sIndustry, setSIndustry] = useState<SimplifiedIndustry>("retail");
  const [sSales, setSSales] = useState<number | string>("");
  const [sPurchase, setSPurchase] = useState<number | string>("");
  const [sCardSales, setSCardSales] = useState<number | string>("");
  const [sMonths, setSMonths] = useState(12);

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const result = useMemo(() => calculateVat({
    taxpayerType,
    salesAmount: n(sales),
    cardSalesAmount: n(cardSales),
    purchaseAmount: n(purchase),
    cardPurchaseAmount: n(cardPurchase),
    isIndividual,
    simplifiedIndustry: sIndustry,
    simplifiedSales: n(sSales),
    simplifiedPurchase: n(sPurchase),
    simplifiedCardSales: n(sCardSales),
    simplifiedMonths: sMonths,
  }), [taxpayerType, sales, cardSales, purchase, cardPurchase, isIndividual, sIndustry, sSales, sPurchase, sCardSales, sMonths]);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid" />

      <nav className="flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors shadow-sm flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>톡톡 문의하기</a>
      </nav>

      <section className="relative pt-12 pb-32 px-6 overflow-hidden">
        <div className="max-w-[1000px] w-full mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">무료 세금 계산기</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">부가가치세 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">일반과세자·간이과세자 부가세 납부세액을 간편하게 확인하세요</p>
          </div>

          {/* 탭 */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-ui-surface p-1.5 rounded-2xl border border-ui-border shadow-sm">
              {(["general", "simplified"] as TaxpayerType[]).map((t) => (
                <button key={t} onClick={() => setTaxpayerType(t)} className={`px-10 py-3 rounded-xl text-[16px] font-bold transition-all ${taxpayerType === t ? "bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-text-secondary"}`}>
                  {t === "general" ? "일반과세자" : "간이과세자"}
                </button>
              ))}
            </div>
          </div>

          {/* ========== 일반과세자 ========== */}
          {taxpayerType === "general" && (
            <>
              <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">매출/매입 정보 입력</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {/* 매출 */}
                  <div className="space-y-6">
                    <h4 className="text-[16px] font-extrabold text-brand-blue flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      매출 내역
                    </h4>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">과세 매출액 (공급가액)</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={sales} onChange={(e) => setSales(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">그 중 신용카드/현금영수증 매출액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={cardSales} onChange={(e) => setCardSales(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 ml-1">* 발행세액공제 산출용 (공급대가 기준 입력)</p>
                    </div>
                    <div className="w-full h-px bg-slate-100 my-4" />
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-text-primary">개인사업자 여부</span>
                        <span className="text-[12px] text-text-secondary">신용카드 매출전표 발행세액공제 (1.3%) 적용</span>
                      </div>
                      <button onClick={() => setIsIndividual(!isIndividual)} className={`relative inline-block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${isIndividual ? "bg-brand-blue" : "bg-slate-300"}`}>
                        <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${isIndividual ? "left-[22px]" : "left-[2px]"}`} />
                      </button>
                    </label>
                  </div>

                  {/* 매입 */}
                  <div className="space-y-6">
                    <h4 className="text-[16px] font-extrabold text-slate-600 flex items-center gap-2 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                      매입 내역
                    </h4>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">매입액 - 세금계산서 수취분 (공급가액)</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={purchase} onChange={(e) => setPurchase(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">매입액 - 신용카드/현금영수증 수취분</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={cardPurchase} onChange={(e) => setCardPurchase(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 ml-1">* 공제 대상에 한함 (공급가액 기준 입력)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 일반 결과 */}
              <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-text-secondary">매출세액</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">10%</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 text-text-primary">
                        <span className="text-2xl font-extrabold tracking-tight">{fmtW(result.salesTax)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-text-secondary">매입세액 합계</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 text-slate-600">
                        <span className="text-2xl font-extrabold tracking-tight">- {fmtW(result.totalPurchaseTax)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-text-secondary">경감·공제세액</span>
                        {result.cardSalesCredit > 0 && <span className="text-[11px] font-bold text-brand-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">카드 1.3%</span>}
                      </div>
                      <div className="flex items-baseline gap-1.5 text-brand-blue">
                        <span className="text-2xl font-extrabold tracking-tight">- {fmtW(result.totalCredit)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 text-white relative shadow-lg overflow-hidden flex flex-col justify-between">
                      <div className="relative z-10 mb-2"><span className="text-blue-200 text-sm font-bold">최종 납부세액</span></div>
                      <div className="flex items-baseline gap-1.5 relative z-10">
                        <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">{fmtW(result.vatPayable)}</span>
                        <span className="text-base text-blue-100 font-bold">원</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========== 간이과세자 ========== */}
          {taxpayerType === "simplified" && (
            <>
              <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">업종 및 매출/매입 정보</h3>
                </div>

                <div className="space-y-10 max-w-[800px] mx-auto w-full">
                  <div>
                    <label className="block text-[15px] font-bold text-text-primary mb-4">업종 선택 <span className="text-text-secondary text-sm font-normal ml-2">(부가가치율)</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {simplifiedIndustries.map((ind) => (
                        <button key={ind.k} onClick={() => setSIndustry(ind.k)} className={`flex flex-col items-center justify-center text-center py-4 px-2 rounded-xl border transition-all shadow-sm min-h-[72px] ${sIndustry === ind.k ? "border-brand-blue bg-blue-50" : "border-ui-border bg-white"}`}>
                          <span className={`text-[14px] font-bold mb-1 ${sIndustry === ind.k ? "text-brand-blue" : "text-text-secondary"}`}>{ind.l}</span>
                          <span className={`text-[12px] font-medium ${sIndustry === ind.k ? "text-blue-500" : "text-slate-400"}`}>{ind.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">해당 과세기간 매출액 <span className="text-xs font-normal text-slate-400">(공급대가)</span></label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={sSales} onChange={(e) => setSSales(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">매입액 - 세금계산서 등 수취분</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={sPurchase} onChange={(e) => setSPurchase(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">그 중 신용카드/현금영수증 매출액</label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={sCardSales} onChange={(e) => setSCardSales(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                        <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 ml-1">* 신용카드 발행세액공제 1.3% 적용 (반기 500만원 한도)</p>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">해당 과세기간 사업 개월 수 <span className="text-xs font-normal text-slate-400">(납부면제 월할 계산용)</span></label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSMonths(Math.max(1, sMonths - 1))} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="font-bold text-text-primary w-6 text-center text-lg">{sMonths}</span>
                        <button onClick={() => setSMonths(Math.min(12, sMonths + 1))} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="text-[13px] text-text-secondary">개월</span>
                      </div>
                      {n(sSales) > 0 && sMonths < 12 && (
                        <p className="text-xs text-brand-blue mt-2 ml-1">환산 연매출: {fmt(result.annualizedSales)}만원</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 간이 결과 */}
              <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>
                <div className="p-6 md:p-8">
                  {result.isExempt && n(sSales) > 0 && (
                    <div className="bg-blue-50 border border-brand-blue/30 rounded-xl p-4 mb-6 flex items-center justify-center gap-3 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-brand-blue font-extrabold text-[16px]">연 매출 4,800만원 미만 — 납부면제 대상입니다.</p>
                        <p className="text-[13px] text-blue-600/80 font-medium mt-0.5">부가가치세 납부의무가 면제됩니다. (단, 신고의무는 있습니다)</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm ${result.isExempt ? "opacity-60" : ""}`}>
                      <div className="flex justify-between items-start mb-4"><span className="text-sm font-bold text-text-secondary">납부세액 (차감전)</span></div>
                      <div className={`flex items-baseline gap-1.5 text-text-primary ${result.isExempt ? "line-through text-slate-500" : ""}`}>
                        <span className="text-2xl font-extrabold tracking-tight">{fmtW(result.simplifiedSalesTax)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm ${result.isExempt ? "opacity-60" : ""}`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-text-secondary">매입세액공제</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">0.5%</span>
                      </div>
                      <div className={`flex items-baseline gap-1.5 text-slate-600 ${result.isExempt ? "line-through text-slate-500" : ""}`}>
                        <span className="text-2xl font-extrabold tracking-tight">- {fmtW(result.simplifiedPurchaseCredit)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm ${result.isExempt ? "opacity-60" : ""}`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-bold text-text-secondary">카드 발행세액공제</span>
                        <span className="text-xs font-bold text-brand-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">1.3%</span>
                      </div>
                      <div className={`flex items-baseline gap-1.5 text-brand-blue ${result.isExempt ? "line-through text-slate-500" : ""}`}>
                        <span className="text-2xl font-extrabold tracking-tight">- {fmtW(result.simplifiedCardCredit)}</span>
                        <span className="text-sm font-bold">원</span>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-6 text-white relative shadow-lg overflow-hidden flex flex-col justify-between ${result.isExempt ? "bg-gradient-to-br from-brand-blue to-blue-700" : "bg-gradient-to-br from-brand-navy to-[#0f172a]"} lg:col-span-1`}>
                      <div className="relative z-10 mb-2"><span className="text-blue-200 text-sm font-bold">최종 납부세액</span></div>
                      <div className="flex items-baseline gap-1.5 relative z-10">
                        <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">{fmtW(result.simplifiedPayable)}</span>
                        <span className="text-base text-blue-100 font-bold">원</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mt-10 mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li>본 계산기는 입력된 정보를 바탕으로 산출된 <strong className="text-text-primary">개략적인 예상 세액</strong>이며, 실제 납부 금액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">신용카드 발행세액공제:</strong> 일반과세자·간이과세자 모두 신용카드/현금영수증 매출전표 발행금액의 1.3%가 공제됩니다. 연간 1,000만원(반기 500만원) 한도. 법인사업자 및 직전연도 공급가액 10억원 초과 개인사업자는 제외됩니다. (부가가치세법 제46조)</li>
              <li><strong className="text-text-primary font-bold">간이과세자 기준:</strong> 직전 연도 공급대가 합계액이 1억 400만원 미만인 개인사업자입니다.</li>
              <li><strong className="text-text-primary font-bold">납부의무 면제:</strong> 해당 과세기간의 공급대가를 사업 영위 개월 수로 환산한 연매출이 4,800만원 미만인 경우 납부의무가 면제됩니다. (신고의무는 있음)</li>
              <li>의제매입세액공제, 대손세액공제 등 추가적인 공제 항목은 본 계산기에 반영되어 있지 않습니다.</li>
              <li>정확한 세액 산출 및 신고는 반드시 기한 내에 세무 전문가와 상담하시기 바랍니다.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">부가세 신고·기장대리가 필요하시면 편하게 연락주세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
              <Link href="/contact" className="flex-1 px-6 py-3.5 bg-brand-blue text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors text-center no-underline">무료 상담 신청하기</Link>
              <a href="https://blog.naver.com/tax_dawn" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3.5 bg-white text-text-primary border-2 border-ui-border rounded-xl text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors text-center">블로그에서 사례 보기</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

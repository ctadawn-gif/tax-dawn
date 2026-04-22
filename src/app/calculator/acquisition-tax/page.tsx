"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateAcquisitionTax,
  type PropertyType,
  type AcquisitionType,
  type HouseCount,
} from "@/lib/acquisitionTaxCalc";

const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");
const fmtWon = (v: number) => (v * 10000).toLocaleString("ko-KR");

const propertyTypes: { k: PropertyType; l: string }[] = [
  { k: "house", l: "주택" },
  { k: "farmland", l: "농지" },
  { k: "land", l: "토지 (농지 외)" },
  { k: "commercial", l: "상가·건축물" },
];

const acqTypes: { k: AcquisitionType; l: string }[] = [
  { k: "purchase", l: "매매" },
  { k: "inheritance", l: "상속" },
  { k: "gift", l: "증여" },
];

const houseCounts: { k: HouseCount; l: string }[] = [
  { k: "1", l: "1주택" },
  { k: "2", l: "2주택" },
  { k: "3", l: "3주택" },
  { k: "4plus", l: "4주택 이상" },
  { k: "corp", l: "법인" },
];

export default function AcquisitionTaxCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>("house");
  const [acqType, setAcqType] = useState<AcquisitionType>("purchase");
  const [price, setPrice] = useState<number | string>("");
  const [houseCount, setHouseCount] = useState<HouseCount>("1");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [areaOver85, setAreaOver85] = useState(false);
  const [isFirstHome, setIsFirstHome] = useState(false);

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const result = useMemo(
    () =>
      calculateAcquisitionTax({
        propertyType,
        acquisitionType: acqType,
        price: n(price),
        houseCount,
        isAdjustedArea: isAdjusted,
        areaOver85,
        isFirstHome,
      }),
    [propertyType, acqType, price, houseCount, isAdjusted, areaOver85, isFirstHome]
  );

  const showHouseOptions = propertyType === "house" && acqType === "purchase";

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid" />

      {/* ── Mobile Nav ─────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between h-[48px] px-5 bg-white border-b border-slate-100">
        <Link href="/" className="no-underline text-[14px] font-medium text-slate-800 tracking-tight">세무회계 새벽</Link>
        <a href="tel:01032623295" aria-label="전화상담 연결" className="text-slate-600 p-1 -mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-3.903-7.181-6.961l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </a>
      </header>

      {/* ── Mobile Hero ─────────────────────────── */}
      <section className="md:hidden bg-gradient-to-b from-blue-50/60 to-white pt-8 pb-10 px-5 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-brand-blue rounded-full text-[13px] font-semibold tracking-tight mb-5">
          <span>🧮</span>
          <span className="pt-[1px]">무료 세금 계산기</span>
        </div>
        <h1 className="text-[28px] font-extrabold text-slate-900 leading-[1.25] tracking-tight mb-3.5">취득세 계산기</h1>
        <p className="text-[15px] font-medium text-slate-500 leading-[1.5] tracking-tight">
          부동산 취득 시 납부할
          <br />
          취득세·농특세·지방교육세를 확인합니다.
        </p>
      </section>

      {/* ── Desktop Nav (기존 유지) ─────────────────────────── */}
      <nav className="hidden md:flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors shadow-sm flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>톡톡 문의하기</a>
      </nav>

      <section className="relative pt-12 pb-32 px-6 overflow-hidden">
        <div className="max-w-[1000px] w-full mx-auto relative z-10">
          <div className="hidden md:block text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">무료 세금 계산기</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">취득세 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">부동산 취득 시 납부할 취득세·농특세·지방교육세를 간편하게 확인하세요</p>
          </div>

          {/* 입력 */}
          <div className="max-w-[700px] mx-auto mb-12">
            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">취득 정보 입력</h3>
              </div>

              <div className="space-y-8">
                {/* 부동산 유형 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-3">부동산 유형</label>
                  <div className="flex p-1 bg-ui-surface rounded-xl border border-ui-border">
                    {propertyTypes.map((t) => (
                      <button key={t.k} onClick={() => setPropertyType(t.k)} className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all ${propertyType === t.k ? "bg-white text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-text-secondary"}`}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 취득 유형 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-3">취득 유형</label>
                  <div className="grid grid-cols-3 gap-3">
                    {acqTypes.map((t) => (
                      <button key={t.k} onClick={() => setAcqType(t.k)} className={`py-4 px-2 rounded-xl border text-[14px] font-bold transition-all shadow-sm ${acqType === t.k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border bg-white text-text-secondary"}`}>
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 취득가액 */}
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">취득가액</label>
                  <div className="relative">
                    <input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-16 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                    <span className="absolute right-4 top-4 text-text-secondary text-base font-bold mt-0.5">만원</span>
                  </div>
                </div>

                {/* 주택 옵션 */}
                {showHouseOptions && (
                  <>
                    <div className="w-full h-px bg-ui-border" />

                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-3 flex items-center justify-between">
                        <span>취득 후 주택 수</span>
                        <span className="text-xs font-normal text-brand-blue bg-blue-50 px-2 py-1 rounded">세대 기준</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {houseCounts.map((h) => (
                          <button key={h.k} onClick={() => { setHouseCount(h.k); if (h.k !== "1") setIsFirstHome(false); }} className={`py-3 px-1 rounded-xl border text-[13px] font-bold transition-all shadow-sm ${houseCount === h.k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border bg-white text-text-secondary"} ${h.k === "corp" ? "col-span-2 sm:col-span-1" : ""}`}>
                            {h.l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* 조정대상지역 */}
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-text-primary">조정대상지역 여부</span>
                          <span className="text-[12px] text-text-secondary">취득하는 주택이 조정대상지역에 있는 경우</span>
                        </div>
                        <button onClick={() => setIsAdjusted(!isAdjusted)} className={`relative inline-block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${isAdjusted ? "bg-brand-blue" : "bg-slate-300"}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${isAdjusted ? "left-[22px]" : "left-[2px]"}`} />
                        </button>
                      </label>

                      <div className="w-full h-px bg-slate-100" />

                      {/* 85㎡ 초과 */}
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-text-primary">전용면적 85㎡ 초과</span>
                          <span className="text-[12px] text-text-secondary">농어촌특별세 부과 대상</span>
                        </div>
                        <button onClick={() => setAreaOver85(!areaOver85)} className={`relative inline-block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${areaOver85 ? "bg-brand-blue" : "bg-slate-300"}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${areaOver85 ? "left-[22px]" : "left-[2px]"}`} />
                        </button>
                      </label>

                      <div className="w-full h-px bg-slate-100" />

                      {/* 생애최초 - 1주택만 */}
                      {houseCount === "1" && (
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-text-primary">생애최초 주택 구입</span>
                            <span className="text-[12px] text-text-secondary">취득가액 12억원 이하, 최대 200만원 감면</span>
                          </div>
                          <button onClick={() => setIsFirstHome(!isFirstHome)} className={`relative inline-block w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${isFirstHome ? "bg-brand-blue" : "bg-slate-300"}`}>
                            <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${isFirstHome ? "left-[22px]" : "left-[2px]"}`} />
                          </button>
                        </label>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 결과 */}
          <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>

            <div className="p-6 md:p-8">
              {/* 세율 요약 바 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-8 text-sm font-bold bg-slate-50 py-4 px-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-text-primary">
                  <span className="text-text-secondary">취득가액</span>
                  <span className="text-[16px]">{n(price) > 0 ? `${fmtWon(n(price))}원` : "0원"}</span>
                </div>
                <svg className="hidden md:block w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                <div className="flex items-center gap-2 text-text-primary">
                  <span className="text-text-secondary">합산 세율</span>
                  <span className="text-brand-blue text-[16px]">{result.totalRate}%</span>
                </div>
                <svg className="hidden md:block w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                <div className="text-brand-blue bg-blue-50 px-3 py-1 rounded-md border border-blue-100 text-[13px]">
                  {result.rateDescription}
                </div>
              </div>

              {/* 결과 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-text-secondary">취득세</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{result.acquisitionTaxRate}%</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 text-text-primary">
                    <span className="text-2xl font-extrabold tracking-tight">{fmtWon(result.acquisitionTax)}</span>
                    <span className="text-sm font-bold">원</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-text-secondary">지방교육세</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{result.localEduTaxRate}%</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 text-text-primary">
                    <span className="text-2xl font-extrabold tracking-tight">{fmtWon(result.localEduTax)}</span>
                    <span className="text-sm font-bold">원</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-bold text-text-secondary">농어촌특별세</span>
                    {result.ruralSpecialTax === 0 ? (
                      <span className="text-[11px] font-bold text-brand-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">비과세</span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{result.ruralSpecialTaxRate}%</span>
                    )}
                  </div>
                  <div className={`flex items-baseline gap-1.5 ${result.ruralSpecialTax === 0 ? "text-slate-300" : "text-text-primary"}`}>
                    <span className="text-2xl font-extrabold tracking-tight">{fmtWon(result.ruralSpecialTax)}</span>
                    <span className="text-sm font-bold">원</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 text-white relative shadow-lg overflow-hidden flex flex-col justify-between">
                  <div className="relative z-10 mb-2">
                    <span className="text-blue-200 text-sm font-bold">총 납부 예상액</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 relative z-10">
                    <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">{fmtWon(result.totalTax)}</span>
                    <span className="text-base text-blue-100 font-bold">원</span>
                  </div>
                </div>
              </div>

              {/* 생애최초 감면 */}
              {result.firstHomeDiscount > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-brand-blue/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[14px] font-bold text-brand-blue">생애최초 주택 구입 감면 적용</span>
                  </div>
                  <div className="text-brand-blue font-extrabold text-[16px]">
                    - {fmtWon(result.firstHomeDiscount)}원
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mt-8 mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li>본 계산기는 입력된 정보를 바탕으로 산출된 <strong className="text-text-primary">개략적인 예상 세액</strong>이며, 실제 부과되는 금액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">다주택자 중과세율:</strong> 조정대상지역 2주택 8%, 3주택 이상 12%. 비조정지역 3주택 8%, 4주택 이상 12%. 법인은 주택 수와 무관하게 12%가 적용됩니다.</li>
              <li><strong className="text-text-primary font-bold">조정대상지역:</strong> 조정대상지역은 수시로 변경될 수 있으므로, 취득 시점의 지정 현황을 반드시 확인하시기 바랍니다. (일시적 2주택 예외 규정 있음)</li>
              <li><strong className="text-text-primary font-bold">생애최초 감면:</strong> 취득가액 12억원 이하 주택을 생애최초로 구입하는 경우 최대 200만원 한도 내에서 취득세가 감면됩니다. 3개월 내 전입 및 3년 거주 요건이 있습니다.</li>
              <li><strong className="text-text-primary font-bold">농지 세율:</strong> 농지는 매매 3%, 상속 2.3%로 일반 토지(매매 4%, 상속 2.8%)보다 낮은 세율이 적용됩니다. 자경농민 감면(50%) 등 추가 감면은 본 계산기에 반영되어 있지 않습니다.</li>
              <li>농어촌특별세는 전용면적 85㎡ 초과 주택에 부과되나, 읍·면 지역 등 일부 조건에 따라 비과세 될 수 있습니다.</li>
              <li>정확한 세액 산출 및 감면 요건 확인은 반드시 신고 전 세무 전문가와 상담하시기 바랍니다.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">취득세 관련 궁금한 점이 있으시면 편하게 연락주세요.</p>
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

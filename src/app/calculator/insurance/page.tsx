"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateSocialInsurance,
  COMPANY_SIZE_LABELS,
  INDUSTRY_LABELS,
  type CompanySize,
  type IndustryType,
} from "@/lib/socialInsuranceCalc";

const fmt = (v: number) => v.toLocaleString("ko-KR");

const sizes: { k: CompanySize; l: string; sub?: string }[] = [
  { k: "under150", l: "150인 미만" },
  { k: "over150priority", l: "150인 이상", sub: "(우선지원)" },
  { k: "150to1000", l: "150 ~ 1,000인 미만" },
  { k: "over1000", l: "1,000인 이상", sub: "/ 공공기관" },
];

const industries: { k: IndustryType; l: string }[] = [
  { k: "office", l: "사무직 (일반)" },
  { k: "retail", l: "도소매·음식·숙박" },
  { k: "it", l: "IT·소프트웨어" },
  { k: "finance", l: "금융·보험" },
  { k: "manufacturing_light", l: "제조 (경공업·전자)" },
  { k: "manufacturing_heavy", l: "제조 (중공업·금속)" },
  { k: "construction", l: "건설업" },
  { k: "transport", l: "운수·창고·통신" },
  { k: "education", l: "교육서비스" },
  { k: "health", l: "보건·사회복지" },
];

const rateDescriptions: Record<string, string> = {
  "국민연금": "요율 9.5% (4.75% / 4.75%)",
  "건강보험": "요율 7.19% (3.595% / 3.595%)",
  "장기요양보험": "건강보험료의 약 13.14%",
  "고용보험": "실업급여 + 고용안정·직업능력",
  "산재보험": "업종별 요율, 사업주 전액 부담",
};

export default function InsuranceCalculator() {
  const [salary, setSalary] = useState<number | string>("");
  const [taxFreeMeal, setTaxFreeMeal] = useState<number | string>(200000);
  const [taxFreeCar, setTaxFreeCar] = useState<number | string>(0);
  const [taxFreeChildcare, setTaxFreeChildcare] = useState<number | string>(0);
  const [taxFreeOther, setTaxFreeOther] = useState<number | string>(0);
  const [companySize, setCompanySize] = useState<CompanySize>("under150");
  const [industryType, setIndustryType] = useState<IndustryType>("office");
  const [dependents, setDependents] = useState(1);

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const result = useMemo(
    () => calculateSocialInsurance({
      monthlySalary: n(salary),
      taxFreeMeal: n(taxFreeMeal),
      taxFreeCarAllowance: n(taxFreeCar),
      taxFreeChildcare: n(taxFreeChildcare),
      taxFreeOther: n(taxFreeOther),
      companySize,
      industryType,
      dependents,
    }),
    [salary, taxFreeMeal, taxFreeCar, taxFreeChildcare, taxFreeOther, companySize, industryType, dependents]
  );

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
        <h1 className="text-[28px] font-extrabold text-slate-900 leading-[1.25] tracking-tight mb-3.5">4대보험료 계산기</h1>
        <p className="text-[15px] font-medium text-slate-500 leading-[1.5] tracking-tight">
          월 급여를 입력하면
          <br />
          근로자·사업주 부담분을 확인합니다.
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">4대보험료 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">월 급여를 입력하면 근로자·사업주 부담분을 바로 확인할 수 있습니다</p>
          </div>

          {/* 입력 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* 급여 정보 */}
            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">급여 정보</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">월 총 급여 <span className="text-xs font-normal text-slate-400">(세전)</span></label>
                  <div className="relative">
                    <input type="number" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-4 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-extrabold text-text-primary text-xl" />
                    <span className="absolute right-4 top-4 text-text-secondary text-base font-medium mt-0.5">원</span>
                  </div>
                </div>

                {/* 부양가족 수 (소득세 원천징수용) */}
                <div className="pt-3 border-t border-ui-border">
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">부양가족 수 <span className="text-xs font-normal text-slate-400">(본인 포함, 소득세 원천징수 계산용)</span></label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setDependents(Math.max(1, dependents - 1))} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="font-bold text-text-primary w-6 text-center text-lg">{dependents}</span>
                    <button onClick={() => setDependents(dependents + 1)} className="w-8 h-8 rounded-lg bg-white border border-ui-border flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="text-[12px] text-text-secondary">명</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-ui-border">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[14px] font-bold text-text-secondary">비과세 급여</label>
                    <span className="text-[12px] text-text-secondary">보수월액에서 제외</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-text-secondary w-28 shrink-0">식대</span>
                      <div className="relative flex-1">
                        <input type="number" inputMode="numeric" value={taxFreeMeal} onChange={(e) => setTaxFreeMeal(e.target.value === "" ? "" : Number(e.target.value))} placeholder="200000" className="w-full pl-3 pr-8 py-2.5 bg-ui-surface border border-ui-border rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue transition-all text-right font-semibold text-text-primary text-[14px]" />
                        <span className="absolute right-3 top-2.5 text-text-secondary text-xs">원</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-text-secondary w-28 shrink-0">자가운전보조금</span>
                      <div className="relative flex-1">
                        <input type="number" inputMode="numeric" value={taxFreeCar} onChange={(e) => setTaxFreeCar(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-3 pr-8 py-2.5 bg-ui-surface border border-ui-border rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue transition-all text-right font-semibold text-text-primary text-[14px]" />
                        <span className="absolute right-3 top-2.5 text-text-secondary text-xs">원</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-text-secondary w-28 shrink-0">출산·보육수당</span>
                      <div className="relative flex-1">
                        <input type="number" inputMode="numeric" value={taxFreeChildcare} onChange={(e) => setTaxFreeChildcare(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-3 pr-8 py-2.5 bg-ui-surface border border-ui-border rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue transition-all text-right font-semibold text-text-primary text-[14px]" />
                        <span className="absolute right-3 top-2.5 text-text-secondary text-xs">원</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-text-secondary w-28 shrink-0">기타 비과세</span>
                      <div className="relative flex-1">
                        <input type="number" inputMode="numeric" value={taxFreeOther} onChange={(e) => setTaxFreeOther(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-3 pr-8 py-2.5 bg-ui-surface border border-ui-border rounded-lg focus:bg-white focus:outline-none focus:border-brand-blue transition-all text-right font-semibold text-text-primary text-[14px]" />
                        <span className="absolute right-3 top-2.5 text-text-secondary text-xs">원</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-[11px] leading-relaxed text-brand-blue font-medium">
                      비과세 급여(식대 월 20만원, 자가운전보조금 월 20만원, 출산·보육수당 자녀 1인당 월 20만원 등)는 4대보험 보수월액에서 제외됩니다.
                    </p>
                  </div>
                  {result.totalTaxFree > 0 && n(salary) > 0 && (
                    <div className="mt-2 text-[13px] text-text-secondary">
                      보수월액 (과세 급여): <span className="font-bold text-text-primary">{fmt(result.taxableSalary)}원</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 사업장 정보 */}
            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">사업장 정보</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-3">사업장 규모 <span className="text-xs font-normal text-slate-400">(고용보험 요율)</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((s) => (
                      <button key={s.k} onClick={() => setCompanySize(s.k)} className={`flex flex-col justify-center text-center py-3.5 px-2 rounded-xl border text-[14px] font-bold transition-all shadow-sm min-h-[60px] ${companySize === s.k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border bg-ui-surface text-text-secondary"}`}>
                        {s.l}
                        {s.sub && <span className="text-[11px] font-medium opacity-80 mt-0.5">{s.sub}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-3">업종 <span className="text-xs font-normal text-slate-400">(산재보험 요율)</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {industries.map((ind) => (
                      <button key={ind.k} onClick={() => setIndustryType(ind.k)} className={`text-center py-2.5 px-2 rounded-lg border text-[13px] font-medium transition-all ${industryType === ind.k ? "border-brand-blue bg-blue-50 text-brand-blue font-bold" : "border-ui-border text-text-secondary hover:border-slate-300"}`}>
                        {ind.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 */}
          <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h4 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  예상 4대보험료 산출 결과
                </h4>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-blue rounded-md border border-blue-100 text-xs font-bold">
                  적용 요율 기준 2026년
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-ui-border mb-8">
                <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-slate-50 text-[14px] font-bold text-text-secondary border-b border-ui-border w-[25%]">구분</th>
                      <th className="py-4 px-6 bg-slate-50 text-[14px] font-bold text-text-secondary border-b border-ui-border text-right w-[25%]">보험료 총액</th>
                      <th className="py-4 px-6 bg-slate-50 text-[14px] font-bold text-brand-blue border-b border-ui-border text-right w-[25%]">근로자 부담</th>
                      <th className="py-4 px-6 bg-slate-50 text-[14px] font-bold text-text-secondary border-b border-ui-border text-right w-[25%]">사업주 부담</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((item, i) => (
                      <tr key={item.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className={`py-4 px-6 ${i < result.items.length - 1 ? "border-b border-ui-border" : "border-b border-slate-300"}`}>
                          <div className="font-bold text-text-primary text-[15px]">{item.name}</div>
                          <div className="text-[12px] text-text-secondary mt-0.5">{rateDescriptions[item.name]}</div>
                        </td>
                        <td className={`py-4 px-6 text-right font-bold text-text-primary text-[16px] ${i < result.items.length - 1 ? "border-b border-ui-border" : "border-b border-slate-300"}`}>{fmt(item.total)}원</td>
                        <td className={`py-4 px-6 text-right font-bold text-[16px] ${item.employee > 0 ? "text-brand-blue" : "text-slate-300"} ${i < result.items.length - 1 ? "border-b border-ui-border" : "border-b border-slate-300"}`}>
                          {item.employee > 0 ? `${fmt(item.employee)}원` : "-"}
                        </td>
                        <td className={`py-4 px-6 text-right font-bold text-text-primary text-[16px] ${i < result.items.length - 1 ? "border-b border-ui-border" : "border-b border-slate-300"}`}>{fmt(item.employer)}원</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50/30">
                      <td className="py-4 px-6 border-b border-ui-border"><div className="font-extrabold text-text-primary text-[15px]">4대보험 소계</div></td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-extrabold text-text-primary text-[17px]">{fmt(result.grandTotal)}원</td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-extrabold text-brand-blue text-[17px]">{fmt(result.totalEmployee)}원</td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-extrabold text-text-primary text-[17px]">{fmt(result.totalEmployer)}원</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 border-b border-ui-border">
                        <div className="font-bold text-text-primary text-[15px]">소득세</div>
                        <div className="text-[12px] text-text-secondary mt-0.5">간이세액표 기준 (원천징수 100%)</div>
                      </td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-bold text-text-primary text-[16px]">{fmt(result.incomeTax)}원</td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-bold text-brand-blue text-[16px]">{fmt(result.incomeTax)}원</td>
                      <td className="py-4 px-6 border-b border-ui-border text-right font-bold text-text-primary text-[16px]">-</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 border-b border-slate-300">
                        <div className="font-bold text-text-primary text-[15px]">지방소득세</div>
                        <div className="text-[12px] text-text-secondary mt-0.5">소득세의 10%</div>
                      </td>
                      <td className="py-4 px-6 border-b border-slate-300 text-right font-bold text-text-primary text-[16px]">{fmt(result.localIncomeTax)}원</td>
                      <td className="py-4 px-6 border-b border-slate-300 text-right font-bold text-brand-blue text-[16px]">{fmt(result.localIncomeTax)}원</td>
                      <td className="py-4 px-6 border-b border-slate-300 text-right font-bold text-text-primary text-[16px]">-</td>
                    </tr>
                    <tr className="bg-brand-navy/5">
                      <td className="py-5 px-6"><div className="font-extrabold text-text-primary text-[16px]">근로자 총 공제액</div></td>
                      <td className="py-5 px-6 text-right font-extrabold text-text-primary text-[18px]">{fmt(result.totalWithholding)}원</td>
                      <td className="py-5 px-6 text-right font-extrabold text-brand-blue text-[18px]">{fmt(result.totalWithholding)}원</td>
                      <td className="py-5 px-6 text-right font-extrabold text-text-primary text-[18px]">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100 flex flex-col justify-center text-center shadow-sm">
                  <span className="text-sm font-bold text-brand-blue mb-2">근로자 부담 합계</span>
                  <div className="flex items-baseline justify-center gap-1.5 text-brand-blue">
                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(result.totalEmployee)}</span>
                    <span className="text-lg md:text-xl font-bold">원</span>
                  </div>
                  <div className="text-[12px] font-medium text-blue-400 mt-2">월 급여에서 공제되는 금액</div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 flex flex-col justify-center text-center shadow-sm">
                  <span className="text-sm font-bold text-text-secondary mb-2">사업주 부담 합계</span>
                  <div className="flex items-baseline justify-center gap-1.5 text-text-primary">
                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(result.totalEmployer)}</span>
                    <span className="text-lg md:text-xl font-bold">원</span>
                  </div>
                  <div className="text-[12px] font-medium text-slate-400 mt-2">사업주가 납부해야 할 금액 (산재보험 포함)</div>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 md:p-8 text-white relative shadow-lg overflow-hidden">
                  <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <span className="text-blue-300 text-[13px] font-bold block mb-1">근로자 총 공제액 (4대보험+소득세+지방소득세)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">{fmt(result.totalWithholding)}</span>
                        <span className="text-lg text-blue-100 font-bold">원</span>
                      </div>
                    </div>
                    <div className="w-px h-12 bg-white/20 hidden md:block" />
                    <div className="text-center md:text-right">
                      <span className="text-green-300 text-[13px] font-bold block mb-1">예상 실수령액</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-300">{fmt(result.netPay)}</span>
                        <span className="text-lg text-green-200 font-bold">원</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mt-8 mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li>본 계산기는 개략적인 예상 보험료를 산출하기 위한 참고용 도구이며, 실제 부과 금액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">비과세 급여</strong>: 식대(월 20만원), 자가운전보조금(월 20만원), 출산·보육수당(자녀 1인당 월 20만원) 등은 4대보험 보수월액에서 제외됩니다. 각 비과세 한도를 초과하는 금액은 과세 대상입니다.</li>
              <li><strong className="text-text-primary font-bold">국민연금 상하한액</strong>: 기준소득월액 상한액(637만원)과 하한액(40만원)이 적용됩니다. (2025.7.1~2026.6.30 기준)</li>
              <li><strong className="text-text-primary font-bold">산재보험</strong>: 업종별 요율이 상이하며 사업주가 전액 부담합니다. 본 계산기의 업종 분류는 간략화된 것이므로, 정확한 요율은 근로복지공단에서 확인하시기 바랍니다.</li>
              <li><strong className="text-text-primary font-bold">국민연금 요율 변경</strong>: 2026년부터 국민연금 요율이 기존 9%에서 9.5%로 인상되었습니다.</li>
              <li><strong className="text-text-primary font-bold">소득세 원천징수</strong>: 간이세액표 기준 100%로 계산됩니다. 실제 원천징수는 80%·100%·120% 중 선택 가능하며, 연말정산 시 최종 정산됩니다. 부양가족 수에 따라 세액이 달라집니다.</li>
              <li>정확한 4대보험료 산출 및 세무/노무 관련 상담은 반드시 전문가와 상담하시기 바랍니다.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">4대보험 관련 궁금한 점이 있으시면 편하게 연락주세요.</p>
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

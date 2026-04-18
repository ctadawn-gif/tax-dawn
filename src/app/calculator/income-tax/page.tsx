"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  calculateIncomeTax,
  type IncomeType,
  type ExpenseMethod,
} from "@/lib/incomeTaxCalc";
import {
  INDUSTRY_RATES,
  CATEGORIES,
  searchIndustry,
  type IndustryRate,
} from "@/lib/industryRates";

const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");

function Counter({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (v: number) => void;
}) {
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

function IndustrySearch({
  selected,
  onSelect,
}: {
  selected: IndustryRate | null;
  onSelect: (r: IndustryRate | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = query.trim()
    ? searchIndustry(query)
    : showAll
      ? INDUSTRY_RATES
      : [];

  const grouped = useMemo(() => {
    const map: Record<string, IndustryRate[]> = {};
    for (const r of results) {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    }
    return map;
  }, [results]);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[14px] font-bold text-text-secondary mb-2">
        업종 선택 <span className="text-xs font-normal text-slate-400">(업종코드 또는 업종명 검색)</span>
      </label>

      {selected ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-brand-blue/30 rounded-xl">
          <div>
            <span className="text-xs text-brand-blue font-medium">{selected.code}</span>
            <span className="text-[14px] font-bold text-text-primary ml-2">{selected.name}</span>
          </div>
          <button
            onClick={() => { onSelect(null); setQuery(""); }}
            className="text-xs text-text-secondary hover:text-red-500 transition-colors px-2 py-1"
          >
            변경
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setShowAll(false); }}
            onFocus={() => setOpen(true)}
            placeholder="예: 940909, 프로그래머, 커피숍..."
            className="w-full pl-4 pr-4 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[15px] text-text-primary"
          />
          {!query.trim() && open && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-2 text-xs text-brand-blue font-medium hover:underline"
            >
              전체 업종 목록 보기
            </button>
          )}
        </div>
      )}

      {open && !selected && Object.keys(grouped).length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-ui-border rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-text-secondary sticky top-0">{cat}</div>
              {items.map((r) => (
                <button
                  key={r.code}
                  onClick={() => { onSelect(r); setOpen(false); setQuery(""); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center gap-3"
                >
                  <span className="text-xs text-text-secondary font-mono w-16 shrink-0">{r.code}</span>
                  <span className="text-sm text-text-primary font-medium">{r.name}</span>
                  <span className="ml-auto text-xs text-text-secondary">
                    단순 {r.simpleRate}%
                    {r.simpleExcessRate != null && ` / ${r.simpleExcessRate}%`}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IncomeTaxCalculator() {
  const [incomeType, setIncomeType] = useState<IncomeType>("business");
  const [businessRevenue, setBusinessRevenue] = useState<number | string>("");
  const [expenseMethod, setExpenseMethod] = useState<ExpenseMethod>("simple");
  const [industryRate, setIndustryRate] = useState<IndustryRate | null>(null);
  const [manualExpenseRate, setManualExpenseRate] = useState<number | string>("");
  const [bookExpense, setBookExpense] = useState<number | string>("");
  const [hasWithholding, setHasWithholding] = useState(false);
  const [salaryRevenue, setSalaryRevenue] = useState<number | string>("");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependents, setDependents] = useState(0);
  const [elderly, setElderly] = useState(0);
  const [disabled, setDisabled] = useState(0);
  const [socialInsurance, setSocialInsurance] = useState<number | string>("");
  const [prepaidTax, setPrepaidTax] = useState<number | string>("");

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const result = useMemo(
    () =>
      calculateIncomeTax({
        incomeType,
        businessRevenue: n(businessRevenue),
        expenseMethod,
        industryRate,
        manualExpenseRate: n(manualExpenseRate),
        bookExpense: n(bookExpense),
        hasWithholding,
        salaryRevenue: n(salaryRevenue),
        hasSpouse,
        dependents,
        elderly,
        disabled,
        socialInsurance: n(socialInsurance),
        prepaidTax: n(prepaidTax),
      }),
    [incomeType, businessRevenue, expenseMethod, industryRate, manualExpenseRate, bookExpense, hasWithholding, salaryRevenue, hasSpouse, dependents, elderly, disabled, socialInsurance, prepaidTax]
  );

  const incomeTypes: { k: IncomeType; l: string }[] = [
    { k: "business", l: "사업/프리랜서" },
    { k: "salary", l: "근로소득" },
    { k: "combined", l: "종합 (사업+근로)" },
  ];

  const expenseMethods: { k: ExpenseMethod; l: string }[] = [
    { k: "simple", l: "단순경비율" },
    { k: "standard", l: "기준경비율" },
    { k: "book", l: "장부작성" },
  ];

  const showBusiness = incomeType === "business" || incomeType === "combined";
  const showSalary = incomeType === "salary" || incomeType === "combined";

  const selectedRateDisplay = industryRate
    ? expenseMethod === "simple"
      ? industryRate.simpleExcessRate != null
        ? `기본 ${industryRate.simpleRate}% / 초과 ${industryRate.simpleExcessRate}%`
        : `${industryRate.simpleRate}%`
      : expenseMethod === "standard"
        ? `${industryRate.standardRate}%`
        : "장부작성"
    : null;

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
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">종합소득세 예상세액 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">소득 유형과 공제 항목을 입력하면 예상 세액을 바로 확인할 수 있습니다</p>
          </div>

          {/* 소득 유형 선택 */}
          <div className="bg-white rounded-2xl p-4 md:px-8 md:py-5 border border-ui-border shadow-sm flex justify-center items-center mb-12">
            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-[600px]">
              {incomeTypes.map((t) => (
                <button key={t.k} onClick={() => setIncomeType(t.k)} className={`flex-1 px-4 py-2.5 rounded-md text-[15px] transition-all ${incomeType === t.k ? "bg-white shadow-sm font-bold text-brand-blue" : "font-medium text-text-secondary hover:text-text-primary"}`}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* 입력 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 사업/프리랜서 소득 */}
            {showBusiness && (
              <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">사업/프리랜서 소득</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-bold text-text-secondary mb-2">총수입금액 <span className="text-xs font-normal text-slate-400">(연간)</span></label>
                    <div className="relative">
                      <input type="number" inputMode="numeric" value={businessRevenue} onChange={(e) => setBusinessRevenue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                      <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-text-secondary mb-2">경비처리 방법</label>
                    <div className="grid grid-cols-3 gap-2">
                      {expenseMethods.map((m) => (
                        <button key={m.k} onClick={() => setExpenseMethod(m.k)} className={`text-center py-2.5 rounded-xl border text-sm font-medium transition-all ${expenseMethod === m.k ? "border-brand-blue bg-blue-50 text-brand-blue" : "border-ui-border text-text-secondary"}`}>{m.l}</button>
                      ))}
                    </div>
                  </div>

                  {expenseMethod !== "book" && (
                    <IndustrySearch selected={industryRate} onSelect={setIndustryRate} />
                  )}

                  {expenseMethod !== "book" && !industryRate && (
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">경비율 직접 입력 <span className="text-xs font-normal text-slate-400">(업종 미선택 시)</span></label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={manualExpenseRate} onChange={(e) => setManualExpenseRate(e.target.value === "" ? "" : Number(e.target.value))} placeholder="64.1" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">%</span>
                      </div>
                    </div>
                  )}

                  {expenseMethod !== "book" && industryRate && selectedRateDisplay && (
                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <p className="text-xs text-brand-blue font-medium">
                        적용 경비율: {selectedRateDisplay}
                        {industryRate.simpleExcessRate != null && expenseMethod === "simple" && (
                          <span className="block mt-1 text-text-secondary">4,000만원 이하 기본율 / 초과분 초과율 적용</span>
                        )}
                      </p>
                    </div>
                  )}

                  {expenseMethod === "book" && (
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">필요경비 <span className="text-xs font-normal text-slate-400">(직접 입력)</span></label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={bookExpense} onChange={(e) => setBookExpense(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-ui-surface rounded-xl">
                    <span className="text-[14px] font-bold text-text-secondary">3.3% 원천징수 대상</span>
                    <button onClick={() => setHasWithholding(!hasWithholding)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${hasWithholding ? "bg-brand-blue" : "bg-slate-200"}`}>
                      <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${hasWithholding ? "left-[26px]" : "left-[2px]"}`} />
                    </button>
                  </div>

                  {/* 종합 선택 시 근로소득도 같은 카드 안에 */}
                  {incomeType === "combined" && (
                    <div className="pt-4 mt-4 border-t border-ui-border">
                      <div className="flex items-center gap-2 mb-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        <span className="text-[15px] font-bold text-text-primary">근로소득</span>
                      </div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">총급여액 <span className="text-xs font-normal text-slate-400">(연간)</span></label>
                      <div className="relative">
                        <input type="number" inputMode="numeric" value={salaryRevenue} onChange={(e) => setSalaryRevenue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 근로소득 (단독일 때만) */}
            {incomeType === "salary" && (
              <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">근로소득</h3>
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">총급여액 <span className="text-xs font-normal text-slate-400">(연간)</span></label>
                  <div className="relative">
                    <input type="number" inputMode="numeric" value={salaryRevenue} onChange={(e) => setSalaryRevenue(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                    <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                  </div>
                </div>
              </div>
            )}

            {/* 인적공제 */}
            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">공제 항목</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-ui-surface rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-text-secondary">배우자 공제</span>
                    <button onClick={() => setHasSpouse(!hasSpouse)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${hasSpouse ? "bg-brand-blue" : "bg-slate-200"}`}>
                      <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${hasSpouse ? "left-[26px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">배우자 연간 소득금액 100만원 이하 (근로소득만 있는 경우 총급여 500만원 이하) 시 150만원 공제</p>
                </div>
                <Counter label="부양가족 수" sub="(본인/배우자 제외)" value={dependents} onChange={setDependents} />
                <Counter label="경로우대" sub="(70세 이상)" value={elderly} onChange={setElderly} />
                <Counter label="장애인 공제" value={disabled} onChange={setDisabled} />

                <div className="pt-2">
                  <label className="block text-[14px] font-bold text-text-secondary mb-2">국민연금·건강보험료 <span className="text-xs font-normal text-slate-400">(연간)</span></label>
                  <div className="relative">
                    <input type="number" inputMode="numeric" value={socialInsurance} onChange={(e) => setSocialInsurance(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                    <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                  </div>
                </div>

                {!hasWithholding && (
                  <div className="pt-2">
                    <label className="block text-[14px] font-bold text-text-secondary mb-2">기납부세액 <span className="text-xs font-normal text-slate-400">(미리 납부한 세금)</span></label>
                    <div className="relative">
                      <input type="number" inputMode="numeric" value={prepaidTax} onChange={(e) => setPrepaidTax(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                      <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                    </div>
                  </div>
                )}

                {hasWithholding && (
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex gap-2 items-start">
                    <svg className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <p className="text-xs leading-relaxed text-brand-blue font-medium">
                      3.3% 원천징수(소득세 3% + 지방소득세 0.3%) 기납부세액이 자동 계산됩니다: {fmt(n(businessRevenue) * 0.033)}만원
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 결과 섹션 */}
          <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden mt-12 mb-12 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue" />
                <div className="mx-6 md:mx-8 mt-5 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>

            <div className="bg-slate-50/80 p-6 md:p-8 border-b border-ui-border">
              <div className="flex flex-col gap-6">
                {/* 사업소득 흐름 */}
                {showBusiness && result.businessRevenue > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-center w-full max-w-4xl mx-auto">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-text-secondary mb-1">사업 수입금액</span>
                      <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-slate-200 pb-1">{fmt(result.businessRevenue)}만원</span>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-text-secondary mb-1">필요경비 ({result.appliedExpenseRate})</span>
                      <span className="text-base md:text-lg font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(result.businessExpense)}만원</span>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-brand-blue mb-1">사업소득금액</span>
                      <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(result.businessIncome)}만원</span>
                    </div>
                  </div>
                )}

                {/* 근로소득 흐름 */}
                {showSalary && result.salaryRevenue > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-center w-full max-w-4xl mx-auto">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-text-secondary mb-1">총급여액</span>
                      <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-slate-200 pb-1">{fmt(result.salaryRevenue)}만원</span>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-text-secondary mb-1">근로소득공제</span>
                      <span className="text-base md:text-lg font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(result.salaryDeduction)}만원</span>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-brand-blue mb-1">근로소득금액</span>
                      <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(result.salaryIncome)}만원</span>
                    </div>
                  </div>
                )}

                {/* 과세표준 */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-center w-full max-w-4xl mx-auto">
                  {incomeType === "combined" && (
                    <>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-text-secondary mb-1">종합소득금액</span>
                        <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-slate-200 pb-1">{fmt(result.totalIncome)}만원</span>
                      </div>
                      <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                    </>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-secondary mb-1">소득공제 합계</span>
                    <span className="text-base md:text-lg font-bold text-red-500 border-b-2 border-slate-200 pb-1">- {fmt(result.totalDeduction)}만원</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M20 12L14 6M20 12L14 18" /></svg>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-brand-blue mb-1">과세표준</span>
                    <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-brand-blue pb-1">{fmt(result.taxableIncome)}만원</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-secondary mb-1">적용세율</span>
                    <span className="text-base md:text-lg font-bold text-text-primary border-b-2 border-slate-200 pb-1">{result.taxRate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h4 className="text-lg font-bold text-text-primary mb-6">예상 납부 세액 결과</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-ui-surface rounded-2xl p-6 border border-ui-border">
                  <span className="text-sm font-bold text-text-secondary mb-2 block">소득세 (결정세액)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-text-primary tracking-tight">{fmt(result.determinedTax)}</span>
                    <span className="text-base text-text-secondary font-medium">만원</span>
                  </div>
                </div>
                <div className="bg-ui-surface rounded-2xl p-6 border border-ui-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-text-secondary">지방소득세</span>
                    <span className="text-[11px] font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded">소득세의 10%</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-text-primary tracking-tight">{fmt(result.localTax)}</span>
                    <span className="text-base text-text-secondary font-medium">만원</span>
                  </div>
                </div>
                <div className="lg:col-span-2 bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 md:p-8 text-white relative shadow-lg overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-blue-200 text-[15px] font-bold mb-2 block">총 납부세액 (소득세 + 지방소득세)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{fmt(result.totalTax)}</span>
                      <span className="text-xl text-blue-100 font-medium">만원</span>
                    </div>
                  </div>
                </div>
              </div>

              {(hasWithholding || n(prepaidTax) > 0) && (
                <div className="mt-6 pt-6 border-t border-dashed border-ui-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50/30 p-5 rounded-xl">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded bg-brand-blue text-white text-[11px] font-bold mb-2">기납부세액 반영</span>
                    <div className="text-sm font-medium text-text-primary">
                      기납부세액 <span className="font-bold text-brand-blue ml-1">{fmt(result.prepaidTax)}만원</span> 을 제외한 최종 결과입니다.
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 bg-white px-5 py-3 rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-sm font-bold text-text-secondary">
                      예상 <span className={result.finalTax < 0 ? "text-brand-blue" : "text-red-500"}>{result.finalTax < 0 ? "환급액" : "추가납부액"}</span>
                    </span>
                    <span className={`text-xl font-extrabold tracking-tight ${result.finalTax < 0 ? "text-brand-blue" : "text-red-500"}`}>{fmt(Math.abs(result.finalTax))}</span>
                    <span className="text-sm text-text-secondary font-medium">만원</span>
                  </div>
                </div>
              )}

              {/* 근로소득 안내 */}
              {incomeType === "salary" && (
                <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-ui-border">
                  <div className="flex gap-2 items-start">
                    <svg className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <div className="text-[13px] text-text-secondary leading-relaxed">
                      <strong className="text-text-primary font-bold block mb-1">근로소득자의 세금 납부 안내</strong>
                      근로소득만 있는 경우, 매월 급여 지급 시 간이세액표에 따라 소득세가 원천징수되고, 다음 해 2월 연말정산을 통해 최종 정산이 이루어집니다. 위 결과는 연간 총 결정세액이며, 실제로는 이미 매월 납부한 세금(원천징수액)과의 차액만 추가 납부하거나 환급받게 됩니다.
                    </div>
                  </div>
                </div>
              )}

              {/* 종합소득 안내 */}
              {incomeType === "combined" && (
                <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-ui-border">
                  <div className="flex gap-2 items-start">
                    <svg className="w-4 h-4 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    <div className="text-[13px] text-text-secondary leading-relaxed">
                      <strong className="text-text-primary font-bold block mb-1">사업소득 + 근로소득 종합과세 안내</strong>
                      근로소득과 사업소득이 함께 있는 경우, 종합소득세 신고 시 두 소득을 합산하여 세액을 계산합니다. 이때 근로소득에 대해 연말정산으로 이미 정산된 결정세액은 기납부세액으로 차감됩니다. 위 기납부세액 란에 연말정산 결정세액을 입력하시면 실제 추가 납부할 세액을 확인할 수 있습니다.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc">
              <li>본 계산기는 개략적인 예상 세액을 산출하기 위한 참고용 도구입니다. 실제 세액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">세액공제 및 세액감면(중소기업 특별세액감면, 자녀세액공제, 연금계좌세액공제, 신용카드 소득공제 등) 항목은 본 간편 계산기에 반영되어 있지 않습니다.</strong> 정확한 계산은 장부기장을 통해 산출해야 합니다.</li>
              <li>사업소득의 단순경비율 및 기준경비율은 업종코드에 따라 상이하며, 2025년 귀속 경비율 고시(국세청고시 제2026-14호)를 기준으로 합니다.</li>
              <li>인적용역(940*** 업종)은 수입금액 4,000만원 이하분은 기본율, 초과분은 초과율이 적용됩니다.</li>
              <li>종합소득세 신고 시에는 가산세 등 다양한 변수가 적용될 수 있으므로, 정확한 신고를 위해 세무 전문가와 상담하는 것을 권장합니다.</li>
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

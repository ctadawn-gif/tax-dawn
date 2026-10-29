"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  calculateInheritanceTax,
  calculateGiftTax,
  giftReportDeadline,
  installmentAmountWon,
  type GiftRelation,
} from "@/lib/inheritGiftTaxCalc";
import PrintButton, { PrintHeader } from "@/components/PrintButton";
import CalculatorShareBar from "@/components/CalculatorShareBar";
import { formatNumberInput, parseNumberInput } from "@/lib/formatInput";
import RelatedPosts from "@/components/blog/RelatedPosts";

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

/** 원 → "1억 537만 원" / "485만 원" / "9,000원" (만 원 단위 반올림) */
function wonKo(won: number): string {
  const w = Math.round(won);
  if (Math.abs(w) < 10000) return `${w.toLocaleString("ko-KR")}원`;
  const man = Math.round(w / 10000);
  const eok = Math.floor(man / 10000);
  const rest = man % 10000;
  if (eok > 0) return `${eok.toLocaleString("ko-KR")}억${rest ? ` ${rest.toLocaleString("ko-KR")}만` : ""} 원`;
  return `${rest.toLocaleString("ko-KR")}만 원`;
}

const DOW = ["일", "월", "화", "수", "목", "금", "토"];
function dateKoDow(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일(${DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]})`;
}

const noopSubscribe = () => () => {};
function todayKST(): string {
  const k = new Date(Date.now() + 9 * 3600000);
  return `${k.getUTCFullYear()}-${String(k.getUTCMonth() + 1).padStart(2, "0")}-${String(k.getUTCDate()).padStart(2, "0")}`;
}

/** 구절 묶음 — 줄이 바뀌어도 구절 사이에서만 끊기게 */
function Ph({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`whitespace-nowrap ${className}`}>{children}</span>;
}

/** 원 단위 금액 입력 + 아래 한글 보조 표시 (차용증 페이지와 같은 방식) */
function WonField({
  label,
  hint,
  value,
  onChange,
  big = false,
}: {
  label: string;
  hint?: string;
  value: number | "";
  onChange: (v: number | "") => void;
  big?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-text-secondary mb-2">
        {label} {hint && <span className="text-xs font-normal text-slate-400 ml-1 whitespace-nowrap">({hint})</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={formatNumberInput(value)}
          onChange={(e) => onChange(parseNumberInput(e.target.value) as number | "")}
          placeholder="0"
          className={`w-full pl-4 pr-10 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary ${big ? "py-3.5 text-lg md:text-xl" : "py-3 text-[15px]"}`}
        />
        <span className={`absolute right-4 text-text-secondary font-medium ${big ? "top-4 text-base" : "top-3 text-sm"}`}>원</span>
      </div>
      {value !== "" && value > 0 && <p className="mt-1.5 text-[13px] font-semibold text-brand-blue text-right">= {wonKo(value)}</p>}
    </div>
  );
}

function FlowCell({ label, value, tone, sub }: { label: string; value: string; tone?: "minus" | "plus" | "key"; sub?: string }) {
  return (
    <div className="flex flex-col min-w-[80px]">
      <span className={`text-[12px] md:text-[13px] mb-1 ${tone === "key" ? "font-bold text-brand-blue" : "font-medium text-text-secondary"}`}>{label}</span>
      <span
        className={`text-sm md:text-base font-bold border-b-2 pb-1 ${tone === "key" ? "border-brand-blue text-text-primary" : "border-slate-200"} ${
          tone === "minus" ? "text-red-500" : tone === "plus" ? "text-brand-blue" : "text-text-primary"
        }`}
      >
        {value}
      </span>
      {sub && <span className="mt-1 text-[11px] text-slate-500">{sub}</span>}
    </div>
  );
}

function ResultCard({ label, value, minus, muted }: { label: string; value: string; minus?: boolean; muted?: boolean }) {
  return (
    <div className="bg-ui-surface rounded-2xl p-5 border border-ui-border">
      <span className="text-xs md:text-sm font-bold text-text-secondary mb-1 block">{label}</span>
      <div className={`text-xl md:text-2xl font-extrabold tracking-tight ${minus ? "text-red-500" : muted ? "text-slate-500" : "text-text-primary"}`}>{value}</div>
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
  const [inhParents, setInhParents] = useState(0); // 자녀가 없을 때 생존 부모 수 (배우자 법정상속분)
  const [inhFinancial, setInhFinancial] = useState<number | string>(""); // 순금융재산 (금융재산상속공제)

  // 증여세 입력 — 원 단위 (차용증 페이지와 같음). 엔진은 만원 단위라 ÷10000 해서 넘김
  const [giftAmountWon, setGiftAmountWon] = useState<number | "">("");
  const [giftRelation, setGiftRelation] = useState<GiftRelation>("linealAdult");
  const [giftDebtWon, setGiftDebtWon] = useState<number | "">("");
  const [giftPriorWon, setGiftPriorWon] = useState<number | "">("");
  const [giftOtherUsedWon, setGiftOtherUsedWon] = useState<number | "">("");
  const [giftGenSkip, setGiftGenSkip] = useState(false);
  const [giftMarriage, setGiftMarriage] = useState(false);
  const [giftBirth, setGiftBirth] = useState(false);
  const [giftMbUsedWon, setGiftMbUsedWon] = useState<number | "">("");
  const [giftNonTaxWon, setGiftNonTaxWon] = useState<number | "">("");
  const [giftFeeWon, setGiftFeeWon] = useState<number | "">("");
  const [giftPriorTaxWon, setGiftPriorTaxWon] = useState<number | "">("");
  const [giftNetMode, setGiftNetMode] = useState(false); // 자녀 손에 X원을 남기려면 (세금까지 증여)
  // 증여일 — 기본 오늘(클라이언트 날짜), 바꾸면 그 값
  const today = useSyncExternalStore(noopSubscribe, todayKST, () => "");
  const [giftDateManual, setGiftDateManual] = useState<string | null>(null);
  const giftDate = giftDateManual ?? today;

  const n = (v: number | string) => (v === "" ? 0 : Number(v));

  const inhResult = useMemo(() => calculateInheritanceTax({
    totalAssets: n(inhAssets), debtsAndExpenses: n(inhDebts), hasSpouse: inhSpouse,
    spouseInheritance: n(inhSpouseAmount), children: inhChildren, minorChildren: inhMinor,
    minorRemainingYears: n(inhMinorYears), elderlyCount: inhElderly,
    priorGiftsToHeir: n(inhPriorGifts), priorGiftsToSpouse: 0, generationSkip: inhGenSkip,
    parentsAlive: inhParents, netFinancialAssets: n(inhFinancial),
  }), [inhAssets, inhDebts, inhSpouse, inhSpouseAmount, inhChildren, inhMinor, inhMinorYears, inhElderly, inhPriorGifts, inhGenSkip, inhParents, inhFinancial]);
  // 만원 → "10억" / "1억 2,857만" — 상속 탭은 만원 단위 입력
  const manKo = (m: number) => wonKo(m * 10000).replace(/ 원$/, "");
  // 배우자 법정상속분 표시용 — "1.5 ÷ (1.5 + 자녀 3) = 33.3%"
  const inhCoHeirs = inhChildren > 0 ? inhChildren : inhParents;
  const inhShareText = inhCoHeirs > 0
    ? `1.5 ÷ (1.5 + ${inhChildren > 0 ? `자녀 ${inhChildren}` : `부모 ${inhParents}`}) = ${(inhResult.spouseLegalShare * 100).toFixed(1)}%`
    : "단독 상속 100%";
  const inhDeductionParts = [
    inhResult.appliedDeduction === "일괄공제 (5억)" ? "일괄 5억" : `기초+인적 ${manKo(inhResult.personalDeductionTotal)}`,
    inhSpouse ? `배우자 ${manKo(inhResult.spouseDeduction)}` : "",
    inhResult.financialDeduction > 0 ? `금융재산 ${manKo(inhResult.financialDeduction)}` : "",
  ].filter(Boolean).join(" + ");

  const toChild = giftRelation === "linealAdult" || giftRelation === "linealMinor";
  // 같은 공제 그룹(직계존속·직계비속·기타친족)의 다른 분께 받아 이미 쓴 공제
  const otherUsedLabel =
    toChild ? "다른 직계존속께 10년 안에 받아 이미 쓴 공제"
    : giftRelation === "linealAscendant" ? "다른 자녀(직계비속)께 10년 안에 받아 이미 쓴 공제"
    : giftRelation === "otherRelative" ? "다른 친족께 10년 안에 받아 이미 쓴 공제"
    : null;
  const giftResult = useMemo(() => {
    const man = (v: number | "") => (v === "" ? 0 : v / 10000);
    return calculateGiftTax({
      giftAmount: man(giftAmountWon),
      relation: giftRelation,
      priorGifts10yr: man(giftPriorWon),
      otherExemptionUsed: otherUsedLabel ? man(giftOtherUsedWon) : 0,
      debtAssumption: man(giftDebtWon),
      generationSkip: giftGenSkip,
      // 미성년 손자녀 · 증여재산가액(채무 차감 후) 20억 초과 → 할증 40% (자동)
      isMinorOver20: giftRelation === "linealMinor" && giftGenSkip && man(giftAmountWon) - man(giftDebtWon) > 200000,
      nonTaxable: man(giftNonTaxWon),
      appraisalFee: man(giftFeeWon),
      marriage: toChild && giftMarriage,
      birth: toChild && giftBirth,
      marriageBirthUsed: man(giftMbUsedWon),
      priorGiftTaxPaid: giftPriorTaxWon === "" ? undefined : man(giftPriorTaxWon),
      taxPaidByDonor: giftNetMode,
    });
  }, [giftAmountWon, giftRelation, giftPriorWon, giftOtherUsedWon, giftDebtWon, giftGenSkip, giftNonTaxWon, giftFeeWon, toChild, giftMarriage, giftBirth, giftMbUsedWon, giftPriorTaxWon, giftNetMode, otherUsedLabel]);
  // 흐름 표시용 — 이번 증여분 과세가액 (사전증여 가산 전)
  const giftThisBase = giftResult.taxableBase - giftResult.priorGifts10yr;
  const giftDeductionSub = [
    giftResult.exemption > 0 || giftResult.marriageBirthExemption > 0 ? `기본 ${wonKo(giftResult.exemption * 10000).replace(" 원", "")}` : "",
    giftResult.marriageBirthExemption > 0 ? `${giftResult.marriageBirthLabel} ${wonKo(giftResult.marriageBirthExemption * 10000).replace(" 원", "")}` : "",
    giftResult.appraisalFee > 0 ? `수수료 ${wonKo(giftResult.appraisalFee * 10000).replace(" 원", "")}` : "",
  ].filter(Boolean).join(" + ");
  const giftEffectiveRate =
    giftResult.giftAmount > 0 ? Number(((giftResult.finalTaxWon / (giftResult.giftAmount * 10000)) * 100).toPrecision(3)).toString() : "0";
  const giftDeadline = giftDate ? giftReportDeadline(giftDate) : null;
  const giftInstallment = installmentAmountWon(giftResult.finalTaxWon);

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
      <div className="bg-grid hidden md:block" />

      {/* ── Mobile Nav ─────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between h-[48px] px-5 bg-white border-b border-slate-100">
        <Link href="/" className="no-underline text-[14px] font-medium text-slate-800 tracking-tight">세무회계 새벽</Link>
        <Link href="/contact" className="no-underline px-3 py-1.5 rounded-lg bg-brand-blue text-white text-[12px] font-bold tracking-tight">
          상담하기 →
        </Link>
      </header>

      {/* ── Mobile Hero ─────────────────────────── */}
      <section className="md:hidden bg-gradient-to-b from-blue-50/60 to-white pt-8 pb-10 px-5 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-brand-blue rounded-full text-[13px] font-semibold tracking-tight mb-5">
          <span>🧮</span>
          <span className="pt-[1px]">무료 세금 계산기</span>
        </div>
        <h1 className="text-[28px] font-extrabold text-slate-900 leading-[1.25] tracking-tight mb-3.5">
          상속·증여세
          <br />
          간편 계산기
        </h1>
        <p className="text-[15px] font-medium text-slate-500 leading-[1.5] tracking-tight">
          상속세와 증여세 예상 세액을
          <br />
          간편하게 확인합니다.
        </p>
      </section>

      {/* ── Desktop Nav (기존 유지) ─────────────────────────── */}
      <nav className="hidden md:flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <a href="https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-colors shadow-sm flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>톡톡 문의하기</a>
      </nav>

      <section className="relative pt-12 pb-32 px-6 overflow-hidden">
        <div className="max-w-[1200px] w-full mx-auto relative z-10">
          <div className="hidden md:block text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">무료 세금 계산기</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">상속·증여세 간편 계산기</h1>
            <p className="text-lg text-text-secondary font-medium">상속세와 증여세 예상 세액을 간편하게 확인해보세요</p>
          </div>

          <CalculatorShareBar
            title="상속세 · 증여세 계산기"
            description="배우자·자녀 공제와 세대생략 할증까지 반영해 예상 세액을 바로 확인."
            slug="inherit-gift"
          />

          {/* 탭 */}
          <div className="no-print bg-white rounded-2xl p-4 md:px-8 md:py-5 border border-ui-border shadow-sm flex justify-center items-center mb-12">
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
              <div className="no-print grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                        <input type="text" inputMode="numeric" value={formatNumberInput(inhAssets)} onChange={(e) => setInhAssets(parseNumberInput(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">채무·공과금·장례비용</label>
                      <div className="relative">
                        <input type="text" inputMode="numeric" value={formatNumberInput(inhDebts)} onChange={(e) => setInhDebts(parseNumberInput(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">순금융재산 <span className="text-xs font-normal text-slate-400 ml-1 whitespace-nowrap">(예금·주식·보험 − 금융채무)</span></label>
                      <div className="relative">
                        <input type="text" inputMode="numeric" value={formatNumberInput(inhFinancial)} onChange={(e) => setInhFinancial(parseNumberInput(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
                        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                      </div>
                      {n(inhFinancial) > 0 && (
                        <p className="mt-1.5 text-[12px] text-brand-blue font-semibold text-right">
                          금융재산상속공제 {manKo(inhResult.financialDeduction)} 원
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-slate-400 leading-relaxed text-pretty">
                        <Ph>총 상속재산에 포함된 금액.</Ph> <Ph>2천만 이하 전액 ·</Ph> <Ph>1억 이하 2천만 ·</Ph>{" "}
                        <Ph>넘으면 20% (최대 2억)</Ph>
                      </p>
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
                          <input type="text" inputMode="numeric" value={formatNumberInput(inhSpouseAmount)} onChange={(e) => setInhSpouseAmount(parseNumberInput(e.target.value))} placeholder="미입력 시 최소 5억 적용" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px] placeholder-slate-400" />
                          <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">만원</span>
                        </div>
                        {n(inhAssets) > 0 && (
                          <div className="mt-2 rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-2 text-[12px] text-text-secondary leading-relaxed">
                            <div>
                              <Ph>법정상속분 {inhShareText}</Ph> <Ph>→ 한도 {manKo(inhResult.spouseLegalLimit)} 원</Ph>
                            </div>
                            <div className="font-bold text-brand-blue">
                              <Ph>배우자공제 {manKo(inhResult.spouseDeduction)} 원</Ph>{" "}
                              <Ph className="font-medium text-text-secondary">({inhResult.spouseDeductionBasis})</Ph>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <Counter label="자녀 수" value={inhChildren} onChange={setInhChildren} />
                    {inhSpouse && inhChildren === 0 && (
                      <Counter label="생존 부모 수" sub="자녀가 없으면 배우자와 함께 상속 (최대 2)" value={inhParents} onChange={(v) => setInhParents(Math.min(2, v))} />
                    )}
                    <div>
                      <label className="block text-[14px] font-bold text-text-secondary mb-2">10년 내 사전증여 합산액</label>
                      <div className="relative">
                        <input type="text" inputMode="numeric" value={formatNumberInput(inhPriorGifts)} onChange={(e) => setInhPriorGifts(parseNumberInput(e.target.value))} placeholder="0" className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]" />
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
              <div className="print-area bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden mt-12 mb-12 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue no-print" />
                <PrintHeader title="상속세 예상 계산 결과" />
                <div className="mx-6 md:mx-8 mt-5 mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-base md:text-lg font-bold text-text-primary">계산 결과</h4>
                  <PrintButton />
                </div>
                <div className="mx-6 md:mx-8 mt-2 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>
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
                      적용 공제: {inhDeductionParts}
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
              <div className="no-print max-w-4xl mx-auto mb-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">증여 정보</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                      <WonField
                        label={giftNetMode ? "자녀 손에 남길 금액 (세금은 따로 증여)" : "증여재산가액"}
                        value={giftAmountWon}
                        onChange={setGiftAmountWon}
                        big
                      />
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
                        기타 친족의 범위: 4촌 이내의 혈족, 3촌 이내의 인척 (상속세 및 증여세법 제53조, 2025.3.14 개정). 예시: 삼촌·이모·조카·사촌·사위·며느리 등.
                      </p>

                      {/* 혼인·출산 공제 — 직계존속 → 자녀일 때만 */}
                      {toChild && (
                        <div className="mt-5 rounded-xl bg-blue-50/50 border border-blue-100 p-4 space-y-3">
                          <div className="text-[13px] font-bold text-text-primary">
                            혼인·출산 증여재산공제 <span className="font-medium text-slate-500">+1억 (상증법 §53의2)</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
                              <input type="checkbox" checked={giftMarriage} onChange={(e) => setGiftMarriage(e.target.checked)} className="accent-brand-blue w-4 h-4" />
                              혼인신고일 전후 2년 안의 증여
                            </label>
                            <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
                              <input type="checkbox" checked={giftBirth} onChange={(e) => setGiftBirth(e.target.checked)} className="accent-brand-blue w-4 h-4" />
                              자녀 출생·입양일부터 2년 안의 증여
                            </label>
                          </div>
                          {(giftMarriage || giftBirth) && (
                            <WonField label="이미 쓴 혼인·출산공제" hint="둘 합쳐 평생 1억 한도" value={giftMbUsedWon} onChange={setGiftMbUsedWon} />
                          )}
                        </div>
                      )}
                    </div>

                    <WonField label="채무 인수액" hint="부담부증여 시" value={giftDebtWon} onChange={setGiftDebtWon} />
                    <WonField label="같은 분께 10년 안에 받은 금액" hint="합산과세" value={giftPriorWon} onChange={setGiftPriorWon} />
                    {otherUsedLabel && (
                      <div className="md:col-span-2">
                        <WonField label={otherUsedLabel} hint="공제만 차감" value={giftOtherUsedWon} onChange={setGiftOtherUsedWon} />
                      </div>
                    )}
                    {(toChild || giftRelation === "linealAscendant") && (
                      <p className="md:col-span-2 -mt-3 text-[12px] text-slate-500 leading-relaxed">
                        아버지·어머니는 한 사람으로 봅니다. 할아버지·할머니는 다른 사람이지만 5,000만 원 공제는 함께 씁니다.
                      </p>
                    )}

                    <div className="md:col-span-2 p-4 bg-ui-surface rounded-xl mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-text-secondary">세대생략 증여 (할증과세)</span>
                          <span className="text-[12px] text-slate-400 mt-0.5">조부모가 손자녀에게 <Ph>직접 증여하는 경우</Ph></span>
                        </div>
                        <button onClick={() => setGiftGenSkip(!giftGenSkip)} className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 shrink-0 ml-4 ${giftGenSkip ? "bg-brand-blue" : "bg-slate-200"}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${giftGenSkip ? "left-[26px]" : "left-[2px]"}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
                        산출세액의 30%가 할증됩니다 (미성년 · 20억 초과 → 40%, 자동 판단). 자녀가 먼저 사망해 손자녀가 대습상속인이 되는 경우는 할증하지 않습니다.
                      </p>
                    </div>

                    {/* 추가 항목 (선택) — 부동산계산기 수준의 세부 입력, 기본은 접힘 */}
                    <details className="md:col-span-2 group rounded-xl border border-ui-border">
                      <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between text-[14px] font-bold text-text-secondary">
                        추가 항목 (선택) <span className="text-[12px] font-medium text-slate-400 group-open:hidden">비과세 · 감정평가수수료 · 기납부세액</span>
                      </summary>
                      <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <WonField label="비과세·불산입액" hint="과세가액에서 제외" value={giftNonTaxWon} onChange={setGiftNonTaxWon} />
                        <WonField label="감정평가수수료" hint="500만 원 한도" value={giftFeeWon} onChange={setGiftFeeWon} />
                        <div className="md:col-span-2">
                          <WonField label="같은 분 사전증여 당시 산출세액" hint="비우면 자동 추정" value={giftPriorTaxWon} onChange={setGiftPriorTaxWon} />
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              {/* 증여세 결과 */}
              <div className="print-area bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden mt-8 mb-8 relative">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue no-print" />
                <PrintHeader title="증여세 예상 계산 결과" />
                <div className="mx-6 md:mx-8 mt-5 mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-base md:text-lg font-bold text-text-primary">계산 결과</h4>
                  <div className="flex items-center gap-3">
                    {/* 역산 토글 — 입력 금액을 '자녀가 실제로 받는 돈'으로 보고 세금까지 증여하는 총액 계산 */}
                    <label className="no-print flex items-center gap-2 cursor-pointer text-[13px] font-bold text-text-secondary">
                      <button
                        type="button"
                        onClick={() => setGiftNetMode(!giftNetMode)}
                        aria-pressed={giftNetMode}
                        className={`relative inline-block w-10 h-5 rounded-full transition-colors shrink-0 ${giftNetMode ? "bg-brand-blue" : "bg-slate-300"}`}
                      >
                        <span className={`absolute w-4 h-4 rounded-full bg-white top-[2px] shadow transition-all ${giftNetMode ? "left-[22px]" : "left-[2px]"}`} />
                      </button>
                      자녀 손에 이 금액을 남기려면
                    </label>
                    <PrintButton />
                  </div>
                </div>
                <div className="mx-6 md:mx-8 mt-2 mb-0 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-[12px] text-amber-700 leading-relaxed"><svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>본 계산 결과는 참고용이며, 실제 세액과 다를 수 있습니다. 세무회계 새벽은 본 계산기의 결과에 대해 법적 책임을 지지 않습니다.</span></div>

                {/* 흐름 — 증여재산 → 채무 → 과세가액 → (+사전증여) → 공제 → 과세표준 × 세율 */}
                <div className="bg-slate-50/80 p-6 md:p-8 border-b border-ui-border">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-center w-full mx-auto">
                    <FlowCell label="증여재산" value={wonKo(giftResult.giftAmount * 10000)} />
                    <ArrowIcon />
                    <FlowCell label={giftNonTaxWon !== "" && giftNonTaxWon > 0 ? "채무·비과세" : "채무차감"} value={`- ${wonKo((giftResult.giftAmount - giftThisBase) * 10000)}`} tone="minus" />
                    <ArrowIcon />
                    <FlowCell label="과세가액" value={wonKo(giftThisBase * 10000)} tone="key" />
                    {giftResult.priorGifts10yr > 0 && (
                      <>
                        <ArrowIcon />
                        <FlowCell label="사전증여 합산" value={`+ ${wonKo(giftResult.priorGifts10yr * 10000)}`} tone="plus" />
                      </>
                    )}
                    <div className="w-full h-px bg-ui-border block md:hidden my-2" />
                    <ArrowIcon />
                    <FlowCell
                      label="공제액"
                      value={`- ${wonKo((giftResult.exemption + giftResult.marriageBirthExemption + giftResult.appraisalFee) * 10000)}`}
                      tone="minus"
                      sub={giftDeductionSub}
                    />
                    <ArrowIcon />
                    <FlowCell label="과세표준" value={wonKo(giftResult.taxableIncome * 10000)} tone="key" />
                    <CrossIcon />
                    <FlowCell label="적용세율" value={giftResult.taxRate} />
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h4 className="text-lg font-bold text-text-primary mb-6">예상 납부 세액 결과</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    <ResultCard label="산출세액" value={wonKo(giftResult.computedTax * 10000)} />
                    <ResultCard label="기납부세액공제" value={`- ${wonKo(giftResult.priorGiftTax * 10000)}`} muted />
                    <ResultCard label="신고세액공제 (3%)" value={`- ${wonKo(giftResult.reportDiscount * 10000)}`} minus />
                    <div className="md:col-span-3 lg:col-span-2 bg-gradient-to-br from-brand-navy to-[#0f172a] rounded-2xl p-6 md:p-8 text-white relative shadow-lg overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-blue-200 text-[15px] font-bold mb-2 block">최종 납부세액</span>
                        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{wonKo(giftResult.finalTaxWon)}</div>
                        <div className="mt-1 text-[13px] text-blue-200 tabular-nums">{giftResult.finalTaxWon.toLocaleString("ko-KR")}원</div>
                      </div>
                    </div>
                  </div>

                  {/* 한 줄 요약 (영상 자막처럼) */}
                  {giftAmountWon !== "" && giftAmountWon > 0 && (
                    <p className="mt-5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-[14px] md:text-[15px] font-bold text-text-primary leading-relaxed">
                      {giftNetMode ? (
                        <>
                          <Ph>자녀 손에 {wonKo(giftAmountWon)} →</Ph>{" "}
                          <Ph>총 증여 {wonKo(giftResult.giftAmount * 10000)}</Ph>{" "}
                          <Ph>= 자녀 몫 {wonKo(giftAmountWon)}</Ph> <Ph>+ 증여세 {wonKo(giftResult.finalTaxWon)}</Ph>
                        </>
                      ) : (
                        <>
                          <Ph>{wonKo(giftResult.giftAmount * 10000)} 증여 →</Ph> <Ph>증여세 {wonKo(giftResult.finalTaxWon)}</Ph>{" "}
                          <Ph className="text-brand-blue">(실효세율 {giftEffectiveRate}%)</Ph>
                        </>
                      )}
                    </p>
                  )}
                  {giftNetMode && (
                    <p className="mt-2 text-[12px] text-slate-500 leading-relaxed">
                      부모가 증여세까지 대신 내면 그 세금도 증여입니다. 그래서 세금이 다시 붙고, 총 증여액은 위처럼 계산됩니다.
                    </p>
                  )}

                  {giftResult.surchargeRate > 0 && giftResult.generationSkipSurcharge > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-700 font-medium">
                      세대생략 할증 {Math.round(giftResult.surchargeRate * 100)}%
                      {giftResult.surchargeRate === 0.4 ? " (미성년 · 20억 초과)" : ""} 적용: +{wonKo(giftResult.generationSkipSurcharge * 10000)}이 산출세액에 더해졌습니다.
                    </div>
                  )}

                  {/* 계산 명세서 */}
                  <div className="mt-6 rounded-2xl border border-ui-border overflow-hidden">
                    <div className="px-4 py-3 bg-ui-surface border-b border-ui-border text-[13px] font-bold text-text-primary">계산 명세서</div>
                    <table className="w-full border-collapse text-[13px] tabular-nums">
                      <tbody>
                        {giftResult.lines.map((l, i) => (
                          <tr key={l.key} className={`border-t border-ui-border first:border-t-0 ${l.strong ? "bg-slate-50/70 font-bold" : ""}`}>
                            <td className="pl-4 pr-2 py-2.5 text-slate-400 w-8 align-top">{i + 1}</td>
                            <td className="px-2 py-2.5 align-top">
                              <span className="text-text-primary">
                                {l.sign && l.sign !== "=" ? `${l.sign === "-" ? "−" : "+"} ` : ""}
                                {l.label}
                              </span>
                              <span className="block md:hidden text-[11px] text-slate-400 font-normal mt-0.5 text-pretty">{l.note}</span>
                            </td>
                            <td className={`px-2 py-2.5 text-right align-top whitespace-nowrap ${l.key === "final" ? "text-brand-blue font-extrabold" : l.sign === "-" ? "text-red-500" : "text-text-primary"}`}>
                              {l.won.toLocaleString("ko-KR")}원
                            </td>
                            <td className="hidden md:table-cell pl-4 pr-4 py-2.5 text-[12px] text-slate-500 align-top">{l.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 신고·납부 기한 · 분납 */}
              <div className="no-print bg-white rounded-2xl p-6 md:p-8 border border-ui-border mb-6">
                <h4 className="text-[16px] font-extrabold text-text-primary mb-4">신고·납부 기한</h4>
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
                  <label className="block">
                    <span className="block text-[13px] font-bold text-text-secondary mb-2">증여일</span>
                    <input
                      type="date"
                      value={giftDate}
                      onChange={(e) => setGiftDateManual(e.target.value)}
                      className="px-4 py-3 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue text-[15px] font-bold text-text-primary"
                    />
                  </label>
                  {giftDeadline && (
                    <div className="text-[14px] text-text-secondary leading-relaxed">
                      <div className="font-bold text-text-primary text-[16px]">
                        {dateKoDow(giftDeadline.due)}까지
                      </div>
                      {giftDeadline.due !== giftDeadline.base && (
                        <div className="text-[12px] text-slate-500">
                          법정 기한 {dateKoDow(giftDeadline.base)}이 휴일이라 다음 날로
                        </div>
                      )}
                      <div className="text-[12px] text-slate-500">증여일이 속한 달 말일부터 3개월 (상증법 §68)</div>
                    </div>
                  )}
                </div>
                <ul className="mt-4 space-y-1.5 text-[13px] text-text-secondary leading-relaxed list-disc pl-5">
                  {giftInstallment > 0 && (
                    <li>
                      <b className="text-text-primary">분납</b>: 납부세액이 1,000만 원을 넘어 최대 <b className="text-text-primary">{wonKo(giftInstallment)}</b>을 2개월 안에 나눠 낼 수 있습니다.
                    </li>
                  )}
                  {giftResult.finalTaxWon > 20_000_000 && (
                    <li>
                      <b className="text-text-primary">연부연납</b>: 2,000만 원을 넘어 최대 5년에 걸쳐 나눠 낼 수도 있습니다 (담보 필요, 가산금 있음).
                    </li>
                  )}
                  <li>
                    기한을 넘기면 <Ph>무신고 가산세 20%와</Ph> <Ph>납부지연 가산세(하루 0.022%)가 붙고,</Ph>{" "}
                    <Ph>신고세액공제 3%도</Ph> <Ph>받지 못합니다.</Ph>
                  </li>
                </ul>
              </div>

              {/* 부담부증여 안내 */}
              {giftDebtWon !== "" && giftDebtWon > 0 && (
                <div className="no-print mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-5 text-[13px] text-amber-800 leading-relaxed">
                  <b>부담부증여 주의</b> — 넘긴 채무 {wonKo(giftDebtWon)}은 증여자(부모)가 그만큼 판 것으로 보아{" "}
                  <b>양도소득세가 따로 나올 수 있습니다</b> (상증법 §47① 단서 · 소득세법 §88 1호). 배우자·직계존비속 간에는 채무 인수가 객관적으로 입증돼야 인정됩니다.
                </div>
              )}

              {/* 함께 볼 것 — 증여 취득세 · 차용증 */}
              <div className="no-print grid md:grid-cols-2 gap-4 mb-6">
                <Link href="/calculator/acquisition-tax" className="group block rounded-2xl border border-ui-border bg-white p-5 hover:border-brand-blue transition-colors no-underline">
                  <div className="text-[14px] font-extrabold text-text-primary group-hover:text-brand-blue">부동산 증여라면 취득세도 →</div>
                  <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
                    받는 사람이 취득세 3.5%를 냅니다. 조정대상지역 공시가 3억 이상 주택은 12%.
                  </p>
                </Link>
                <Link
                  href={giftAmountWon !== "" && giftAmountWon > 0 ? `/loan-agreement?amount=${giftAmountWon}` : "/loan-agreement"}
                  className="group block rounded-2xl border border-ui-border bg-white p-5 hover:border-brand-blue transition-colors no-underline"
                >
                  <div className="text-[14px] font-extrabold text-text-primary group-hover:text-brand-blue">이 금액을 빌려주는 걸로 하면? →</div>
                  <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
                    차용증 자동작성{giftAmountWon !== "" && giftAmountWon > 0 ? ` — ${wonKo(giftAmountWon)}이 미리 채워집니다` : ""}. 적정이자율 4.6%, 무이자 한도 2.17억.
                  </p>
                </Link>
              </div>

              {/* 세금 없이 줄 수 있는 돈 */}
              <details className="no-print group bg-white rounded-2xl border border-ui-border mb-8 overflow-hidden">
                <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between text-[15px] font-extrabold text-text-primary">
                  세금 없이 줄 수 있는 돈 (10년 공제)
                  <span className="text-[13px] font-bold text-brand-blue group-open:hidden">펼치기</span>
                </summary>
                <div className="px-6 pb-6">
                  <table className="w-full border-collapse text-[13px]">
                    <thead>
                      <tr className="text-left text-text-secondary border-b border-ui-border">
                        <th className="py-2 pr-3 font-bold">받는 사람</th>
                        <th className="py-2 pr-3 font-bold">10년 공제</th>
                        <th className="hidden md:table-cell py-2 font-bold">비고</th>
                      </tr>
                    </thead>
                    <tbody className="text-text-primary">
                      {[
                        ["배우자", "6억", ""],
                        ["성년 자녀", "5,000만", "혼인·출산 시 +1억"],
                        ["미성년 자녀", "2,000만", ""],
                        ["손자녀", "5,000만 (미성년 2,000만)", "부모 증여와 공제 한도 공유 · 세금이 나오면 30% 할증"],
                        ["부모 (자녀가 줄 때)", "5,000만", ""],
                        ["사위·며느리 등", "1,000만", "기타 친족"],
                      ].map(([a, b, c]) => (
                        <tr key={a} className="border-b border-ui-border last:border-b-0 align-top">
                          <td className="py-2.5 pr-3">
                            <span className="font-bold whitespace-nowrap">{a}</span>
                            {c && <span className="md:hidden block mt-0.5 text-[11px] text-text-secondary text-pretty">{c}</span>}
                          </td>
                          <td className="py-2.5 pr-3 text-pretty">{b}</td>
                          <td className="hidden md:table-cell py-2.5 text-[12px] text-text-secondary">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-3 text-[12px] text-slate-500">
                    <Ph>직계존속 공제 5,000만 원은</Ph> <Ph>부모·조부모가 함께 쓰는 한도입니다.</Ph>
                  </p>
                </div>
              </details>
            </>
          )}

          {/* 참고사항 */}
          <div className="bg-slate-50 rounded-xl p-6 border border-ui-border mb-8">
            <h5 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              알아두세요 (참고사항)
            </h5>
            <ul className="space-y-2 text-[13px] text-text-secondary leading-relaxed pl-5 list-disc text-pretty">
              <li>본 계산기는 개략적인 예상 세액을 산출하기 위한 참고용 도구이며, 실제 부과되는 세액과 차이가 발생할 수 있습니다.</li>
              <li><strong className="text-text-primary font-bold">상속세의 경우 일괄공제(5억)와 기초공제+인적공제 합산액 중 큰 금액을 자동으로 적용</strong>하여 계산합니다.</li>
              <li>가업상속공제, 영농상속공제, 동거주택 상속공제 등 특례 조항이나 감정평가 수수료 공제 등은 본 간편 계산기에 반영되어 있지 않습니다.</li>
              {tab === "inheritance" && (
                <>
                  <li>
                    <strong className="text-text-primary font-bold">배우자상속공제</strong>는 실제 상속받은 금액만큼 공제하되 <strong className="text-text-primary font-bold">법정상속분 한도</strong>(상속재산 × 배우자 지분, 자녀와 함께면 1.5 ÷ (1.5 + 자녀 수))와 30억을 넘지 못합니다. 5억 미만이면 5억을 공제합니다(상증법 §19). 실제 상속액으로 인정받으려면 신고기한 다음 날부터 9개월 안에 분할·등기를 마쳐야 합니다.
                  </li>
                  <li>
                    <strong className="text-text-primary font-bold">금융재산상속공제</strong>는 예금·주식·보험 등에서 금융채무를 뺀 순금융재산 기준입니다. 2천만 원 이하 전액, 1억 이하 2천만 원, 넘으면 20%(최대 2억)를 공제합니다(상증법 §22). 차명계좌 등 신고하지 않은 금융재산은 공제되지 않습니다.
                  </li>
                </>
              )}
              <li>증여재산공제는 동일인으로부터 10년간 합산하여 적용되며, 이미 사전증여로 공제를 사용한 경우 잔여 공제만 적용됩니다.</li>
              {tab === "gift" && (
                <>
                  <li>혼인·출산 공제는 2024년 1월 1일 이후 증여분부터 적용됩니다.</li>
                  <li>증여세는 받는 사람이 냅니다. 부모가 대신 내면 그 세금도 증여입니다.</li>
                </>
              )}
              <li>정확한 세액 산출 및 절세 전략 수립을 위해서는 반드시 세무 전문가와 상담하시기 바랍니다.</li>
            </ul>
          </div>

          <RelatedPosts k="inherit-gift" />

          {/* CTA */}
          <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center">
            <p className="text-[15px] text-text-secondary mb-6">계산기로 간단하게 확인해보셨다면, 정확한 절세 방법은 세무사와 상담하세요.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
              <Link href="/contact" className="flex-1 px-6 py-3.5 bg-brand-blue text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors text-center no-underline">상담 신청하기</Link>
              <a href="https://blog.naver.com/tax_dawn" target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3.5 bg-white text-text-primary border-2 border-ui-border rounded-xl text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors text-center">블로그에서 사례 보기</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

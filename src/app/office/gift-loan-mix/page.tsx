"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateMix,
  mixScenarios,
  mixCurve,
  recommendMix,
  recommendedRatePct,
  minRatePctExact,
  interestFreeLimit,
  tenPercentBandGift,
  type MixInput,
  type MixRelation,
  type InsuranceType,
} from "@/lib/giftLoanMixCalc";
import { defaultMixSettings, listGiftLoanMixRates, LENDER_TAX, RATES_AS_OF, type MixSettings } from "@/lib/officeRates";

const won = (v: number) => Math.floor(v).toLocaleString("ko-KR");

/** 820,000,000 → "8억 2,000만 원" (원 단위까지 그대로) */
function koreanAmount(v: number): string {
  const n = Math.floor(Math.max(0, v));
  if (n === 0) return "0원";
  const eok = Math.floor(n / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const rest = n % 10_000;
  const parts: string[] = [];
  if (eok) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (rest) parts.push(rest.toLocaleString("ko-KR"));
  return `${parts.join(" ")} 원`;
}

const RELATIONS: { key: MixRelation; label: string }[] = [
  { key: "adultLineal", label: "부모·조부모 (받는 사람 성년)" },
  { key: "minorLineal", label: "부모·조부모 (받는 사람 미성년)" },
  { key: "spouse", label: "배우자" },
  { key: "other", label: "그 밖의 친족" },
];

const INSURANCE: { key: InsuranceType; label: string }[] = [
  { key: "regional", label: "지역가입자" },
  { key: "employee", label: "직장가입자" },
  { key: "dependent", label: "피부양자" },
];

const inputCls =
  "w-full px-3 py-3 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue text-right font-semibold text-text-primary text-[16px]";
const labelCls = "block text-[14px] font-bold text-text-secondary mb-1.5";

function MoneyInput({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value ? value.toLocaleString("ko-KR") : ""}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
          className={`${inputCls} pr-9`}
        />
        <span className="absolute right-3 top-3.5 text-text-secondary text-sm font-bold">원</span>
      </div>
      <p className="text-xs text-slate-500 mt-1 text-right">{hint ?? koreanAmount(value)}</p>
    </div>
  );
}

function PctInput({ label, value, onChange, disabled, hint }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean; hint?: string }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          disabled={disabled}
          value={text ?? String(value)}
          onChange={(e) => {
            const t = e.target.value.replace(/[^0-9.]/g, "");
            setText(t);
            const n = Number(t);
            if (t !== "" && !Number.isNaN(n)) onChange(n);
            if (t === "") onChange(0);
          }}
          onBlur={() => setText(null)}
          className={`${inputCls} pr-9 ${disabled ? "opacity-60" : ""}`}
        />
        <span className="absolute right-3 top-3.5 text-text-secondary text-sm font-bold">%</span>
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1 text-right">{hint}</p>}
    </div>
  );
}

function Unverified() {
  return <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 align-middle">확인 전</span>;
}

const LINE_COLORS = ["#0052FF", "#0f172a", "#b45309"];
const PERIOD_LABELS = ["5년", "10년", "15년"];

function Chart({ points, userGift, total }: { points: { gift: number; totals: number[] }[]; userGift: number; total: number }) {
  const W = 600;
  const H = 260;
  const L = 12;
  const R = 12;
  const T = 14;
  const Bm = 34;
  const maxY = Math.max(1, ...points.flatMap((p) => p.totals));
  const x = (g: number) => L + (total > 0 ? (g / total) * (W - L - R) : 0);
  const y = (v: number) => T + (1 - v / maxY) * (H - T - Bm);
  const mins = [0, 1, 2].map((k) => points.reduce((best, p) => (p.totals[k] < best.totals[k] ? p : best), points[0]));
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="증여 금액에 따른 세금·보험료 합계 그래프">
        <line x1={L} y1={H - Bm} x2={W - R} y2={H - Bm} stroke="#cbd5e1" />
        <line x1={L} y1={T} x2={L} y2={H - Bm} stroke="#cbd5e1" />
        {[0, 1, 2].map((k) => (
          <polyline key={k} fill="none" stroke={LINE_COLORS[k]} strokeWidth="2" points={points.map((p) => `${x(p.gift).toFixed(1)},${y(p.totals[k]).toFixed(1)}`).join(" ")} />
        ))}
        {mins.map((p, k) => (
          <circle key={k} cx={x(p.gift)} cy={y(p.totals[k])} r="5" fill="#fff" stroke={LINE_COLORS[k]} strokeWidth="2.5" />
        ))}
        <line x1={x(userGift)} y1={T} x2={x(userGift)} y2={H - Bm} stroke="#64748b" strokeDasharray="4 4" />
        <text x={L} y={H - 12} fontSize="12" fill="#64748b">증여 0원</text>
        <text x={W - R} y={H - 12} fontSize="12" fill="#64748b" textAnchor="end">전액 증여</text>
        <text x={Math.min(W - R - 40, Math.max(L + 40, x(userGift)))} y={H - 12} fontSize="12" fill="#0f172a" textAnchor="middle">지금 넣은 값</text>
      </svg>
      <ul className="mt-3 space-y-1.5 text-[13px] text-text-secondary">
        {mins.map((p, k) => (
          <li key={k} className="flex flex-wrap items-baseline gap-x-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: LINE_COLORS[k] }} />
            <strong className="text-text-primary">{PERIOD_LABELS[k]}</strong>
            <span>합계가 가장 작은 곳 : 증여 {won(p.gift)}원일 때 {won(p.totals[k])}원</span>
          </li>
        ))}
        <li>세로축 맨 위는 {won(maxY)}원입니다. 동그라미는 41개 지점 가운데 합계가 가장 작은 곳입니다.</li>
      </ul>
    </div>
  );
}

export default function GiftLoanMixPage() {
  const [total, setTotal] = useState(0);
  const [gift, setGift] = useState(0);
  const [relation, setRelation] = useState<MixRelation>("adultLineal");
  const [priorGift, setPriorGift] = useState(0);
  const [useMarriageBirth, setUseMarriageBirth] = useState(false);
  const [autoRate, setAutoRate] = useState(true);
  const [manualRate, setManualRate] = useState(0);
  const [repay, setRepay] = useState<"lump" | "monthly">("lump");
  const [monthlyPrincipal, setMonthlyPrincipal] = useState(0);
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("regional");
  const [existingFinancialIncome, setExistingFinancialIncome] = useState(0);
  const [employeeOtherIncome, setEmployeeOtherIncome] = useState(0);
  const [marginal, setMarginal] = useState<number | null>(null);
  const [settings, setSettings] = useState<MixSettings>(() => defaultMixSettings());
  const [takeHome, setTakeHome] = useState(0);
  const [living, setLiving] = useState(0);
  const [mortgage, setMortgage] = useState(0);
  const [loadMsg, setLoadMsg] = useState("");
  const loadMortgage = () => {
    try {
      const v = Number(window.sessionStorage.getItem("office.mortgageMonthly"));
      if (v > 0) {
        setMortgage(Math.floor(v));
        setLoadMsg("대출 계산기에서 보낸 값을 불러왔습니다.");
      } else setLoadMsg("보낸 값이 없습니다. 대출 계산기의 상환 계산에서 먼저 보내기를 눌러 주세요.");
    } catch {
      setLoadMsg("불러오지 못했습니다. 직접 넣어 주세요.");
    }
  };

  const safeGift = Math.min(gift, total);
  const loan = total - safeGift;
  const ratePct = autoRate ? recommendedRatePct(loan, settings) : manualRate;

  const input: MixInput = useMemo(
    () => ({
      total,
      gift: safeGift,
      relation,
      priorGift,
      useMarriageBirth,
      ratePct,
      monthlyPrincipal: repay === "monthly" ? monthlyPrincipal : 0,
      insuranceType,
      existingFinancialIncome,
      employeeOtherIncome,
      marginalRatePct: marginal,
    }),
    [total, safeGift, relation, priorGift, useMarriageBirth, ratePct, repay, monthlyPrincipal, insuranceType, existingFinancialIncome, employeeOtherIncome, marginal],
  );

  const result = useMemo(() => calculateMix(input, settings), [input, settings]);
  const scenarios = useMemo(() => mixScenarios(input, settings, autoRate), [input, settings, autoRate]);
  const curve = useMemo(() => mixCurve(input, settings, autoRate), [input, settings, autoRate]);
  const recs = useMemo(() => recommendMix(input, settings), [input, settings]);
  const [recIdx, setRecIdx] = useState(1);
  const rates = useMemo(() => listGiftLoanMixRates(), []);

  const setNum = (key: keyof MixSettings) => (v: number) => setSettings((s) => ({ ...s, [key]: v }));
  const periodRows: { label: string; pick: (i: number) => number; strong?: boolean; note?: string }[] = [
    { label: "증여세", pick: (i) => result.periods[i].giftTax },
    { label: "이자에서 뗀 세금", pick: (i) => result.periods[i].withholding },
    { label: "종합소득세 추가분 (어림)", pick: (i) => result.periods[i].incomeTaxExtra },
    { label: "건강보험료 증가분", pick: (i) => result.periods[i].insuranceExtra },
    { label: "세금·보험료 합계", pick: (i) => result.periods[i].total, strong: true },
    { label: "이자 합계 (가족 안에서 오가는 돈)", pick: (i) => result.periods[i].interest },
    { label: "기간 끝에 남는 원금", pick: (i) => result.periods[i].remainingPrincipal },
  ];

  const card = "bg-white rounded-2xl border border-ui-border p-5 md:p-7";
  const h2 = "text-[18px] font-bold text-text-primary mb-4";

  return (
    <div className="min-h-screen bg-ui-surface">
      <header className="bg-white border-b border-ui-border">
        <div className="max-w-[960px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="no-underline text-[14px] font-semibold text-text-primary">세무회계 새벽</Link>
          <span className="text-[12px] font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded px-2 py-1">참고용 · 숫자 확인 전</span>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 md:px-6 py-6 md:py-10 space-y-5">
        <div>
          <h1 className="text-[24px] md:text-[30px] font-semibold text-slate-900 tracking-tight">증여·차용 혼합 계산</h1>
        <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[14px] font-bold text-amber-900">이 계산기는 참고용입니다. 결과는 넣은 값에 따른 어림이며, 실제 세금·보험료·대출 조건은 달라질 수 있습니다.</p>
          <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">
            가족에게서 받는 돈을 얼마는 증여로, 얼마는 빌린 돈으로 할 때 가족 전체가 밖으로 내는 세금과 보험료를 5년, 10년, 15년으로 견줍니다. 입력한 값은 이 화면 안에서만 계산하고 저장하지 않습니다.
          </p>
          <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
            세율과 보험료율은 {RATES_AS_OF} 기준으로 적은 값이며, 조문·고시와 아직 대조하지 않았습니다.
          </p>
        </div>

        {/* 입력 */}
        <section className={card}>
          <h2 className={h2}>기본 입력</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <MoneyInput label="받는 돈 전체" value={total} onChange={setTotal} />
            <div>
              <MoneyInput label="증여로 처리할 금액" value={safeGift} onChange={(v) => setGift(Math.min(v, total))} />
              <input
                type="range"
                min={0}
                max={total}
                step={Math.max(1, Math.floor(total / 200))}
                value={safeGift}
                onChange={(e) => setGift(Number(e.target.value))}
                className="w-full mt-2 accent-brand-blue"
                aria-label="증여로 처리할 금액"
              />
              <p className="text-xs text-slate-500">빌리는 돈 : {won(loan)}원</p>
            </div>
            <div>
              <label className={labelCls}>주는 사람과의 관계</label>
              <select value={relation} onChange={(e) => setRelation(e.target.value as MixRelation)} className={`${inputCls} text-left`}>
                {RELATIONS.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1 text-right">증여재산공제 {won(result.deduction)}원</p>
            </div>
            <MoneyInput label="최근 10년 같은 사람에게서 이미 받은 증여" value={priorGift} onChange={setPriorGift} hint={`부모는 두 분을 합쳐서 넣습니다 · ${koreanAmount(priorGift)}`} />
            <label className="flex items-center gap-2.5 text-[14px] font-bold text-text-secondary cursor-pointer">
              <input type="checkbox" checked={useMarriageBirth} onChange={(e) => setUseMarriageBirth(e.target.checked)} className="w-5 h-5 accent-brand-blue" />
              혼인·출산 증여공제를 씁니다 ({won(settings.marriageBirthDeduction)}원 추가)
            </label>
            <div />
            <div>
              <PctInput
                label="약정 이자율"
                value={ratePct}
                onChange={setManualRate}
                disabled={autoRate}
                hint={loan > 0 ? `이 차입금에서 차액이 기준 미만이려면 ${minRatePctExact(loan, settings).toFixed(4)}%보다 높아야 합니다` : "빌리는 돈이 없습니다"}
              />
              <label className="flex items-center gap-2.5 mt-2 text-[13px] font-bold text-text-secondary cursor-pointer">
                <input type="checkbox" checked={autoRate} onChange={(e) => { if (!e.target.checked) setManualRate(ratePct); setAutoRate(e.target.checked); }} className="w-5 h-5 accent-brand-blue" />
                낮출 수 있는 가장 낮은 이자율로 자동
              </label>
            </div>
            <div>
              <label className={labelCls}>원금 상환 방식</label>
              <div className="grid grid-cols-2 gap-2">
                {([["lump", "만기에 한 번에"], ["monthly", "매달 일정 금액"]] as const).map(([k, t]) => (
                  <button key={k} type="button" onClick={() => setRepay(k)} className={`py-3 rounded-xl text-[14px] font-bold border ${repay === k ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-text-secondary border-ui-border"}`}>
                    {t}
                  </button>
                ))}
              </div>
              {repay === "monthly" && (
                <div className="mt-3">
                  <MoneyInput label="매달 갚는 원금" value={monthlyPrincipal} onChange={setMonthlyPrincipal} />
                </div>
              )}
            </div>
          </div>

          <details className="mt-6 border-t border-ui-border pt-4">
            <summary className="cursor-pointer text-[15px] font-bold text-text-primary">빌려주는 사람 (건강보험, 다른 소득, 세율)</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label className={labelCls}>건강보험 구분</label>
                <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value as InsuranceType)} className={`${inputCls} text-left`}>
                  {INSURANCE.map((r) => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>종합소득세 한계세율</label>
                <select value={marginal === null ? "" : String(marginal)} onChange={(e) => setMarginal(e.target.value === "" ? null : Number(e.target.value))} className={`${inputCls} text-left`}>
                  <option value="">모름 ({settings.marginalRateUnknownPct}%로 계산)</option>
                  {LENDER_TAX.marginalRatesPct.value.map((r) => (
                    <option key={r} value={r}>{r}%</option>
                  ))}
                </select>
              </div>
              <MoneyInput label="이미 있는 이자·배당 소득 (한 해)" value={existingFinancialIncome} onChange={setExistingFinancialIncome} />
              {insuranceType === "employee" && <MoneyInput label="그 밖의 급여 외 소득 (한 해, 사업·임대·연금 등)" value={employeeOtherIncome} onChange={setEmployeeOtherIncome} />}
            </div>
          </details>

          <details className="mt-4 border-t border-ui-border pt-4">
            <summary className="cursor-pointer text-[15px] font-bold text-text-primary">설정 (세율·보험료율, 고칠 수 있음) <Unverified /></summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <PctInput label="적정 이자율" value={settings.adequateRatePct} onChange={setNum("adequateRatePct")} />
              <MoneyInput label="이자 차액 과세 기준" value={settings.gapThreshold} onChange={setNum("gapThreshold")} />
              <PctInput label="이자에서 떼는 세율" value={settings.withholdingPct} onChange={setNum("withholdingPct")} />
              <PctInput label="신고세액공제" value={settings.filingCreditPct} onChange={setNum("filingCreditPct")} />
              <PctInput label="건강보험료율" value={settings.healthRatePct} onChange={setNum("healthRatePct")} />
              <PctInput label="장기요양 (건강보험료의 %)" value={settings.longTermCareOfHealthPct} onChange={setNum("longTermCareOfHealthPct")} />
              <MoneyInput label="금융소득 종합과세 기준" value={settings.financialIncomeThreshold} onChange={setNum("financialIncomeThreshold")} />
              <MoneyInput label="건강보험 금융소득 반영 기준" value={settings.regionalFinancialIncomeThreshold} onChange={setNum("regionalFinancialIncomeThreshold")} />
              <MoneyInput label="직장가입자 급여 외 소득 기준" value={settings.employeeOtherIncomeThreshold} onChange={setNum("employeeOtherIncomeThreshold")} />
            </div>
            <button type="button" onClick={() => setSettings(defaultMixSettings())} className="mt-4 px-4 py-2 rounded-lg border border-ui-border bg-white text-[13px] font-bold text-text-secondary">
              처음 값으로 되돌리기
            </button>
          </details>
        </section>

        {/* 요약 */}
        <section className={card}>
          <h2 className={h2}>요약</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["증여 금액", `${won(result.gift)}원`],
              ["빌리는 돈", `${won(result.loan)}원`],
              ["낼 증여세", `${won(result.giftTax)}원`],
              ["권장 최저 이자율", result.loan > 0 ? `${recommendedRatePct(result.loan, settings).toFixed(2)}%` : "해당 없음"],
              ["첫 달 이자", `${won(result.firstMonthInterest)}원`],
              ["빌린 사람의 첫 달 부담", `${won(result.firstMonthBurden)}원`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-ui-border p-4">
                <p className="text-[13px] font-bold text-text-secondary">{k}</p>
                <p className="text-[17px] md:text-[20px] font-semibold text-text-primary mt-1.5 break-all">{v}</p>
              </div>
            ))}
          </div>
          <div className={`mt-4 rounded-xl border px-4 py-3 text-[14px] leading-relaxed ${result.gapWarning ? "bg-red-50 border-red-200 text-red-800" : "bg-slate-50 border-ui-border text-text-secondary"}`}>
            <strong>이자 차액 판정 : </strong>
            {result.loan === 0
              ? "빌리는 돈이 없어 해당하지 않습니다."
              : result.gapWarning
                ? `첫해 차액이 ${won(result.years[0].gap)}원으로 기준 ${won(settings.gapThreshold)}원 이상입니다. 이 이자율로는 차액이 증여로 과세될 수 있습니다. 그 증여세는 이 계산에 들어 있지 않습니다.`
                : `첫해 차액이 ${won(result.years[0].gap)}원으로 기준 ${won(settings.gapThreshold)}원 미만입니다.`}
          </div>
          <p className="text-[13px] text-text-secondary mt-3 leading-relaxed">
            약정 이자율 {ratePct}% · 증여세 과세표준 {won(result.giftTaxBase)}원 · 신고세액공제 {won(result.filingCredit)}원 · 무이자로 빌려도 차액이 기준 미만인 한도 {won(interestFreeLimit(settings))}원 · 증여세 10% 구간을 다 쓰는 증여 금액 {won(tenPercentBandGift(input, settings))}원
          </p>
          {result.marginalRateAssumed && <p className="text-[13px] text-amber-800 mt-2">한계세율을 모름으로 두어 {settings.marginalRateUnknownPct}%로 계산했습니다. 이 경우 종합소득세 추가분은 0원으로 나옵니다.</p>}
          {result.dependentNotice && <p className="text-[13px] text-amber-800 mt-2">피부양자는 건강보험료를 계산하지 않았습니다. 소득 기준을 넘으면 피부양자 자격을 잃고 지역가입자가 될 수 있습니다.</p>}
        </section>

        {/* 기간 비교표 */}
        <section className={card}>
          <h2 className={h2}>기간 비교</h2>
          <table className="w-full text-[12px] md:text-[14px]">
            <thead>
              <tr className="text-text-secondary border-b border-ui-border">
                <th className="text-left font-bold py-2 pr-2 w-[34%]">항목</th>
                {PERIOD_LABELS.map((p) => (
                  <th key={p} className="text-right font-bold py-2 pl-1">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periodRows.map((row) => (
                <tr key={row.label} className={`border-b border-slate-100 ${row.strong ? "bg-slate-50" : ""}`}>
                  <td className={`py-2.5 pr-2 ${row.strong ? "font-bold text-text-primary" : "text-text-secondary"}`}>{row.label}</td>
                  {[0, 1, 2].map((i) => (
                    <td key={i} className={`py-2.5 pl-1 text-right break-all ${row.strong ? "font-bold text-text-primary" : "text-text-primary"}`}>{won(row.pick(i))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[12px] text-text-secondary mt-3 leading-relaxed">단위는 원입니다. 이자는 가족 안에서 오가는 돈이라 합계에 넣지 않았습니다. 종합소득세 추가분은 어림이며, 실제는 다른 소득과 합쳐 계산해야 합니다. 건강보험료는 이자를 받은 다음 해 11월쯤부터 반영되고, 보험료 상한은 반영하지 않았습니다.</p>
        </section>

        {/* 빌린 사람의 한 달 부담 */}
        <section className={card}>
          <h2 className={h2}>빌린 사람의 한 달 부담</h2>
          <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">세후 월급에서 생활비, 주택담보대출 상환액, 가족에게 빌린 돈의 이자와 원금을 뺀 여유입니다. 첫해 기준입니다.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <MoneyInput label="세후 월급 (한 달)" value={takeHome} onChange={setTakeHome} />
            <MoneyInput label="생활비 (한 달)" value={living} onChange={setLiving} />
            <div>
              <MoneyInput label="주택담보대출 한 달 상환액" value={mortgage} onChange={setMortgage} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button type="button" onClick={loadMortgage} className="rounded-lg border border-brand-blue px-3 py-1.5 text-[13px] font-bold text-brand-blue">대출 계산기에서 불러오기</button>
                <Link href="/office/loan" className="text-[13px] font-bold text-brand-blue underline">대출 계산기 열기</Link>
              </div>
              {loadMsg && <p className="text-xs text-slate-500 mt-1">{loadMsg}</p>}
            </div>
          </div>
          {(() => {
            const familyInterest = Math.floor(result.years[0].interest / 12);
            const familyPrincipal = repay === "monthly" ? monthlyPrincipal : 0;
            const room = takeHome - living - mortgage - familyInterest - familyPrincipal;
            const rows: [string, number][] = [
              ["세후 월급", takeHome],
              ["생활비", -living],
              ["주택담보대출 상환액", -mortgage],
              ["가족 차입 이자 (첫해 이자 ÷ 12)", -familyInterest],
              ["가족 차입 원금 상환", -familyPrincipal],
            ];
            return (
              <div className="mt-4 border-t border-ui-border pt-3">
                <ul className="space-y-1.5 text-[14px] tabular-nums">
                  {rows.map(([name, v]) => (
                    <li key={name} className="flex justify-between gap-3">
                      <span className="text-text-secondary">{name}</span>
                      <span className="text-text-primary">{v < 0 ? "-" : ""}{won(Math.abs(v))}원</span>
                    </li>
                  ))}
                  <li className="flex justify-between gap-3 border-t border-ui-border pt-2 font-extrabold">
                    <span className="text-text-primary">한 달 여유</span>
                    <span className={room < 0 ? "text-red-700" : "text-text-primary"}>{room < 0 ? "-" : ""}{won(Math.abs(room))}원</span>
                  </li>
                </ul>
                {takeHome > 0 && room < 0 && <p className="text-[13px] font-bold text-red-700 mt-2">넣은 값으로는 매달 돈이 모자랍니다.</p>}
                <p className="text-[12px] text-text-secondary mt-2 leading-relaxed">이자는 뗀 세금을 포함한 금액입니다. 빌린 사람은 이자에서 세금을 떼어 세무서에 내고 나머지를 빌려준 사람에게 보내므로, 나가는 돈의 합은 같습니다.</p>
              </div>
            );
          })()}
        </section>

        {/* 추천 설정 */}
        <section className={card}>
          <h2 className={h2}>추천 설정</h2>
          <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">증여 금액을 {won(recs[0]?.step ?? 10_000_000)}원 단위로 바꿔 가며 세금·보험료 합계가 가장 작은 조합을 찾았습니다. 이자율은 차액이 기준 미만이 되는 가장 낮은 이자율로 두고, 매달 갚는 원금 등 나머지는 넣은 값 그대로입니다.</p>
          <div className="mt-3 flex gap-2">
            {recs.map((x, k) => (
              <button key={x.years} type="button" onClick={() => setRecIdx(k)} className={`flex-1 rounded-xl border px-2 py-2 text-[14px] font-bold ${recIdx === k ? "border-brand-blue bg-brand-blue text-white" : "border-ui-border bg-white text-text-secondary"}`}>
                {x.years}년 기준
              </button>
            ))}
          </div>
          {recs[recIdx] && (() => {
            const x = recs[recIdx];
            return (
              <div className="mt-4">
                <ul className="space-y-1.5 text-[15px] tabular-nums">
                  <li className="flex justify-between gap-3"><span className="text-text-secondary">증여 금액</span><strong className="text-text-primary">{won(x.gift)}원</strong></li>
                  <li className="flex justify-between gap-3"><span className="text-text-secondary">차용 금액</span><strong className="text-text-primary">{won(x.loan)}원</strong></li>
                  <li className="flex justify-between gap-3"><span className="text-text-secondary">약정 이자율</span><strong className="text-text-primary">연 {x.ratePct}%</strong></li>
                  <li className="flex justify-between gap-3"><span className="text-text-secondary">증여세</span><span className="text-text-primary">{won(x.giftTax)}원</span></li>
                  <li className="flex justify-between gap-3 border-t border-ui-border pt-2"><span className="text-text-primary font-extrabold">{x.years}년 세금·보험료 합계</span><strong className="text-text-primary">{won(x.total)}원</strong></li>
                </ul>
                <p className="text-[13px] text-text-secondary mt-2 leading-relaxed">같은 기간에 전액 차용이면 {won(x.allLoanTotal)}원, 전액 증여이면 {won(x.allGiftTotal)}원입니다.</p>
                <button type="button" onClick={() => { setGift(x.gift); setAutoRate(true); }} className="mt-3 w-full rounded-xl bg-brand-blue px-3 py-3 text-[15px] font-bold text-white">이 설정을 위 입력 칸에 넣기</button>
              </div>
            );
          })()}
          <p className="text-[12px] text-text-secondary mt-3 leading-relaxed">이 계산기가 세는 네 가지(증여세, 이자에서 뗀 세금, 종합소득세 추가분, 건강보험료)만의 합계로 고른 것입니다. 빌려준 사람의 상속세, 증여 후 10년 안의 상속 합산, 빌린 사람의 상환 능력, 차용으로 인정받을 수 있는지는 들어 있지 않습니다. 한계세율을 모름으로 두면 종합소득세 추가분이 0원으로 잡혀 차용 쪽으로 기웁니다.</p>
        </section>

        {/* 혼합 비교표 */}
        <section className={card}>
          <h2 className={h2}>증여 금액을 바꿔 보면</h2>
          <p className="text-[13px] text-text-secondary mb-3">{autoRate ? "줄마다 그 차입금에서 낮출 수 있는 가장 낮은 이자율로 계산했습니다." : `모든 줄을 약정 이자율 ${ratePct}%로 계산했습니다.`}</p>
          <div className="space-y-3">
            {scenarios.map((sc) => (
              <div key={sc.key} className={`rounded-xl border p-4 ${sc.key === "user" ? "border-brand-blue bg-blue-50/40" : "border-ui-border"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-[15px] font-bold text-text-primary">{sc.label}</p>
                  <p className="text-[13px] text-text-secondary">증여 {won(sc.gift)}원 · 차용 {won(sc.loan)}원 · 이자율 {sc.ratePct.toFixed(2)}%</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 mt-2 text-[14px]">
                  {sc.result.periods.map((p, i) => (
                    <p key={i} className="flex justify-between sm:block">
                      <span className="text-text-secondary">{PERIOD_LABELS[i]} 합계 </span>
                      <strong className="text-text-primary">{won(p.total)}원</strong>
                    </p>
                  ))}
                </div>
                {sc.result.gapWarning && <p className="text-[12px] text-red-700 mt-1.5">이 이자율로는 이자 차액이 기준 이상입니다.</p>}
              </div>
            ))}
          </div>
        </section>

        {/* 그래프 */}
        <section className={card}>
          <h2 className={h2}>증여 금액에 따른 합계</h2>
          {total > 0 ? <Chart points={curve} userGift={safeGift} total={total} /> : <p className="text-[14px] text-text-secondary">받는 돈 전체를 넣으면 그래프가 나옵니다.</p>}
        </section>

        {/* 해마다의 표 */}
        <section className={card}>
          <details>
            <summary className="cursor-pointer text-[18px] font-bold text-text-primary">해마다의 표 (15년)</summary>
            <div className="mt-4 space-y-2">
              {result.years.map((r) => (
                <div key={r.year} className="rounded-lg border border-slate-100 px-3 py-2.5 text-[13px]">
                  <p className="font-bold text-text-primary">{r.year}년차 <span className="font-normal text-text-secondary">· 기초 잔액 {won(r.startBalance)}원</span></p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-0.5 mt-1 text-text-secondary">
                    <p>이자 <span className="text-text-primary">{won(r.interest)}</span></p>
                    <p>뗀 세금 <span className="text-text-primary">{won(r.withholding)}</span></p>
                    <p>추가분 <span className="text-text-primary">{won(r.incomeTaxExtra)}</span></p>
                    <p>보험료 <span className="text-text-primary">{won(r.insuranceExtra)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* 안내 */}
        <section className={card}>
          <h2 className={h2}>꼭 읽을 안내</h2>
          <ul className="list-disc pl-5 space-y-2 text-[14px] text-text-secondary leading-relaxed">
            <li>이 계산은 입력한 조건에서의 어림이며 실제 세액과 보험료는 다를 수 있습니다.</li>
            <li>세율과 보험료율은 {RATES_AS_OF} 기준입니다.</li>
            <li>빌린 돈으로 인정받으려면 차용증을 쓰고 이자와 원금을 실제로 갚아야 합니다. 계산 결과가 세무서의 판단을 보장하지 않습니다.</li>
            <li>증여로 처리한 돈은 돌려받지 않는 돈입니다. 주는 분의 노후 자금과 다른 자녀, 10년 안 상속 때의 합산은 이 계산에 들어 있지 않습니다.</li>
            <li>이자 차액이 기준을 넘는 경우의 증여세, 건강보험료 상한, 피부양자 자격 상실에 따른 보험료는 계산하지 않습니다.</li>
          </ul>
          <h3 className="text-[15px] font-bold text-text-primary mt-5 mb-2">이 계산이 다루지 않는 것</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-text-secondary leading-relaxed">
            <li>빌려준 사람의 실제 종합소득세 (다른 소득과 합쳐서 하는 계산)</li>
            <li>원금을 불규칙하게 갚는 경우, 중간에 이자율을 바꾸는 경우</li>
            <li>받는 사람이나 주는 사람이 여러 명인 경우</li>
            <li>취득세 등 집을 사는 데 드는 다른 비용</li>
            <li>빌린 돈의 이자를 빌린 사람이 비용으로 처리하는 문제</li>
          </ul>
        </section>

        {/* 숫자 기준 */}
        <section className={card}>
          <details>
            <summary className="cursor-pointer text-[18px] font-bold text-text-primary">이 계산에 쓴 숫자와 확인 상태</summary>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {rates.map((r) => (
                <li key={r.label} className="border-b border-slate-100 pb-2.5">
                  <p className="font-bold text-text-primary">
                    {r.label} {r.verified ? <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded px-1.5 py-0.5">확인함</span> : <Unverified />}
                  </p>
                  <p className="text-text-secondary mt-0.5 break-all">
                    {Array.isArray(r.value)
                      ? (r.value as unknown[]).map((v) => (typeof v === "object" && v !== null ? `${(v as { upTo: number | null }).upTo === null ? "초과분" : won((v as { upTo: number }).upTo) + "원 이하"} ${(v as { ratePct: number }).ratePct}% (누진공제 ${won((v as { deduction: number }).deduction)}원)` : String(v))).join(" / ")
                      : typeof r.value === "number" && r.value >= 10000
                        ? `${won(r.value)}`
                        : String(r.value)}
                  </p>
                  <p className="text-slate-500 mt-0.5">기준일 {r.asOf} · 대조할 근거 : {r.source}</p>
                </li>
              ))}
            </ul>
          </details>
        </section>
      </main>
    </div>
  );
}

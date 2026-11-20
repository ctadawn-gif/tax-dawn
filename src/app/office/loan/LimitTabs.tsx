"use client";

import { useState } from "react";
import { calculateLimit, calculateRatios, pickAmountCap, type LimitKind } from "@/lib/loanLimitCalc";
import { annuityPaymentExact, REPAY_METHOD_LABEL, type RepayMethod } from "@/lib/loanRepaymentCalc";
import {
  LOAN_AMOUNT_CAP,
  LOAN_BUYER_LABEL,
  LOAN_DSR,
  LOAN_LTV,
  LOAN_MAX_TERM_YEARS,
  LOAN_REGION_LABEL,
  LOAN_STRESS,
  listLoanRules,
  type LoanBuyer,
  type LoanRegion,
} from "@/lib/officeRates";

const won = (v: number) => Math.floor(v).toLocaleString("ko-KR");

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

const inputCls =
  "w-full px-3 py-3 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue text-right font-semibold text-text-primary text-[16px]";
const labelCls = "block text-[14px] font-bold text-text-secondary mb-1.5";

function Unverified() {
  return <span className="ml-1 inline-block rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 align-middle text-[11px] font-bold text-amber-800">확인 전</span>;
}

function MoneyInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
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
        <span className="absolute right-3 top-3.5 text-sm font-bold text-text-secondary">원</span>
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{koreanAmount(value)}</p>
    </div>
  );
}

function NumInput({
  label, value, onChange, unit, hint, flag,
}: { label: string; value: number; onChange: (v: number) => void; unit: string; hint?: string; flag?: boolean }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div>
      <label className={labelCls}>
        {label}
        {flag && <Unverified />}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text ?? String(value)}
          onChange={(e) => {
            const t = e.target.value.replace(/[^0-9.]/g, "");
            setText(t);
            const n = Number(t);
            if (t !== "" && !Number.isNaN(n)) onChange(n);
            if (t === "") onChange(0);
          }}
          onBlur={() => setText(null)}
          className={`${inputCls} pr-14`}
        />
        <span className="absolute right-3 top-3.5 text-sm font-bold text-text-secondary">{unit}</span>
      </div>
      {hint && <p className="mt-1 text-right text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div>
      <p className={labelCls}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([k, text]) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={`rounded-xl border px-3 py-2 text-[13px] font-bold ${
              value === k ? "border-brand-blue bg-brand-blue text-white" : "border-ui-border bg-white text-text-secondary"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

const REGIONS = Object.entries(LOAN_REGION_LABEL) as [LoanRegion, string][];
const BUYERS = Object.entries(LOAN_BUYER_LABEL) as [LoanBuyer, string][];
const KIND_LABEL: Record<LimitKind, string> = { ltv: "LTV 한도", dsr: "DSR 한도", cap: "금액 한도" };

export function LimitTab() {
  const [price, setPrice] = useState(0);
  const [senior, setSenior] = useState(0);
  const [region, setRegion] = useState<LoanRegion>("regulated");
  const [buyer, setBuyer] = useState<LoanBuyer>("noHouse");
  const [ltvOver, setLtvOver] = useState<number | null>(null);
  const [income, setIncome] = useState(0);
  const [lender, setLender] = useState<"bank" | "nonBank">("bank");
  const [dsrOver, setDsrOver] = useState<number | null>(null);
  const [other, setOther] = useState(0);
  const [ratePct, setRatePct] = useState(0);
  const [stressOver, setStressOver] = useState<number | null>(null);
  const [years, setYears] = useState(0);
  const [useCap, setUseCap] = useState(true);

  const ltvRatio = ltvOver ?? LOAN_LTV[buyer][region].value;
  const dsrLimit = dsrOver ?? (lender === "bank" ? LOAN_DSR.bankPct.value : LOAN_DSR.nonBankPct.value);
  const stress = stressOver ?? LOAN_STRESS[region].value;
  const capApplies = region !== "local" && useCap;
  const cap = capApplies ? pickAmountCap(price, LOAN_AMOUNT_CAP.value) : null;
  const months = Math.floor(years) * 12;

  const r = calculateLimit({
    collateralValue: price, senior, ltvRatioPct: ltvRatio, income, dsrLimitPct: dsrLimit,
    otherAnnualDebtService: other, ratePct, stressPct: stress, months, amountCap: cap,
  });
  const monthly = Math.floor(annuityPaymentExact(r.final, ratePct, months));
  const rows: { kind: LimitKind; value: number | null; note: string }[] = [
    { kind: "ltv", value: r.ltvLimit, note: `집값 × ${ltvRatio}% - 선순위·보증금 등` },
    { kind: "dsr", value: r.dsrLimit, note: `한 해 ${won(r.annualRoom)}원까지 갚는 것으로 보고, 연 ${(ratePct + stress).toFixed(2)}%로 거꾸로 계산 (원리금균등)` },
    { kind: "cap", value: r.capLimit, note: capApplies ? "수도권·규제지역, 주택 구입 목적일 때" : "적용하지 않음" },
  ];

  return (
    <>
      <section className="mt-6 rounded-2xl border border-ui-border bg-white p-5">
        <h2 className="text-[18px] font-extrabold text-text-primary">넣을 값</h2>
        <div className="mt-4 space-y-4">
          <Choice label="집이 있는 곳" value={region} options={REGIONS} onChange={(v) => { setRegion(v); setLtvOver(null); setStressOver(null); }} />
          <Choice label="사는 사람" value={buyer} options={BUYERS} onChange={(v) => { setBuyer(v); setLtvOver(null); }} />
          <Choice label="빌리는 곳" value={lender} options={[["bank", "은행"], ["nonBank", "그 밖의 금융회사"]]} onChange={(v) => { setLender(v); setDsrOver(null); }} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MoneyInput label="집값 (담보가치)" value={price} onChange={setPrice} />
          <MoneyInput label="선순위 · 보증금 등" value={senior} onChange={setSenior} />
          <MoneyInput label="연소득" value={income} onChange={setIncome} />
          <MoneyInput label="다른 대출의 한 해 원리금" value={other} onChange={setOther} />
          <NumInput label="연 이자율" value={ratePct} onChange={setRatePct} unit="%" />
          <NumInput label="기간" value={years} onChange={setYears} unit="년" hint={`${months}개월`} />
          <NumInput label="LTV 비율" value={ltvRatio} onChange={setLtvOver} unit="%" flag hint="고른 값에 따라 자동으로 들어갑니다. 고쳐 쓸 수 있습니다" />
          <NumInput label="DSR 기준" value={dsrLimit} onChange={setDsrOver} unit="%" flag />
          <NumInput label="스트레스 금리 (더하는 금리)" value={stress} onChange={setStressOver} unit="%p" flag hint="변동형 기준. 혼합형·주기형은 더 낮습니다" />
          <label className="flex items-center gap-2 self-center text-[14px] font-bold text-text-secondary">
            <input type="checkbox" checked={useCap} onChange={(e) => setUseCap(e.target.checked)} className="h-4 w-4" />
            주택 구입 목적 (금액 한도 적용)
          </label>
        </div>
        {region !== "local" && years > LOAN_MAX_TERM_YEARS.value && (
          <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[13px] font-bold text-amber-900">
            수도권·규제지역 주택담보대출 만기는 {LOAN_MAX_TERM_YEARS.value}년 이내로 제한되어 있습니다. <Unverified />
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[18px] font-extrabold text-text-primary">빌릴 수 있는 금액의 어림</h2>
        <div className="mt-3 rounded-2xl border border-brand-blue bg-white p-5">
          <p className="text-[13px] font-bold text-text-secondary">세 한도 가운데 가장 작은 값 ({KIND_LABEL[r.binding]}에 걸림)</p>
          <p className="mt-1 break-all text-[26px] font-extrabold tabular-nums text-text-primary">{won(r.final)}원</p>
          <p className="mt-1 text-xs text-slate-500">
            {koreanAmount(r.final)} · 이 금액을 연 {ratePct}%, {years}년 원리금균등으로 빌리면 한 달 {won(monthly)}원
          </p>
        </div>
        <ul className="mt-3 space-y-2">
          {rows.map((x) => (
            <li key={x.kind} className={`rounded-2xl border bg-white p-4 ${r.binding === x.kind ? "border-brand-blue" : "border-ui-border"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[15px] font-extrabold text-text-primary">{KIND_LABEL[x.kind]}</span>
                <span className="text-[17px] font-extrabold tabular-nums text-text-primary">{x.value == null ? "없음" : `${won(x.value)}원`}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{x.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function RatioTab() {
  const [income, setIncome] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [ratePct, setRatePct] = useState(0);
  const [years, setYears] = useState(0);
  const [method, setMethod] = useState<RepayMethod>("annuity");
  const [stress, setStress] = useState(0);
  const [otherDs, setOtherDs] = useState(0);
  const [otherInt, setOtherInt] = useState(0);
  const [value, setValue] = useState(0);
  const [senior, setSenior] = useState(0);
  const [dsrLimit, setDsrLimit] = useState(LOAN_DSR.bankPct.value);
  const [ltvLimit, setLtvLimit] = useState(LOAN_LTV.noHouse.regulated.value);

  const r = calculateRatios({
    income, loan: { principal, ratePct, months: Math.floor(years) * 12, method }, stressPct: stress,
    otherAnnualDebtService: otherDs, otherAnnualInterest: otherInt, collateralValue: value, senior,
    bulletMaxYears: LOAN_DSR.bulletMaxYears.value,
  });
  const lines: { name: string; pct: number; limit: number | null; note: string }[] = [
    { name: "DSR", pct: r.dsrPct, limit: dsrLimit, note: `(이번 대출 한 해 원리금 ${won(r.annualThisLoan)}원 + 다른 대출 한 해 원리금) ÷ 연소득` },
    { name: "DTI", pct: r.dtiPct, limit: null, note: `(이번 대출 한 해 원리금 ${won(r.annualThisLoanNoStress)}원 + 다른 대출 한 해 이자) ÷ 연소득. 기준은 넣지 않았습니다` },
    { name: "LTV", pct: r.ltvPct, limit: ltvLimit, note: "(대출 금액 + 선순위·보증금 등) ÷ 담보가치" },
  ];

  return (
    <>
      <section className="mt-6 rounded-2xl border border-ui-border bg-white p-5">
        <h2 className="text-[18px] font-extrabold text-text-primary">넣을 값</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MoneyInput label="연소득" value={income} onChange={setIncome} />
          <MoneyInput label="이번 대출 금액" value={principal} onChange={setPrincipal} />
          <NumInput label="연 이자율" value={ratePct} onChange={setRatePct} unit="%" />
          <NumInput label="기간" value={years} onChange={setYears} unit="년" />
          <NumInput label="스트레스 금리 (더하는 금리)" value={stress} onChange={setStress} unit="%p" hint={`2026-12-31까지 : 수도권·규제지역 ${LOAN_STRESS.regulated.value}, 지방 ${LOAN_STRESS.local.value} (변동형)`} flag />
          <MoneyInput label="다른 대출의 한 해 원리금 (DSR용)" value={otherDs} onChange={setOtherDs} />
          <MoneyInput label="다른 대출의 한 해 이자 (DTI용)" value={otherInt} onChange={setOtherInt} />
          <MoneyInput label="담보가치 (집값)" value={value} onChange={setValue} />
          <MoneyInput label="선순위 · 보증금 등" value={senior} onChange={setSenior} />
          <NumInput label="DSR 기준" value={dsrLimit} onChange={setDsrLimit} unit="%" flag />
          <NumInput label="LTV 기준" value={ltvLimit} onChange={setLtvLimit} unit="%" flag />
        </div>
        <div className="mt-4">
          <Choice label="상환 방식" value={method} options={(Object.entries(REPAY_METHOD_LABEL) as [RepayMethod, string][])} onChange={setMethod} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-[18px] font-extrabold text-text-primary">세 가지 비율</h2>
        <ul className="mt-3 space-y-2">
          {lines.map((x) => {
            const over = x.limit != null && x.pct > x.limit;
            return (
              <li key={x.name} className={`rounded-2xl border p-4 ${over ? "border-red-400 bg-red-50" : "border-ui-border bg-white"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[15px] font-extrabold text-text-primary">{x.name}</span>
                  <span className={`text-[20px] font-extrabold tabular-nums ${over ? "text-red-700" : "text-text-primary"}`}>{x.pct.toFixed(2)}%</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {x.limit != null && (over ? `넣은 기준 ${x.limit}%를 넘습니다. ` : `넣은 기준 ${x.limit}% 안입니다. `)}
                  {x.note}
                </p>
              </li>
            );
          })}
        </ul>
        {method !== "annuity" && (
          <p className="mt-3 text-[13px] text-slate-500">
            원금균등은 가장 많이 내는 첫해 금액으로, 만기 일시상환은 원금을 최대 {LOAN_DSR.bulletMaxYears.value}년으로 나눈 금액에 한 해 이자를 더해 계산했습니다. <Unverified />
          </p>
        )}
      </section>
    </>
  );
}

function showValue(v: unknown): string {
  if (Array.isArray(v)) {
    return (v as { upTo: number | null; cap: number }[])
      .map((x) => `${x.upTo == null ? "그 초과" : `집값 ${won(x.upTo)}원 이하`} : ${won(x.cap)}원`)
      .join(" / ");
  }
  return String(v);
}

export function RulesList() {
  const rules = listLoanRules();
  return (
    <details className="mt-6 rounded-2xl border border-ui-border bg-white p-5">
      <summary className="cursor-pointer text-[16px] font-extrabold text-text-primary">이 계산에 쓴 규제 숫자 ({rules.length}개, 모두 확인 전)</summary>
      <ul className="mt-3 space-y-3 text-[13px]">
        {rules.map((x) => (
          <li key={x.label} className="border-b border-ui-border pb-3">
            <p className="font-bold text-text-primary">
              {x.label} : {showValue(x.value)}
              {!x.verified && <Unverified />}
            </p>
            <p className="mt-0.5 break-all text-xs text-slate-500">기준일 {x.asOf} · {x.source}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

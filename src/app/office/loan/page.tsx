"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateRepayment,
  compareMethods,
  MAX_MONTHS,
  REPAY_METHOD_LABEL,
  type RepayMethod,
  type RepayResult,
} from "@/lib/loanRepaymentCalc";
import { LimitTab, RatioTab, RulesList } from "./LimitTabs";

const won = (v: number) => Math.floor(v).toLocaleString("ko-KR");

/** 400,000,000 → "4억 원" (원 단위까지 그대로) */
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
        <span className="absolute right-3 top-3.5 text-text-secondary text-sm font-bold">원</span>
      </div>
      <p className="text-xs text-slate-500 mt-1 text-right">{koreanAmount(value)}</p>
    </div>
  );
}

function NumInput({
  label, value, onChange, unit, decimal, hint, disabled,
}: { label: string; value: number; onChange: (v: number) => void; unit: string; decimal?: boolean; hint?: string; disabled?: boolean }) {
  const [text, setText] = useState<string | null>(null);
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          autoComplete="off"
          disabled={disabled}
          value={text ?? String(value)}
          onChange={(e) => {
            const t = e.target.value.replace(decimal ? /[^0-9.]/g : /[^0-9]/g, "");
            setText(t);
            const n = Number(t);
            if (t !== "" && !Number.isNaN(n)) onChange(n);
            if (t === "") onChange(0);
          }}
          onBlur={() => setText(null)}
          className={`${inputCls} pr-12 ${disabled ? "opacity-60" : ""}`}
        />
        <span className="absolute right-3 top-3.5 text-text-secondary text-sm font-bold">{unit}</span>
      </div>
      {hint && <p className="text-xs text-slate-500 mt-1 text-right">{hint}</p>}
    </div>
  );
}

const METHODS: RepayMethod[] = ["annuity", "equalPrincipal", "bullet"];
const TABS = ["상환 계산", "대출 가능액", "DSR·DTI·LTV"];

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ui-border bg-white p-4">
      <p className="text-[13px] font-bold text-text-secondary">{title}</p>
      <p className="mt-1 text-[20px] font-extrabold text-text-primary tabular-nums break-all">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/** 표의 한 줄. 휴대폰에서는 두 줄로 접어 옆으로 넘치지 않게 한다 */
function Line({ head, payment, principal, interest, balance }: { head: string; payment: number; principal: number; interest: number; balance: number }) {
  return (
    <li className="border-b border-ui-border py-2 text-[13px] tabular-nums">
      <div className="hidden sm:grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] gap-2 text-right">
        <span className="text-left font-bold text-text-primary">{head}</span>
        <span>{won(payment)}</span>
        <span>{won(principal)}</span>
        <span>{won(interest)}</span>
        <span>{won(balance)}</span>
      </div>
      <div className="sm:hidden">
        <div className="flex justify-between">
          <span className="font-bold text-text-primary">{head}</span>
          <span className="font-bold text-text-primary">{won(payment)}원</span>
        </div>
        <div className="mt-0.5 flex flex-wrap justify-between gap-x-3 text-xs text-slate-500">
          <span>원금 {won(principal)}</span>
          <span>이자 {won(interest)}</span>
          <span>남은 원금 {won(balance)}</span>
        </div>
      </div>
    </li>
  );
}

function LineHead({ first }: { first: string }) {
  return (
    <div className="hidden sm:grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] gap-2 border-b border-ui-border pb-2 text-right text-xs font-bold text-text-secondary">
      <span className="text-left">{first}</span>
      <span>상환액</span>
      <span>원금</span>
      <span>이자</span>
      <span>남은 원금</span>
    </div>
  );
}

function paymentSummary(r: RepayResult): { value: string; sub: string } {
  if (r.method === "annuity") {
    return { value: `${won(r.levelPayment)}원`, sub: r.lastPayment !== r.levelPayment ? `마지막 달은 ${won(r.lastPayment)}원` : "" };
  }
  if (r.method === "equalPrincipal") {
    return { value: `${won(r.firstPayment)}원`, sub: `첫 달 기준. 마지막 달은 ${won(r.lastPayment)}원` };
  }
  return { value: `${won(r.firstPayment)}원`, sub: `매달 이자만. 마지막 달은 원금을 더해 ${won(r.lastPayment)}원` };
}

export default function OfficeLoanPage() {
  const [principal, setPrincipal] = useState(0);
  const [ratePct, setRatePct] = useState(0);
  const [term, setTerm] = useState(0);
  const [termUnit, setTermUnit] = useState<"year" | "month">("year");
  const [graceMonths, setGraceMonths] = useState(0);
  const [method, setMethod] = useState<RepayMethod>("annuity");
  const [tab, setTab] = useState(0);
  const [sent, setSent] = useState<number | null>(null);
  /** 한 달 상환액을 이 브라우저 창 안에만 잠깐 적어 둔다 (주소창·서버에는 남기지 않음, 창을 닫으면 지워짐) */
  const sendToMix = (v: number) => {
    try {
      window.sessionStorage.setItem("office.mortgageMonthly", String(v));
      setSent(v);
    } catch {
      setSent(null);
    }
  };

  const months = termUnit === "year" ? Math.floor(term) * 12 : Math.floor(term);
  const common = useMemo(() => ({ principal, ratePct, months, graceMonths }), [principal, ratePct, months, graceMonths]);
  const result = useMemo(() => calculateRepayment({ ...common, method }), [common, method]);
  const compared = useMemo(() => compareMethods(common), [common]);
  const pay = paymentSummary(result);

  return (
    <main className="min-h-screen bg-ui-surface">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block rounded bg-brand-navy px-2 py-1 text-[12px] font-bold text-white">참고용</span>
          <Link href="/office/gift-loan-mix" className="text-[13px] font-bold text-brand-blue underline">
            증여·차용 혼합 계산기로 가기
          </Link>
        </div>
        <h1 className="mt-3 text-[26px] font-extrabold text-text-primary sm:text-[32px]">대출 계산기</h1>
        <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[14px] font-bold text-amber-900">이 계산기는 참고용입니다. 결과는 넣은 값에 따른 어림이며, 실제 세금·보험료·대출 조건은 달라질 수 있습니다.</p>
        <p className="mt-2 text-[15px] text-text-secondary">
          달마다 갚을 돈, 빌릴 수 있는 금액의 어림, DSR·DTI·LTV 비율을 계산합니다. 넣은 값은 이 화면 안에서만 쓰이고 어디에도 저장하지 않습니다.
        </p>

        <div className="mt-6 flex gap-2 overflow-hidden">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              className={`flex-1 rounded-xl border px-2 py-2.5 text-center text-[13px] font-bold sm:text-[14px] ${
                tab === i ? "border-brand-blue bg-brand-blue text-white" : "border-ui-border bg-white text-text-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 1 && <LimitTab />}
        {tab === 2 && <RatioTab />}
        {tab === 0 && (
          <>
        <section className="mt-6 rounded-2xl border border-ui-border bg-white p-5">
          <h2 className="text-[18px] font-extrabold text-text-primary">넣을 값</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <MoneyInput label="대출 금액" value={principal} onChange={setPrincipal} />
            <NumInput label="연 이자율" value={ratePct} onChange={setRatePct} unit="%" decimal />
            <div>
              <NumInput
                label="기간"
                value={term}
                onChange={setTerm}
                unit={termUnit === "year" ? "년" : "개월"}
                hint={termUnit === "year" ? `${months.toLocaleString("ko-KR")}개월` : `${Math.floor(months / 12)}년 ${months % 12}개월`}
              />
              <div className="mt-2 flex gap-2">
                {(["year", "month"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setTermUnit(u)}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-[13px] font-bold ${
                      termUnit === u ? "border-brand-blue text-brand-blue" : "border-ui-border text-text-secondary"
                    }`}
                  >
                    {u === "year" ? "년으로 넣기" : "개월로 넣기"}
                  </button>
                ))}
              </div>
            </div>
            <NumInput
              label="거치기간 (이자만 내는 기간)"
              value={graceMonths}
              onChange={setGraceMonths}
              unit="개월"
              disabled={method === "bullet"}
              hint={method === "bullet" ? "만기 일시상환에서는 쓰지 않습니다" : "없으면 0"}
            />
          </div>
          <div className="mt-4">
            <p className={labelCls}>상환 방식</p>
            <div className="grid grid-cols-3 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border px-2 py-3 text-[14px] font-bold ${
                    method === m ? "border-brand-blue bg-brand-blue text-white" : "border-ui-border bg-white text-text-secondary"
                  }`}
                >
                  {REPAY_METHOD_LABEL[m]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {!result.valid ? (
          <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[15px] font-bold text-amber-900">
            {result.message || `기간은 ${MAX_MONTHS}개월까지 계산합니다.`}
          </p>
        ) : (
          <>
            <section className="mt-6">
              <h2 className="text-[18px] font-extrabold text-text-primary">{REPAY_METHOD_LABEL[method]}으로 갚으면</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Card title="한 달 상환액" value={pay.value} sub={pay.sub} />
                <Card title="전체 이자" value={`${won(result.totalInterest)}원`} sub={`${result.rows.length}회 동안 내는 이자의 합`} />
                <Card title="전체 상환액" value={`${won(result.totalPayment)}원`} sub="원금 + 전체 이자" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => sendToMix(result.firstPayment)}
                  className="rounded-xl border border-brand-blue px-3 py-2 text-[13px] font-bold text-brand-blue"
                >
                  한 달 상환액 {won(result.firstPayment)}원을 증여·차용 혼합 계산기로 보내기
                </button>
                {sent != null && (
                  <span className="text-[13px] text-text-secondary">
                    보냈습니다. 혼합 계산기의 &quot;빌린 사람의 한 달 부담&quot;에서 불러오기를 누르세요.
                  </span>
                )}
              </div>
              {result.graceMonths > 0 && (
                <p className="mt-3 text-[14px] text-text-secondary">
                  처음 {result.graceMonths}개월은 이자 {won(result.gracePayment)}원만 내고, 그 뒤 {result.repayMonths}개월 동안 원금을 갚습니다.
                </p>
              )}
              {method === "equalPrincipal" && (
                <p className="mt-3 text-[14px] text-text-secondary">매달 갚는 원금은 {won(result.monthlyPrincipal)}원입니다.</p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-[18px] font-extrabold text-text-primary">세 가지 방식 견주기</h2>
              <p className="mt-1 text-[13px] text-slate-500">같은 금액, 이자율, 기간으로 계산했습니다. 만기 일시상환에는 거치기간을 넣지 않습니다.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {compared.map((r) =>
                  r.valid ? (
                    <div key={r.method} className={`rounded-2xl border bg-white p-4 ${r.method === method ? "border-brand-blue" : "border-ui-border"}`}>
                      <p className="text-[15px] font-extrabold text-text-primary">{REPAY_METHOD_LABEL[r.method]}</p>
                      <dl className="mt-2 space-y-1.5 text-[13px] tabular-nums">
                        <div className="flex justify-between gap-2"><dt className="text-text-secondary">첫 달</dt><dd className="font-bold text-text-primary">{won(r.firstPayment)}원</dd></div>
                        <div className="flex justify-between gap-2"><dt className="text-text-secondary">마지막 달</dt><dd className="font-bold text-text-primary">{won(r.lastPayment)}원</dd></div>
                        <div className="flex justify-between gap-2"><dt className="text-text-secondary">전체 이자</dt><dd className="font-bold text-text-primary">{won(r.totalInterest)}원</dd></div>
                        <div className="flex justify-between gap-2"><dt className="text-text-secondary">전체 상환액</dt><dd className="font-bold text-text-primary">{won(r.totalPayment)}원</dd></div>
                      </dl>
                    </div>
                  ) : null,
                )}
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-ui-border bg-white p-5">
              <h2 className="text-[18px] font-extrabold text-text-primary">해마다의 합계</h2>
              <p className="mt-1 text-[13px] text-slate-500">첫 회차부터 12회씩 묶었습니다. 금액은 원입니다.</p>
              <div className="mt-3">
                <LineHead first="연차" />
                <ul>
                  {result.years.map((y) => (
                    <Line key={y.year} head={`${y.year}년차`} payment={y.payment} principal={y.principal} interest={y.interest} balance={y.endBalance} />
                  ))}
                </ul>
              </div>
            </section>

            <details className="mt-4 rounded-2xl border border-ui-border bg-white p-5">
              <summary className="cursor-pointer text-[16px] font-extrabold text-text-primary">달마다의 상환표 펼치기 ({result.rows.length}회)</summary>
              <div className="mt-3">
                <LineHead first="회차" />
                <ul>
                  {result.rows.map((x) => (
                    <Line key={x.no} head={`${x.no}회`} payment={x.payment} principal={x.principal} interest={x.interest} balance={x.balance} />
                  ))}
                </ul>
              </div>
            </details>
          </>
        )}

          </>
        )}

        {tab > 0 && <RulesList />}

        <section className="mt-8 rounded-2xl border border-ui-border bg-white p-5 text-[14px] leading-relaxed text-text-secondary">
          <h2 className="text-[16px] font-extrabold text-text-primary">꼭 읽어 주세요</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>이 계산은 입력한 조건에서의 어림입니다. 실제 대출 한도와 금리, 상환액은 금융회사의 심사에 따라 달라집니다.</li>
            <li>대출 승인이나 한도를 보장하지 않습니다.</li>
            <li>대출 규제 기준은 2026-11-20 기준이며 바뀔 수 있습니다. 스트레스 금리는 2026-12-31까지의 값입니다.</li>
            <li>이자는 한 달 이율(연 이자율 ÷ 12)로 계산하고 달마다 원 미만을 버렸습니다. 마지막 회차에서 남은 원금을 모두 갚는 것으로 맞췄습니다. 금융회사마다 끝자리와 날짜 계산이 달라 몇 원에서 몇백 원까지 차이가 날 수 있습니다.</li>
            <li>금리가 중간에 바뀌는 경우와 중도상환은 계산하지 않습니다.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

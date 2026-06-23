"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintButton, { PrintHeader } from "@/components/PrintButton";
import { formatNumberInput, parseNumberInput } from "@/lib/formatInput";
import {
  numberToKoreanFormal,
  giftBenefit,
  minSafeRate,
  lenderInterestTax,
  monthsBetween,
  checkRepayment,
  ratePct,
  ADEQUATE_RATE,
  GIFT_THRESHOLD,
  INTEREST_FREE_LIMIT,
} from "@/lib/loanCalc";

const BLOG_URL = "https://blog.naver.com/tax_dawn";

// 관련 블로그 글 — 실제 링크·썸네일을 받으면 교체.
// thumb: /public/blog/ 에 넣은 이미지 경로(예: "/blog/loan-1.jpg") 또는 이미지 URL. 비우면 자리표시.
const BLOG_POSTS: { title: string; desc: string; thumb: string; url: string }[] = [
  {
    title: "부모·자녀 차용, 4.6%·1천만 원 기준 한 번에 정리",
    desc: "가족 간 차용 시 적정이자율 4.6%와 증여세 비과세 기준(연 이자차액 1천만 원)을 한 번에 정리했습니다.",
    thumb: "/blog/loan-rate-guide.jpg",
    url: "https://blog.naver.com/tax_dawn/224245790973",
  },
  {
    title: "2.17억 무이자, '차용 인정'이 먼저입니다 (양식 제공)",
    desc: "무이자 한도(약 2.17억)만 볼 게 아니라, 진짜 '차용'으로 인정받는 요건이 먼저인 이유와 양식.",
    thumb: "/blog/loan-interest-free-217.jpg",
    url: "https://blog.naver.com/tax_dawn/224321271269",
  },
  {
    title: "국세청 기준으로 본, 부모 차용증을 증여로 보는 경우",
    desc: "국세청 안내 기준에서 부모 자금 차용이 증여로 간주되는 대표 사례를 정리했습니다.",
    thumb: "/blog/loan-gift-cases.jpg",
    url: "https://blog.naver.com/tax_dawn/224140479746",
  },
];
const won = (v: number) => (v || 0).toLocaleString("ko-KR");
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-ui-surface border border-transparent focus:border-brand-blue focus:bg-white outline-none transition-colors text-[15px] text-text-primary placeholder:text-slate-400";

function dateKo(s: string): string | null {
  if (!s) return null;
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return null;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

/** 미리보기 빈칸: 값이 있으면 표시, 없으면 손글씨용 밑줄 */
function Fill({ value, w = "120px" }: { value?: string | number | null; w?: string }) {
  if (value !== "" && value != null) return <>{value}</>;
  return (
    <span
      style={{ display: "inline-block", minWidth: w, borderBottom: "1px solid #94a3b8" }}
    >
      &nbsp;
    </span>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[13px] font-bold text-text-secondary mb-1.5">
        {label}
        {hint && <span className="font-normal text-slate-400"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default function LoanAgreementPage() {
  // 거래조건
  const [amount, setAmount] = useState<number | "">("");
  const [loanDate, setLoanDate] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [holder, setHolder] = useState("");
  // 이자
  const [rate, setRate] = useState("");
  const [intDay, setIntDay] = useState("");
  // 변제
  const [dueDate, setDueDate] = useState("");
  const [repayType, setRepayType] = useState<"lump" | "installment">("lump");
  const [monthly, setMonthly] = useState<number | "">("");
  const [repayDay, setRepayDay] = useState("");
  const [balloon, setBalloon] = useState(false);
  const [extra, setExtra] = useState("");
  // 인적사항(선택)
  const [nameA, setNameA] = useState("");
  const [idA, setIdA] = useState("");
  const [telA, setTelA] = useState("");
  const [addrA, setAddrA] = useState("");
  const [nameB, setNameB] = useState("");
  const [idB, setIdB] = useState("");
  const [telB, setTelB] = useState("");
  const [addrB, setAddrB] = useState("");
  // 작성일 (하이드레이션 안전하게 클라이언트에서 오늘 날짜 채움)
  const [writeDate, setWriteDate] = useState("");
  useEffect(() => {
    const t = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    setWriteDate(`${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`);
  }, []);

  const amt = Number(amount) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const mAmt = Number(monthly) || 0;

  const calc = useMemo(() => {
    const korean = amt > 0 ? numberToKoreanFormal(amt) : "";
    const benefit = giftBenefit(amt, r);
    const safe = benefit < GIFT_THRESHOLD;
    const minR = minSafeRate(amt);
    const lenderTax = lenderInterestTax(amt, r);
    const months = monthsBetween(loanDate, dueDate);
    const repay = checkRepayment(amt, mAmt, months);
    const gauge = Math.min(100, GIFT_THRESHOLD ? (benefit / GIFT_THRESHOLD) * 100 : 0);
    return { korean, benefit, safe, minR, lenderTax, months, repay, gauge };
  }, [amt, r, mAmt, loanDate, dueDate]);

  const interestFree = amt > 0 && amt <= INTEREST_FREE_LIMIT;

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-5 lg:px-10 py-8 lg:py-12">
        {/* 헤더 */}
        <header className="no-print mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-3">
            무료 서식 · 로그인 없음
          </div>
          <h1 className="text-[28px] lg:text-[36px] font-extrabold text-text-primary tracking-tight leading-tight">
            차용증 자동작성
            <span className="text-text-secondary font-bold text-[18px] lg:text-[22px]">
              {" "}
              (금전소비대차 계약서)
            </span>
          </h1>
          <p className="mt-3 text-[15px] lg:text-[16px] text-text-secondary leading-relaxed">
            빈칸만 채우면 오른쪽에 실시간으로 완성됩니다. 가족 간 차용 시{" "}
            <b className="text-text-primary">증여세 안전선(4.6%·무이자 2.17억)</b>과{" "}
            <b className="text-text-primary">상환계획</b>까지 자동으로 점검해 드려요.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* ───────────── 입력 폼 ───────────── */}
          <section className="no-print space-y-6">
            {/* 1. 거래조건 */}
            <div className="bg-white rounded-2xl border border-ui-border p-5 lg:p-6 shadow-sm">
              <h2 className="text-[15px] font-extrabold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-blue text-white text-[12px] font-bold flex items-center justify-center">
                  1
                </span>
                거래 조건
              </h2>
              <div className="space-y-4">
                <Field label="차용 금액 (원)">
                  <input
                    inputMode="numeric"
                    value={formatNumberInput(amount)}
                    onChange={(e) => setAmount(parseNumberInput(e.target.value) as number | "")}
                    placeholder="예: 100,000,000"
                    className={inputCls}
                  />
                  {amt > 0 && (
                    <p className="mt-1.5 text-[13px] text-brand-blue font-semibold">
                      일금 {calc.korean}원정
                    </p>
                  )}
                </Field>
                <Field label="차용일 (돈을 빌린 날)">
                  <input
                    type="date"
                    value={loanDate}
                    onChange={(e) => setLoanDate(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="은행">
                    <input
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      placeholder="○○은행"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="계좌번호">
                    <input
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="000-00-000000"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="예금주">
                    <input
                      value={holder}
                      onChange={(e) => setHolder(e.target.value)}
                      placeholder="홍길동"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <p className="text-[12px] text-slate-400 -mt-1">
                  ※ 차용금은 반드시 <b className="text-slate-500">계좌이체</b>로 주고받아야 거래 사실이
                  입증됩니다.
                </p>
              </div>
            </div>

            {/* 2. 이자 + 시뮬레이터 */}
            <div className="bg-white rounded-2xl border border-ui-border p-5 lg:p-6 shadow-sm">
              <h2 className="text-[15px] font-extrabold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-blue text-white text-[12px] font-bold flex items-center justify-center">
                  2
                </span>
                이자
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-1">
                <Field label="약정 이자율 (연 %)">
                  <input
                    inputMode="decimal"
                    value={rate}
                    onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="예: 4.6  (무이자=0)"
                    className={inputCls}
                  />
                </Field>
                <Field label="이자 지급일" hint="매월">
                  <input
                    inputMode="numeric"
                    value={intDay}
                    onChange={(e) => setIntDay(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                    placeholder="예: 25"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* 이자율 시뮬레이터 */}
              {amt > 0 && (
                <div className="mt-4 rounded-xl bg-ui-surface border border-ui-border p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-extrabold text-text-primary">
                    💡 이자율 시뮬레이터 <span className="text-slate-400 font-medium">(증여세 안전 체크)</span>
                  </div>

                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">무이자 안전 한도</span>
                    <span className="font-bold text-text-primary">{won(INTEREST_FREE_LIMIT)}원</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[13px]">
                    <span className="text-text-secondary">이 원금의 최소 안전 이자율</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-brand-blue">
                        {calc.minR > 0 ? `연 ${ratePct(calc.minR)}%` : "0% (무이자 가능)"}
                      </span>
                      {calc.minR > 0 && (
                        <button
                          type="button"
                          onClick={() => setRate(ratePct(calc.minR))}
                          className="text-[11px] font-bold px-2 py-1 rounded-md bg-brand-blue text-white hover:bg-blue-700 transition-colors"
                        >
                          적용
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 게이지 */}
                  <div>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-text-secondary">
                        연간 증여 의제 차액{" "}
                        <span className="text-slate-400">(적정이자 − 실제이자)</span>
                      </span>
                      <span className="font-bold text-text-primary">{won(calc.benefit)}원</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          calc.safe ? (calc.gauge > 80 ? "bg-amber-400" : "bg-emerald-500") : "bg-red-500"
                        }`}
                        style={{ width: `${Math.max(2, calc.gauge)}%` }}
                      />
                    </div>
                    <div className="mt-1.5">
                      {calc.safe ? (
                        <span className="text-[12px] font-bold text-emerald-600">
                          ✅ 안전 — 차액이 1,000만원 미만이라 증여세 과세 대상 아님
                        </span>
                      ) : (
                        <span className="text-[12px] font-bold text-red-600">
                          ⚠️ 차액 1,000만원 이상 — 증여세 과세 대상. 이자율을 올리세요
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 이자소득세 트레이드오프 */}
                  {r > 0 && (
                    <div className="pt-2 border-t border-ui-border text-[12px] text-text-secondary leading-relaxed">
                      이자를 받으면 빌려준 사람(갑)에게{" "}
                      <b className="text-text-primary">연간 이자소득세 약 {won(calc.lenderTax)}원</b>{" "}
                      (27.5% 원천징수)이 생깁니다. <br />
                      👉 보통 <b className="text-text-primary">최소 안전 이자율</b>에 맞추는 것이 증여세·이자소득세
                      균형점입니다.
                    </div>
                  )}

                  <Link
                    href="/calculator/inherit-gift"
                    className="inline-block text-[12px] font-bold text-brand-blue hover:underline"
                  >
                    정확한 증여세 합산·공제는 증여세 계산기 →
                  </Link>
                </div>
              )}
            </div>

            {/* 3. 변제 + 상환 정합성 */}
            <div className="bg-white rounded-2xl border border-ui-border p-5 lg:p-6 shadow-sm">
              <h2 className="text-[15px] font-extrabold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-blue text-white text-[12px] font-bold flex items-center justify-center">
                  3
                </span>
                변제 (상환)
              </h2>
              <div className="space-y-4">
                <Field label="변제 기일 (만기)">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputCls}
                  />
                  {calc.months > 0 && (
                    <p className="mt-1.5 text-[12px] text-text-secondary">상환기간 약 {calc.months}개월</p>
                  )}
                </Field>

                <div className="flex gap-2">
                  {(["lump", "installment"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRepayType(t)}
                      className={`flex-1 py-2.5 rounded-xl text-[14px] font-bold border transition-colors ${
                        repayType === t
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-white text-text-secondary border-ui-border hover:border-brand-blue"
                      }`}
                    >
                      {t === "lump" ? "만기 일시상환" : "매월 분할상환"}
                    </button>
                  ))}
                </div>

                {repayType === "installment" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="월 상환 원금 (원)">
                        <input
                          inputMode="numeric"
                          value={formatNumberInput(monthly)}
                          onChange={(e) =>
                            setMonthly(parseNumberInput(e.target.value) as number | "")
                          }
                          placeholder="예: 2,000,000"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="상환일" hint="매월">
                        <input
                          inputMode="numeric"
                          value={repayDay}
                          onChange={(e) =>
                            setRepayDay(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))
                          }
                          placeholder="예: 25"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {/* 상환계획 정합성 */}
                    {amt > 0 && calc.months > 0 && mAmt > 0 && (
                      <div className="rounded-xl bg-ui-surface border border-ui-border p-4 space-y-2.5">
                        <div className="text-[13px] font-extrabold text-text-primary">
                          📋 상환계획 점검
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-text-secondary">
                            {calc.months}개월 × {won(mAmt)}원 = 상환총액
                          </span>
                          <span className="font-bold text-text-primary">
                            {won(calc.repay.totalScheduled)}원
                          </span>
                        </div>
                        {calc.repay.fullyRepaid ? (
                          <p className="text-[13px] font-bold text-emerald-600">
                            ✅ 약 {calc.repay.payoffMonths}개월차 완납 (마지막 회차{" "}
                            {won(calc.repay.lastPayment || 0)}원)
                          </p>
                        ) : (
                          <>
                            <p className="text-[13px] font-bold text-amber-600">
                              ⚠️ 만기까지 {won(calc.repay.shortfall)}원이 남습니다 (잔액)
                            </p>
                            <div className="flex items-center justify-between text-[13px]">
                              <span className="text-text-secondary">기간 내 완납 권장 월상환액</span>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-brand-blue">
                                  {won(calc.repay.recommendedMonthly)}원
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setMonthly(calc.repay.recommendedMonthly)}
                                  className="text-[11px] font-bold px-2 py-1 rounded-md bg-brand-blue text-white hover:bg-blue-700 transition-colors"
                                >
                                  적용
                                </button>
                              </div>
                            </div>
                            <label className="flex items-start gap-2 pt-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={balloon}
                                onChange={(e) => setBalloon(e.target.checked)}
                                className="mt-0.5 accent-brand-blue"
                              />
                              <span className="text-[12px] text-text-secondary leading-snug">
                                잔액은 <b className="text-text-primary">만기에 일시 상환</b>한다는 약정을
                                계약서에 추가
                                {balloon && (
                                  <span
                                    className={`block mt-1 font-bold ${
                                      calc.repay.balloonRatio > 0.5 ? "text-red-600" : "text-emerald-600"
                                    }`}
                                  >
                                    만기 일시상환 비중{" "}
                                    {Math.round(calc.repay.balloonRatio * 100)}% —{" "}
                                    {calc.repay.balloonRatio > 0.5
                                      ? "⚠️ 비중이 높아요. 분할 비중을 높이는 걸 권장"
                                      : "적정"}
                                  </span>
                                )}
                              </span>
                            </label>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 4. 특약 */}
            <div className="bg-white rounded-2xl border border-ui-border p-5 lg:p-6 shadow-sm">
              <h2 className="text-[15px] font-extrabold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-blue text-white text-[12px] font-bold flex items-center justify-center">
                  4
                </span>
                기타 특약 <span className="text-slate-400 font-medium text-[13px]">(선택)</span>
              </h2>
              <textarea
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                rows={2}
                placeholder="예: 중도 상환 시 별도 수수료 없음 등"
                className={inputCls + " resize-none"}
              />
            </div>

            {/* 5. 인적사항 (선택) */}
            <div className="bg-white rounded-2xl border border-ui-border p-5 lg:p-6 shadow-sm">
              <h2 className="text-[15px] font-extrabold text-text-primary mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-400 text-white text-[12px] font-bold flex items-center justify-center">
                  5
                </span>
                당사자 인적사항{" "}
                <span className="text-slate-400 font-medium text-[13px]">(선택 — 비우면 손글씨)</span>
              </h2>
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 p-2.5">
                <span className="text-[14px]">🔒</span>
                <p className="text-[12px] text-amber-800 leading-snug">
                  모든 입력은 이 브라우저 안에서만 처리되며 <b>서버로 전송·저장되지 않습니다.</b>{" "}
                  주민등록번호 등 민감정보는 입력하지 말고, <b>인쇄 후 직접 손으로 작성</b>하시길 권장합니다.
                </p>
              </div>

              {[
                {
                  t: "채권자 (갑) — 빌려주는 사람",
                  name: nameA,
                  sn: setNameA,
                  id: idA,
                  sid: setIdA,
                  tel: telA,
                  stel: setTelA,
                  addr: addrA,
                  saddr: setAddrA,
                },
                {
                  t: "채무자 (을) — 빌리는 사람",
                  name: nameB,
                  sn: setNameB,
                  id: idB,
                  sid: setIdB,
                  tel: telB,
                  stel: setTelB,
                  addr: addrB,
                  saddr: setAddrB,
                },
              ].map((p) => (
                <div key={p.t} className="mb-4 last:mb-0">
                  <div className="text-[13px] font-bold text-text-secondary mb-2">{p.t}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={p.name}
                      onChange={(e) => p.sn(e.target.value)}
                      placeholder="성명"
                      className={inputCls}
                    />
                    <input
                      value={p.tel}
                      onChange={(e) => p.stel(e.target.value)}
                      placeholder="연락처"
                      className={inputCls}
                    />
                    <input
                      value={p.id}
                      onChange={(e) => p.sid(e.target.value)}
                      placeholder="주민등록번호 (권장: 손글씨)"
                      className={inputCls}
                    />
                    <input
                      value={p.addr}
                      onChange={(e) => p.saddr(e.target.value)}
                      placeholder="주소"
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ───────────── 실시간 미리보기 ───────────── */}
          <section className="lg:sticky lg:top-6">
            <div className="no-print flex items-center justify-between mb-3">
              <span className="text-[13px] font-bold text-text-secondary">실시간 미리보기</span>
              <PrintButton label="인쇄 / PDF 저장" />
            </div>

            <div className="rounded-2xl border border-ui-border shadow-sm overflow-hidden">
              <article className="bg-white p-7 lg:p-9 text-[13px] leading-relaxed text-slate-900 print-keep">
                <PrintHeader title="금전소비대차 계약서 (차용증)" />

                <h2 className="text-center text-[20px] font-extrabold tracking-tight mb-5">
                  금전소비대차 계약서
                </h2>
                <p className="mb-5 text-slate-700">
                  채권자(돈을 빌려주는 사람, 이하 “갑”)와(과) 채무자(돈을 빌리는 사람, 이하 “을”)는 아래와 같이
                  금전소비대차 계약을 체결한다.
                </p>

                {/* 제1조 */}
                <h3 className="font-bold mb-1.5">제1조 (차용 금액)</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    <DocRow label="차용 금액">
                      일금 <Fill value={amt > 0 ? calc.korean : ""} w="180px" />원정 (₩
                      <Fill value={amt > 0 ? won(amt) : ""} w="110px" />)
                    </DocRow>
                    <DocRow label="차용일">
                      <Fill value={dateKo(loanDate)} w="160px" />
                    </DocRow>
                    <DocRow label="입금 계좌">
                      <Fill value={bank} w="80px" /> <Fill value={account} w="130px" /> (예금주:{" "}
                      <Fill value={holder} w="70px" />)
                    </DocRow>
                    <DocRow label="차용 방법">계좌이체</DocRow>
                  </tbody>
                </table>

                {/* 제2조 */}
                <h3 className="font-bold mb-1.5">제2조 (이자)</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    <DocRow label="약정 이자율">
                      연 <Fill value={rate ? ratePct(r) : ""} w="50px" />%{" "}
                      <span className="text-slate-400">(세법상 적정이자율 {ratePct(ADEQUATE_RATE)}%)</span>
                    </DocRow>
                    <DocRow label="이자 지급">
                      매월 <Fill value={intDay} w="36px" />일, 갑의 계좌로 계좌이체
                    </DocRow>
                  </tbody>
                </table>

                {/* 제3조 */}
                <h3 className="font-bold mb-1.5">제3조 (변제기 및 변제 방법)</h3>
                <table className="w-full border-collapse mb-4">
                  <tbody>
                    <DocRow label="변제 기일">
                      <Fill value={dateKo(dueDate)} w="160px" /> 까지
                    </DocRow>
                    <DocRow label="변제 방법">
                      {repayType === "lump" ? (
                        "변제기일에 원금을 일시 상환한다."
                      ) : (
                        <>
                          매월 <Fill value={repayDay} w="36px" />일, 원금{" "}
                          <Fill value={mAmt > 0 ? won(mAmt) : ""} w="90px" />원씩 분할 상환한다.
                        </>
                      )}
                    </DocRow>
                    <DocRow label="변제 계좌">갑의 계좌로 계좌이체</DocRow>
                  </tbody>
                </table>

                {/* 제4조 */}
                <h3 className="font-bold mb-1.5">제4조 (기한이익 상실 및 특약사항)</h3>
                <ul className="space-y-1 mb-3 text-slate-700">
                  <li>
                    ① 을이 이자 지급을 2회 이상 지체하거나 파산·회생 절차의 개시가 있는 때에는, 갑의 청구에 따라
                    기한의 이익을 상실하고 즉시 잔존 원리금을 변제한다.
                  </li>
                  <li>② 을이 변제를 지체한 경우, 지체된 금액에 대하여 지연손해금을 가산하여 지급한다.</li>
                  <li>③ 본 계약과 관련한 분쟁은 갑의 주소지 관할 법원을 제1심 관할법원으로 한다.</li>
                  {repayType === "installment" && balloon && (
                    <li>④ 매월 분할상환액으로 변제되지 않은 원금 잔액은 변제기일에 일시 상환한다.</li>
                  )}
                  {extra && <li>※ 기타 특약: {extra}</li>}
                </ul>
                <p className="mb-6 text-slate-700">
                  본 계약서는 2부를 작성하여 갑과 을이 각 1부씩 보관한다.
                </p>

                {/* 작성일 */}
                <p className="text-center font-semibold mb-5">
                  <Fill value={dateKo(writeDate)} w="160px" />
                </p>

                {/* 서명란 */}
                {[
                  { t: "채권자 (갑)", name: nameA, id: idA, tel: telA, addr: addrA },
                  { t: "채무자 (을)", name: nameB, id: idB, tel: telB, addr: addrB },
                ].map((p) => (
                  <table key={p.t} className="w-full border-collapse mb-3">
                    <tbody>
                      <tr>
                        <th className="border border-slate-300 bg-slate-50 p-2 text-left w-[110px] font-semibold">
                          {p.t} 성명
                        </th>
                        <td className="border border-slate-300 p-2">
                          <Fill value={p.name} w="120px" />
                        </td>
                        <td className="border border-slate-300 p-2 w-[110px] text-center text-slate-500">
                          (서명 또는 인)
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-slate-50 p-2 text-left font-semibold">
                          주민등록번호
                        </th>
                        <td className="border border-slate-300 p-2">
                          <Fill value={p.id} w="120px" />
                        </td>
                        <td className="border border-slate-300 bg-slate-50 p-2 text-center font-semibold">
                          연락처
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-slate-50 p-2 text-left font-semibold">
                          주소
                        </th>
                        <td className="border border-slate-300 p-2" colSpan={2}>
                          <Fill value={p.addr} w="280px" />
                          {p.tel && <span className="float-right text-slate-700">☎ {p.tel}</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}

                {/* 안내문구 */}
                <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5 leading-relaxed">
                  <p>
                    ※ 본 양식은 가족 간 금전 대차 시 차용으로 인정받기 위한 실무 요건(차용 금액·이자율·상환
                    일정·당사자 서명)을 반영하여 작성되었습니다.
                  </p>
                  <p>
                    ※ 세법상 적정이자율(연 {ratePct(ADEQUATE_RATE)}%)보다 낮은 이자율 또는 무이자로 차용 시, 연간
                    이자 차액이 1천만 원 미만이면 증여세 과세 대상에서 제외됩니다. 약 {won(INTEREST_FREE_LIMIT)}원
                    이하는 무이자 차용이 가능합니다.
                  </p>
                  <p>
                    ※ 차용증 작성 후에는 작성 시점을 객관적으로 입증할 수 있도록 우체국 내용증명, 공증, 전자계약
                    플랫폼 등을 활용할 수 있습니다.
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>

        {/* ───────────── 관련 블로그(썸네일 카드) + 상담 ───────────── */}
        <section className="no-print mt-12">
          <h2 className="text-[20px] lg:text-[22px] font-extrabold text-text-primary mb-1">
            차용증, 더 알아보기
          </h2>
          <p className="text-[14px] text-text-secondary mb-5">
            작성법·증여세·자금출처 소명까지 — 블로그에서 자세히 정리했습니다.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BLOG_POSTS.map((post, i) => (
              <BlogCard key={i} {...post} />
            ))}
          </div>

          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block rounded-2xl border border-ui-border bg-ui-surface p-5 hover:border-brand-blue transition-colors group"
          >
            <div className="text-[15px] font-extrabold text-text-primary mb-1 group-hover:text-brand-blue">
              내 상황은 좀 복잡한데? · 1:1 상담 안내 →
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              자금출처 소명, 큰 금액 차용, 무이자 한도 초과 등은 세무사 상담이 안전합니다. 상담 방법은 블로그에서
              안내드립니다.
            </p>
          </a>
        </section>

        <p className="no-print mt-6 text-[12px] text-slate-400 leading-relaxed">
          본 서식은 일반적인 정보 제공용이며, 법적 효력은 개별 사안에 따라 달라질 수 있습니다. 금액이 크거나 다툼의
          소지가 있는 거래는 전문가 상담을 권장합니다.
        </p>
      </main>

      <Footer />
    </div>
  );
}

function DocRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th className="border border-slate-300 bg-slate-50 p-2 text-left w-[110px] font-semibold align-top">
        {label}
      </th>
      <td className="border border-slate-300 p-2">{children}</td>
    </tr>
  );
}

function BlogCard({
  title,
  desc,
  thumb,
  url,
}: {
  title: string;
  desc: string;
  thumb: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-ui-border overflow-hidden hover:border-brand-blue hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-[13px] font-medium">
            썸네일 준비 중
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-[15px] font-bold text-text-primary leading-snug mb-1 group-hover:text-brand-blue line-clamp-2">
          {title}
        </div>
        <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">{desc}</p>
        <span className="inline-block mt-2 text-[12px] font-bold text-brand-blue">
          블로그에서 보기 →
        </span>
      </div>
    </a>
  );
}

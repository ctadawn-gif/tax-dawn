"use client";

// 차용증 상환 스케줄표 탭 — 핵심 숫자 4개 → 세금 계산 예시 → 회차표 → 당사자별 할 일 → 계산 기준
// (화면 + 엑셀 다운로드 + 별도 인쇄. 인쇄 규칙은 globals.css .print-schedule)
import { useState } from "react";
import { scheduleToCsv, type ScheduleResult, type RepayType, type ScheduleRow } from "@/lib/loanSchedule";
import { downloadScheduleXlsx } from "@/lib/loanScheduleXlsx";
import { ratePct } from "@/lib/loanCalc";

const won = (v: number) => (v || 0).toLocaleString("ko-KR");
const dot = (s: string) => s.replace(/-/g, ".");
const WITHHOLDING_LABEL = "27.5%"; // 소득세 25% + 지방소득세 2.5%

export interface ScheduleMeta {
  principal: number;
  annualRate: number;
  loanDate: string;
  dueDate: string;
  repayType: RepayType;
  monthlyPrincipal: number;
  lenderName?: string;
  borrowerName?: string;
  repayDay?: number;
  interestDay?: number;
}

export default function RepaymentSchedule({
  result,
  meta,
  onPrint,
  onEditTerms,
}: {
  result: ScheduleResult;
  meta: ScheduleMeta;
  onPrint: () => void;
  onEditTerms: () => void;
}) {
  const { rows, totals, byYear, warnings } = result;
  const hasInterest = meta.annualRate > 0;
  const taxTotal = totals.incomeTax + totals.localTax;
  const firstInterest = rows.find((x) => x.interest > 0);
  const months = rows.length;

  const [busy, setBusy] = useState(false);
  const download = async () => {
    setBusy(true);
    try {
      await downloadScheduleXlsx(result, meta);
    } catch {
      // 엑셀 모듈을 못 받아오면 CSV로 대체 (엑셀에서 열림)
      const blob = new Blob([scheduleToCsv(result)], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `상환스케줄표_${meta.loanDate.replace(/-/g, "")}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  };

  if (rows.length === 0) return null;

  const terms = [
    { l: "차용 원금", v: `${won(meta.principal)}원` },
    { l: "이자율", v: hasInterest ? `연 ${ratePct(meta.annualRate)}%` : "무이자" },
    { l: "기간", v: `${dot(meta.loanDate)} ~ ${dot(meta.dueDate)}` },
    { l: "상환", v: meta.repayType === "installment" ? `매월 ${won(meta.monthlyPrincipal)}원 분할` : "만기 일시상환" },
  ];

  return (
    <div className="print-schedule">
      {/* ── 인쇄 전용 머리글 ── */}
      <div className="print-only mb-4 border-b-2 border-slate-900 pb-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[18pt] font-extrabold text-slate-900">상환 스케줄표</div>
            <div className="text-[9.5pt] text-slate-600 mt-1">
              금전소비대차 계약서 별첨 · {terms.map((t) => `${t.l} ${t.v}`).join(" · ")}
              {(meta.lenderName || meta.borrowerName) && (
                <>
                  {" "}· 채권자 {meta.lenderName || "____"} / 채무자 {meta.borrowerName || "____"}
                </>
              )}
            </div>
          </div>
          <div className="text-[8.5pt] text-slate-500 text-right">www.dawntax.com</div>
        </div>
      </div>

      {/* ── 화면 헤더 ── */}
      <div className="no-print mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-[24px] lg:text-[30px] font-extrabold text-text-primary tracking-tight leading-tight">
              상환 스케줄표
            </h2>
            <p className="mt-1.5 text-[14px] lg:text-[15px] text-text-secondary">
              {hasInterest ? (
                <>
                  매달 보낼 돈과 뗄 세금.
                  <br className="md:hidden" />
                  <span className="hidden md:inline"> </span>엑셀로 받아 납부 체크하며 관리하세요.
                </>
              ) : (
                <>
                  무이자 분할상환 일정.
                  <br className="md:hidden" />
                  <span className="hidden md:inline"> </span>엑셀로 받아 납부 체크하며 관리하세요.
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-[14px] font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {busy ? "준비 중…" : "엑셀로 다운로드"}
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ui-border bg-white text-text-secondary text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors shadow-sm"
              title="PC에서만 인쇄/PDF 저장이 가능합니다"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              인쇄 / PDF
            </button>
          </div>
        </div>

        {/* 조건 요약 칩 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
          {terms.map((t) => (
            <span key={t.l} className="inline-flex items-baseline gap-1.5">
              <span className="text-slate-400">{t.l}</span>
              <span className="font-bold text-text-primary">{t.v}</span>
            </span>
          ))}
          <button type="button" onClick={onEditTerms} className="text-brand-blue font-bold hover:underline">
            조건 수정 →
          </button>
        </div>
      </div>

      {/* ── 핵심 숫자 ── */}
      {hasInterest ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 print-summary">
          <Kpi label="총 이자 (세전)" value={totals.interest} sub={`${months}회 · 갑이 받을 이자 전체`} />
          <Kpi
            label={`이자소득세 ${WITHHOLDING_LABEL}`}
            value={taxTotal}
            tone="red"
            sub={`소득세 25% ${won(totals.incomeTax)} + 지방소득세 2.5% ${won(totals.localTax)}`}
          />
          <Kpi label="갑 실수령 이자 (세후)" value={totals.netInterest} sub="총 이자 − 세금" />
          <Kpi label="을 총 송금액" value={totals.payment} tone="dark" sub={`원금 ${won(totals.principal)} + 세후 이자 ${won(totals.netInterest)}`} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 print-summary">
          <Kpi label="총 상환 원금" value={totals.principal} />
          <Kpi label="상환 회차" value={months} unit="회" />
          <Kpi label="월 상환액" value={meta.monthlyPrincipal} />
          <Kpi label="을 총 송금액" value={totals.payment} tone="dark" sub="무이자 · 세금 없음" />
        </div>
      )}

      {/* ── 세금 계산 예시 (첫 이자 회차) ── */}
      {hasInterest && firstInterest && (
        <div className="mt-4 rounded-2xl border border-ui-border bg-white p-4 md:p-5 print-example">
          <div className="text-[12px] font-bold text-text-secondary mb-2">
            세금은 이렇게 뗍니다 — {firstInterest.no}회차({dot(firstInterest.date)}) 예시
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] md:text-[15px] font-bold tabular-nums">
            <span className="text-text-primary">이자 {won(firstInterest.interest)}</span>
            <span className="text-slate-400">×</span>
            <span className="text-red-600">{WITHHOLDING_LABEL}</span>
            <span className="text-slate-400">=</span>
            <span className="text-red-600">세금 {won(firstInterest.incomeTax + firstInterest.localTax)}</span>
            <span className="text-slate-400">→</span>
            <span className="text-text-primary">세후 이자 {won(firstInterest.netInterest)}</span>
            {firstInterest.principal > 0 && <span className="text-slate-400">+ 원금 {won(firstInterest.principal)} =</span>}
            <span className="text-brand-blue">송금 {won(firstInterest.payment)}원</span>
          </div>
          <p className="mt-2 text-[12px] text-text-secondary leading-relaxed">
            {WITHHOLDING_LABEL} = 소득세 25% + 지방소득세 2.5%(소득세의 10%). 각각 10원 미만 절사. 채무자(을)가 떼서 국세청에 내고, 채권자(갑)는
            세후 금액만 받습니다.
          </p>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 space-y-1">
          {warnings.map((w) => (
            <p key={w} className="text-[13px] text-amber-800 leading-relaxed">
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      {/* ── 표 (PC·인쇄) ── */}
      <div className="hidden md:block print-table mt-6 rounded-2xl border border-ui-border overflow-hidden">
        <div className="overflow-auto max-h-[680px]">
          <table className="w-full border-collapse text-[13px] tabular-nums">
            <thead className="sticky top-0 z-10 bg-ui-surface text-text-secondary text-[12px]">
              {hasInterest && (
                <tr className="border-b border-ui-border">
                  <th colSpan={3} className="py-2" />
                  <th colSpan={3} className="py-2 text-center font-bold text-text-primary bg-blue-50/60 border-x border-ui-border">
                    이자 — 갑에게 지급
                  </th>
                  <th colSpan={3} className="py-2" />
                </tr>
              )}
              <tr>
                <Th className="pl-4">회차</Th>
                <Th>지급일</Th>
                <Th className="text-right">원금 상환</Th>
                {hasInterest && (
                  <>
                    <Th className="text-right border-l border-ui-border bg-blue-50/60">세전</Th>
                    <Th className="text-right bg-blue-50/60">− 세금 {WITHHOLDING_LABEL}</Th>
                    <Th className="text-right border-r border-ui-border bg-blue-50/60">= 세후</Th>
                  </>
                )}
                <Th className="text-right font-extrabold text-text-primary">실송금액</Th>
                <Th className="text-right">남은 원금</Th>
                {hasInterest && <Th className="text-center pr-4">원천세 납부기한</Th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => {
                const prevYear = i > 0 ? rows[i - 1].date.slice(0, 4) : null;
                const year = x.date.slice(0, 4);
                return (
                  <RowGroup
                    key={x.no}
                    x={x}
                    yearBreak={prevYear !== null && prevYear !== year ? year : null}
                    cols={hasInterest ? 9 : 5}
                    zebra={i % 2 === 1}
                    hasInterest={hasInterest}
                  />
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-ui-surface font-extrabold text-[13px]">
                <Td colSpan={2} className="pl-4">
                  합계 <span className="font-medium text-text-secondary">({months}회)</span>
                </Td>
                <Td className="text-right">{won(totals.principal)}</Td>
                {hasInterest && (
                  <>
                    <Td className="text-right border-l border-ui-border">{won(totals.interest)}</Td>
                    <Td className="text-right text-red-600">−{won(taxTotal)}</Td>
                    <Td className="text-right border-r border-ui-border">{won(totals.netInterest)}</Td>
                  </>
                )}
                <Td className="text-right text-brand-blue">{won(totals.payment)}</Td>
                <Td />
                {hasInterest && <Td />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ── 모바일 회차 카드 ── */}
      <div className="md:hidden no-print mt-5 rounded-2xl border border-ui-border divide-y divide-ui-border overflow-hidden">
        {rows.map((x, i) => {
          const prevYear = i > 0 ? rows[i - 1].date.slice(0, 4) : null;
          const year = x.date.slice(0, 4);
          return (
            <div key={x.no}>
              {prevYear !== null && prevYear !== year && (
                <div className="px-4 py-1.5 bg-slate-100 text-[11px] font-extrabold text-slate-500 tracking-wide">{year}년</div>
              )}
              <div className={`p-4 ${x.isMaturity ? "bg-blue-50/60" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-text-secondary">
                    {x.no}회차 · {dot(x.date)}
                    {x.isMaturity && <span className="ml-1.5 text-brand-blue">만기</span>}
                  </span>
                  <span className="text-[11px] text-slate-400">남은 원금 {won(x.balance)}</span>
                </div>
                <div className="text-[20px] font-extrabold text-text-primary tracking-tight tabular-nums">
                  {won(x.payment)}
                  <span className="text-[13px] text-text-secondary font-bold ml-1">원 송금</span>
                </div>
                {(x.principal > 0 || x.interest > 0) && (
                  <div className="mt-1.5 text-[12px] text-text-secondary leading-relaxed tabular-nums">
                    {x.principal > 0 && <div>원금 {won(x.principal)}</div>}
                    {x.interest > 0 && (
                      <div>
                        이자 {won(x.interest)} <span className="text-red-600">− 세금 {won(x.incomeTax + x.localTax)}</span> = {won(x.netInterest)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="p-4 bg-ui-surface flex items-center justify-between font-extrabold">
          <span className="text-[13px] text-text-secondary">총 송금액 ({months}회)</span>
          <span className="text-[17px] text-brand-blue tabular-nums">{won(totals.payment)}원</span>
        </div>
      </div>

      {/* ── 당사자별 할 일 ── */}
      {hasInterest && (
        <div className="mt-5 grid md:grid-cols-2 gap-3 print-todo">
          <div className="rounded-2xl border border-ui-border bg-white p-4 md:p-5">
            <div className="text-[13px] font-extrabold text-text-primary mb-2">채무자(을)가 할 일</div>
            <ul className="text-[12.5px] text-text-secondary leading-relaxed space-y-1.5 pl-4 list-disc">
              <li>
                이자 줄 때 <b className="text-text-primary">{WITHHOLDING_LABEL}를 떼고</b> 세후 금액을 송금
              </li>
              <li>
                뗀 세금은 <b className="text-text-primary">다음 달 10일까지</b> 홈택스에서 원천세 신고·납부 (표의 납부기한 열)
              </li>
              <li>이듬해 2월 말까지 이자소득 지급명세서 제출</li>
              <li>이자가 1천원 미만이어도 뗍니다 (이자소득은 소액부징수 제외, 소득세법 §86)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ui-border bg-white p-4 md:p-5">
            <div className="text-[13px] font-extrabold text-text-primary mb-2">채권자(갑)가 알아둘 것</div>
            <ul className="text-[12.5px] text-text-secondary leading-relaxed space-y-1.5 pl-4 list-disc">
              <li>받는 돈은 세후 이자 — 세금은 을이 대신 내는 구조</li>
              <li>
                한 해 이자가 다른 금융소득과 합쳐 <b className="text-text-primary">2,000만원을 넘으면</b> 종합소득세 신고 대상
                {byYear.length > 0 && (
                  <span className="block mt-1 text-slate-500">
                    연도별 이자: {byYear.map((y) => `${y.year}년 ${won(y.interest)}`).join(" · ")}
                  </span>
                )}
              </li>
              <li>세후로 받은 이자도 종합과세 시 기납부세액으로 정산됩니다</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── 계산 기준 ── */}
      <div className="mt-4 print-notes text-[12px] text-slate-500 leading-relaxed">
        <p>
          <b className="text-slate-600">계산 기준</b> · 이자 = 상환 후 잔액 × 연 이자율 × 일수 ÷ 365 (달마다 28~31일이라 회차별 이자가 조금씩 다름) · 지급일이
          그 달에 없으면 말일 · 세액은 10원 미만 절사 · 중도상환·연체·이자율 변경 미반영 · 참고용
        </p>
      </div>
    </div>
  );
}

/* ───────── 작은 부품 ───────── */

function Kpi({
  label,
  value,
  sub,
  unit = "원",
  tone = "plain",
}: {
  label: string;
  value: number;
  sub?: string;
  unit?: string;
  tone?: "plain" | "red" | "dark";
}) {
  const box =
    tone === "dark"
      ? "bg-brand-navy border-brand-navy text-white"
      : tone === "red"
        ? "bg-red-50/70 border-red-100"
        : "bg-white border-ui-border";
  const labelCls = tone === "dark" ? "text-blue-200" : tone === "red" ? "text-red-700" : "text-text-secondary";
  const valueCls = tone === "dark" ? "text-white" : tone === "red" ? "text-red-600" : "text-text-primary";
  const subCls = tone === "dark" ? "text-blue-200/80" : "text-slate-400";
  return (
    <div className={`rounded-2xl border p-4 ${box}`}>
      <div className={`text-[12px] font-bold mb-1 ${labelCls}`}>{label}</div>
      <div className={`text-[19px] md:text-[22px] font-extrabold tracking-tight tabular-nums ${valueCls}`}>
        {won(value)}
        <span className={`text-[13px] font-bold ml-0.5 ${labelCls}`}>{unit}</span>
      </div>
      {sub && <div className={`text-[11px] mt-1 leading-snug ${subCls}`}>{sub}</div>}
    </div>
  );
}

function RowGroup({
  x,
  yearBreak,
  cols,
  zebra,
  hasInterest,
}: {
  x: ScheduleRow;
  yearBreak: string | null;
  cols: number;
  zebra: boolean;
  hasInterest: boolean;
}) {
  const dash = <span className="text-slate-300">–</span>;
  return (
    <>
      {yearBreak && (
        <tr>
          <td colSpan={cols} className="px-4 py-1 bg-slate-100 text-[11px] font-extrabold text-slate-500 tracking-wide">
            {yearBreak}년
          </td>
        </tr>
      )}
      <tr className={`border-t border-ui-border ${x.isMaturity ? "bg-blue-50/70 font-bold" : zebra ? "bg-slate-50/50" : ""}`}>
        <Td className="pl-4 text-text-secondary">{x.no}</Td>
        <Td>
          {dot(x.date)}
          {x.isMaturity && <span className="ml-1.5 text-[10px] font-extrabold text-brand-blue">만기</span>}
        </Td>
        <Td className="text-right">{x.principal ? won(x.principal) : dash}</Td>
        {hasInterest && (
          <>
            <Td className="text-right border-l border-ui-border">
              {x.interest ? (
                <>
                  {won(x.interest)}
                  <span className="block text-[10px] font-medium text-slate-400 leading-none mt-0.5">{x.days}일</span>
                </>
              ) : (
                dash
              )}
            </Td>
            <Td className="text-right text-red-600">{x.interest ? `−${won(x.incomeTax + x.localTax)}` : dash}</Td>
            <Td className="text-right border-r border-ui-border">{x.interest ? won(x.netInterest) : dash}</Td>
          </>
        )}
        <Td className="text-right font-extrabold text-text-primary bg-blue-50/30">{won(x.payment)}</Td>
        <Td className="text-right text-text-secondary">{won(x.balance)}</Td>
        {hasInterest && <Td className="text-center text-text-secondary pr-4">{x.taxDueDate ? dot(x.taxDueDate) : dash}</Td>}
      </tr>
    </>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 text-left font-bold whitespace-nowrap ${className}`}>{children}</th>;
}
function Td({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`px-3 py-2 whitespace-nowrap align-middle ${className}`}>
      {children}
    </td>
  );
}

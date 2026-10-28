"use client";

// 차용증 상환 스케줄표 — 회차별 원금·이자·원천징수·실송금액 (화면 + 엑셀 다운로드 + 별도 인쇄)
import { useState } from "react";
import { scheduleToCsv, type ScheduleResult, type RepayType } from "@/lib/loanSchedule";
import { downloadScheduleXlsx } from "@/lib/loanScheduleXlsx";
import { ratePct } from "@/lib/loanCalc";

const won = (v: number) => (v || 0).toLocaleString("ko-KR");
const dot = (s: string) => s.replace(/-/g, ".");

export interface ScheduleMeta {
  principal: number;
  annualRate: number;
  loanDate: string;
  dueDate: string;
  repayType: RepayType;
  monthlyPrincipal: number;
  lenderName?: string;
  borrowerName?: string;
}

export default function RepaymentSchedule({
  result,
  meta,
  onPrint,
}: {
  result: ScheduleResult;
  meta: ScheduleMeta;
  onPrint: () => void;
}) {
  const { rows, totals, byYear, warnings } = result;
  const hasInterest = meta.annualRate > 0;
  const taxTotal = totals.incomeTax + totals.localTax;

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

  type Card = { l: string; v: number; sub?: string; strong?: boolean; unit?: string };
  const summary: Card[] = hasInterest
    ? [
        { l: "총 상환 원금", v: totals.principal },
        { l: "총 이자 (세전)", v: totals.interest },
        { l: "원천징수세액 합계", v: taxTotal, sub: `소득세 ${won(totals.incomeTax)} + 지방소득세 ${won(totals.localTax)}` },
        { l: "채무자(을) 총 송금액", v: totals.payment, strong: true, sub: "원금 + 세후 이자" },
      ]
    : [
        { l: "총 상환 원금", v: totals.principal },
        { l: "상환 회차", v: rows.length, unit: "회" },
        { l: "월 상환액", v: meta.monthlyPrincipal },
        { l: "채무자(을) 총 송금액", v: totals.payment, strong: true },
      ];

  return (
    <div className="print-schedule mt-12">
      {/* 인쇄 전용 머리글 */}
      <div className="print-only mb-4 border-b-2 border-slate-900 pb-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[18pt] font-extrabold text-slate-900">상환 스케줄표</div>
            <div className="text-[9.5pt] text-slate-600 mt-1">
              금전소비대차 계약서 별첨 · 차용 {won(meta.principal)}원 · 연 {ratePct(meta.annualRate)}% ·{" "}
              {dot(meta.loanDate)} ~ {dot(meta.dueDate)} ·{" "}
              {meta.repayType === "installment" ? `매월 ${won(meta.monthlyPrincipal)}원 분할상환` : "만기 일시상환"}
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

      {/* 화면 헤더 */}
      <div className="no-print flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-3">
            계약서 별첨
          </div>
          <h2 className="text-[24px] lg:text-[30px] font-extrabold text-text-primary tracking-tight leading-tight">
            상환 스케줄표
          </h2>
          <p className="mt-2 text-[14px] lg:text-[15px] text-text-secondary">
            {hasInterest ? (
              <>
                매달 보낼 금액과 떼야 할 세금.
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
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
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ui-border bg-white text-text-secondary text-[13px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors shadow-sm"
            title="PC에서만 인쇄/PDF 저장이 가능합니다"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            스케줄표 인쇄 / PDF
          </button>
        </div>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-5 print-summary">
        {summary.map((c) => (
          <div
            key={c.l}
            className={`rounded-2xl border p-4 ${
              c.strong ? "bg-brand-navy border-brand-navy text-white" : "bg-white border-ui-border"
            }`}
          >
            <div className={`text-[12px] font-bold mb-1 ${c.strong ? "text-blue-200" : "text-text-secondary"}`}>{c.l}</div>
            <div className={`text-[18px] md:text-[20px] font-extrabold tracking-tight ${c.strong ? "text-white" : "text-text-primary"}`}>
              {won(c.v)}
              <span className={`text-[13px] font-bold ml-0.5 ${c.strong ? "text-blue-200" : "text-text-secondary"}`}>{c.unit ?? "원"}</span>
            </div>
            {c.sub && <div className={`text-[11px] mt-1 ${c.strong ? "text-blue-200/80" : "text-slate-400"}`}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 p-3.5 space-y-1">
          {warnings.map((w) => (
            <p key={w} className="text-[13px] text-amber-800 leading-relaxed">
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      {/* PC·인쇄: 전체 표 */}
      <div className="hidden md:block print-table rounded-2xl border border-ui-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] tabular-nums">
            <thead>
              <tr className="bg-ui-surface text-text-secondary text-[12px]">
                <Th>회차</Th>
                <Th>지급일</Th>
                {hasInterest && <Th className="text-center">일수</Th>}
                <Th className="text-right">원금 상환</Th>
                {hasInterest && (
                  <>
                    <Th className="text-right">이자 (세전)</Th>
                    <Th className="text-right">
                      원천징수
                      <span className="block text-[10px] font-medium text-slate-400">소득세+지방소득세</span>
                    </Th>
                    <Th className="text-right">이자 (세후)</Th>
                  </>
                )}
                <Th className="text-right font-extrabold text-text-primary">실송금액</Th>
                <Th className="text-right">잔액</Th>
                {hasInterest && <Th className="text-center">원천세 납부기한</Th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.no} className={`border-t border-ui-border ${x.isMaturity ? "bg-blue-50/60 font-bold" : ""}`}>
                  <Td className="text-text-secondary">{x.no}</Td>
                  <Td>
                    {dot(x.date)}
                    {x.isMaturity && <span className="ml-1.5 text-[10px] font-extrabold text-brand-blue">만기</span>}
                  </Td>
                  {hasInterest && <Td className="text-center text-text-secondary">{x.days || "–"}</Td>}
                  <Td className="text-right">{x.principal ? won(x.principal) : "–"}</Td>
                  {hasInterest && (
                    <>
                      <Td className="text-right">{x.interest ? won(x.interest) : "–"}</Td>
                      <Td className="text-right text-red-600">{x.interest ? `−${won(x.incomeTax + x.localTax)}` : "–"}</Td>
                      <Td className="text-right">{x.interest ? won(x.netInterest) : "–"}</Td>
                    </>
                  )}
                  <Td className="text-right font-extrabold text-text-primary">{won(x.payment)}</Td>
                  <Td className="text-right text-text-secondary">{won(x.balance)}</Td>
                  {hasInterest && <Td className="text-center text-text-secondary">{x.taxDueDate ? dot(x.taxDueDate) : "–"}</Td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-ui-surface font-extrabold">
                <Td colSpan={2}>합계</Td>
                {hasInterest && <Td className="text-center">{totals.days}</Td>}
                <Td className="text-right">{won(totals.principal)}</Td>
                {hasInterest && (
                  <>
                    <Td className="text-right">{won(totals.interest)}</Td>
                    <Td className="text-right text-red-600">−{won(taxTotal)}</Td>
                    <Td className="text-right">{won(totals.netInterest)}</Td>
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

      {/* 모바일: 회차 카드 */}
      <div className="md:hidden no-print rounded-2xl border border-ui-border divide-y divide-ui-border">
        {rows.map((x) => (
          <div key={x.no} className={`p-4 ${x.isMaturity ? "bg-blue-50/60" : ""}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-bold text-text-secondary">
                {x.no}회차 · {dot(x.date)}
                {x.isMaturity && <span className="ml-1.5 text-brand-blue">만기</span>}
              </span>
              <span className="text-[12px] text-slate-400">잔액 {won(x.balance)}</span>
            </div>
            <div className="text-[18px] font-extrabold text-text-primary tracking-tight">
              {won(x.payment)}<span className="text-[13px] text-text-secondary font-bold ml-0.5">원 송금</span>
            </div>
            {hasInterest && x.interest > 0 && (
              <div className="mt-1 text-[12px] text-text-secondary leading-relaxed">
                {x.principal > 0 && <>원금 {won(x.principal)} + </>}이자 {won(x.interest)} ({x.days}일)
                <br />
                세금 −{won(x.incomeTax + x.localTax)} → 세후 이자 {won(x.netInterest)}
              </div>
            )}
          </div>
        ))}
        <div className="p-4 bg-ui-surface flex items-center justify-between font-extrabold">
          <span className="text-[13px] text-text-secondary">총 송금액</span>
          <span className="text-[16px] text-brand-blue">{won(totals.payment)}원</span>
        </div>
      </div>

      {/* 안내 */}
      <div className="mt-5 rounded-xl bg-slate-50 border border-ui-border p-4 md:p-5 print-notes">
        <h3 className="text-[13px] font-bold text-text-primary mb-2">계산 기준 · 세무 처리</h3>
        <ul className="text-[12.5px] text-text-secondary leading-relaxed space-y-1.5 pl-4 list-disc">
          <li>
            이자는 <b className="text-text-primary">상환 후 잔액 × 연 이자율 × 일수 ÷ 365</b>로 계산합니다. 달마다 일수(28~31일)가 달라
            회차별 이자가 조금씩 다릅니다. 지급일이 그 달에 없으면(예: 31일) 말일로 당깁니다.
          </li>
          {hasInterest && (
            <>
              <li>
                <b className="text-text-primary">채무자(을)</b>는 이자를 줄 때 <b className="text-text-primary">소득세 25% + 지방소득세 2.5%</b>를
                떼고(원천징수) 세후 이자만 보냅니다. 뗀 세금은 <b className="text-text-primary">다음 달 10일까지</b> 홈택스에서 원천세
                신고·납부하고, 이듬해 2월 말까지 이자소득 지급명세서를 제출합니다. 이자소득은 1천원 미만이어도 징수합니다(소득세법 §86).
              </li>
              <li>
                <b className="text-text-primary">채권자(갑)</b>는 세후 이자를 받습니다. 이자가 다른 금융소득과 합쳐 한 해{" "}
                <b className="text-text-primary">2,000만원을 넘으면</b> 종합소득세 신고 대상입니다.
                {byYear.length > 1 && (
                  <>
                    {" "}연도별 이자: {byYear.map((y) => `${y.year}년 ${won(y.interest)}원`).join(" · ")}
                  </>
                )}
              </li>
              <li>세액은 각각 10원 미만 절사. 실제 신고 시 원 단위가 다를 수 있습니다.</li>
            </>
          )}
          <li>본 표는 참고용이며, 중도상환·연체·이자율 변경 등은 반영되지 않습니다.</li>
        </ul>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 text-left font-bold whitespace-nowrap ${className}`}>{children}</th>;
}
function Td({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`px-3 py-2 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

"use client";

/**
 * 인쇄 / PDF 저장 버튼
 *
 * - 클릭 시 window.print() 호출 → 사용자 브라우저의 인쇄 다이얼로그 표시
 * - 인쇄 다이얼로그에서 "PDF로 저장" 옵션 선택 시 PDF 파일로 저장 가능
 * - 실제 인쇄 레이아웃은 globals.css의 @media print 규칙으로 처리
 *   (#result-section 외 모든 요소 숨김, 색상·배경 유지 등)
 *
 * 결과 섹션(#result-section) 안 또는 옆에 배치할 것.
 * className에 "no-print" 적용되어 있어 인쇄물에는 버튼이 나오지 않음.
 */
export default function PrintButton({ label = "인쇄 / PDF 저장" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-ui-border bg-white text-text-secondary text-[13px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors shadow-sm"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      {label}
    </button>
  );
}

/**
 * 인쇄 시 결과지 상단에 표시되는 헤더.
 * 평상시에는 숨김(.print-only) → 인쇄·PDF에서만 보임.
 */
export function PrintHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <div className="print-only border-b-2 border-slate-900 pb-3 mb-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[18px] font-extrabold text-slate-900">세무회계 새벽</div>
          <div className="text-[13px] text-slate-600">{title}</div>
        </div>
        <div className="text-right text-[11px] text-slate-500 leading-tight">
          <div>출력일: {today}</div>
          <div>www.dawntax.com</div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const QNA = [
  {
    q: "저도 종합소득세 신고 대상인가요?",
    a: "프리랜서(3.3% 원천징수)든 개인사업자든, 2025년에 1원이라도 사업소득이 있으면 신고 대상입니다. 근로소득만 있어도 2개 이상 회사에서 급여를 받았거나, 이자·배당 2천만 원 초과, 기타소득 3백만 원 초과 등에 해당하면 합산신고해야 합니다. 애매하시면 상담은 무료입니다.",
  },
  {
    q: "AI 자동신고 앱으로 이미 신고했는데, 맡길 필요 있나요?",
    a: "자동신고 앱은 편리하지만, 실제 인정되지 않는 경비·공제 항목까지 과다하게 반영해 환급액을 부풀려 주는 경우가 많습니다. 당장은 환급금이 들어와 좋아 보이지만, 국세청 사후검증이나 세무조사에서 걸리면 원금 + 무신고·과소신고 가산세까지 함께 추징되어 오히려 더 큰 금액을 돌려내게 됩니다. 실제로 이런 사례로 뒤늦게 저희를 찾아오시는 분들이 매년 늘고 있습니다.",
  },
  {
    q: "수수료는 얼마인가요? 언제 내나요?",
    a: "프리랜서(사업자등록 없음) 기준 단순경비율 10만 원, 간편장부 20~40만 원(소득구간별)입니다. 사업자 등록이 있으시면 별도 상담드립니다. 모든 금액은 VAT 별도이며, 4월 30일 이내 접수·입금 시 2만 원 할인됩니다.",
  },
  {
    q: "홈택스 수임동의 꼭 해야 하나요?",
    a: "네, 신고대행을 위한 필수 절차입니다. 공동인증서나 간편인증으로 로그인 → 세무대리·납세관리 → 수임동의 메뉴에서 2~3분이면 끝납니다. 방법이 헷갈리시면 1:1로 안내해드립니다.",
  },
  {
    q: "준비 서류가 다 없는데 괜찮나요?",
    a: "기본 서류(사업자등록증·신분증·홈택스 ID)만 있으면 시작 가능합니다. 나머지는 담당 세무사가 하나씩 요청드리면서 진행합니다. 영수증이 전부 없어도 통장 거래내역만 있으면 많은 항목을 복원할 수 있으니 걱정 마세요.",
  },
  {
    q: "환급은 언제 받나요?",
    a: "신고 후 약 4~6주 내로 환급계좌에 입금됩니다 (국세청 일정에 따라 변동 있음). 환급 예정 여부는 신고 전에 미리 알려드립니다.",
  },
  {
    q: "5월 막바지인데 지금 맡겨도 되나요?",
    a: "네, 신고기간 마지막 날(6월 1일)까지 접수 가능합니다. 다만 서류 확인·수정 여유를 위해 5월 20일 이전 접수를 권장드립니다. 이후 접수는 일정 조율이 필요할 수 있습니다.",
  },
  {
    q: "작년에 신고 안 한 게 있는데 같이 처리 가능한가요?",
    a: "네, 기한후신고로 처리 가능합니다. 기한 경과에 따른 가산세는 발생하지만, 감면 가능한 사유가 있는지 검토해드립니다. 신고를 미룰수록 가산세가 커지니 빨리 상담받으시는 게 좋습니다.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-[#F8FAFC] px-5 py-16 w-full">
        <div className="mb-8">
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            자주 묻는 질문
          </h2>
          <p className="text-[15px] font-medium text-slate-500 mt-2.5 tracking-tight leading-[1.45]">
            궁금한 것 미리 확인해보세요.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          {QNA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-slate-200/60 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.06)] w-full"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-[22px] flex items-start justify-between gap-4 text-left outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-bold text-slate-900 leading-[1.45] tracking-tight flex-1 pt-px">
                    <span className="text-brand-blue mr-1.5 font-extrabold">{`Q${idx + 1}.`}</span>
                    {item.q}
                  </span>
                  <div
                    className={`text-slate-400 shrink-0 mt-[3px] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6">
                    <div className="border-t border-slate-100 pt-4 text-[14.5px] text-slate-600 leading-[1.65] tracking-tight">
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
            자주 묻는 질문
          </h2>
        </div>

        <div className="space-y-4">
          {QNA.map((item, idx) => (
            <details
              key={idx}
              className="group bg-white border border-ui-border rounded-[20px] overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="p-6 font-bold text-[16px] md:text-[18px] text-text-primary cursor-pointer flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors list-none">
                <span>{`Q${idx + 1}. ${item.q}`}</span>
                <span className="group-open:rotate-180 transition-transform duration-300 text-slate-400 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 pt-5 text-[15px] text-text-secondary leading-relaxed border-t border-ui-border">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

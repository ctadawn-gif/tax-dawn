"use client";

import { useState, useEffect } from "react";

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

function useDaysUntilDeadline() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const deadline = new Date("2026-06-01T23:59:59+09:00");
    const update = () => {
      const now = new Date();
      const diff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDays(Math.max(diff, 0));
    };
    update();
    const timer = setInterval(update, 1000 * 60 * 60);
    return () => clearInterval(timer);
  }, []);

  return days;
}

export default function Hero() {
  const days = useDaysUntilDeadline();

  return (
    <>
      {/* ── Mobile Hero (Variant 디자인) ─────────────────────────── */}
      <section className="md:hidden relative pb-[200px] bg-[#F2F4F6]">
        {/* 상단 그라데이션 배경 */}
        <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-[#E8F2FF] to-[#F2F4F6] pointer-events-none" />

        <div className="relative z-10 px-6 pt-3">
          {/* D-day 뱃지 */}
          <div className="inline-flex items-center bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-[13px] font-bold mb-4 tracking-tight">
            🔥 {days !== null ? `D-${days}` : "D-day"} · 6월 1일(월) 신고 마감
          </div>

          {/* 헤드라인 */}
          <h1 className="text-[28px] font-extrabold leading-[1.35] tracking-[-0.03em] mb-3 text-[#191F28]">
            AI 자동신고가 아닌,
            <br />
            <span className="text-brand-blue">대표 세무사가 직접</span>
            <br />
            <span className="text-brand-blue">신고합니다.</span>
          </h1>

          {/* 서브카피 */}
          <p className="text-[15px] font-medium text-[#8B95A1] leading-[1.5] tracking-tight mb-8">
            과한 환급은 위험합니다.
            <br />
            정확한 신고가 안전합니다.
          </p>

          {/* Proof Card (티켓 형태) */}
          <div className="relative bg-white rounded-3xl p-6 shadow-[0_12px_30px_-10px_rgba(0,98,223,0.08),0_4px_12px_rgba(0,0,0,0.02)]">
            {/* 티켓 좌우 원형 컷아웃 */}
            <div className="absolute top-[118px] -left-2 w-4 h-4 rounded-full bg-[#F2F4F6]" />
            <div className="absolute top-[118px] -right-2 w-4 h-4 rounded-full bg-[#F2F4F6]" />

            {/* 라벨 + 플랫폼 뱃지 */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-semibold text-[#8B95A1]">실제 고객 리뷰</span>
              <span className="bg-blue-50 text-brand-blue px-2 py-1 rounded text-[11px] font-bold">
                숨고 · 엑스퍼트 · 택슬리
              </span>
            </div>

            {/* 500+ 리뷰 + 별점 */}
            <div className="mb-5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[36px] font-extrabold text-[#191F28] tracking-[-0.04em] leading-none">
                  500+
                </span>
                <span className="text-[13px] font-medium text-[#8B95A1]">누적 리뷰 수</span>
              </div>
              <div className="mt-2 text-base text-[#FFB800] tracking-[3px]">★★★★★</div>
            </div>

            {/* 티켓 점선 구분 */}
            <div className="border-t-2 border-dashed border-slate-200 -mx-6 mb-5" />

            {/* 인용 리뷰 + 세무사 아바타 */}
            <div className="flex items-center gap-3">
              <div className="flex relative shrink-0">
                <img
                  src="/ko.jpg"
                  alt="고유빈 세무사"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover object-top relative z-10"
                />
                <img
                  src="/kim.jpg"
                  alt="김근량 세무사"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover object-[65%_top] -ml-3"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-[#191F28] leading-snug">
                  &ldquo;다른 세무사님과 다름을 느꼈어요.&rdquo;
                </span>
                <span className="text-[12px] font-medium text-brand-blue mt-0.5">
                  — 이** (네이버 엑스퍼트)
                </span>
              </div>
            </div>

            {/* 3 메타 박스 */}
            <div className="flex gap-2 mt-6">
              {[
                { label: "신고기한", value: "06.01(월)" },
                { label: "상담 답변", value: "24시간 내" },
                { label: "검토 방식", value: "세무사 2인" },
              ].map((meta) => (
                <div
                  key={meta.label}
                  className="flex-1 bg-[#F9FAFB] rounded-xl p-3 flex flex-col gap-1"
                >
                  <span className="text-[11px] font-semibold text-[#8B95A1]">{meta.label}</span>
                  <span className="text-[14px] font-bold text-[#191F28]">{meta.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 고정 CTA 바 (모바일 전용) */}
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden mx-auto max-w-[420px] bg-white/90 backdrop-blur-md border-t border-black/5 px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col gap-2.5">
          <a
            href="#inquiry-form"
            className="no-underline w-full bg-brand-blue text-white rounded-2xl py-4 text-[16px] font-bold flex items-center justify-center shadow-[0_8px_16px_rgba(0,98,223,0.2)] active:scale-[0.98] transition-transform"
          >
            무료상담 신청하기
          </a>
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline w-full bg-[#F2F4F6] text-[#191F28] rounded-2xl py-4 text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span>💬</span> 톡톡으로 문의
          </a>
        </div>
      </section>

      {/* ── Desktop Hero (기존 디자인 유지) ─────────────────────────── */}
      <section className="hidden md:block pt-32 pb-32 px-5 text-center max-w-[900px] mx-auto relative">
        <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full text-[14px] font-bold mb-8 shadow-sm animate-pulse">
          <span>🔥</span>
          {days !== null ? `D-${days}` : "D-day"} · 2026년 6월 1일 신고 마감
        </div>

        <h1 className="text-[56px] font-extrabold leading-[1.2] tracking-tight mb-6 text-text-primary">
          AI 자동신고가 아닌,
          <br />
          <span className="text-brand-blue relative inline-block">
            대표 세무사가 직접 신고합니다.
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 -z-10"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-[22px] text-text-secondary font-medium leading-relaxed mb-10 max-w-[700px] mx-auto">
          과다하게 돌려받은 환급금은 몇 년 뒤 가산세와 함께 돌아옵니다.
          <br />
          <strong className="text-text-primary">
            매년 500건 이상의 신고를, 대표세무사 2인이 직접 크로스체크합니다.
          </strong>
        </p>

        <div className="flex flex-row items-center justify-center gap-4">
          <a
            href="#inquiry-form"
            className="px-8 py-4 rounded-xl text-[18px] font-bold bg-brand-blue text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 no-underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            무료상담 신청하기
          </a>
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl text-[18px] font-bold bg-white text-text-primary border-2 border-ui-border hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 no-underline"
          >
            <svg className="w-5 h-5 text-[#03C75A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z" />
            </svg>
            톡톡으로 문의
          </a>
        </div>

        <div className="mt-8 text-[14px] text-text-secondary space-y-1.5">
          <p>※ 종합소득세 신고대행 문의 상담은 무료입니다.</p>
          <p>
            ※ 신고 기간에는 문의가 많아{" "}
            <a
              href="sms:010-3262-3295"
              className="font-bold text-brand-blue hover:underline no-underline"
            >
              010-3262-3295
            </a>
            로 문자·카카오톡 남겨주시면 신속히 답변드립니다.
          </p>
        </div>
      </section>
    </>
  );
}

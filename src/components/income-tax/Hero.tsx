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
    <section className="pt-20 pb-24 md:pt-32 md:pb-32 px-5 text-center max-w-[900px] mx-auto relative">
      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-1.5 rounded-full text-[14px] font-bold mb-8 shadow-sm animate-pulse">
        <span>🔥</span>
        {days !== null ? `D-${days}` : "D-day"} · 2026년 6월 1일 신고 마감
      </div>

      <h1 className="text-[40px] md:text-[56px] font-extrabold leading-[1.2] tracking-tight mb-6 text-text-primary">
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

      <p className="text-[18px] md:text-[22px] text-text-secondary font-medium leading-relaxed mb-10 max-w-[700px] mx-auto">
        과다하게 돌려받은 환급금은 몇 년 뒤 가산세와 함께 돌아옵니다.
        <br className="hidden md:block" />
        <strong className="text-text-primary">
          매년 500건 이상의 신고를, 대표세무사 2인이 직접 크로스체크합니다.
        </strong>
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#inquiry-form"
          className="w-full sm:w-auto px-8 py-4 rounded-xl text-[16px] md:text-[18px] font-bold bg-brand-blue text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 no-underline"
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
          className="w-full sm:w-auto px-8 py-4 rounded-xl text-[16px] md:text-[18px] font-bold bg-white text-text-primary border-2 border-ui-border hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 no-underline"
        >
          <svg className="w-5 h-5 text-[#03C75A]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z" />
          </svg>
          톡톡으로 문의
        </a>
      </div>

      <div className="mt-8 text-[13px] md:text-[14px] text-text-secondary space-y-1.5">
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
  );
}

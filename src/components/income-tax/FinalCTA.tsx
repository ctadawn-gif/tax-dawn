const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

export default function FinalCTA() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section
        id="contact"
        className="md:hidden relative overflow-hidden bg-[#0B1120] py-16 px-5 w-full flex flex-col items-center"
      >
        {/* Blue glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-blue-500/20 blur-[70px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-full mb-10 text-center">
            <h2 className="text-[24px] font-extrabold text-white leading-[1.35] tracking-tight mb-3">
              종합소득세 상담부터
              <br />
              받아보세요.
            </h2>
            <p className="text-[15px] font-medium text-blue-200 leading-[1.5] tracking-tight">
              신고기간은 6월 1일(월)까지.
              <br />
              문의는 모두 무료입니다.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mb-6">
            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline w-full h-14 bg-brand-blue text-white text-[16px] font-bold rounded-[14px] shadow-[0_4px_16px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  clipRule="evenodd"
                />
              </svg>
              톡톡 문의하기
            </a>

            <a
              href="tel:01032623295"
              className="no-underline w-full h-14 bg-white/10 border border-white/20 text-white text-[16px] font-medium rounded-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              전화 010-3262-3295
            </a>

            <a
              href="mailto:cta.ryang@gmail.com"
              className="no-underline w-full h-14 bg-white/10 border border-white/20 text-white text-[16px] font-medium rounded-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              이메일 문의
            </a>
          </div>

          <p className="text-[12px] text-blue-200/70 text-center font-medium tracking-tight">
            ※ 카카오톡·문자로 남겨주시면 가장 빠릅니다.
          </p>
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section
        id="contact"
        className="hidden md:block py-24 md:py-32 px-5 bg-brand-navy text-white text-center relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[800px] mx-auto">
          <h2 className="text-[40px] md:text-[56px] font-extrabold tracking-tight mb-6 leading-tight">
            종합소득세 상담부터
            <br />
            받아보세요.
          </h2>
          <p className="text-[18px] md:text-[20px] text-blue-200 font-medium mb-12 leading-relaxed">
            신고기간은 6월 1일(월)까지입니다.
            <br />
            문의는 무료이며, 문자나 카카오톡으로 남겨주시면 가장 빠릅니다.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href={TALK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-[16px] md:text-[18px] font-bold bg-brand-blue text-white hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 no-underline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.535 1.636 4.764 4.103 5.922-.178.636-.643 2.302-.682 2.44-.05.176.06.17.135.122.095-.06 2.37-1.565 3.32-2.22.68.106 1.385.16 2.114.16 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
              </svg>
              톡톡 문의하기
            </a>
            <a
              href="tel:01032623295"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-[16px] md:text-[18px] font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              전화 010-3262-3295
            </a>
            <a
              href="mailto:cta.ryang@gmail.com"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-[16px] md:text-[18px] font-bold bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/20 no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              이메일 문의
            </a>
          </div>

          <div className="text-[13px] text-slate-400 space-y-1">
            <p>※ 종합소득세 신고대행 문의 상담은 무료입니다.</p>
            <p>※ 신고 기간에는 문의가 많아 카카오톡·문자로 남겨주시면 신속히 답변드립니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}

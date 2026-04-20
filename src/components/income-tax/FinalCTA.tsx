const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-5 bg-brand-navy text-white text-center relative overflow-hidden"
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
  );
}

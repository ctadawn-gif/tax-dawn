"use client";

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

export default function FloatingTalk() {
  return (
    <a
      href={TALK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#03C75A] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center z-50 group"
      aria-label="네이버 톡톡 문의"
    >
      <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z" />
      </svg>
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-brand-navy text-white text-[13px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
        톡톡 문의하기
      </span>
    </a>
  );
}

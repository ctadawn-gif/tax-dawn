const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

export default function IncomeTaxAnnouncementBar() {
  return (
    <div className="bg-brand-navy text-white text-center py-2 px-4 text-[13px] font-medium tracking-tight relative z-20">
      📱 문자 · 카카오톡으로 문의주시면 가장 빠르게 답변드립니다
      <a
        href={TALK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300 ml-2 no-underline hover:text-blue-200 transition-colors"
      >
        톡톡으로 문의하기 →
      </a>
    </div>
  );
}

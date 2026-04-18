import Image from "next/image";

export default function CTA() {
  return (
    <section id="contact" className="relative py-20 px-6">
      <div className="bg-grid" />

      <div className="max-w-[1000px] w-full bg-white rounded-[32px] p-8 md:p-16 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative z-10 flex flex-col items-center text-center mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-8">
          상담 안내
        </span>

        <h2 className="text-3xl md:text-[42px] font-extrabold text-text-primary tracking-tight leading-[1.25] mb-6">
          더 구체적인 상담이 필요하신가요?
        </h2>

        <p className="text-[17px] md:text-[19px] text-text-secondary leading-[1.7] mb-12 max-w-[640px]">
          계산기로 간단하게 확인해보셨다면, 이제 정확한 절세 방법을 찾을
          차례입니다. 상속·증여세 신고, 종합소득세 절세, 사업자 기장대행,
          자금출처 소명 등 세무 업무 전반에 대해 편하게 연락주세요.
        </p>

        {/* 세무사 연락처 */}
        <p className="text-[13px] text-text-secondary mb-4">프로필을 누르면 네이버 엑스퍼트에서 상담을 예약할 수 있습니다</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[640px] mb-10">
          <a
            href="https://m.expert.naver.com/expert/profile/home?storeId=100058445&u=%2FPXSLGf999lYdP5IwsGyCb6FWam%2FygHjBfMrSAjEZzI%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 bg-ui-surface rounded-2xl border border-ui-border hover:border-brand-blue transition-colors group"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-1">
              <Image
                src="/kim.jpg"
                alt="김근량 세무사"
                width={80}
                height={80}
                className="w-full h-full object-cover object-[55%_top]"
              />
            </div>
            <span className="text-text-primary font-bold text-[17px] group-hover:text-brand-blue transition-colors">
              김근량 세무사
            </span>
            <span className="text-brand-blue font-extrabold text-[20px] tracking-tight">
              010-3262-3295
            </span>
            <span className="text-text-secondary text-[13px] leading-snug text-center">
              종합소득세 · 부가가치세 · 사업자 기장대행
            </span>
          </a>
          <a
            href="https://m.expert.naver.com/expert/profile/home?storeId=100055567&u=pPfkLxZfCoZXp4gZwIn7Gwh13UsHEXKuynJIyvXjZ5A%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 bg-ui-surface rounded-2xl border border-ui-border hover:border-brand-blue transition-colors group"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mb-1">
              <Image
                src="/ko.jpg"
                alt="고유빈 세무사"
                width={80}
                height={80}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="text-text-primary font-bold text-[17px] group-hover:text-brand-blue transition-colors">
              고유빈 세무사
            </span>
            <span className="text-brand-blue font-extrabold text-[20px] tracking-tight">
              010-9374-4916
            </span>
            <span className="text-text-secondary text-[13px] leading-snug text-center">
              상속·증여세 · 자금조달계획서 · 자금출처 소명
            </span>
          </a>
        </div>

        {/* 블로그 & 플레이스 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="https://blog.naver.com/tax_dawn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-ui-border rounded-xl font-semibold text-[15px] text-text-primary hover:border-brand-blue hover:text-brand-blue transition-all group"
          >
            블로그에서 절세 사례 보기
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a
            href="https://naver.me/5yP5BKUk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-ui-border rounded-xl font-semibold text-[15px] text-text-primary hover:border-brand-blue hover:text-brand-blue transition-all group"
          >
            네이버 플레이스에서 후기 보기
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        <div className="w-full border-t border-slate-100 mb-8" />

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex items-center justify-center gap-2 text-text-secondary text-[14px] font-medium bg-slate-50 px-5 py-2.5 rounded-lg border border-slate-100 flex-wrap text-center">
            <svg
              className="w-4 h-4 text-brand-blue shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            서울 송파구 위례서로 252, 유원플러스송파 610호
            <span className="text-slate-300 mx-1">|</span>
            방문 상담은 예약 후 가능합니다
          </div>

          <div className="flex items-start gap-3 bg-ui-surface rounded-xl p-5 text-[13px] text-text-secondary leading-relaxed max-w-[800px] w-full text-left">
            <svg
              className="w-5 h-5 shrink-0 text-slate-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>
              <strong className="font-bold text-text-primary mr-1">
                면책 고지:
              </strong>
              본 계산기의 결과는 참고용이며, 실제 세액과 다를 수 있습니다.
              정확한 세금 산출은 개별 상황에 따라 달라지므로 반드시 세무사와
              상담하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

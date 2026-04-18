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
            href="#location"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-ui-border rounded-xl font-semibold text-[15px] text-text-primary hover:border-brand-blue hover:text-brand-blue transition-all group"
          >
            오시는 길
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

      </div>
    </section>
  );
}

import Image from "next/image";

export default function CTA() {
  return (
    <section id="contact" className="relative py-14 md:py-20 px-5 md:px-6">
      <div className="bg-grid" />

      <div className="max-w-[1000px] w-full bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-16 border border-ui-border shadow-[0_4px_20px_-6px_rgba(0,0,0,0.05)] md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative z-10 flex flex-col items-center text-center mx-auto">
        <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-blue-50 text-brand-blue text-[12px] md:text-[13px] font-bold tracking-wide border border-blue-100 mb-5 md:mb-8">
          상담 안내
        </span>

        <h2 className="text-[24px] md:text-[42px] font-extrabold text-text-primary tracking-tight leading-[1.3] md:leading-[1.25] mb-4 md:mb-6">
          더 구체적인 상담이
          <br className="md:hidden" />
          <span className="md:hidden"> </span>
          필요하신가요?
        </h2>

        <p className="text-[15px] md:text-[19px] text-text-secondary leading-[1.6] md:leading-[1.7] mb-8 md:mb-12 max-w-[640px]">
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

        {/* 상담 신청 CTA */}
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-[16px] hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg no-underline mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          무료 상담 신청하기
        </a>
        <p className="text-[12.5px] text-text-secondary mb-10 leading-relaxed max-w-[520px]">
          번호를 남겨주시면 구체적인 사안 파악을 위해 세무사가 먼저 문자를 보내드립니다.<br />
          상속·증여·양도세 및 기타 세무 컨설팅 상담은 유료로 진행됩니다.
        </p>

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

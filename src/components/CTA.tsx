import Image from "next/image";
import Link from "next/link";

const KIM_EXPERT_URL =
  "https://m.expert.naver.com/expert/profile/home?storeId=100058445&u=%2FPXSLGf999lYdP5IwsGyCb6FWam%2FygHjBfMrSAjEZzI%3D";
const KO_EXPERT_URL =
  "https://m.expert.naver.com/expert/profile/home?storeId=100055567&u=pPfkLxZfCoZXp4gZwIn7Gwh13UsHEXKuynJIyvXjZ5A%3D";
const BLOG_URL = "https://blog.naver.com/tax_dawn";

export default function CTA() {
  return (
    <>
      <div id="contact" className="scroll-mt-16" />
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-slate-50 py-16 px-5 w-full">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-4 tracking-tight">
            상담 안내
          </div>
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] mb-4 tracking-tight">
            더 구체적인 상담이
            <br />
            필요하신가요?
          </h2>
          <p className="text-[15px] font-medium text-slate-500 leading-[1.6] tracking-tight">
            계산기로 확인해보셨다면,
            <br />
            이제 정확한 절세 방법을 찾을 차례입니다.
            <br />
            편하게 연락주세요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* 김근량 */}
          <article className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex flex-col w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-blue-50 shrink-0 bg-slate-100 shadow-sm">
                <Image
                  src="/kim.jpg"
                  alt="김근량 대표세무사"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "55% top" }}
                />
              </div>
              <div className="flex flex-col pt-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[20px] font-bold text-slate-900 tracking-tight">김근량</span>
                  <span className="bg-slate-900 text-white rounded-[6px] px-2 py-[3px] text-[12px] font-semibold tracking-tight">
                    대표세무사
                  </span>
                </div>
                <a
                  href="tel:01032623295"
                  className="no-underline inline-flex items-center text-[18px] font-bold text-brand-blue w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  010-3262-3295
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                종합소득세
              </span>
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                부가가치세
              </span>
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                기장대행
              </span>
            </div>

            <a
              href={KIM_EXPERT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex items-center justify-center w-full h-11 border border-slate-200 bg-white text-slate-700 rounded-[12px] text-[14px] font-bold active:bg-slate-100 transition-colors tracking-tight"
            >
              엑스퍼트 상담 예약
            </a>
          </article>

          {/* 고유빈 */}
          <article className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex flex-col w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-blue-50 shrink-0 bg-slate-100 shadow-sm">
                <Image
                  src="/ko.jpg"
                  alt="고유빈 대표세무사"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "top" }}
                />
              </div>
              <div className="flex flex-col pt-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[20px] font-bold text-slate-900 tracking-tight">고유빈</span>
                  <span className="bg-slate-900 text-white rounded-[6px] px-2 py-[3px] text-[12px] font-semibold tracking-tight">
                    대표세무사
                  </span>
                </div>
                <a
                  href="tel:01093744916"
                  className="no-underline inline-flex items-center text-[18px] font-bold text-brand-blue w-fit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  010-9374-4916
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                상속세
              </span>
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                증여세
              </span>
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                자금조달·출처소명
              </span>
              <span className="bg-slate-50 border border-slate-100 text-slate-600 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight">
                양도세
              </span>
            </div>

            <a
              href={KO_EXPERT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline flex items-center justify-center w-full h-11 border border-slate-200 bg-white text-slate-700 rounded-[12px] text-[14px] font-bold active:bg-slate-100 transition-colors tracking-tight"
            >
              엑스퍼트 상담 예약
            </a>
          </article>
        </div>

        {/* 유료 상담 안내 */}
        <div className="mt-8 bg-amber-50/70 border border-amber-100 rounded-xl p-4 flex items-start gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-amber-500 shrink-0 mt-[1px]"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-[13px] text-amber-800 leading-[1.6] tracking-tight">
            상속·증여·양도세 및 기타 세무 컨설팅 상담은 유료로 진행됩니다.
            <br />
            무료 상담은 1차 번호 남겨주시면 세무사가 문자로 먼저 연락드립니다.
          </p>
        </div>

        {/* 메인 CTA */}
        <Link
          href="/contact"
          className="no-underline mt-8 flex items-center justify-center w-full h-14 bg-brand-blue text-white rounded-[14px] text-[16px] font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform tracking-tight"
        >
          무료 상담 신청하기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 ml-1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        {/* 서브 링크 */}
        <div className="mt-4 flex flex-col gap-3">
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center justify-center w-full h-12 border border-slate-200 bg-white text-slate-700 rounded-[12px] text-[15px] font-semibold active:bg-slate-100 transition-colors tracking-tight"
          >
            블로그에서 절세 사례 보기
          </a>
          <a
            href="#location"
            className="no-underline flex items-center justify-center w-full h-12 border border-slate-200 bg-white text-slate-700 rounded-[12px] text-[15px] font-semibold active:bg-slate-100 transition-colors tracking-tight"
          >
            오시는 길
          </a>
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block relative py-14 md:py-20 px-5 md:px-6">
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
              href={KIM_EXPERT_URL}
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
              href={KO_EXPERT_URL}
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
              href={BLOG_URL}
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
    </>
  );
}

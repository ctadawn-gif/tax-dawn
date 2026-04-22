export default function Hero() {
  return (
    <>
      {/* ── Mobile Hero ─────────────────────────── */}
      <section className="md:hidden relative w-full px-5 pt-12 pb-16 bg-gradient-to-b from-[#EFF4FF] via-white to-white">
        <div className="flex flex-col items-center text-center z-10 w-full">
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50/80 text-brand-blue rounded-full text-[13px] font-semibold tracking-tight mb-6 ring-1 ring-blue-100/50">
            세무회계 새벽 · 무료 세금 계산기
          </div>

          <h1 className="text-[30px] font-extrabold text-slate-900 leading-[1.35] tracking-tight mb-5 w-full">
            내 세금, <span className="text-brand-blue">얼마나 나올지</span>
            <br />
            미리 확인해보세요.
          </h1>

          <p className="text-[16px] font-medium text-brand-blue leading-[1.5] tracking-tight mb-4 w-full opacity-90">
            종합소득세·부가세·상속증여세·취득세·4대보험.
            <br />
            3분이면 대략적인 범위가 나옵니다.
          </p>

          <p className="text-[15px] font-medium text-slate-500 leading-[1.6] tracking-tight mb-10 w-full">
            정확한 세액은 아니어도,
            <br />
            대략적인 범위만 알면 방향이 잡힙니다.
          </p>

          <a
            href="#calculators"
            className="no-underline group relative w-full h-[56px] bg-brand-blue text-white text-[16px] font-bold rounded-[14px] flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all duration-200"
          >
            <span className="flex items-center gap-1.5 tracking-tight">
              내 세금 무료로 계산해보기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* ── Desktop Hero (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block relative pt-16 md:pt-24 pb-10 md:pb-16 px-6 text-center max-w-[800px] mx-auto">
        <div className="bg-grid" />

        <span className="relative z-10 inline-block bg-ui-surface border border-ui-border px-4 py-1.5 rounded-full text-[13px] font-semibold text-brand-blue mb-6">
          세무회계 새벽 · 무료 세금 계산기
        </span>

        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold leading-[1.15] tracking-tight text-text-primary mb-6">
          내 세금, 얼마나 나올지
          <br />
          미리 확인해보세요
        </h1>

        <p className="relative z-10 text-lg md:text-xl text-brand-blue font-bold mb-5 opacity-90">
          종합소득세 · 부가세 · 상속증여세 · 취득세 · 4대보험까지, 3분이면 대략적인 범위가 나옵니다.
        </p>

        <p className="relative z-10 text-base md:text-lg leading-relaxed text-text-secondary mb-10 max-w-[600px] mx-auto">
          정확한 세액은 아니더라도, 대략적인 범위를 알고 있으면 절세 방향을 잡기가 훨씬 수월합니다.
          세무사 상담 전에 내 상황을 먼저 파악해보세요.
        </p>

        <div className="relative z-10 flex justify-center">
          <a
            href="#calculators"
            className="inline-block px-8 py-4 md:px-9 md:py-[18px] bg-brand-blue text-white text-base md:text-lg font-bold rounded-xl shadow-[0_10px_25px_-5px_rgba(0,82,255,0.3)] hover:translate-y-[-2px] hover:shadow-[0_15px_30px_-5px_rgba(0,82,255,0.4)] transition-all"
          >
            내 세금 무료로 계산해보기 →
          </a>
        </div>
      </section>
    </>
  );
}

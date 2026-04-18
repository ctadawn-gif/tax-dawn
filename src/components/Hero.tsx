export default function Hero() {
  return (
    <section className="relative pt-16 md:pt-24 pb-10 md:pb-16 px-6 text-center max-w-[800px] mx-auto">
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
        상속세 · 증여세 · 종합소득세, 3분이면 대략적인 범위가 나옵니다.
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
  );
}

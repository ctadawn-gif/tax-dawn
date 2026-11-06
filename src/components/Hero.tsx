import Link from "next/link";

// PC 히어로 오른쪽 — 상속·증여세 계산기 결과 미리보기.
// 예시: 성인 자녀에게 2억 원 증여 (증여재산공제 5,000만 → 과세표준 1억 5,000만 → 20% − 누진공제 1,000만 = 2,000만, 신고세액공제 3%)
const PREVIEW_ROWS: [string, string][] = [
  ["증여재산", "2억 원"],
  ["증여재산공제 (성인 자녀)", "− 5,000만 원"],
  ["과세표준", "1억 5,000만 원"],
  ["산출세액", "2,000만 원"],
  ["신고세액공제 3%", "− 60만 원"],
];

function HeroPreview() {
  return (
    <Link
      href="/calculator/inherit-gift"
      className="block bg-white border border-ui-border rounded-2xl shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)] hover:border-slate-300 transition-colors no-underline"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-ui-border text-[13px] text-text-secondary">
        <span className="font-medium">상속·증여세 계산기</span>
        <span>예시 · 성인 자녀에게 2억 원 증여</span>
      </div>
      <dl className="px-6 pt-3 pb-1">
        {PREVIEW_ROWS.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2 text-[14px]">
            <dt className="text-text-secondary">{label}</dt>
            <dd className="text-text-primary tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mx-6 mb-4 mt-2 rounded-lg bg-ui-surface px-5 py-4 flex items-end justify-between gap-4">
        <span className="text-[14px] text-text-secondary">예상 납부세액</span>
        <span className="text-[28px] font-semibold text-text-primary tabular-nums leading-none">
          <span className="hl">1,940만 원</span>
        </span>
      </div>
      <p className="px-6 pb-5 text-[13px] font-medium text-brand-blue">내 숫자로 계산해보기 →</p>
    </Link>
  );
}

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

      {/* ── Desktop Hero: 왼쪽 글, 오른쪽 계산 결과 미리보기 ─────────────────────────── */}
      <section className="hidden md:block pt-16 lg:pt-20 pb-16 lg:pb-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-[52px] font-semibold leading-[1.2] tracking-tight text-text-primary mb-6">
              내 세금, 얼마나 나올지
              <br />
              미리 확인해보세요
            </h1>

            <p className="text-lg lg:text-xl text-text-primary font-medium mb-4">
              종합소득세 · 부가세 · 상속증여세 · 취득세 · 4대보험까지, 3분이면 대략적인 범위가 나옵니다
            </p>

            <p className="text-base lg:text-lg leading-relaxed text-text-secondary mb-10 max-w-[560px] mx-auto lg:mx-0">
              정확한 세액은 아니더라도, 대략적인 범위를 알고 있으면 절세 방향을 잡기가 훨씬 수월합니다.
              세무사 상담 전에 내 상황을 먼저 파악해보세요.
            </p>

            <div className="flex justify-center lg:justify-start items-center gap-6">
              <a
                href="#calculators"
                className="inline-block px-8 py-4 bg-brand-blue text-white text-base lg:text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors no-underline"
              >
                내 세금 무료로 계산해보기 →
              </a>
              <Link
                href="/#contact"
                className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors no-underline"
              >
                상담 문의
              </Link>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>
    </>
  );
}

const problems = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
      </svg>
    ),
    label: "01",
    title: "신고 기한, 놓치면 가산세가 붙습니다",
    paragraphs: [
      "아버지가 돌아가신 후 상속세 신고를 미루다 6개월이 지났습니다. 총 상속재산 18억에서 공제를 적용해도 과세표준이 8억. 산출세액 1억 8천만 원.",
    ],
    highlight: (
      <>
        무신고 가산세 20%가 붙어
        <br />
        <span className="text-red-500">3,600만 원을 추가로 납부</span>하게 됩니다.
      </>
    ),
    footer: '신고 기한 안에 상담만 받았어도 막을 수 있는 돈입니다.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H200A16,16,0,0,1,216,40Zm-16,0H56V216H200ZM88,80a8,8,0,0,0,8,8h64a8,8,0,0,0,0-16H96A8,8,0,0,0,88,80Zm0,48a8,8,0,0,0,8,8h64a8,8,0,0,0,0-16H96A8,8,0,0,0,88,128Zm0,48a8,8,0,0,0,8,8h64a8,8,0,0,0,0-16H96A8,8,0,0,0,88,176Z" />
      </svg>
    ),
    label: "02",
    title: "장부 없이 신고하면 세금을 더 내게 됩니다",
    paragraphs: [
      "연 매출 2억인 음식점 사장님. 실제 재료비·임차료·인건비를 합치면 1억 6천만 원인데, 기준경비율(10.2%)로 추계신고하면 경비 인정이 2,040만 원뿐입니다.",
      "장부를 작성했다면 소득금액 4,000만 원 → 추계신고 시 소득금액 1억 7,960만 원. 같은 매출인데 세금이 완전히 달라집니다.",
    ],
    highlight: (
      <>
        장부 작성 시 종합소득세 약 400만 원,
        <br />
        <span className="text-red-500">추계신고 시 약 4,800만 원 + 무기장 가산세.</span>
      </>
    ),
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256">
        <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,192V64H216V192Zm59.13-75.14a8,8,0,0,1-3.69,10.7l-48,24a8,8,0,1,1-7.16-14.32l40.3-20.15-40.3-20.15A8,8,0,0,1,47.45,82.62l48,24A8,8,0,0,1,99.13,116.86ZM208,168a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h72A8,8,0,0,1,208,168Z" />
      </svg>
    ),
    label: "03",
    title: "소명 요청, 방치하면 세금이 추징됩니다",
    paragraphs: [
      "30대 직장인이 9억짜리 아파트를 매수했습니다. 한국부동산원에서 자금출처 소명 요청이 왔는데, 부모님에게 받은 2억의 증여세 신고를 안 한 상태였습니다.",
    ],
    flow: ["자금조달계획서", "부동산원·구청 소명", "국세청 자금출처조사"],
    highlight: (
      <>
        증여세 2,000만 원 + <span className="text-red-500">무신고 가산세 20%(400만 원)</span>
        <br />
        소명 단계가 올라갈수록 추징 금액이 커집니다.
      </>
    ),
  },
];

export default function Problem() {
  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden">
      <div className="bg-grid" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-[13px] font-bold tracking-wide border border-red-100 mb-4">
            놓치면 손해입니다
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            세금, 이렇게 손해 보고 계십니다
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {problems.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 md:p-10 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,82,255,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                {p.icon}
              </div>
              <span className="text-brand-blue font-bold text-sm tracking-wide mb-2 block">
                {p.label}
              </span>
              <h3 className="text-2xl font-bold text-text-primary mb-5 leading-snug">
                {p.title}
              </h3>
              <div className="text-[15px] leading-relaxed text-text-secondary flex-grow flex flex-col gap-4">
                {p.flow && (
                  <div className="bg-ui-surface rounded-lg p-3 text-[13px] font-medium text-brand-navy border border-ui-border flex flex-wrap gap-1 items-center">
                    {p.flow.map((step, j) => (
                      <span key={j} className="flex items-center gap-1">
                        {j > 0 && (
                          <span className="text-brand-blue">→</span>
                        )}
                        <span>{step}</span>
                      </span>
                    ))}
                  </div>
                )}
                {p.paragraphs.map((text, j) => (
                  <p key={j}>{text}</p>
                ))}
                {p.highlight && (
                  <div className="highlight-box p-4 rounded-xl mt-auto">
                    <p className="text-text-primary font-semibold">
                      {p.highlight}
                    </p>
                  </div>
                )}
                {p.footer && <p className="mt-auto pt-2">{p.footer}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

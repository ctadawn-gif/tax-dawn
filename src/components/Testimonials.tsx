const testimonials = [
  {
    initial: "박",
    name: "박정현",
    info: "52세, 회사원, 서울 광진구",
    quote:
      "아버지가 돌아가시고 상속세가 얼마인지 감도 못 잡고 있었어요. 블로그마다 금액이 달라서 불안하기만 했는데, 계산기로 돌려보니 배우자공제 적용하면 예상보다 4,000만 원 적게 나오더라고요. 그 결과 들고 세무사님한테 상담받으니까 대화가 훨씬 빨랐습니다.",
  },
  {
    initial: "이",
    name: "이수진",
    info: "34세, 프리랜서 디자이너, 서울 강남구",
    quote:
      "과세예고통지서가 날아왔는데 납부할 세액이 850만 원이었어요. 너무 당황해서 어디서부터 손을 대야 할지 몰랐는데, 세무사님이 장부를 다시 작성해서 경비 증빙을 정리해주셨고, 결국 납부 세액이 200만 원으로 줄었습니다. 그대로 냈으면 건보료까지 올라갈 수 있었다고 하더라고요. 진짜 다행이었어요.",
  },
  {
    initial: "김",
    name: "김도현",
    info: "42세, 변리사, 서울 송파구",
    quote:
      "자금출처조사 관련 뉴스가 계속 나오고 규제가 강화된다는 말에 불안해서 여러 세무사 사무실에 상담을 받아봤는데, 대부분 일반적인 설명만 해주셨어요. 고유빈 세무사님은 달랐습니다. 자금조달계획서 작성부터 부동산원 소명 대응까지 현행 규정 기준으로 전체 프로세스를 단계별로 짚어주셨고, 제 상황에서 어떤 자료가 왜 필요한지까지 설명해주셔서 확실히 이 분야 전문이구나 싶었습니다.",
  },
];

function QuoteIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="relative pt-24 pb-32 px-6 overflow-hidden">
      <div className="bg-grid" />

      <div className="max-w-[1200px] w-full mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">
            고객 후기
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            실제 상담을 받으신 분들의 이야기
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 md:p-10 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,82,255,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              <div className="mb-6 text-brand-blue/20 group-hover:text-brand-blue/40 transition-colors duration-300">
                <QuoteIcon />
              </div>
              <p className="text-[16px] leading-[1.7] text-text-primary font-medium flex-grow mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-text-primary text-[15px]">
                    {t.name}
                  </div>
                  <div className="text-text-secondary text-[13px] mt-0.5 tracking-tight">
                    {t.info}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

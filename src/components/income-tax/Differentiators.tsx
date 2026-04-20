type Card = {
  title: React.ReactNode;
  body: string;
  icon: React.ReactNode;
};

const CARDS: Card[] = [
  {
    title: (
      <>
        대표세무사 2인이
        <br />
        직접 크로스체크합니다
      </>
    ),
    body:
      "한 명의 세무사가 작성한 신고서를, 다른 세무사가 다시 검토합니다. 혼자라면 지나칠 수 있는 공제와 경비를 두 번 걸러냅니다. 대부분의 사무실은 직원이 작성하고 세무사가 승인하지만, 저희는 두 명 모두 대표세무사입니다.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: (
      <>
        받을 수 있는 만큼만,
        <br />
        정확히 돌려드립니다
      </>
    ),
    body:
      "자동 신고 앱은 실제 인정되지 않는 경비·공제 항목을 과다하게 반영해 환급액을 부풀립니다. 당장은 환급금이 많아 보이지만, 국세청 사후검증이나 세무조사에서 걸리면 원금 + 가산세와 함께 추징됩니다. 저희는 과장 없이, 법령 범위 안에서만 환급받을 수 있는 항목을 찾아드립니다.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: (
      <>
        규모에 상관없이
        <br />
        통장과 카드내역까지 직접 봅니다
      </>
    ),
    body:
      "매출이 작은 간편장부대상자라고 해서 대충 하지 않습니다. 대표세무사 2인이 통장 거래내역과 카드 사용내역을 직접 확인해, 놓치기 쉬운 경비를 복원합니다. 영수증이 부족해도 거래내역만 있으면 많은 부분을 되살릴 수 있습니다.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
        />
      </svg>
    ),
  },
];

export default function Differentiators() {
  return (
    <section className="py-24 px-5 bg-ui-surface border-y border-ui-border">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
            세무회계 새벽이 다른 이유
          </h2>
          <p className="text-[18px] text-text-secondary font-medium">
            신고 한 번 잘못 내면 몇 년 뒤 가산세로 돌아옵니다.
            <br />
            그래서 저희는 이렇게 합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[24px] border border-ui-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                {card.icon}
              </div>
              <h3 className="text-[20px] font-bold text-text-primary mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

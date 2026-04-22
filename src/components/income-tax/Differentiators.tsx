import type { ReactNode } from "react";

type MobileCard = {
  title: ReactNode;
  body: ReactNode;
  icon: ReactNode;
};

const MOBILE_CARDS: MobileCard[] = [
  {
    title: (
      <>
        세무사 2인이
        <br />
        직접 검토합니다
      </>
    ),
    body: (
      <>
        제출 전 이중 확인.
        <br />
        놓친 것 없는지 다시 봅니다.
      </>
    ),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-7 h-7 text-brand-blue"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    title: (
      <>
        받을 수 있는 만큼만
        <br />
        돌려드립니다
      </>
    ),
    body: (
      <>
        과장하지 않습니다.
        <br />
        법령 안에서만.
      </>
    ),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-7 h-7 text-brand-blue"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: (
      <>
        통장·카드내역까지
        <br />
        직접 봅니다
      </>
    ),
    body: (
      <>
        규모와 상관없이.
        <br />
        하나하나 검토합니다.
      </>
    ),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        className="w-7 h-7 text-brand-blue"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
];

type PCCard = {
  title: ReactNode;
  body: string;
  icon: ReactNode;
};

const PC_CARDS: PCCard[] = [
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
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-[#F9FAFB] px-6 py-16">
        <div className="mb-10">
          <span className="block text-[14px] font-bold text-brand-blue tracking-tight mb-3">
            세무회계 새벽이 다른 이유
          </span>
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            신고 한 번 잘못 내면,
            <br />
            가산세로 돌아옵니다.
          </h2>
        </div>

        <div className="flex flex-col gap-[18px]">
          {MOBILE_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-slate-100/60"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-blue-50 flex items-center justify-center mb-5">
                {card.icon}
              </div>
              <h3 className="text-[18px] font-extrabold text-slate-900 leading-[1.4] tracking-tight mb-2">
                {card.title}
              </h3>
              <p className="text-[15px] font-medium text-slate-500 leading-[1.5] tracking-tight">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 bg-ui-surface border-y border-ui-border">
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
            {PC_CARDS.map((card, idx) => (
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
    </>
  );
}

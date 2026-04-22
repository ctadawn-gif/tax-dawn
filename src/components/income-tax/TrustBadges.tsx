const PC_BADGES = [
  { text: "매년 500건 이상 신고 실적" },
  { text: "대표세무사 2인 직접 검토" },
  { text: "누적 리뷰 500+", sub: "(숨고·엑스퍼트·택슬리)" },
  { text: "당일 상담 회신", sub: "(카카오톡 기준)" },
];

type MobileStat = {
  number: string;
  label: string;
  labelSize?: "sm" | "xs";
};

const MOBILE_STATS: MobileStat[] = [
  { number: "500건+", label: "매년 신고 실적" },
  { number: "2인", label: "대표세무사 직접 검토" },
  { number: "500+", label: "누적 리뷰 (숨고·엑스퍼트·택슬리)", labelSize: "xs" },
  { number: "24시간 내", label: "상담 답변 (주말 포함)" },
];

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-[#3B82F6] shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function TrustBadges() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-[#0B1120] px-6 py-14 w-full">
        <div className="grid grid-cols-2 gap-x-3 gap-y-10">
          {MOBILE_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckIcon />
                <span
                  className={`${
                    stat.number === "24시간 내" ? "text-[30px]" : "text-[32px]"
                  } font-extrabold text-white leading-none tracking-tighter`}
                >
                  {stat.number}
                </span>
              </div>
              <p
                className={`${
                  stat.labelSize === "xs"
                    ? "text-[11.5px] tracking-tighter"
                    : "text-[13px] tracking-tight"
                } font-medium text-slate-400 whitespace-nowrap mt-1`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block bg-brand-navy py-10 w-full overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 justify-items-center">
            {PC_BADGES.map((badge, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2.5 text-white font-bold text-[15px] md:text-[16px] whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>
                  {badge.text}
                  {badge.sub && (
                    <span className="text-slate-400 font-medium text-[13px] ml-1.5">
                      {badge.sub}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

const BADGES = [
  { text: "매년 500건 이상 신고 실적" },
  { text: "대표세무사 2인 직접 검토" },
  { text: "누적 리뷰 500+", sub: "(숨고·엑스퍼트·택슬리)" },
  { text: "당일 상담 회신", sub: "(카카오톡 기준)" },
];

export default function TrustBadges() {
  return (
    <section className="bg-brand-navy py-10 w-full overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 justify-items-center">
          {BADGES.map((badge, idx) => (
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
  );
}

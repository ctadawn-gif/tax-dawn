import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="no-print bg-brand-navy text-white text-center py-2 px-4 text-[13px] font-medium tracking-tight relative z-20">
      2026 세제개편안 반영 — 보유세(재산세+종부세) 계산기 신규 오픈
      <Link
        href="/calculator/holding-tax"
        className="text-blue-300 ml-2 no-underline hover:text-blue-200 transition-colors"
      >
        자세히 보기 →
      </Link>
    </div>
  );
}

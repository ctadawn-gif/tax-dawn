import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-navy text-white text-center py-2 px-4 text-[13px] font-medium tracking-tight relative z-20">
      2026년 개정 세법 반영 완료 — 6종 계산기 최신 법령 업데이트
      <Link
        href="/updates"
        className="text-blue-300 ml-2 no-underline hover:text-blue-200 transition-colors"
      >
        자세히 보기 →
      </Link>
    </div>
  );
}

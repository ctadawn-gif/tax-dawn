import Link from "next/link";
import { getAnnouncement } from "@/lib/season";

// 시즌별 문구는 src/lib/season.ts getAnnouncement 에서 날짜로 자동 전환
export default function AnnouncementBar() {
  const a = getAnnouncement();
  return (
    <div className="no-print bg-brand-navy text-white text-center py-2 px-4 text-[13px] font-medium tracking-tight relative z-20">
      {a.text}
      {a.pcExtra && <span className="hidden md:inline text-white/60">{a.pcExtra}</span>}
      <Link
        href={a.href}
        className="text-blue-300 ml-2 no-underline hover:text-blue-200 transition-colors"
      >
        {a.cta}
      </Link>
    </div>
  );
}

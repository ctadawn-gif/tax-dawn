import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "계산기 업데이트 내역 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🕐", text: "마지막 업데이트 2026년 4월", scheme: "blue" },
    headline: {
      line1: "계산기",
      line2: "업데이트 내역",
    },
    subtitle: ["6개 계산기", "최신 세법 개정 반영", "법령 근거 공개"],
  });
}

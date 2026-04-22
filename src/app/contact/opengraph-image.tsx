import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "무료 상담 신청 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "💬", text: "무료 상담 신청", scheme: "blue" },
    headline: {
      line1: "어떤 세무 문의든,",
      line2: "편하게 남겨주세요.",
    },
    subtitle: ["대표세무사 2인 직접 확인", "24시간 이내 연락"],
  });
}

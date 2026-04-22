import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "AI 아닌 세무사가 직접. 종합소득세 신고대행 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🔥", text: "2026.06.01 마감", scheme: "red" },
    headline: {
      line1: "AI 아닌",
      line1Accent: "세무사가 직접.",
      line2: "종합소득세 신고대행",
    },
    subtitle: ["세무사 2인 크로스체크", "500건+", "10만원부터"],
  });
}

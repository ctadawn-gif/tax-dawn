import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "AI 아닌 세무사가 직접. 부가가치세 신고접수 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧾", text: "부가세 1기 · 7.25 마감", scheme: "red" },
    headline: {
      line1: "AI 아닌",
      line1Accent: "세무사가 직접.",
      line2: "부가가치세 신고접수",
    },
    subtitle: ["세무사 2인 크로스체크", "11만·8.8만원부터", "7.25 신고마감"],
  });
}

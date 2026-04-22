import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "소개 · 오시는 길 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "👥", text: "세무회계 새벽", scheme: "blue" },
    headline: {
      line1: "대표 세무사 2인,",
      line2: "직접 상담부터 신고까지",
    },
    subtitle: ["서울 송파구 위례서로 252", "유원플러스송파 610호"],
  });
}

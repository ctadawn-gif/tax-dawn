import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "보유세 계산기 (재산세+종부세, 2026 개편안) | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🏠", text: "2026 세제개편안 반영", scheme: "blue" },
    headline: {
      line1: "재산세 + 종부세,",
      line1Accent: "연도별 비교.",
      line2: "보유세 계산기",
    },
    subtitle: ["현행 vs '27 vs '28", "1주택·다주택", "정부안 기준"],
  });
}

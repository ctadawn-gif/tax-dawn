import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "부가가치세 계산기 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧮", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "부가가치세",
      line2: "계산기",
    },
    subtitle: ["일반·간이과세자", "업종별 자동 반영", "무료"],
  });
}

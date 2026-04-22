import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "취득세 계산기 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧮", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "취득세",
      line2: "계산기",
    },
    subtitle: ["주택·농지·상가", "감면 자동 반영", "무료"],
  });
}

import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "종합소득세 예상세액 계산기 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧮", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "종합소득세",
      line2: "예상세액 계산기",
    },
    subtitle: ["업종별 경비율 자동", "3분 완료", "무료"],
  });
}

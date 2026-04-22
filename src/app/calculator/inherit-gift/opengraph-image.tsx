import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "상속·증여세 간편 계산기 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧮", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "상속·증여세",
      line2: "간편 계산기",
    },
    subtitle: ["공제·세율 자동 반영", "관계별 공제", "3분 완료"],
  });
}

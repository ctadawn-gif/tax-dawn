import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "세무 블로그 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "✍️", text: "네이버 블로그 연동", scheme: "blue" },
    headline: {
      line1: "세무사가",
      line2: "직접 씁니다",
    },
    subtitle: ["상속·증여세", "자금출처조사", "개인사업자 세금"],
  });
}

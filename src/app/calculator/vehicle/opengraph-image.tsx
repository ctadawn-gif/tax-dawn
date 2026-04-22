import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "업무용승용차 비용 계산기 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "🧮", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "업무용승용차",
      line2: "비용 계산기",
    },
    subtitle: ["매입·리스·렌트", "한눈에 비교", "무료"],
  });
}

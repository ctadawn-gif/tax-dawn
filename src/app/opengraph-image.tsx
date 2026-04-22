import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "내 세금, 얼마나 나올지 미리 확인 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "💡", text: "무료 세금 계산기", scheme: "blue" },
    headline: {
      line1: "내 세금, 얼마나",
      line2: "나올지 미리 확인.",
    },
    subtitle: ["6개 세무 계산기", "대표세무사 2인", "상시 상담"],
  });
}

import { OG_SIZE, OG_CONTENT_TYPE, renderOGImage } from "@/lib/og-template";

export const alt = "차용증 자동작성 (무료) — 금전소비대차 계약서 | 세무회계 새벽";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOGImage({
    badge: { emoji: "📄", text: "무료 서식 · 로그인 없음", scheme: "blue" },
    headline: {
      line1: "빈칸만 채우면",
      line1Accent: "완성.",
      line2: "차용증 자동작성",
    },
    subtitle: ["증여세 안전선 체크", "상환계획 점검", "인쇄·PDF 무료"],
  });
}

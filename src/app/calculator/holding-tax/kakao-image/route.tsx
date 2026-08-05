import { renderKakaoShareImage } from "@/lib/kakao-share-image";

/** 카카오톡 공유 전용 정사각형 카드 (좌우 크롭 방지) */
export async function GET() {
  return renderKakaoShareImage({
    badge: "2026 세제개편안 반영",
    lines: [
      { text: "재산세 + 종부세" },
      { text: "보유세 계산기", accent: true },
    ],
    tags: ["현행 vs '27 vs '28", "1주택·다주택"],
  });
}

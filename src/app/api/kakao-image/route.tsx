import { renderKakaoShareImage, type KakaoShareContent } from "@/lib/kakao-share-image";

/**
 * 카카오톡 공유용 정사각형 카드 (계산기 공용)
 *   GET /api/kakao-image?c=<슬러그>
 * 계산기마다 라우트를 만들지 않고 슬러그로 분기한다.
 */

const CARDS: Record<string, KakaoShareContent> = {
  "holding-tax": {
    badge: "2026 세제개편안 반영",
    lines: [{ text: "재산세 + 종부세" }, { text: "보유세 계산기", accent: true }],
    tags: ["현행 vs '27 vs '28", "1주택·다주택"],
  },
  "income-tax": {
    badge: "2026 개정세법 반영",
    lines: [{ text: "프리랜서·개인사업자" }, { text: "종합소득세 계산기", accent: true }],
    tags: ["업종별 경비율 자동", "3.3% 환급 확인"],
  },
  "inherit-gift": {
    badge: "관계별 공제 자동 반영",
    lines: [{ text: "상속세 · 증여세" }, { text: "간편 계산기", accent: true }],
    tags: ["배우자·자녀 공제", "세대생략 할증"],
  },
  vat: {
    badge: "일반·간이과세 모두 지원",
    lines: [{ text: "부가가치세" }, { text: "계산기", accent: true }],
    tags: ["매출·매입 입력", "신용카드 공제 반영"],
  },
  "acquisition-tax": {
    badge: "다주택·조정지역 반영",
    lines: [{ text: "주택·토지·상가" }, { text: "취득세 계산기", accent: true }],
    tags: ["주택 수별 중과세율", "생애최초 감면"],
  },
  vehicle: {
    badge: "매입·리스·렌트 비교",
    lines: [{ text: "업무용승용차" }, { text: "비용 계산기", accent: true }],
    tags: ["운행일지 반영", "경비 한도 확인"],
  },
  insurance: {
    badge: "근로자·사업주 분리 계산",
    lines: [{ text: "국민연금·건강보험" }, { text: "4대보험료 계산기", accent: true }],
    tags: ["비과세 급여 반영", "업종별 산재보험료"],
  },
  "loan-agreement": {
    badge: "무료 서식 · 로그인 없음",
    lines: [{ text: "빈칸만 채우면 완성" }, { text: "차용증 자동작성", accent: true }],
    tags: ["증여세 안전선 체크", "상환계획 점검"],
  },
};

const FALLBACK: KakaoShareContent = {
  badge: "세무회계 새벽",
  lines: [{ text: "무료 세금 계산기" }, { text: "7종", accent: true }],
  tags: ["로그인 없이 3분", "세무사가 직접 제작"],
};

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("c") ?? "";
  return renderKakaoShareImage(CARDS[slug] ?? FALLBACK);
}

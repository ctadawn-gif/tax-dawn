import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부가가치세 신고접수 · 세무사 2인 크로스체크",
  description:
    "부가가치세 신고, 세무사가 직접 접수합니다. 일반과세자 11만원부터 / 간이과세자 8.8만원부터(부가세 포함). 신고기한 7월 25일. 이름·연락처만 남기면 24시간 내 연락드립니다.",
  openGraph: {
    title: "부가가치세 신고접수 | 세무회계 새벽",
    description:
      "일반과세자 11만원부터 / 간이과세자 8.8만원부터. 대표세무사 2인이 직접 접수·검토합니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "세무회계 새벽",
  },
  alternates: { canonical: "/vat" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

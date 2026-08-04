import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "보유세 계산기 (재산세+종부세, 2026 개편안)",
  description:
    "재산세·종합부동산세를 합산한 보유세를 현행과 2026 세제개편안(정부안)으로 연도별 비교. 1세대1주택·다주택, 공시가격·거주·세액공제 반영. 로그인 없이 무료. (정부안·참고용)",
  alternates: { canonical: "/calculator/holding-tax" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

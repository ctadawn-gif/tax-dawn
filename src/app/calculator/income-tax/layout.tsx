import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "종합소득세 계산기 (2026 무료)",
  description:
    "프리랜서·근로·사업 소득을 통합 계산. 2026년 개정 세율·경비율 반영. 로그인 없이 3분이면 예상세액 확인.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

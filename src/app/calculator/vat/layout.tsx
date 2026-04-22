import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부가가치세 계산기 (일반·간이)",
  description:
    "일반과세자·간이과세자 모두 지원. 매출·매입 세액, 납부세액을 3분 만에 계산.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

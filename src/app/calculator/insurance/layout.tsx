import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "4대보험료 계산기 (근로자·사업주)",
  description:
    "국민연금·건강보험·장기요양·고용보험·산재보험까지. 근로자·사업주 부담분을 분리 계산. 2026년 요율 반영.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

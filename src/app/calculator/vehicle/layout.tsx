import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "업무용승용차 비용 계산기",
  description:
    "매입·리스·렌트 3가지 방식을 동시 비교. 업무용승용차 관련 비용 한도와 절세 효과를 한눈에 확인.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

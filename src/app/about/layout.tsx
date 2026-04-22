import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "세무사 소개 · 오시는 길",
  description:
    "세무회계 새벽 대표세무사 2인 프로필과 사무실 위치 안내. 숨고·택슬리·엑스퍼트 리뷰 500+.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

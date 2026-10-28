import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "세무 블로그 — 세무사가 직접 쓰는 세금 이야기",
  description:
    "세무회계 새벽 대표세무사 2인이 직접 쓰는 상속·증여세, 자금출처조사, 개인사업자 세금 이야기. 네이버 블로그 최신 글을 한곳에서.",
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

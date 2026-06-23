import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자료실 — 무료 세무 서식·자료",
  description:
    "세무회계 새벽 자료실. 차용증 자동작성 등 실무에 바로 쓰는 무료 세무 서식·자료를 모았습니다. 로그인 없이 무료.",
  alternates: { canonical: "/resources" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

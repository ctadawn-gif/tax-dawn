import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상속세·증여세 계산기 (무료)",
  description:
    "배우자·자녀·손자녀 등 관계별 공제 자동 반영. 상속세와 증여세 예상세액을 3분 만에 확인.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

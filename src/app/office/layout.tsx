import type { Metadata } from "next";

// 세무사만 쓰는 내부 쪽. 검색에 잡히지 않게 하고, 메뉴와 사이트맵에는 넣지 않는다.
export const metadata: Metadata = {
  title: "참고용 계산기",
  robots: { index: false, follow: false, nocache: true },
};

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

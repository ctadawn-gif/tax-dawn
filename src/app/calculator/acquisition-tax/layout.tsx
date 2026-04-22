import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "취득세 계산기 (주택·부동산)",
  description:
    "주택 수·조정지역·생애최초 감면·일시적 2주택 등 자동 반영. 취득세·농어촌특별세·지방교육세 한 번에 계산.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "차용증 자동작성 (무료) — 금전소비대차 계약서",
  description:
    "빈칸만 채우면 차용증(금전소비대차 계약서)이 자동 완성. 가족 간 차용 증여세 안전선(적정이자율 4.6%·무이자 2.17억 한도) 자동 체크, 상환계획 점검까지. 인쇄·PDF 저장 무료, 로그인 없음.",
  alternates: { canonical: "/loan-agreement" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

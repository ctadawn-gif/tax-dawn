import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/income-tax/ContactForm";

export const metadata: Metadata = {
  title: "상담 신청",
  description:
    "종합소득세, 부가세, 상속·증여세, 양도세, 자금조달 등 세무 업무 전반에 대해 상담을 신청하세요. 대표세무사 2인이 직접 답변드립니다.",
};

// 상단 안내 바(시즌 문구)를 날짜 기준으로 갱신
export const revalidate = 86400;

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* 상단 안내·빠른 연락 카드 없이 간편 상담 신청 폼만 노출 */}
        <h1 className="sr-only">상담 신청</h1>
        <ContactForm variant="general" />
      </main>
      <Footer />
    </>
  );
}

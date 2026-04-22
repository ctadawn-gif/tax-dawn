import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IncomeTaxAnnouncementBar from "@/components/income-tax/AnnouncementBar";
import Hero from "@/components/income-tax/Hero";
import Differentiators from "@/components/income-tax/Differentiators";
import TrustBadges from "@/components/income-tax/TrustBadges";
import FeeTable from "@/components/income-tax/FeeTable";
import Profiles from "@/components/income-tax/Profiles";
import Process from "@/components/income-tax/Process";
import Documents from "@/components/income-tax/Documents";
import FAQ from "@/components/income-tax/FAQ";
import IncomeTaxTestimonials from "@/components/income-tax/IncomeTaxTestimonials";
import ContactForm from "@/components/income-tax/ContactForm";
import FinalCTA from "@/components/income-tax/FinalCTA";

export const metadata: Metadata = {
  title: "2026년 종합소득세 신고대행 | 세무사 2인 크로스체크 | 세무회계 새벽",
  description:
    "AI 자동신고 말고, 대표세무사 2인이 직접 검토합니다. 매년 500건 이상 정확한 신고. 6월 1일 마감.",
  openGraph: {
    title: "2026년 종합소득세 신고대행 | 세무회계 새벽",
    description:
      "AI 자동신고 말고, 대표세무사 2인이 직접 검토합니다. 매년 500건 이상 정확한 신고.",
    // images는 opengraph-image.tsx에서 자동 생성
    type: "website",
    locale: "ko_KR",
    siteName: "세무회계 새벽",
  },
};

export default function IncomeTaxPage() {
  return (
    <>
      <IncomeTaxAnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Differentiators />
        <TrustBadges />
        <FeeTable />
        <Profiles />
        <Process />
        <Documents />
        <FAQ />
        <IncomeTaxTestimonials />
        <ContactForm />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

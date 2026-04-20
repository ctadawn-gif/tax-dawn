import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/income-tax/ContactForm";

export const metadata: Metadata = {
  title: "무료 상담 신청 | 세무회계 새벽",
  description:
    "종합소득세, 부가세, 상속·증여세, 양도세, 자금조달 등 세무 업무 전반에 대해 무료 상담을 신청하세요. 대표세무사 2인이 직접 답변드립니다.",
};

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="pt-16 pb-10 md:pt-24 md:pb-14 px-5 text-center max-w-[780px] mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-5">
            무료 상담 신청
          </span>
          <h1 className="text-[32px] md:text-[44px] font-extrabold tracking-tight text-text-primary mb-4 leading-tight">
            세무 관련 어떤 문의든
            <br className="sm:hidden" />
            편하게 남겨주세요
          </h1>
          <p className="text-[16px] md:text-[18px] text-text-secondary font-medium leading-relaxed mb-10">
            대표세무사 2인이 직접 확인하고
            <br className="sm:hidden" />
            <strong className="text-text-primary"> 24시간 이내 연락</strong>드립니다.
          </p>

          {/* 유료 상담 안내 */}
          <div className="mx-auto max-w-[560px] bg-amber-50 border border-amber-200 rounded-[20px] p-5 md:p-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-amber-900 mb-1">
                  상담 진행 방식 안내
                </p>
                <p className="text-[13.5px] text-amber-800 leading-relaxed">
                  신청해주시면 세무사가 먼저 연락드려 내용을 확인해드립니다.
                  간단한 안내는 무료이며, 복잡한 사안(예: 심층 세무 설계, 세무조사 대응 등)은
                  별도 유료 상담으로 안내될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <ContactForm variant="general" />
      </main>
      <Footer />
    </>
  );
}

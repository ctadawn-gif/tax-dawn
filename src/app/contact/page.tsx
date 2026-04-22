import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/income-tax/ContactForm";

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

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
        {/* ── Mobile Hero ─────────────────────────── */}
        <section className="md:hidden bg-gradient-to-b from-blue-50/80 via-white to-white pt-12 pb-10 px-5 flex flex-col items-start w-full">
          <div className="inline-flex items-center justify-center bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-4 tracking-tight">
            무료 상담 신청
          </div>
          <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight mb-3">
            세무 관련 어떤 문의든
            <br />
            편하게 남겨주세요.
          </h1>
          <p className="text-[15px] font-medium text-slate-500 leading-[1.6] tracking-tight">
            대표세무사 2인이 직접 확인하고
            <br />
            24시간 이내 연락드립니다.
          </p>
        </section>

        {/* ── Mobile Quick Action Cards (빠른 연락) ─────────────────── */}
        <section className="md:hidden px-5 pb-8 flex flex-col gap-3 w-full">
          {/* 전화 */}
          <a
            href="tel:01032623295"
            className="no-underline flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] active:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-bold text-slate-900 tracking-tight truncate">
                바로 전화하기
              </div>
              <div className="text-[15px] font-medium text-slate-600 tracking-tight mt-0.5 truncate">
                010-3262-3295
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-slate-300 shrink-0 ml-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>

          {/* 카카오톡 */}
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] active:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#03C75A]/10 text-[#03C75A] flex items-center justify-center shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-bold text-slate-900 tracking-tight truncate">
                카카오톡 상담
              </div>
              <div className="text-[15px] font-medium text-slate-600 tracking-tight mt-0.5 truncate">
                톡톡으로 빠르게 (평균 30분 내 답변)
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-slate-300 shrink-0 ml-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>

          {/* 이메일 */}
          <a
            href="mailto:cta.ryang@gmail.com"
            className="no-underline flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] active:bg-slate-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-bold text-slate-900 tracking-tight truncate">
                이메일 문의
              </div>
              <div className="text-[15px] font-medium text-slate-600 tracking-tight mt-0.5 truncate">
                cta.ryang@gmail.com
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-slate-300 shrink-0 ml-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </section>

        {/* 유료 상담 안내 (모바일) */}
        <div className="md:hidden px-5 pt-4 border-t border-slate-100">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-2.5 items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-amber-500 shrink-0 mt-[2px]"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-[14px] font-medium text-amber-800 leading-[1.6] tracking-tight">
              상속·증여·양도세 및 기타 세무 컨설팅 상담은 유료로 진행됩니다.
              <br />
              무료 상담은 1차 번호 남겨주시면 세무사가 문자로 먼저 연락드립니다.
            </p>
          </div>
        </div>

        {/* ── Desktop Hero (기존 유지) ─────────────────────────── */}
        <section className="hidden md:block pt-24 pb-14 px-5 text-center max-w-[780px] mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-5">
            무료 상담 신청
          </span>
          <h1 className="text-[44px] font-extrabold tracking-tight text-text-primary mb-4 leading-tight">
            세무 관련 어떤 문의든 편하게 남겨주세요
          </h1>
          <p className="text-[18px] text-text-secondary font-medium leading-relaxed mb-10">
            대표세무사 2인이 직접 확인하고 <strong className="text-text-primary">24시간 이내 연락</strong>드립니다.
          </p>

          {/* 유료 상담 안내 (PC) */}
          <div className="mx-auto max-w-[560px] bg-amber-50 border border-amber-200 rounded-[20px] p-6 text-left">
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
                <p className="text-[14px] font-bold text-amber-900 mb-1">상담 진행 방식 안내</p>
                <p className="text-[13.5px] text-amber-800 leading-relaxed">
                  번호를 남겨주시면 구체적인 사안 파악을 위해 세무사가 먼저 문자를 보내드립니다.
                  단, <strong>상속·증여·양도세 및 기타 세무 컨설팅 상담은 유료로 진행</strong>됩니다.
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

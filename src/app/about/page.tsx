"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { reviews, SOURCE_LABELS } from "@/lib/reviews";

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";
const PLACE_URL = "https://naver.me/5yP5BKUk";
const KO_EXPERT_URL = "https://m.expert.naver.com/expert/profile/home?storeId=100055567&u=pPfkLxZfCoZXp4gZwIn7Gwh13UsHEXKuynJIyvXjZ5A%3D";
const KIM_EXPERT_URL = "https://m.expert.naver.com/expert/profile/home?storeId=100058445&u=%2FPXSLGf999lYdP5IwsGyCb6FWam%2FygHjBfMrSAjEZzI%3D";

// 베스트 리뷰 10개
const bestReviews = [
  reviews[0], reviews[3], reviews[5], reviews[10], reviews[15],
  reviews[20], reviews[25], reviews[30], reviews[40], reviews[50],
  reviews[60], reviews[70],
].filter(Boolean);

// 모바일용 큐레이션 3개
const MOBILE_REVIEWS = [
  { text: "종소세 기한후신고 때문에 급했는데, 당일날 해결해주셨어요. 꼼꼼하고 전문적이고 친절하시기까지.", reviewer: "명**", source: "숨고" as const },
  { text: "자금조달계획서 상담받았는데, 복잡한 상황임에도 현실적인 분석과 대책 방안을 잘 설명해주셨습니다.", reviewer: "손**", source: "숨고" as const },
  { text: "오프라인에서 세무사에 알아볼 때 잘 안 알려주려 하는 게 많아 답답했는데, 하나하나 꼼꼼히 봐주셨어요.", reviewer: "이**", source: "네이버 엑스퍼트" as const },
];

function mobileSourceClasses(s: "숨고" | "네이버 엑스퍼트" | "택슬리") {
  if (s === "숨고") return "bg-[#00C7AE]/10 text-[#00C7AE]";
  if (s === "네이버 엑스퍼트") return "bg-[#03C75A]/10 text-[#03C75A]";
  return "bg-[#3B82F6]/10 text-[#3B82F6]";
}

function StarRating({ size = 3 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-${size} h-${size} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // 모바일 캐러셀
  const [mobileIdx, setMobileIdx] = useState(0);
  const [mobilePaused, setMobilePaused] = useState(false);
  const mobileTouchStartX = useRef(0);
  const mobileTouchCurrentX = useRef(0);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bestReviews.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: current * 356, behavior: "smooth" });
    }
  }, [current]);

  // 모바일 캐러셀 자동 전환
  useEffect(() => {
    if (mobilePaused) return;
    const timer = setInterval(() => {
      setMobileIdx((i) => (i + 1) % MOBILE_REVIEWS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [mobilePaused]);

  const mobileNext = () => setMobileIdx((i) => (i + 1) % MOBILE_REVIEWS.length);
  const mobilePrev = () => setMobileIdx((i) => (i - 1 + MOBILE_REVIEWS.length) % MOBILE_REVIEWS.length);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid hidden md:block" />

      {/* ── Mobile Nav ─────────────────────────── */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between h-[48px] px-5 bg-white border-b border-slate-100">
        <Link href="/" className="no-underline text-[14px] font-medium text-slate-800 tracking-tight">세무회계 새벽</Link>
        <Link href="/" className="text-slate-500 text-[13px] font-medium no-underline">← 홈으로</Link>
      </header>

      {/* ── Desktop Nav (기존 유지) ─────────────────────────── */}
      <nav className="hidden md:flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <Link href="/" className="text-text-secondary text-sm font-medium hover:text-brand-blue transition-colors no-underline">← 홈으로</Link>
      </nav>

      {/* ── Mobile Content ─────────────────────────── */}
      <div className="md:hidden">
        {/* Hero */}
        <section className="bg-white pt-12 pb-10 px-5 flex flex-col items-start w-full">
          <div className="inline-flex items-center justify-center bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-4 tracking-tight">
            세무회계 새벽
          </div>
          <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight mb-4">
            소개 · 오시는 길
          </h1>
          <p className="text-[16px] font-medium text-slate-500 leading-[1.65] tracking-tight">
            서울 송파구 소재 세무사 사무실.
            <br />
            대표세무사 2인이 직접 상담부터
            <br />
            신고까지 책임집니다.
          </p>
        </section>

        {/* 세무사 2인 */}
        <section className="bg-slate-50 pt-10 pb-12 px-5 border-t border-slate-100 w-full">
          <h2 className="text-[18px] font-bold text-slate-900 mb-5 tracking-tight">담당 세무사</h2>

          {/* 고유빈 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] p-5 mb-4">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[80px] h-[80px] rounded-full border-4 border-blue-50 shrink-0 overflow-hidden">
                <Image src="/ko.jpg" alt="고유빈 세무사" width={80} height={80} className="w-full h-full object-cover" style={{ objectPosition: "top" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-slate-900 tracking-tight">고유빈</span>
                  <span className="bg-slate-900 text-white rounded-md px-2 py-0.5 text-[12px] font-medium tracking-tight">대표세무사</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">상속세 · 증여세</span>
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">자금조달계획서</span>
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">자금출처 소명</span>
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">양도소득세</span>
            </div>

            <a href="tel:01093744916" className="no-underline flex items-center gap-1.5 w-fit text-[16px] font-bold text-brand-blue mb-5 tracking-tight">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
              010-9374-4916
            </a>

            <a href={KO_EXPERT_URL} target="_blank" rel="noopener noreferrer" className="no-underline w-full h-11 border border-slate-200 rounded-[12px] flex items-center justify-center text-[14px] font-semibold text-slate-700 active:bg-slate-50 transition-colors tracking-tight">
              엑스퍼트 프로필 보기
            </a>
          </div>

          {/* 김근량 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[80px] h-[80px] rounded-full border-4 border-blue-50 shrink-0 overflow-hidden">
                <Image src="/kim.jpg" alt="김근량 세무사" width={80} height={80} className="w-full h-full object-cover" style={{ objectPosition: "55% top" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold text-slate-900 tracking-tight">김근량</span>
                  <span className="bg-slate-900 text-white rounded-md px-2 py-0.5 text-[12px] font-medium tracking-tight">대표세무사</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">종합소득세 · 부가가치세</span>
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">사업자 기장대행</span>
              <span className="bg-slate-100 text-slate-700 rounded-full px-3 py-1 text-[13px] font-medium tracking-tight whitespace-nowrap">법인세</span>
            </div>

            <a href="tel:01032623295" className="no-underline flex items-center gap-1.5 w-fit text-[16px] font-bold text-brand-blue mb-5 tracking-tight">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
              </svg>
              010-3262-3295
            </a>

            <a href={KIM_EXPERT_URL} target="_blank" rel="noopener noreferrer" className="no-underline w-full h-11 border border-slate-200 rounded-[12px] flex items-center justify-center text-[14px] font-semibold text-slate-700 active:bg-slate-50 transition-colors tracking-tight">
              엑스퍼트 프로필 보기
            </a>
          </div>
        </section>

        {/* 오시는 길 */}
        <section className="bg-white pt-10 pb-12 px-5 border-t border-slate-100 w-full">
          <h2 className="text-[18px] font-bold text-slate-900 mb-4 tracking-tight">오시는 길</h2>

          <a href={PLACE_URL} target="_blank" rel="noopener noreferrer" className="block rounded-[16px] border border-slate-200 overflow-hidden mb-4 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=서울+송파구+위례서로+252&zoom=16&language=ko"
              width="100%"
              height="260"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>

          {/* 주소 카드 */}
          <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
              <span className="text-[17px] font-bold text-slate-900 tracking-tight">세무회계 새벽</span>
            </div>
            <p className="text-[15px] font-medium text-slate-600 leading-[1.6] tracking-tight">
              서울 송파구 위례서로 252,
              <br />
              유원플러스송파 610호
            </p>
            <div className="bg-amber-50 rounded-md px-3 py-2 mt-3 text-[13px] font-medium text-amber-700 tracking-tight w-fit">
              ※ 방문 상담은 예약 후 가능합니다
            </div>
          </div>

          {/* 버튼 2개 */}
          <div className="flex gap-3 w-full">
            <a href={PLACE_URL} target="_blank" rel="noopener noreferrer" className="no-underline flex-1 h-12 border border-slate-200 bg-white rounded-[12px] flex items-center justify-center gap-1.5 text-[14px] font-semibold text-slate-700 active:bg-slate-50 transition-colors tracking-tight px-2">
              <div className="w-4 h-4 bg-[#03C75A] text-white flex items-center justify-center text-[10px] font-black rounded-[3px] shrink-0">N</div>
              <span className="truncate">네이버 플레이스</span>
            </a>
            <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="no-underline flex-1 h-12 border border-[#03C75A] bg-white rounded-[12px] flex items-center justify-center gap-1.5 text-[14px] font-semibold text-[#03C75A] active:bg-green-50 transition-colors tracking-tight px-2">
              <span className="shrink-0 text-lg leading-none">💬</span>
              <span className="truncate">톡톡 문의</span>
            </a>
          </div>
        </section>

        {/* 고객 리뷰 */}
        <section className="bg-slate-50 pt-10 pb-16 px-5 border-t border-slate-100 w-full">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">고객 리뷰</h2>
            <div className="text-[14px] font-medium text-slate-500 tracking-tight flex items-center gap-1">
              <span className="text-amber-400 text-[13px] tracking-widest">★★★★★</span>
              5.0 · 500건+
            </div>
          </div>

          <div
            className="relative w-full overflow-hidden"
            onTouchStart={(e) => {
              setMobilePaused(true);
              mobileTouchStartX.current = e.touches[0].clientX;
              mobileTouchCurrentX.current = e.touches[0].clientX;
            }}
            onTouchMove={(e) => {
              mobileTouchCurrentX.current = e.touches[0].clientX;
            }}
            onTouchEnd={() => {
              const diff = mobileTouchStartX.current - mobileTouchCurrentX.current;
              if (Math.abs(diff) > 50) {
                if (diff > 0) mobileNext();
                else mobilePrev();
              }
              setMobilePaused(false);
            }}
          >
            <div className="flex transition-transform duration-500 ease-in-out w-full" style={{ transform: `translateX(-${mobileIdx * 100}%)` }}>
              {MOBILE_REVIEWS.map((r, idx) => (
                <div key={idx} className="w-full shrink-0">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 min-h-[220px] flex flex-col items-center justify-center text-center mx-auto">
                    <div className="text-amber-400 text-[14px] tracking-widest mb-3">★★★★★</div>
                    <p className="text-[15px] font-medium text-slate-700 leading-[1.7] tracking-tight">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-slate-500 tracking-tight">
                      <span>— {r.reviewer} ·</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${mobileSourceClasses(r.source)}`}>
                        {r.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {MOBILE_REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMobileIdx(i)}
                aria-label={`${i + 1}번 리뷰`}
                className={`rounded-full transition-all duration-300 ${
                  i === mobileIdx ? "w-6 h-2 bg-brand-blue" : "w-2 h-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ── Desktop Content (기존 유지) ─────────────────────────── */}
      <div className="hidden md:block max-w-[1000px] w-full mx-auto px-6 pt-12 pb-20 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">세무회계 새벽</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">소개 · 오시는 길</h1>
        </div>

        {/* 오시는 길 (지도) */}
        <div className="mb-20">
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight mb-6">오시는 길</h2>

          <a href={PLACE_URL} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-ui-border shadow-sm hover:shadow-md transition-shadow">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=서울+송파구+위례서로+252&zoom=16&language=ko"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>

          <div className="mt-5 bg-white rounded-2xl p-6 border border-ui-border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1">세무회계 새벽</h3>
                <p className="text-[14px] text-text-secondary">서울 송파구 위례서로 252, 유원플러스송파 610호</p>
                <p className="text-[13px] text-text-secondary mt-1">방문 상담은 예약 후 가능합니다</p>
              </div>
              <div className="flex gap-3">
                <a href={PLACE_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border-2 border-ui-border rounded-xl text-[13px] font-bold text-text-primary hover:border-brand-blue hover:text-brand-blue transition-colors no-underline">
                  네이버 플레이스 →
                </a>
                <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#03C75A] text-white rounded-xl text-[13px] font-bold hover:bg-[#02b351] transition-colors no-underline flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>
                  톡톡 문의
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 세무사 소개 */}
        <div className="mb-20">
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight mb-6">세무사 소개</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-blue-50">
                <Image src="/ko.jpg" alt="고유빈 세무사" width={112} height={112} className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-xl font-extrabold text-text-primary mb-1">고유빈 세무사</h3>
              <p className="text-sm text-brand-blue font-bold mb-4">대표세무사</p>
              <div className="text-[13px] text-text-secondary leading-relaxed space-y-1">
                <p>상속·증여세 · 자금조달계획서</p>
                <p>자금출처 소명 · 양도소득세</p>
              </div>
              <a href={KO_EXPERT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors no-underline">
                엑스퍼트 상담 →
              </a>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-blue-50">
                <Image src="/kim.jpg" alt="김근량 세무사" width={112} height={112} className="w-full h-full object-cover object-[55%_top]" />
              </div>
              <h3 className="text-xl font-extrabold text-text-primary mb-1">김근량 세무사</h3>
              <p className="text-sm text-brand-blue font-bold mb-4">대표세무사</p>
              <div className="text-[13px] text-text-secondary leading-relaxed space-y-1">
                <p>종합소득세 · 부가가치세</p>
                <p>사업자 기장대행 · 법인세</p>
              </div>
              <a href={KIM_EXPERT_URL} target="_blank" rel="noopener noreferrer" className="mt-5 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors no-underline">
                엑스퍼트 상담 →
              </a>
            </div>
          </div>
        </div>

        {/* 리뷰 캐러셀 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">고객 리뷰</h2>
            <div className="flex items-center gap-2">
              <StarRating size={4} />
              <span className="text-lg font-extrabold text-text-primary">5.0</span>
              <span className="text-text-secondary text-sm ml-1">500건+</span>
            </div>
          </div>

          <div className="relative">
            <div
              ref={containerRef}
              className="flex gap-4 overflow-x-auto select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {bestReviews.map((r, i) => (
                <div key={i} className="shrink-0 w-[340px] bg-white rounded-2xl p-6 border border-ui-border shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <StarRating size={3} />
                    <span className="text-[10px] font-bold text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded">
                      {SOURCE_LABELS[r.source]}
                    </span>
                  </div>
                  <p className="text-[14px] text-text-primary leading-relaxed mb-4 line-clamp-4">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="text-[12px] text-text-secondary font-medium">{r.reviewer}</div>
                </div>
              ))}
            </div>

            {/* 인디케이터 */}
            <div className="flex justify-center gap-1.5 mt-6">
              {bestReviews.map((_, i) => (
                <button key={i} onClick={() => { setCurrent(i); startAutoPlay(); }} className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-6 bg-brand-blue" : "w-2 bg-slate-300"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

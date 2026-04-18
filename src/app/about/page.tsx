"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { reviews, SOURCE_LABELS } from "@/lib/reviews";

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";
const PLACE_URL = "https://naver.me/5yP5BKUk";

// 베스트 리뷰 10개
const bestReviews = [
  reviews[0], reviews[3], reviews[5], reviews[10], reviews[15],
  reviews[20], reviews[25], reviews[30], reviews[40], reviews[50],
  reviews[60], reviews[70],
].filter(Boolean);

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

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid" />

      <nav className="flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="no-underline"><img src="/logo.png" alt="세무회계 새벽" className="h-10 md:h-12 w-auto" /></Link>
        <Link href="/" className="text-text-secondary text-sm font-medium hover:text-brand-blue transition-colors no-underline">← 홈으로</Link>
      </nav>

      <div className="max-w-[1000px] w-full mx-auto px-6 pt-12 pb-20 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">세무회계 새벽</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">소개 · 오시는 길</h1>
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
              <a href="https://m.expert.naver.com/expert/profile/home?storeId=100055567&u=pPfkLxZfCoZXp4gZwIn7Gwh13UsHEXKuynJIyvXjZ5A%3D" target="_blank" rel="noopener noreferrer" className="mt-5 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors no-underline">
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
              <a href="https://m.expert.naver.com/expert/profile/home?storeId=100058445&u=%2FPXSLGf999lYdP5IwsGyCb6FWam%2FygHjBfMrSAjEZzI%3D" target="_blank" rel="noopener noreferrer" className="mt-5 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors no-underline">
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

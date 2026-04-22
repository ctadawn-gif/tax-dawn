"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// 모바일용 큐레이션 리뷰 (짧고 임팩트 있는 6개)
type MobileReview = { quote: string; reviewer: string; source: "숨고" | "네이버 엑스퍼트" | "택슬리" };
const MOBILE_REVIEWS: MobileReview[] = [
  { quote: "종소세 기한후신고 때문에 급했는데, 당일날 해결해주셨어요. 꼼꼼하고 전문적이고 친절하시기까지.", reviewer: "명**", source: "숨고" },
  { quote: "자금조달계획서 상담받았는데, 복잡한 상황임에도 현실적인 분석과 대책 방안을 잘 설명해주셨습니다.", reviewer: "손**", source: "숨고" },
  { quote: "오프라인에서 세무사에 알아볼 때 잘 안 알려주려 하는 게 많아 답답했는데, 하나하나 꼼꼼히 봐주셨어요.", reviewer: "이**", source: "네이버 엑스퍼트" },
  { quote: "양도소득세 때문에 이곳저곳 알아보고 연락드렸는데 일처리도 깔끔하고, 알기쉽게 설명도 자세히 해주셨어요.", reviewer: "이**", source: "숨고" },
  { quote: "상속세 상담 드렸는데 너무 전문적이고 친절하시네요. 의뢰인 입장에서 여쭤보기 불편한 내역도 먼저 자세히 설명해주셨습니다.", reviewer: "유**", source: "택슬리" },
  { quote: "다른 세무사님과 확실히 다름을 느꼈어요. 짧은 상담에도 답이 빠르고 꼼꼼히 봐주십니다.", reviewer: "sal**", source: "네이버 엑스퍼트" },
];

function mobileSourceClasses(s: MobileReview["source"]) {
  if (s === "숨고") return "bg-[#00C7AE]/10 text-[#00C7AE]";
  if (s === "네이버 엑스퍼트") return "bg-[#03C75A]/10 text-[#03C75A]";
  return "bg-[#3B82F6]/10 text-[#3B82F6]";
}

const testimonials = [
  { name: "명**", info: "", quote: "종소세 기한후신고 때문에 급했는데, 다른 곳들은 당일은 힘들다했지만 세무사님이 당일날 성심 다하셔서 해결해주셨습니다. 정말 꼼꼼하시고 전문적이시고 친절하시기까지.. 앞으로 세금 관련해서는 여기만 찾으려구요.", source: "숨고" },
  { name: "홍**", info: "", quote: "아파트 매수 관련해서 자금조달계획서 준비가 막막했는데, 매우 현실적으로 세세히 상담해주셨습니다. 전화 몇마디인데도 제 상황을 굉장히 빠르게 캐치하셔서 자금출처 소명 준비 방향까지 잡을 수 있었어요.", source: "숨고" },
  { name: "미라**", info: "", quote: "기장대행 상담이었는데, 채팅하다가 직접 전화까지 주셔서 정말 자세하게 강의급으로 밀도 높게 상담 받았습니다. 진짜 찐 세무전문가란 이런거구나.. 전문지식과 친절함에 존경심까지 들었습니다.", source: "엑스퍼트" },
  { name: "천**", info: "", quote: "부가세 신고 항상 혼자하다가 너무 많이 나오는것 같아 부탁드렸는데, 너무 빠르게! 꼼꼼하게! 처리해주셔서 종소세까지 맡길 예정입니다! 늦은 시간에도 빠르게 답변주시고 친절하게 자세히 답변해주셔서 도움이 많이 됐어요", source: "숨고" },
  { name: "박**", info: "", quote: "종합소득세 경정청구 관련해서 고민이 많았는데, 세무사님께 상담을 받으면서 마음이 한결 가벼워졌습니다. '경정청구가 꼭 필요한 경우'와 '굳이 안 해도 되는 경우'를 구분해서 현실적으로 말씀해주신 게 가장 도움이 되었어요.", source: "숨고" },
  { name: "sal****", info: "", quote: "기장대행 상담드렸는데 답이 진짜 제일 빠르시고 시간이 부족해서 못물어보면 전화로도 바로 상담해주십니다. 짧은 상담에 답도 느리고 돈만 바라는 다른 세무사님과 확실히 다름을 느꼈어요.", source: "엑스퍼트" },
  { name: "이**", info: "", quote: "양도소득세 때문에 이곳저곳 알아보고 연락드렸는데 일처리도 깔끔하게 잘해주셨고 알기쉽게 설명도 자세히 해주셨어요. 덕분에 걱정없이 양도세 신고 잘 마무리했습니다 ㅎㅎ", source: "숨고" },
  { name: "황**", info: "", quote: "초보사업자인데 모르고 부가세신고를 못해서 가산세가 많이 나왔어요. 밤 늦게까지 자기일처럼 경정신청을 정확하게 처리해주셨어요. 부가세도 줄고 너무 든든했어요. 최고예요.", source: "숨고" },
  { name: "교육세*****", info: "", quote: "증여세 관련해서 인터넷으로 열시간 찾아본 것 보다 세무사님한테 답변받은게 훨씬 더 도움이 많이 되었습니다. 자금출처 소명 대응까지 친절하게 안내해주셨어요!!", source: "택슬리" },
  { name: "재량달*****", info: "", quote: "상속세 상담드렸는데 진짜 짱이에요! 정말 똑똑하시고 원하는 답변만 꼭꼭 골라서 해주십니다! 완전 강추 ♡", source: "택슬리" },
  { name: "가결산*****", info: "", quote: "프리랜서 종합소득세 신고가 처음이라 하나도 몰랐는데 세무사님이 하나하나 친절하게 잘 답변해 주십니다. 혼자 알아보려니 정말 답답했었는데.. 빠르고 명확한 답변 덕분에 잘 해결했습니다 :)", source: "택슬리" },
  { name: "김**", info: "", quote: "급하게 종합소득세 문의 넣었는데 친절하고 빠르게 해결해주셨어요! 직접 신고했더니 금액이 너무 많이 나와 멘탈이 무너졌는데 장부 작성 후 세금이 확 줄었습니다 ❤️", source: "숨고" },
  { name: "유형자*****", info: "", quote: "상속세 상담 드렸는데 너무 전문적이고 친절하시네요~^^ 의뢰인 입장에서 여쭤보기 불편한 재산 내역도 먼저 자세하게 설명해주시고, 감동이었습니다.", source: "택슬리" },
  { name: "손**", info: "", quote: "자금조달계획서와 자금출처 소명 준비 때문에 상담드렸는데, 복잡한 상황임에도 현실적인 분석과 대책 방안을 잘 설명해주셨습니다. 앞으로 처리해야 할 일들이 정리가 되어 만족합니다!", source: "숨고" },
  { name: "이거**", info: "", quote: "오프라인에서 세무사에 알아볼 때 잘 안알려 주려하는게 많아 답답했는데 세무사님께서는 종소세 신고부터 사업자 경비처리까지 하나하나 궁금한 부분을 꼼꼼히 봐주시고 설명도 잘해주셔서 너무 감사합니다!", source: "엑스퍼트" },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // 모바일 캐러셀 상태
  const [mobileIdx, setMobileIdx] = useState(0);
  const [mobilePaused, setMobilePaused] = useState(false);
  const mobileTouchStartX = useRef(0);
  const mobileTouchCurrentX = useRef(0);

  const cardWidth = 380;
  const gap = 24;

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  // 모바일 자동 전환 3.5초
  useEffect(() => {
    if (mobilePaused) return;
    const timer = setInterval(() => {
      setMobileIdx((i) => (i + 1) % MOBILE_REVIEWS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [mobilePaused]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: current * (cardWidth + gap),
        behavior: "smooth",
      });
    }
  }, [current]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      const newCurrent = Math.round(containerRef.current.scrollLeft / (cardWidth + gap));
      setCurrent(Math.max(0, Math.min(newCurrent, testimonials.length - 1)));
    }
    startAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX);
    setScrollLeft(containerRef.current?.scrollLeft || 0);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    if (containerRef.current) {
      const newCurrent = Math.round(containerRef.current.scrollLeft / (cardWidth + gap));
      setCurrent(Math.max(0, Math.min(newCurrent, testimonials.length - 1)));
    }
    startAutoPlay();
  };

  const mobileNext = () => setMobileIdx((i) => (i + 1) % MOBILE_REVIEWS.length);
  const mobilePrev = () => setMobileIdx((i) => (i - 1 + MOBILE_REVIEWS.length) % MOBILE_REVIEWS.length);

  return (
    <>
      {/* ── Mobile + Tablet (xl 미만) ─────────────────────────── */}
      <section className="xl:hidden py-16 bg-white w-full relative overflow-hidden">
        <div className="flex flex-col items-center justify-center px-5 mb-10 w-full text-center">
          <h2 className="text-[24px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            실제 상담을 받으신
            <br />
            분들의 이야기
          </h2>

          <div className="flex flex-col items-center justify-center mt-5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="flex items-center text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <span className="text-[15px] font-bold text-slate-700 tracking-tight ml-0.5">5.0</span>
            </div>
            <p className="text-[15px] font-medium text-slate-600 tracking-tight">
              숨고·택슬리·엑스퍼트 리뷰 500+
            </p>
          </div>
        </div>

        <div
          className="w-full relative"
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
          <div
            className="flex w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${mobileIdx * 100}%)` }}
          >
            {MOBILE_REVIEWS.map((r, idx) => (
              <div key={idx} className="w-full shrink-0 px-5">
                <article className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/80 p-6 min-h-[260px] flex flex-col w-full">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[14px] font-bold text-amber-500">5.0</span>
                  </div>

                  <div className="flex-1 flex items-center py-2">
                    <p className="text-[16px] text-slate-800 leading-[1.65] tracking-tight font-medium">
                      <span className="text-slate-300 font-serif text-[18px] mr-0.5">&ldquo;</span>
                      {r.quote}
                      <span className="text-slate-300 font-serif text-[18px] ml-0.5">&rdquo;</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-700">{r.reviewer}</span>
                    <span className="text-slate-300 text-[12px]">·</span>
                    <span className={`px-2.5 py-1 rounded-md text-[12px] font-bold tracking-tight ${mobileSourceClasses(r.source)}`}>
                      {r.source}
                    </span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Dot 인디케이터 */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {MOBILE_REVIEWS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMobileIdx(idx)}
              aria-label={`${idx + 1}번 리뷰 보기`}
              className={`rounded-full transition-all duration-300 ${
                idx === mobileIdx ? "w-6 h-2 bg-brand-blue" : "w-2 h-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Desktop (xl 이상) ─────────────────────────── */}
      <section className="hidden xl:block relative pt-24 pb-32 px-6 overflow-hidden">
      <div className="bg-grid" />

      <div className="max-w-[1200px] w-full mx-auto relative z-10">
        <div className="text-center mb-5 md:mb-6">
          <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-blue-50 text-brand-blue text-[12px] md:text-[13px] font-bold tracking-wide border border-blue-100 mb-3 md:mb-4">
            고객 후기
          </span>
          <h2 className="text-[24px] md:text-3xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
            실제 상담을 받으신
            <br className="md:hidden" />
            <span className="md:hidden"> </span>
            분들의 이야기
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mb-8 md:mb-12">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xl font-extrabold text-text-primary">5.0</span>
          </div>
          <div className="w-px h-6 bg-ui-border" />
          <div className="text-text-secondary text-[15px] font-medium">
            숨고 · 택슬리 · 엑스퍼트 등 세무 플랫폼 <span className="text-brand-blue font-bold">500건+</span> 리뷰
          </div>
        </div>

        {/* 캐러셀 */}
        <div className="relative">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="shrink-0 w-[340px] md:w-[380px] bg-white rounded-3xl p-7 md:p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <StarRating />
                  <span className="text-[11px] font-bold text-text-secondary bg-slate-100 px-2 py-1 rounded">
                    {t.source}
                  </span>
                </div>
                <p className="text-[15px] leading-[1.7] text-text-primary font-medium flex-grow mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-100">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-[14px]">{t.name}</div>
                    {t.info && <div className="text-text-secondary text-[12px]">{t.info}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 좌우 화살표 */}
          <button
            onClick={() => { setCurrent(Math.max(0, current - 1)); startAutoPlay(); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-ui-border shadow-md flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors z-10 hidden md:flex"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => { setCurrent(Math.min(testimonials.length - 1, current + 1)); startAutoPlay(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-ui-border shadow-md flex items-center justify-center text-text-secondary hover:text-brand-blue hover:border-brand-blue transition-colors z-10 hidden md:flex"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); startAutoPlay(); }}
              className={`h-2 rounded-full transition-all duration-300 ${current === i ? "w-6 bg-brand-blue" : "w-2 bg-slate-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

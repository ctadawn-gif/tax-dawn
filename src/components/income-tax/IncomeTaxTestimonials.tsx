"use client";

import { useState, useEffect } from "react";

type Review = {
  text: string;
  reviewer: string;
  source: string;
  best?: boolean;
};

const REVIEWS: Review[] = [
  // ── Slide 1: 종합소득세 직접 언급 (6개)
  {
    text:
      "이번에 종합소득세 관련해서 고민이 많았는데, 세무사님께 상담을 받으면서 마음이 한결 가벼워졌습니다. '꼭 필요한 경우'와 '굳이 안 해도 되는 경우'를 구분해서 말씀해주신 게 가장 도움이 되었어요.",
    reviewer: "박** 고객",
    source: "숨고",
    best: true,
  },
  {
    text:
      "급하게 문의 넣었는데 친절하고 빠르게 해결해주셨어요!! 제가 직접 종합소득세 신고했더니 금액이 너무 많이 나와 멘탈이 무너졌는데, 세무사님이 시원하게 해결해주셨습니당 ❤️",
    reviewer: "김** 고객",
    source: "숨고",
  },
  {
    text:
      "부가세 신고를 혼자 또는 어플로 하다가 너무 많이 나오는 것 같아 부탁드렸는데, 너무 빠르게, 꼼꼼하게 처리해주셔서 종소세까지 맡길 예정입니다!",
    reviewer: "천** 고객",
    source: "숨고",
  },
  {
    text:
      "세무사 상담 중 제일 베스트였습니다. 필요한 정보를 너무 잘 알려주셔서 도움이 너무 많이 됐습니다. 단언컨대 제일 전문적이셔서, 세무 상담 필요할 때는 무조건 김근량 세무사님께 오겠습니다.",
    reviewer: "익명 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "기한후신고 종합소득세 필요한 정보들 너무나도 쉽게 설명해주시고 진행해줬습니다. 감사합니다!",
    reviewer: "rlaw*** 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "종합소득세 신고 관련해서 궁금한 게 많았는데 하나라도 더 알려주려고 하십니다. 친절한 답변 감사합니다!",
    reviewer: "sh93*** 고객",
    source: "네이버 엑스퍼트",
  },

  // ── Slide 2: 사업자 / 프리랜서 (6개)
  {
    text:
      "근로소득, 사업소득, 기타소득으로 소득의 종류가 다양해서 세금신고에 어려움이 있었는데 신속하게 응대해주시고 친절, 명확하게 설명해주셔서 이해가 잘 되었습니다.",
    reviewer: "heey*** 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "작은 가게를 운영하며 업무용 차를 구매할 일이 생겨 도움을 받고자 상담을 신청하였습니다. 경우에 따라 발생되는 차이를 명확하게 설명해주셔서 합리적인 선택을 할 수 있을 것 같습니다. 추천드려요",
    reviewer: "moon*** 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "사업 시작하고 첫 세금 신고라서 어떻게 해야 할지 막막하던 때에 실력 있고 엄청 친절하신 세무사님 만나서 잘 마무리 할 수 있었어요!! 👍",
    reviewer: "핏** 고객",
    source: "숨고",
  },
  {
    text:
      "늦은 시간에 요청드렸는데 너무 친절하고 명확하게 알려주셔서 감사합니다. 덕분에 오늘 발뻗고 잘 수 있겠어요. 앞으로 기장 업무 잘 부탁드립니다!!!",
    reviewer: "라이언이라니까 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "개인사업자 기장료 문의드렸는데 정말 친절하게 안내해주셨습니다. 아직은 기장을 안 맡기고 단건으로 진행해도 된다고 정말 솔직하게 말씀해주셨습니다.",
    reviewer: "tjsd*** 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "너무 좋은 세무사님이십니다. 답이 진짜 제일 빠르시고요. 상담하다가 시간이 부족해서 못 물어보면 전화로도 바로 상담해주시고, 전화약속도 칼같이 지켜주십니다. 정말 너무 친절하십니다.",
    reviewer: "sall*** 고객",
    source: "네이버 엑스퍼트",
  },

  // ── Slide 3: 전문성 / 친절함 (6개)
  {
    text:
      "김근량 세무사님 진심으로 감사드립니다~~ 😊🙏 10분 무료상담이였는데, 채팅하다가 직접 전화까지 주셔서 정말 자세하게 세무 관련 강의급으로, 밀도 높게 상담받았습니다. 진짜 찐 세무전문가란 이런거구나…",
    reviewer: "미라클 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "오프라인에서 회계사무소나 세무사에 알아볼 때 잘 안 알려주려 하는 게 많아 답답했는데, 김근량 세무사님께서는 하나하나 궁금한 부분까지 꼼꼼히 봐주시고 설명도 잘해주셔서 너무 감사합니다!",
    reviewer: "이거바바 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "종합소득세, 부가가치세 관련하여 모르는 부분도 많고 신고를 제대로 한 건지도 잘 모르겠었는데, 세무사님께서 안 될 것 같은 부분은 과장 없이 현실적으로 조언해주셔서 너무 좋았습니다!",
    reviewer: "익명 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "친절하시고 설명을 잘해주세요! 종합소득세신고할 때 연락드릴라고요 ^^ 가격도 저렴한 것 같아요! 감사합니다 ❤️",
    reviewer: "bbbe*** 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "궁금했던 부분을 사실 확인뿐만 아니라 대처까지 너무 잘 알려주셨어요. 종소세 신고할 때 연락드리겠습니다!",
    reviewer: "푸우 고객",
    source: "네이버 엑스퍼트",
  },
  {
    text:
      "종합소득세 관련 상담 요청드렸는데, 빠르고 신속하게 처리해주셨습니다.",
    reviewer: "hanw*** 고객",
    source: "네이버 엑스퍼트",
  },
];

const PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(REVIEWS.length / PER_PAGE);

function Star() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="relative bg-white p-6 rounded-[20px] border border-ui-border shadow-sm h-full flex flex-col">
      {review.best && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 font-bold text-[12px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          BEST
        </div>
      )}
      <div className="flex text-yellow-400 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
      <p className="text-[14.5px] text-text-primary leading-relaxed mb-4 flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="text-[12.5px] text-slate-500 font-medium">
        — {review.reviewer} · {review.source}
      </div>
    </div>
  );
}

export default function IncomeTaxTestimonials() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setPage((p) => (p + 1) % TOTAL_PAGES);
    }, 8000);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setPage((p) => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  const next = () => setPage((p) => (p + 1) % TOTAL_PAGES);

  return (
    <section id="testimonials" className="py-24 px-5 bg-ui-surface border-y border-ui-border">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
            실제 고객 후기
          </h2>
          <p className="text-[18px] text-text-secondary font-medium">
            숨고·네이버 엑스퍼트에 남겨주신 리뷰 일부입니다.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* 화살표 - 데스크톱 */}
          <button
            onClick={prev}
            aria-label="이전 후기"
            className="hidden md:flex absolute left-[-60px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-ui-border shadow-md hover:shadow-lg hover:border-brand-blue hover:text-brand-blue items-center justify-center text-text-secondary transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="다음 후기"
            className="hidden md:flex absolute right-[-60px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-ui-border shadow-md hover:shadow-lg hover:border-brand-blue hover:text-brand-blue items-center justify-center text-text-secondary transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 슬라이드 뷰포트 */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, pageIdx) => (
                <div
                  key={pageIdx}
                  className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-1 pt-3"
                >
                  {REVIEWS.slice(pageIdx * PER_PAGE, (pageIdx + 1) * PER_PAGE).map((r, i) => (
                    <ReviewCard key={i} review={r} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 모바일 화살표 + 페이지 닷 */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="이전 후기"
              className="md:hidden w-10 h-10 rounded-full bg-white border border-ui-border shadow-sm flex items-center justify-center text-text-secondary hover:text-brand-blue transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {Array.from({ length: TOTAL_PAGES }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  aria-label={`${idx + 1}번 페이지로 이동`}
                  className={`h-2 rounded-full transition-all ${
                    idx === page ? "w-8 bg-brand-blue" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="다음 후기"
              className="md:hidden w-10 h-10 rounded-full bg-white border border-ui-border shadow-sm flex items-center justify-center text-text-secondary hover:text-brand-blue transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

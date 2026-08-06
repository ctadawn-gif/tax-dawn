"use client";

import ShareButton from "@/components/ShareButton";

/**
 * 계산기 상단 공유 바.
 * 공유되는 것은 "계산 결과"가 아니라 "계산기 링크"이므로,
 * 결과 카드 헤더가 아니라 입력 영역 위에 둔다.
 */
export default function CalculatorShareBar({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  /** /api/kakao-image?c=<slug> 의 슬러그 */
  slug: string;
}) {
  return (
    <div className="no-print max-w-[700px] mx-auto mb-4 flex items-center justify-between gap-3 rounded-xl border border-ui-border bg-ui-surface px-4 py-3">
      <span className="text-[13px] text-text-secondary leading-snug">
        이 계산기가 <b className="text-text-primary">필요한 분께 공유</b>해보세요
      </span>
      <ShareButton
        title={title}
        description={description}
        imageUrl={`/api/kakao-image?c=${slug}`}
        buttonLabel="계산해보기"
      />
    </div>
  );
}

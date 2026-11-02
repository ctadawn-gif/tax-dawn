"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { saveCalcSummary } from "@/lib/calcSummary";

/**
 * 계산기 하단 '상담 신청하기' — 누르는 순간의 계산 요약을 상담 폼으로 넘긴다.
 * lines가 비어 있으면(아직 입력 전) 이전 요약을 지우고 그냥 이동한다.
 */
export default function ConsultButton({
  source,
  topic = "",
  lines,
  href = "/contact",
  className,
  children,
}: {
  source: string;
  topic?: string;
  lines: (string | false | null | undefined)[];
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        saveCalcSummary({ source, topic, lines: lines.filter((l): l is string => Boolean(l)) })
      }
    >
      {children}
    </Link>
  );
}

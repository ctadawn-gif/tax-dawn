"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { getNavPromo, type NavPromo } from "@/lib/season";

const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "계산기", href: "/#calculators" },
  { label: "자료실", href: "/resources" },
  { label: "상담 안내", href: "/#contact" },
  { label: "오시는 길", href: "/#location" },
  { label: "블로그", href: "/blog" },
];

const noopSubscribe = () => () => {};

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

// 시즌 프로모션 버튼 — 날짜에 따라 자동 전환 (src/lib/season.ts getNavPromo)
//   4.15~6.1 종소세 / 6.15~7.26·12.16~1.26 부가세 / 10.15~12.15 종부세 계산기 / 그 외 숨김

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 정적 페이지라 빌드 시점이 아닌 "지금" 날짜로 정하려고 클라이언트에서 계산 (서버 렌더는 숨김)
  const promoKey = useSyncExternalStore(noopSubscribe, () => JSON.stringify(getNavPromo()), () => "null");
  const promo = JSON.parse(promoKey) as NavPromo | null;

  return (
    <nav className="flex justify-between items-center gap-4 px-6 lg:px-10 xl:px-20 py-5 max-w-[1440px] mx-auto w-full bg-white relative z-20">
      <Link href="/" className="no-underline">
        <img src="/logo.png" alt="세무회계 새벽" className="h-12 md:h-14 w-auto shrink-0" />
      </Link>

      <ul className="hidden lg:flex gap-6 xl:gap-8 list-none m-0 p-0">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-text-secondary text-sm font-medium hover:text-brand-blue transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* PC: 색 버튼은 하나만. 시즌 버튼이 있으면 그것이 주 버튼이고 상담 문의는 글자 링크,
          없으면 상담 문의가 주 버튼. 톡톡은 오른쪽 아래 떠 있는 버튼(FloatingTalk)과 겹쳐 머리글에서 뺌 */}
      <div className="hidden lg:flex items-center gap-6 shrink-0 whitespace-nowrap">
        {promo && (
          <Link
            href="/#contact"
            className="text-sm font-medium text-text-primary hover:text-brand-blue transition-colors no-underline"
          >
            상담 문의
          </Link>
        )}
        <Link
          href={promo ? promo.href : "/#contact"}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-brand-blue text-white hover:bg-blue-700 transition-colors no-underline"
        >
          {promo ? promo.label : "상담 문의"}
        </Link>
      </div>

      <button
        className="lg:hidden p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="메뉴 열기"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-ui-border shadow-lg lg:hidden z-50 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-text-primary font-medium py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {promo && (
            <Link
              href={promo.href}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-3 rounded-lg text-sm font-semibold bg-brand-blue text-white text-center flex items-center justify-center no-underline"
            >
              {promo.label}
            </Link>
          )}
          {/* 색 버튼은 하나만: 시즌 버튼이 있으면 상담 문의는 테두리, 톡톡은 글자 링크 */}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className={`px-5 py-3 rounded-lg text-sm font-semibold text-center no-underline ${
              promo ? "border border-ui-border text-text-primary" : "bg-brand-blue text-white"
            }`}
          >
            상담 문의
          </Link>
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-secondary text-center py-2"
          >
            네이버 톡톡으로 문의하기
          </a>
        </div>
      )}
    </nav>
  );
}

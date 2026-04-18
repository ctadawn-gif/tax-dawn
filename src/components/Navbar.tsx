"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "계산기", href: "#calculators" },
  { label: "상담 안내", href: "#contact" },
  { label: "오시는 길", href: "#location" },
  { label: "블로그", href: "https://blog.naver.com/tax_dawn", external: true },
];

const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto w-full bg-white relative z-20">
      <Link href="/" className="no-underline">
        <img src="/logo.png" alt="세무회계 새벽" className="h-12 md:h-14 w-auto" />
      </Link>

      <ul className="hidden lg:flex gap-8 list-none m-0 p-0">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-text-secondary text-sm font-medium hover:text-brand-blue transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hidden lg:flex">
        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#03C75A] text-white hover:bg-[#02b351] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>
          톡톡 문의하기
        </a>
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
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg text-sm font-bold bg-[#03C75A] text-white text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0C4.477 0 0 3.582 0 8c0 2.867 1.89 5.39 4.726 6.836-.152.554-.55 2.013-.63 2.326-.098.382.14.377.295.274.122-.08 1.94-1.31 2.736-1.846A11.81 11.81 0 0010 16c5.523 0 10-3.582 10-8S15.523 0 10 0z"/></svg>
            톡톡 문의하기
          </a>
        </div>
      )}
    </nav>
  );
}

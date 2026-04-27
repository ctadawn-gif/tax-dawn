"use client";

import { useState } from "react";

const REQUIRED = [
  "사업자 등록증 사본",
  "대표자 신분증",
  "휴대전화번호 · 등본상 주소",
  { main: "홈택스 ID / PW", note: "(미가입 시 가입 필요)" },
  { main: "홈택스 수임동의", note: "(별도 절차 안내)" },
];

const OPTIONAL: { main: React.ReactNode; sub: string }[] = [
  { main: "주민등록등본 · 가족관계증명원", sub: "소득공제 부양가족 있는 경우" },
  { main: "신용카드 사용 내역서 (엑셀)", sub: "사업용 카드 외 사용 내역 있는 경우" },
  { main: "사업관련 계좌이체 내역", sub: "2025년 거래내역" },
  { main: "통신비 (휴대폰·인터넷)", sub: "카드결제 시 생략" },
  { main: "사업장 공과금", sub: "(전기·가스·수도·관리비)" },
  { main: "차량비용 (리스·렌탈비·보험료·자동차세)", sub: "자차면 차량등록증" },
  { main: "2025년 건강보험 납부내역", sub: "" },
  { main: "대출금 이자내역", sub: "(대출잔액증명서·이자납입내역서)" },
  { main: "거래처 경조사비", sub: "(청첩장·부고장 날짜 캡쳐)" },
  { main: "기부금 영수증", sub: "" },
];

// 모바일용 (필수): 문자열 또는 {main, note}
type MobileRequired = string | { main: string; note: string };

const MOBILE_REQUIRED: MobileRequired[] = [
  "사업자 등록증 사본",
  "대표자 신분증",
  "휴대전화번호 · 등본상 주소",
  { main: "홈택스 ID / PW", note: "(미가입 시 가입 필요)" },
  { main: "홈택스 수임동의", note: "(별도 절차 안내)" },
];

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg
      className="w-5 h-5 text-slate-500 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function MobileCheckIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center shrink-0 mt-[2px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-3.5 h-3.5 text-white"
      >
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default function Documents() {
  const [optionalOpen, setOptionalOpen] = useState(false);

  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-[#0B1120] px-5 py-16 w-full">
        <div className="mb-8">
          <h2 className="text-[26px] font-extrabold text-white leading-[1.35] tracking-tight">
            준비해 주실
            <br />
            서류 목록
          </h2>
          <p className="text-[15px] font-medium text-slate-400 mt-3 tracking-tight leading-[1.45]">
            기본 서류만 준비해주세요.
            <br />
            나머지는 저희가 안내드립니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* 필수 서류 */}
          <div className="bg-[#1e293b] rounded-[20px] p-6 border border-slate-700/50 shadow-sm w-full">
            <h3 className="text-[17px] font-bold text-white mb-5 tracking-tight">필수 서류</h3>
            <ul className="flex flex-col gap-4">
              {MOBILE_REQUIRED.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <MobileCheckIcon />
                  <span className="text-[15px] font-medium text-slate-200 leading-[1.4] tracking-tight pt-[1px]">
                    {typeof item === "string" ? (
                      item
                    ) : (
                      <>
                        {item.main}{" "}
                        <span className="text-slate-400 text-[13px]">{item.note}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 해당자만 준비 (아코디언) */}
          <div className="bg-[#1e293b] rounded-[20px] px-6 py-5 border border-slate-700/50 shadow-sm w-full">
            <button
              type="button"
              onClick={() => setOptionalOpen((v) => !v)}
              className="w-full flex items-center justify-between outline-none"
              aria-expanded={optionalOpen}
            >
              <div className="flex items-center gap-2.5">
                <h3 className="text-[17px] font-bold text-white tracking-tight">
                  추가서류 <span className="text-slate-400 font-medium text-[14px]">(해당자만)</span>
                </h3>
                <span className="bg-brand-blue/20 text-[#3b82f6] text-[13px] font-bold px-2.5 py-0.5 rounded-full">
                  {OPTIONAL.length}개
                </span>
              </div>
              <div
                className={`text-slate-400 transition-transform duration-300 ${
                  optionalOpen ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>

            {optionalOpen && (
              <div className="mt-6 pt-1 border-t border-slate-700/50">
                <ul className="flex flex-col gap-5 mt-5">
                  {OPTIONAL.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <MobileCheckIcon />
                      <div className="flex flex-col gap-0.5 pt-[1px]">
                        <span className="text-[15px] font-medium text-slate-200 leading-[1.4] tracking-tight">
                          {item.main}
                        </span>
                        {item.sub && (
                          <span className="text-[13px] text-slate-400 leading-[1.4] tracking-tight">
                            {item.sub}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 bg-slate-900 text-white">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-white mb-4">
              준비해 주실 서류 목록
            </h2>
            <p className="text-[18px] text-slate-400 font-medium">
              기본 서류만 주시면 시작할 수 있습니다.
              <br />
              나머지는 담당 세무사가 하나씩 안내드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 필수 서류 */}
            <div className="bg-slate-800 rounded-[24px] p-8 border border-slate-700">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[13px] font-bold mb-6">
                먼저 전달
              </div>
              <h3 className="text-[22px] font-bold text-white mb-6">필수 서류</h3>
              <ul className="space-y-4">
                {REQUIRED.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-[16px] text-slate-200">
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <>
                          {item.main}
                          <span className="text-slate-400 text-[14px] ml-1">{item.note}</span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 해당자만 준비 */}
            <div className="bg-slate-800/50 rounded-[24px] p-8 border border-slate-700 border-dashed">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-[13px] font-bold mb-6">
                선택
              </div>
              <h3 className="text-[22px] font-bold text-white mb-6">해당자만 준비</h3>
              <ul className="space-y-4">
                {OPTIONAL.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CircleIcon />
                    <span className="text-[15px] text-slate-300 leading-snug">
                      {item.main}
                      {item.sub && (
                        <>
                          {" "}
                          <span className="text-slate-500 text-[13px]">{item.sub}</span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

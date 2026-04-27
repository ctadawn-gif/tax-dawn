"use client";

import { useState } from "react";

/* ────────────────────────────────────────────────
   요청 자료 13개 — 엑셀 마스터본 기준
   isAuth: true → 카톡인증 시 세무사가 대신 출력 가능
   ──────────────────────────────────────────────── */
type DocItem = {
  no: number;
  name: string;
  note: string;
  isAuth?: boolean;
};

const DOCUMENTS: DocItem[] = [
  { no: 1, name: "2025년 경조사비", note: "청첩장, 부고문자 캡쳐본" },
  { no: 2, name: "2025년 사업자대출 이자비용", note: "해당사항 있는 경우 전달" },
  {
    no: 3,
    name: "2025년 카드이용내역 엑셀파일",
    note: "2025년 1월~12월 / 카드사 알려주시면 다운 방법 안내드립니다.",
  },
  {
    no: 4,
    name: "2025년 대표자 국민연금 납부확인서",
    note: "카톡인증 해주시면 세무사가 대신 출력 가능합니다.",
    isAuth: true,
  },
  {
    no: 5,
    name: "2025년 대표자 건강보험 납부확인서",
    note: "카톡인증 해주시면 세무사가 대신 출력 가능합니다.",
    isAuth: true,
  },
  {
    no: 6,
    name: "2025년 타소득 확인 자료",
    note: "카톡인증 해주시면 세무사가 대신 출력 가능합니다.",
    isAuth: true,
  },
  {
    no: 7,
    name: "2025년 연말정산간소화 자료",
    note: "카톡인증 해주시면 세무사가 대신 출력 가능합니다.",
    isAuth: true,
  },
  { no: 8, name: "2025년 기부금 내역", note: "해당사항 있는 경우 전달" },
  {
    no: 9,
    name: "2025년 통신비 납부내역",
    note: "통신사 어플에서 다운받아서 전달 부탁드립니다.",
  },
  {
    no: 10,
    name: "주민등록등본",
    note: "현재 전입신고 되어있는 주소지 기준으로 발행",
  },
  { no: 11, name: "가족관계증명서", note: "부모님·자녀가 보이게 발급" },
  {
    no: 12,
    name: "혼인관계증명서",
    note: "2025년도에 혼인신고하신 경우에만",
  },
  {
    no: 13,
    name: "자동차등록증",
    note: "본인명의 차량 있으신 경우에만 전달",
  },
];

const KAKAO_TALK_URL =
  "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

/* ──── 아이콘 ──── */
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function NoticeBlock() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mb-8">
      <div className="flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-[15px] md:text-base font-extrabold text-amber-900 mb-3 tracking-tight">
            자료 전달 전 확인사항
          </h4>
          <ul className="flex flex-col gap-2 text-[13.5px] md:text-[14.5px] text-amber-900 leading-[1.55] tracking-tight">
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold shrink-0">·</span>
              <span>
                모든 자료의 <strong className="font-extrabold">출력 기준일은 &quot;2025년도&quot;</strong> 입니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold shrink-0">·</span>
              <span>
                <a
                  href={KAKAO_TALK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold underline underline-offset-2 decoration-amber-400 hover:text-amber-700"
                >
                  카카오톡
                </a>{" "}
                또는 이메일{" "}
                <a
                  href="mailto:cta.ryang@gmail.com"
                  className="font-extrabold underline underline-offset-2 decoration-amber-400 hover:text-amber-700"
                >
                  cta.ryang@gmail.com
                </a>{" "}
                으로 보내주시면 됩니다.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold shrink-0">·</span>
              <span>
                팩스번호는{" "}
                <strong className="font-extrabold">0507-1793-5901</strong> 입니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ──── 모바일 카드 한 개 ──── */
function MobileCard({ doc }: { doc: DocItem }) {
  return (
    <article
      className={`rounded-[14px] border p-4 flex flex-col gap-2 w-full ${
        doc.isAuth
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-extrabold ${
            doc.isAuth
              ? "bg-brand-blue text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {doc.no}
        </span>
        <h4 className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight">
          {doc.name}
        </h4>
      </div>
      <p
        className={`pl-8 text-[13px] leading-[1.55] tracking-tight ${
          doc.isAuth ? "text-blue-700 font-medium" : "text-slate-600"
        }`}
      >
        {doc.note}
      </p>
    </article>
  );
}

export default function Documents() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-white px-5 py-16 w-full">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[12px] font-bold mb-3 tracking-wide">
            요청 자료 13건
          </span>
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            준비해 주실
            <br />
            서류 목록
          </h2>
          <p className="text-[14.5px] font-medium text-slate-500 mt-3 tracking-tight leading-[1.5]">
            아래 자료를 준비해주시면
            <br />
            세무사가 정확한 신고를 도와드립니다.
          </p>
        </div>

        <NoticeBlock />

        <div className="flex flex-col gap-3">
          {(open ? DOCUMENTS : DOCUMENTS.slice(0, 5)).map((doc) => (
            <MobileCard key={doc.no} doc={doc} />
          ))}
        </div>

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-700 text-[14px] font-bold flex items-center justify-center gap-1.5 active:bg-slate-50 transition-colors"
          >
            나머지 {DOCUMENTS.length - 5}건 더보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-slate-500">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 border border-blue-200" />
          <span>
            파란 항목은 <strong className="font-extrabold text-brand-blue">카톡인증</strong>으로 대신 출력 가능
          </span>
        </div>
      </section>

      {/* ── Desktop ─────────────────────────── */}
      <section className="hidden md:block bg-white py-24 px-5">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide mb-4">
              요청 자료 13건
            </span>
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-slate-900 mb-4">
              준비해 주실 서류 목록
            </h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              아래 자료를 준비해주시면, 담당 세무사가 누락 없이 정확한 신고를 도와드립니다.
            </p>
          </div>

          <NoticeBlock />

          {/* 표 */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[14px] font-bold">
                  <th className="py-3.5 px-4 w-[60px] text-center">번호</th>
                  <th className="py-3.5 px-4 w-[300px]">항목</th>
                  <th className="py-3.5 px-4">비고</th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS.map((doc) => (
                  <tr
                    key={doc.no}
                    className={`border-t border-slate-100 ${
                      doc.isAuth ? "bg-blue-50/60" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 text-center text-[14px] font-bold text-slate-700">
                      {doc.no}
                    </td>
                    <td className="py-3 px-4 text-[14.5px] font-bold text-slate-900 tracking-tight">
                      <div className="flex items-center gap-2">
                        {doc.isAuth && (
                          <span className="inline-flex items-center gap-1 bg-brand-blue text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                            <CheckIcon className="w-3 h-3" />
                            인증
                          </span>
                        )}
                        <span>{doc.name}</span>
                      </div>
                    </td>
                    <td
                      className={`py-3 px-4 text-[14px] tracking-tight leading-relaxed ${
                        doc.isAuth ? "text-blue-700 font-medium" : "text-slate-600"
                      }`}
                    >
                      {doc.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-[13.5px] text-slate-500">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 border border-blue-200 mr-1.5 align-middle" />
            파란 줄 항목은{" "}
            <strong className="font-extrabold text-brand-blue">카톡인증</strong> 시
            세무사가 대신 출력 가능합니다.
          </p>
        </div>
      </section>
    </>
  );
}

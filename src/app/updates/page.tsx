import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "계산기 업데이트 내역",
  description:
    "2026년 개정 세법·경비율·세율표 반영 내역. 6종 계산기의 최신 업데이트와 법령 근거를 한눈에 확인하세요.",
};

const updates = [
  {
    title: "종합소득세 계산기",
    href: "/calculator/income-tax",
    laws: [
      "소득세법 제55조(세율), 제47조(기본공제), 제51조(추가공제)",
      "소득세법 제59조(근로소득세액공제)",
      "2025년 귀속 경비율 고시 (국세청고시 제2026-14호)",
    ],
    changes: [
      { label: "세율 구간", desc: "과세표준 1,400만원 이하 6% 구간 유지 (2023년 확대분 반영)" },
      { label: "업종코드별 경비율", desc: "82개 주요 업종의 단순경비율·기준경비율 반영, 업종 검색 기능" },
      { label: "인적용역 초과율", desc: "940*** 업종코드 수입금액 4,000만원 기준 기본율/초과율 자동 분리 계산" },
      { label: "소득유형 통합", desc: "사업/프리랜서 소득 통합, 근로소득, 종합(사업+근로) 3가지 모드 지원" },
    ],
  },
  {
    title: "상속·증여세 계산기",
    href: "/calculator/inherit-gift",
    laws: [
      "상속세 및 증여세법 제26조(일괄공제), 제19조(배우자상속공제)",
      "상속세 및 증여세법 제53조(증여재산공제)",
      "상속세 및 증여세법 제27조(세대생략 할증과세)",
    ],
    changes: [
      { label: "현행 세율 유지", desc: "최고세율 50%, 자녀공제 1인당 5,000만원 (정부 개정안 2024.12 국회 부결)" },
      { label: "기타친족 범위 축소", desc: "6촌 혈족·4촌 인척 → 4촌 혈족·3촌 인척 (2025.3.14 개정)" },
      { label: "신고세액공제", desc: "3% 유지" },
      { label: "일괄공제 자동 비교", desc: "기초공제(2억)+인적공제 vs 일괄공제(5억) 큰 쪽 자동 적용" },
    ],
  },
  {
    title: "부가가치세 계산기",
    href: "/calculator/vat",
    laws: [
      "부가가치세법 제37조(납부세액), 제61조(간이과세)",
      "부가가치세법 제46조(신용카드 매출세액공제)",
    ],
    changes: [
      { label: "간이과세자 기준", desc: "연 매출 1억 400만원 미만 적용" },
      { label: "납부면제", desc: "간이과세자 연 매출 4,800만원 미만 시 납부의무 면제 (신고의무는 유지)" },
      { label: "신용카드 매출세액공제", desc: "1.3%, 연 1,000만원 한도 (개인사업자 한정)" },
      { label: "업종별 부가가치율", desc: "7개 업종 구분 (소매 15% ~ 금융·전문서비스 40%)" },
    ],
  },
  {
    title: "취득세 계산기",
    href: "/calculator/acquisition-tax",
    laws: [
      "지방세법 제11조(부동산 취득의 세율)",
      "지방세법 제13조의2(다주택자 중과)",
      "지방세특례제한법 제36조의3(생애최초 감면)",
    ],
    changes: [
      { label: "농지 구분 반영", desc: "농지 매매 3% / 비농지 4%, 농지 상속 2.3% / 비농지 2.8% 세율 구분" },
      { label: "생애최초 감면", desc: "취득가액 12억원 이하, 최대 200만원 한도 (2028년까지 연장)" },
      { label: "다주택 중과세율", desc: "조정대상지역 2주택 8%, 3주택+ 12% 반영" },
      { label: "농특세·지방교육세", desc: "85㎡ 초과 주택 농특세, 중과 시 할증세율 자동 적용" },
    ],
  },
  {
    title: "업무용승용차 비용 계산기",
    href: "/calculator/vehicle",
    laws: [
      "법인세법 시행규칙 제27조의2(업무용승용차 관련비용)",
      "소득세법 시행령 제78조의3(업무용승용차 비용)",
    ],
    changes: [
      { label: "비용 한도", desc: "연간 관련비용 1,500만원 한도, 감가상각비 800만원 한도" },
      { label: "리스 감가상각비 상당액", desc: "수선유지비 구분 불가 시 93% 적용" },
      { label: "렌트 감가상각비 상당액", desc: "법정 비율 70% 적용" },
      { label: "운행일지 연동", desc: "작성/미작성 시 경비 인정 차이를 실시간 비교" },
    ],
  },
  {
    title: "4대보험료 계산기",
    href: "/calculator/insurance",
    laws: [
      "국민연금법 시행령, 국민건강보험법 시행령",
      "고용보험 및 산업재해보상보험의 보험료징수 등에 관한 법률",
    ],
    changes: [
      { label: "국민연금 요율 인상", desc: "9% → 9.5% (2026년~)", tag: "변경" },
      { label: "건강보험 요율 인상", desc: "7.09% → 7.19% (2026년~)", tag: "변경" },
      { label: "장기요양보험", desc: "건강보험료의 약 13.14% 적용" },
      { label: "국민연금 상하한", desc: "기준소득월액 상한 637만원, 하한 40만원 (2025.7~2026.6)" },
      { label: "산재보험", desc: "업종별 요율 반영 (10개 업종), 평균 1.47% (2026년 동결)" },
      { label: "비과세 급여", desc: "식대 20만원, 자가운전보조금 20만원, 출산·보육수당 20만원 보수월액 제외 처리" },
      { label: "근로소득 간이세액표", desc: "2026.2.27. 개정 공식 표 lookup (588행), 8~20세 자녀세액공제 자동 차감", tag: "변경" },
    ],
  },
];

export default function UpdatesPage() {
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
        <section className="bg-white pt-12 pb-8 px-5 flex flex-col items-start w-full">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-4 tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            마지막 업데이트: 2026년 4월
          </div>
          <h1 className="text-[26px] font-extrabold text-slate-900 leading-[1.3] tracking-tight mb-3">
            계산기 업데이트 내역
          </h1>
          <p className="text-[15px] font-medium text-slate-500 leading-[1.6] tracking-tight">
            각 계산기에 반영된 최신
            <br />
            세법 개정사항을 확인하세요.
          </p>
        </section>

        {/* 업데이트 카드 6개 */}
        <section className="bg-white px-5 pb-8 flex flex-col gap-4 w-full">
          {updates.map((item, i) => {
            const hasChange = item.changes.some((c) => "tag" in c && c.tag);
            return (
              <article
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 w-full"
              >
                {/* 헤더 */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-900 text-white rounded-md px-2 py-0.5 text-[12px] font-bold tracking-tight">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={item.href}
                      className="no-underline text-[13px] font-semibold text-brand-blue flex items-center gap-0.5 tracking-tight active:opacity-70 transition-opacity"
                    >
                      계산기 바로가기 <span className="text-[14px] leading-none">→</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                      {item.title}
                    </h2>
                    {hasChange && (
                      <span className="bg-red-50 text-red-600 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tracking-tight shrink-0">
                        변경
                      </span>
                    )}
                  </div>
                </div>

                {/* 반영 법령 */}
                <div className="flex flex-col gap-2">
                  {item.laws.map((law, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-blue-500 mt-[2px] shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[13px] font-medium text-slate-600 tracking-tight">
                        {law}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-slate-100" />

                {/* 주요 반영사항 */}
                <div className="flex flex-col gap-2.5">
                  {item.changes.map((c, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-300 mt-2 shrink-0" />
                      <p className="text-[14px] leading-[1.6] tracking-tight flex-1">
                        <span className="font-bold text-slate-800 mr-1.5">{c.label}</span>
                        {"tag" in c && c.tag ? (
                          <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded-[6px] font-semibold text-[13px] tracking-tight">
                            {c.desc}
                          </span>
                        ) : (
                          <span className="text-slate-600">{c.desc}</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        {/* 면책 */}
        <section className="bg-white px-5 pb-12 w-full">
          <div className="bg-slate-50 rounded-[16px] p-5 w-full">
            <p className="text-[14px] font-medium text-slate-500 leading-[1.65] tracking-tight">
              본 페이지의 내용은 참고용이며, 세법은 수시로 개정될 수 있습니다. 정확한 법령 확인은{" "}
              <a
                href="https://www.law.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue underline underline-offset-4 decoration-blue-200"
              >
                국가법령정보센터(law.go.kr)
              </a>
              를 참고하세요.
            </p>
          </div>
        </section>
      </div>

      {/* ── Desktop Content (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block pt-16 pb-12 px-6 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
          <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span className="text-sm font-bold text-brand-blue">마지막 업데이트: 2026년 4월</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
          계산기 업데이트 내역
        </h1>
        <p className="text-lg text-text-secondary font-medium leading-relaxed">
          각 계산기에 반영된 최신 세법 개정사항과 법령 근거를 확인하세요.
        </p>
      </section>

      {/* 타임라인 (PC) */}
      <main className="hidden md:block max-w-4xl mx-auto px-6 pb-32 relative z-10">
        <div className="space-y-12">
          {updates.map((item, i) => (
            <div key={i} className="relative">
              <div className="bg-white rounded-3xl border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,82,255,0.1)] transition-all duration-300 overflow-hidden">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-ui-border bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center text-sm font-extrabold">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="text-lg md:text-xl font-extrabold text-text-primary">{item.title}</h2>
                  </div>
                  <Link href={item.href} className="text-sm font-bold text-brand-blue hover:underline no-underline">
                    계산기 바로가기 →
                  </Link>
                </div>

                <div className="px-6 md:px-8 py-6 space-y-5">
                  <div>
                    <h3 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-2">반영 법령</h3>
                    <ul className="space-y-1">
                      {item.laws.map((law, j) => (
                        <li key={j} className="text-[13px] text-text-secondary leading-relaxed flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-brand-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" /></svg>
                          {law}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-3">주요 반영사항</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.changes.map((change, j) => (
                        <div key={j} className="bg-ui-surface rounded-xl p-4 border border-ui-border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-bold text-text-primary">{change.label}</span>
                            {"tag" in change && change.tag && (
                              <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">{change.tag}</span>
                            )}
                          </div>
                          <p className="text-[13px] text-text-secondary leading-relaxed">{change.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 면책 */}
        <div className="mt-16 text-center">
          <p className="text-[13px] text-text-secondary leading-relaxed max-w-2xl mx-auto">
            본 페이지의 내용은 참고용이며, 세법은 수시로 개정될 수 있습니다.
            정확한 법령 확인은{" "}
            <a href="https://www.law.go.kr" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-medium hover:underline">
              국가법령정보센터(law.go.kr)
            </a>
            를 참고하시기 바랍니다.
          </p>
        </div>
      </main>
    </div>
  );
}

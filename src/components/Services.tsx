import Link from "next/link";
import FadeInOnScroll from "./FadeInOnScroll";

const services = [
  {
    label: "01",
    title: "종합소득세 계산기",
    description:
      "사업소득·근로소득·프리랜서 소득을 입력하면 업종별 경비율을 자동 적용하여 예상 세액을 계산합니다. 3.3% 원천징수 환급액도 바로 확인 가능합니다.",
    result: "업종코드별 경비율 자동 적용, 사업+근로 종합과세 지원",
    shortDesc: "프리랜서·근로·사업 소득 통합 계산",
    href: "/calculator/income-tax",
  },
  {
    label: "02",
    title: "상속·증여세 계산기",
    description:
      "상속재산 규모, 배우자 유무, 자녀 수만 입력하면 기본적인 공제를 적용해서 예상 세액 범위를 보여드립니다. 증여세도 관계별 공제를 자동 반영합니다.",
    result: "상속세·증여세 탭 전환, 세대생략 할증과세 반영",
    shortDesc: "관계별 공제 자동 반영",
    href: "/calculator/inherit-gift",
  },
  {
    label: "03",
    title: "부가가치세 계산기",
    description:
      "일반과세자와 간이과세자 모두 지원합니다. 매출·매입을 입력하면 납부세액을 바로 계산하고, 신용카드 매출세액공제도 자동 반영합니다.",
    result: "일반/간이 탭 전환, 업종별 부가가치율 자동 적용",
    shortDesc: "일반·간이과세자 모두 지원",
    href: "/calculator/vat",
  },
  {
    label: "04",
    title: "취득세 계산기",
    description:
      "주택·농지·토지·상가 취득 시 취득세·지방교육세·농특세를 한번에 계산합니다. 다주택 중과, 조정대상지역, 생애최초 감면까지 반영됩니다.",
    result: "주택 수·조정지역·생애최초 감면 자동 적용",
    shortDesc: "주택 수·조정지역·감면 자동 반영",
    href: "/calculator/acquisition-tax",
  },
  {
    label: "05",
    title: "업무용승용차 비용 계산기",
    description:
      "매입·리스·렌트를 한눈에 비교합니다. 운행일지 작성 여부에 따라 경비 인정 한도가 달라지는 것을 바로 확인할 수 있습니다.",
    result: "매입·리스·렌트 3가지 방식 동시 비교",
    shortDesc: "매입·리스·렌트 동시 비교",
    href: "/calculator/vehicle",
  },
  {
    label: "06",
    title: "4대보험료 계산기",
    description:
      "월 급여와 비과세 항목을 입력하면 국민연금·건강보험·고용보험·산재보험 근로자·사업주 부담분을 자동 계산합니다.",
    result: "비과세 급여 반영, 업종별 산재보험료 포함",
    shortDesc: "근로자·사업주 부담분 분리 계산",
    href: "/calculator/insurance",
  },
];

export default function Services() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section
        id="calculators"
        className="md:hidden bg-white px-5 py-14 w-full"
      >
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[12px] font-bold tracking-wide mb-3">
            무료 세금 계산기
          </span>
          <h2 className="text-[24px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            검색 10번 하는 시간에,
            <br />
            계산 1번이면 끝납니다.
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {services.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              className="no-underline group bg-white rounded-2xl p-5 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.99] transition-all flex items-center gap-4"
            >
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-brand-blue font-bold text-[12px] tracking-wide mb-1">
                  {s.label}
                </span>
                <h3 className="text-[16px] font-extrabold text-slate-900 leading-snug mb-1">
                  {s.title}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 leading-[1.45] tracking-tight">
                  {s.shortDesc}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-slate-400 shrink-0 group-active:text-brand-blue group-active:translate-x-0.5 transition-all"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section
        id="calculators"
        className="hidden md:block relative pt-24 pb-32 px-6 overflow-hidden"
      >
        <div className="bg-grid" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">
              무료 세금 계산기
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
              검색 10번 하는 시간에, 계산 1번이면 끝납니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {services.map((s, i) => (
              <FadeInOnScroll key={i} delay={i * 100}>
                <Link
                  href={s.href}
                  className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,82,255,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col group no-underline h-full"
                >
                  <span className="text-brand-blue font-bold text-sm tracking-wide mb-2 block">
                    {s.label}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary mb-4 leading-snug group-hover:text-brand-blue transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-text-secondary flex-grow mb-4">
                    {s.description}
                  </p>
                  <div className="highlight-box p-3 rounded-xl mt-auto">
                    <p className="text-[13px] text-text-primary flex items-start gap-2">
                      <span className="text-brand-blue font-bold text-base leading-none mt-0.5">→</span>
                      <span>{s.result}</span>
                    </p>
                  </div>
                </Link>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

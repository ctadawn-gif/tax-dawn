import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/income-tax/ContactForm";

const FEES = [
  { type: "일반과세자", price: "11만원" },
  { type: "간이과세자", price: "8.8만원" },
];

const INCLUDED = [
  "매출·매입 자료 정리 및 검토",
  "신용카드·현금영수증 매입세액공제 반영",
  "부가가치세 신고서 작성 및 홈택스 전자신고",
  "대표세무사 2인 크로스체크 후 제출",
];

export default function VatPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ui-border bg-gradient-to-b from-blue-50/50 to-white">
          <div className="max-w-[900px] mx-auto px-5 py-16 lg:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue rounded-full px-3.5 py-1.5 text-[13px] font-bold mb-5 border border-blue-100">
              2026년 1기 확정신고 · 접수 중
            </div>
            <h1 className="text-[30px] lg:text-[46px] font-extrabold text-text-primary tracking-tight leading-[1.2]">
              부가가치세 신고,
              <br />
              세무사가 직접 접수합니다
            </h1>
            <p className="mt-5 text-[16px] lg:text-[18px] text-text-secondary leading-relaxed">
              복잡한 매입·매출, <b className="text-text-primary">대표세무사 2인이 크로스체크</b>로 정확하게.
              <br className="hidden sm:block" />
              신고기한 <b className="text-text-primary">7월 25일</b> — 이름·연락처만 남기면 24시간 내 연락드립니다.
            </p>

            {/* 요금 카드 */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-[560px] mx-auto mt-9">
              {FEES.map((f) => (
                <div
                  key={f.type}
                  className="rounded-2xl border border-ui-border bg-white p-6 shadow-sm"
                >
                  <div className="text-[14px] font-bold text-text-secondary mb-1.5">{f.type}</div>
                  <div className="text-[36px] font-extrabold text-brand-blue leading-none">
                    {f.price}
                    <span className="text-[22px] font-bold text-brand-blue/60 align-top">~</span>
                  </div>
                  <div className="text-[12px] text-slate-400 mt-2">부가세 포함 · 부터</div>
                </div>
              ))}
            </div>
            <p className="text-[12.5px] text-slate-400 mt-3">
              ※ 기본 수수료 기준이며, 매출·업종 규모에 따라 달라질 수 있습니다.
            </p>

            <a
              href="#inquiry-form"
              className="inline-flex items-center gap-2 mt-9 px-7 py-3.5 rounded-xl bg-brand-blue text-white text-[16px] font-bold shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all no-underline"
            >
              지금 신고 접수하기 →
            </a>
          </div>
        </section>

        {/* 포함 내역 */}
        <section className="max-w-[900px] mx-auto px-5 py-14 lg:py-20">
          <h2 className="text-[22px] lg:text-[28px] font-extrabold text-text-primary text-center mb-8">
            접수하면 이렇게 진행됩니다
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-[640px] mx-auto">
            {INCLUDED.map((it, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-ui-border bg-ui-surface p-4"
              >
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[11px] font-bold">
                  ✓
                </span>
                <span className="text-[14px] text-text-primary font-medium leading-snug">{it}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[13px] text-text-secondary mt-6">
            ※ 자료가 준비되지 않으셨어도 접수 후 안내해 드립니다. 기한후신고도 가능합니다.
          </p>
        </section>

        {/* 접수 폼 */}
        <div className="border-t border-ui-border bg-white">
          <ContactForm variant="vat" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

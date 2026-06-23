import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Resource = {
  title: string;
  desc: string;
  href?: string;
  icon: string;
  badge?: string;
  ready: boolean;
};

const RESOURCES: Resource[] = [
  {
    title: "차용증 자동작성",
    desc: "빈칸만 채우면 금전소비대차 계약서가 완성됩니다. 가족 간 차용 증여세 안전선(4.6%·무이자 2.17억)과 상환계획까지 자동 점검.",
    href: "/loan-agreement",
    icon: "📄",
    badge: "NEW",
    ready: true,
  },
  {
    title: "준비 중",
    desc: "실무에 바로 쓰는 세무 서식·자료를 계속 추가하고 있습니다.",
    icon: "⏳",
    ready: false,
  },
  {
    title: "준비 중",
    desc: "필요하신 자료가 있으면 상담·블로그로 알려주세요.",
    icon: "⏳",
    ready: false,
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-5 lg:px-10 py-10 lg:py-14">
        <header className="mb-9">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue rounded-full px-3 py-1.5 text-[13px] font-semibold mb-3">
            세무회계 새벽 · 무료 제공
          </div>
          <h1 className="text-[28px] lg:text-[38px] font-extrabold text-text-primary tracking-tight">
            자료실
          </h1>
          <p className="mt-3 text-[15px] lg:text-[16px] text-text-secondary leading-relaxed">
            실무에 바로 쓰는 무료 서식·자료를 모았습니다. 로그인 없이 사용하세요.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESOURCES.map((r, i) =>
            r.ready && r.href ? (
              <Link
                key={i}
                href={r.href}
                className="group block rounded-2xl border border-ui-border bg-white p-6 hover:border-brand-blue hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[22px]">
                    {r.icon}
                  </div>
                  {r.badge && (
                    <span className="text-[11px] font-extrabold text-brand-blue bg-blue-50 rounded-full px-2 py-1">
                      {r.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-[16px] font-extrabold text-text-primary mb-1.5 group-hover:text-brand-blue">
                  {r.title}
                </h2>
                <p className="text-[13px] text-text-secondary leading-relaxed mb-3">{r.desc}</p>
                <span className="text-[13px] font-bold text-brand-blue">바로 작성하기 →</span>
              </Link>
            ) : (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-ui-border bg-ui-surface/60 p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-[22px] mb-3 opacity-70">
                  {r.icon}
                </div>
                <h2 className="text-[16px] font-extrabold text-slate-400 mb-1.5">{r.title}</h2>
                <p className="text-[13px] text-slate-400 leading-relaxed">{r.desc}</p>
              </div>
            )
          )}
        </div>

        <p className="mt-8 text-[13px] text-text-secondary">
          원하는 자료가 있으신가요?{" "}
          <a
            href="https://blog.naver.com/tax_dawn"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-blue hover:underline"
          >
            블로그로 알려주세요 →
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
}

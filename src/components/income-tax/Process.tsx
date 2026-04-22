type Step = {
  title: string;
  body: React.ReactNode;
  final?: boolean;
};

const STEPS: Step[] = [
  {
    title: "무료상담",
    body:
      "카카오톡·전화·이메일 중 편한 방법으로 문의주시면, 신고 유형과 대략적인 수수료를 안내드립니다.",
  },
  {
    title: "홈택스 수임동의",
    body: (
      <>
        공동인증서나 간편인증으로 홈택스 로그인 → 수임동의 절차 진행. 어려우시면 1:1로 안내해드립니다.{" "}
        <span className="text-slate-400 font-medium">(2~3분 소요)</span>
      </>
    ),
  },
  {
    title: "서류 제출",
    body: "준비 서류 목록을 받아 하나씩 전달. 영수증이 부족해도 통장·카드내역으로 복원 가능합니다.",
  },
  {
    title: "신고서 작성 + 크로스체크",
    body:
      "담당 세무사가 신고서를 작성하면, 다른 대표세무사가 전체를 다시 검토합니다. 최종 세액을 미리 안내드리고 확정합니다.",
  },
  {
    title: "신고 완료 + 환급",
    body: "전자신고 완료 후 결과를 공유드립니다. 환급 대상이면 약 4~6주 내 환급계좌로 입금됩니다.",
    final: true,
  },
];

type MobileStep = {
  title: string;
  lines: string[];
  final?: boolean;
};

const MOBILE_STEPS: MobileStep[] = [
  {
    title: "무료상담",
    lines: ["카카오톡·전화·이메일로 문의.", "신고 유형과 수수료를 안내드립니다."],
  },
  {
    title: "홈택스 수임동의",
    lines: ["간편인증으로 홈택스 로그인.", "2~3분 소요, 어려우면 1:1 안내."],
  },
  {
    title: "서류 제출",
    lines: ["준비 서류 하나씩 전달.", "영수증 없어도 내역으로 복원 가능."],
  },
  {
    title: "신고서 작성 + 크로스체크",
    lines: ["담당 세무사가 작성.", "다른 세무사가 다시 검토."],
  },
  {
    title: "신고 완료 + 환급",
    lines: ["전자신고 완료 후 결과 공유.", "환급은 4~6주 내 입금."],
    final: true,
  },
];

export default function Process() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-white px-5 py-16 w-full">
        <div className="mb-14">
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            상담부터 신고 완료까지
          </h2>
          <p className="text-[15px] font-medium text-slate-500 mt-2.5 tracking-tight leading-[1.4]">
            필요한 건 5단계뿐입니다.
          </p>
        </div>

        <div className="flex flex-col gap-10 w-full">
          {MOBILE_STEPS.map((step, idx) => {
            const isFinal = step.final;
            const isLast = idx === MOBILE_STEPS.length - 1;
            const stepNum = idx + 1;
            return (
              <div key={idx} className="flex gap-[18px] items-start relative w-full">
                {/* 연결선 (마지막 단계 제외) */}
                {!isLast && (
                  <div className="absolute left-[25px] top-[40px] bottom-[-45px] w-[2px] bg-blue-100 z-0" />
                )}

                {/* 번호 원 */}
                <div
                  className={
                    isFinal
                      ? "w-[52px] h-[52px] rounded-full bg-brand-blue border-[2px] border-brand-blue flex items-center justify-center shrink-0 relative z-10 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                      : "w-[52px] h-[52px] rounded-full bg-white border-[2px] border-brand-blue flex items-center justify-center shrink-0 relative z-10 shadow-sm"
                  }
                >
                  <span
                    className={
                      isFinal
                        ? "text-[20px] font-extrabold text-white mt-[1px]"
                        : "text-[20px] font-extrabold text-brand-blue mt-[1px]"
                    }
                  >
                    {stepNum}
                  </span>
                </div>

                {/* 본문 */}
                <div className="pt-[2px] pb-1 w-full">
                  <span
                    className={
                      isFinal
                        ? "text-[12px] font-bold text-brand-blue tracking-wider"
                        : "text-[12px] font-bold text-slate-400 tracking-wider"
                    }
                  >
                    {`STEP ${String(stepNum).padStart(2, "0")}`}
                  </span>
                  <h3
                    className={
                      isFinal
                        ? "text-[17px] font-extrabold text-brand-blue mt-1 mb-2 tracking-tight"
                        : "text-[17px] font-extrabold text-slate-900 mt-1 mb-2 tracking-tight"
                    }
                  >
                    {step.title}
                  </h3>
                  <p
                    className={
                      isFinal
                        ? "text-[14px] font-medium text-slate-700 leading-[1.5] tracking-tight"
                        : "text-[14px] font-medium text-slate-600 leading-[1.5] tracking-tight"
                    }
                  >
                    {step.lines.map((line, i) => (
                      <span key={i} className={i === 0 ? "block" : "block mt-0.5"}>
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 max-w-[800px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
            상담부터 신고 완료까지
          </h2>
          <p className="text-[18px] text-text-secondary font-medium">
            복잡한 절차는 저희가 안내드립니다. 필요한 건 5단계뿐입니다.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[31px] md:left-[39px] top-6 bottom-6 w-0.5 bg-blue-100" />

          <div className="space-y-12 relative z-10">
            {STEPS.map((step, idx) => {
              const isFirst = idx === 0;
              const isFinal = step.final;
              return (
                <div key={idx} className="flex gap-6 md:gap-8 group">
                  <div
                    className={
                      isFinal
                        ? "w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-blue text-white font-extrabold text-[20px] md:text-[24px] flex items-center justify-center shrink-0 shadow-md"
                        : isFirst
                          ? "w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-brand-blue text-brand-blue font-extrabold text-[20px] md:text-[24px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105"
                          : "w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-slate-200 text-slate-400 font-extrabold text-[20px] md:text-[24px] flex items-center justify-center shrink-0 shadow-sm transition-colors group-hover:border-brand-blue group-hover:text-brand-blue"
                    }
                  >
                    {idx + 1}
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h4 className="text-[18px] md:text-[20px] font-bold text-text-primary mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

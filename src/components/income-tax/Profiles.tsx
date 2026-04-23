import Image from "next/image";

type Profile = {
  name: string;
  photo: string;
  /** object-position for portrait cropping */
  objectPosition: string;
  specialties: string[];
  phone: string;
  phoneHref: string;
  email: string;
};

const PROFILES: Profile[] = [
  {
    name: "김근량",
    photo: "/kim.jpg",
    objectPosition: "60% top",
    specialties: [
      "종합소득세 · 부가가치세",
      "사업자 기장대행",
      "법인세",
    ],
    phone: "010-3262-3295",
    phoneHref: "tel:01032623295",
    email: "cta.ryang@gmail.com",
  },
  {
    name: "고유빈",
    photo: "/ko.jpg",
    objectPosition: "top",
    specialties: [
      "상속세 · 증여세",
      "자금조달계획서 · 자금출처 소명",
      "양도소득세",
    ],
    phone: "010-9374-4916",
    phoneHref: "tel:01093744916",
    email: "cta.dawn@gmail.com",
  },
];

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-brand-blue"
    >
      <path
        fillRule="evenodd"
        d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 text-slate-400"
    >
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );
}

export default function Profiles() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-slate-50 px-5 py-14 w-full">
        <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight mb-8">
          담당 세무사 소개
        </h2>

        <div className="flex flex-col gap-4">
          {PROFILES.map((profile) => (
            <div
              key={profile.name}
              className="bg-white rounded-[20px] p-6 flex flex-col items-center border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              {/* 원형 사진 */}
              <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-[5px] border-blue-50 mb-5 shadow-sm bg-slate-100">
                <Image
                  src={profile.photo}
                  alt={`${profile.name} 대표세무사`}
                  width={130}
                  height={130}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: profile.objectPosition }}
                />
              </div>

              {/* 이름 + 뱃지 */}
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
                  {profile.name}
                </h3>
                <span className="bg-slate-900 text-white text-[11.5px] font-semibold px-2 py-0.5 rounded tracking-tight">
                  대표세무사
                </span>
              </div>

              {/* 전문 분야 pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                {profile.specialties.map((s) => (
                  <span
                    key={s}
                    className="bg-blue-50/70 text-brand-blue text-[13px] font-semibold px-3 py-1.5 rounded-full tracking-tight whitespace-nowrap"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* 구분선 */}
              <div className="w-full h-[1px] bg-slate-100 mb-5" />

              {/* 연락처 */}
              <div className="flex flex-col items-center gap-2.5">
                <a
                  href={profile.phoneHref}
                  className="no-underline flex items-center gap-1.5 text-[18px] font-bold text-slate-800 tracking-tight active:text-brand-blue transition-colors"
                >
                  <PhoneIcon />
                  {profile.phone}
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="no-underline flex items-center gap-1.5 text-[14px] font-medium text-slate-500 tracking-tight"
                >
                  <MailIcon />
                  {profile.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 bg-ui-surface border-y border-ui-border">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
              담당 세무사 소개
            </h2>
            <p className="text-[18px] text-text-secondary font-medium">
              신고서를 쓰는 사람도, 검토하는 사람도 대표세무사입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PROFILES.map((profile) => (
              <div
                key={profile.name}
                className="bg-white rounded-[28px] border border-ui-border p-8 md:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center text-center"
              >
                <div className="w-40 h-40 md:w-44 md:h-44 rounded-full overflow-hidden mb-6 border-4 border-blue-50 shrink-0">
                  <Image
                    src={profile.photo}
                    alt={`${profile.name} 세무사`}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: profile.objectPosition }}
                  />
                </div>

                <h3 className="text-[26px] font-extrabold text-text-primary mb-1">
                  {profile.name} 세무사
                </h3>
                <p className="text-[14px] text-brand-blue font-bold mb-6">대표세무사</p>

                <div className="w-full mb-6">
                  <p className="text-[12px] font-bold text-slate-400 tracking-[0.15em] uppercase mb-3">
                    전문 분야
                  </p>
                  <ul className="space-y-1.5 text-[15px] font-medium text-text-secondary">
                    {profile.specialties.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="w-full pt-6 border-t border-ui-border/60 space-y-2">
                  <a
                    href={profile.phoneHref}
                    className="flex items-center justify-center gap-2 text-[15px] font-bold text-text-primary hover:text-brand-blue transition-colors no-underline"
                  >
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {profile.phone}
                  </a>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-center gap-2 text-[14px] text-text-secondary hover:text-brand-blue transition-colors no-underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {profile.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

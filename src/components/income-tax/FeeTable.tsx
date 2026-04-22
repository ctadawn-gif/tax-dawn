type Row = {
  label: string;
  sub?: string;
  price: string;
  emphasize?: boolean;
};

const ROWS: Row[] = [
  { label: "단순경비율 대상자", price: "100,000원" },
  { label: "간편장부", sub: "(연소득 3천만 원 이하)", price: "200,000원" },
  { label: "간편장부", sub: "(연소득 7천만 원 이하)", price: "300,000원" },
  { label: "간편장부", sub: "(연소득 7천만 원 초과)", price: "400,000원" },
  { label: "복식부기의무자", price: "별도 문의", emphasize: true },
];

const PC_NOTES = [
  "모든 금액은 부가가치세 별도",
  "다수 사업장 소득·근로소득·기타소득 합산 시 추가 비용 발생",
  "복식부기의무자로서 기장 미진행 시 소급기장 비용 별도",
  "프리랜서도 전년도 소득금액에 따라 복식부기의무자에 해당 가능",
];

type MobileRow = {
  label: string;
  price: string;
  emphasize?: boolean;
};

const MOBILE_ROWS: MobileRow[] = [
  { label: "단순경비율 대상자", price: "100,000원" },
  { label: "간편장부 (3천만원 이하)", price: "200,000원" },
  { label: "간편장부 (7천만원 이하)", price: "300,000원" },
  { label: "간편장부 (7천만원 초과)", price: "400,000원" },
  { label: "복식부기의무자", price: "별도 문의", emphasize: true },
];

const MOBILE_NOTES = [
  "모든 금액 부가가치세 별도",
  "합산 소득 시 추가 비용 발생",
  "기장 미진행 시 소급기장 비용 별도",
  "프리랜서도 복식부기의무자 해당 가능",
];

export default function FeeTable() {
  return (
    <>
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-white px-5 py-14 w-full">
        {/* 타이틀 */}
        <div className="mb-6">
          <h2 className="text-[26px] font-extrabold text-slate-900 leading-[1.35] tracking-tight">
            수수료를 투명하게
            <br />
            공개합니다.
          </h2>
          <p className="text-[15px] font-medium text-slate-500 mt-2.5 tracking-tight">
            프리랜서(3.3% 원천징수) 기준
          </p>
        </div>

        {/* 할인 배너 */}
        <div className="bg-brand-blue rounded-xl py-3 px-4 mb-8 flex items-center justify-center shadow-md shadow-blue-500/20">
          <span className="text-[14px] font-bold text-white tracking-tight whitespace-nowrap">
            💰 4월 30일 이내 접수 시 2만원 할인
          </span>
        </div>

        {/* 수수료 리스트 카드 */}
        <div className="border border-slate-200 rounded-[14px] overflow-hidden mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col">
            {MOBILE_ROWS.map((row, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-4 py-4 ${
                  row.emphasize
                    ? "bg-slate-50"
                    : "bg-white border-b border-slate-100"
                }`}
              >
                <span
                  className={`text-[14px] tracking-tight whitespace-nowrap ${
                    row.emphasize ? "font-bold text-slate-700" : "font-medium text-slate-600"
                  }`}
                >
                  {row.label}
                </span>
                <span
                  className={`tracking-tight whitespace-nowrap ${
                    row.emphasize
                      ? "text-[16px] font-bold text-slate-800"
                      : "text-[17px] font-extrabold text-slate-900"
                  }`}
                >
                  {row.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 사업자 등록 안내 */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-1.5 mb-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-amber-500"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[15px] font-bold text-amber-900 tracking-tight whitespace-nowrap">
              사업자 등록이 있으신가요?
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-amber-800/90 tracking-tight whitespace-nowrap font-medium">
              업종·매출·기장 여부에 따라 수수료가 달라집니다.
            </p>
            <p className="text-[13px] text-amber-800/90 tracking-tight whitespace-nowrap font-medium">
              상담 폼으로 문의 주시면 맞춤 안내드려요.
            </p>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-slate-50/80 rounded-xl p-4 mb-8">
          <ul className="flex flex-col gap-1.5">
            {MOBILE_NOTES.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-[12px] font-bold text-slate-400">·</span>
                <span className="text-[12.5px] text-slate-500 tracking-tight whitespace-nowrap font-medium">
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <a
          href="#inquiry-form"
          className="no-underline w-full h-[56px] bg-brand-blue text-white rounded-[14px] flex items-center justify-center text-[16px] font-bold tracking-tight shadow-[0_8px_16px_-4px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-transform"
        >
          수수료 상담하기
        </a>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section className="hidden md:block py-24 px-5 max-w-[760px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
            수수료를 투명하게 공개합니다
          </h2>
          <p className="text-[18px] text-text-secondary font-medium">
            아래는 <strong className="text-text-primary">프리랜서(3.3% 원천징수)</strong> 기준 수수료입니다.
          </p>
        </div>

        <div className="bg-white rounded-[24px] border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] overflow-hidden mb-6 relative">
          <div className="bg-blue-50 border-b border-blue-100 p-4 text-center">
            <p className="text-brand-blue font-bold text-[15px]">
              💰 4월 30일 이내 접수 + 입금 완료 시 2만 원 할인
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-ui-surface border-b border-ui-border">
                <tr>
                  <th className="py-3 px-5 font-semibold text-text-secondary text-[13px] uppercase tracking-wider w-[62%]">
                    구분
                  </th>
                  <th className="py-3 px-5 font-semibold text-text-secondary text-[13px] uppercase tracking-wider text-right w-[38%]">
                    수수료
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border">
                {ROWS.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      row.emphasize
                        ? "bg-slate-50 border-t-2 border-ui-border"
                        : "hover:bg-slate-50 transition-colors"
                    }
                  >
                    <td className="py-3.5 px-5">
                      <strong className="text-text-primary font-bold text-[15px]">{row.label}</strong>
                      {row.sub && (
                        <span className="text-text-secondary text-[13px] ml-1.5">{row.sub}</span>
                      )}
                    </td>
                    <td
                      className={`py-3.5 px-5 text-right ${
                        row.emphasize
                          ? "font-bold text-text-secondary text-[15px]"
                          : "font-extrabold text-text-primary text-[17px]"
                      }`}
                    >
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-[20px] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-amber-900 mb-1">
              사업자 등록이 있으신가요?
            </p>
            <p className="text-[14px] text-amber-800 leading-relaxed">
              업종·매출·기장 여부에 따라 수수료가 <strong>위 표와 다르게</strong> 책정됩니다. 톡톡이나 아래 상담 폼으로 문의 주시면 맞춤 안내드립니다.
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-[13px] text-text-secondary mb-10 bg-ui-surface p-6 rounded-[16px] border border-ui-border">
          {PC_NOTES.map((note, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-slate-400">·</span> {note}
            </li>
          ))}
        </ul>

        <div className="text-center">
          <a
            href="#inquiry-form"
            className="inline-flex px-8 py-4 rounded-xl text-[16px] font-bold bg-brand-navy text-white hover:bg-slate-800 transition-all shadow-sm no-underline"
          >
            수수료 상담하기
          </a>
        </div>
      </section>
    </>
  );
}

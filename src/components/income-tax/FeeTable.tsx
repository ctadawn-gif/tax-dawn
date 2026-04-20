const TALK_URL = "https://talk.naver.com/ct/wbwmjv1?frm=mnmb&frm=nmb_detail#nafullscreen";

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

const NOTES = [
  "모든 금액은 부가가치세 별도",
  "다수 사업장 소득·근로소득·기타소득 합산 시 추가 비용 발생",
  "복식부기의무자로서 기장 미진행 시 소급기장 비용 별도",
  "프리랜서도 전년도 소득금액에 따라 복식부기의무자에 해당 가능",
];

export default function FeeTable() {
  return (
    <section className="py-24 px-5 max-w-[760px] mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-text-primary mb-4">
          수수료를 투명하게 공개합니다
        </h2>
        <p className="text-[18px] text-text-secondary font-medium">
          프리랜서(3.3% 원천징수) 기준 수수료입니다.
          <br />
          사업자 등록이 있으신 경우 별도 상담드립니다.
        </p>
      </div>

      <div className="bg-white rounded-[24px] border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] overflow-hidden mb-8 relative">
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

      <ul className="space-y-2 text-[13px] text-text-secondary mb-10 bg-ui-surface p-6 rounded-[16px] border border-ui-border">
        {NOTES.map((note, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-slate-400">·</span> {note}
          </li>
        ))}
      </ul>

      <div className="text-center">
        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-8 py-4 rounded-xl text-[16px] font-bold bg-brand-navy text-white hover:bg-slate-800 transition-all shadow-sm no-underline"
        >
          수수료 상담하기
        </a>
      </div>
    </section>
  );
}

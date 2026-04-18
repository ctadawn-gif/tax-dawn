import Link from "next/link";

const calculators = [
  { name: "종합소득세", href: "/calculator/income-tax" },
  { name: "상속·증여세", href: "/calculator/inherit-gift" },
  { name: "취득세", href: "/calculator/acquisition-tax" },
  { name: "업무용승용차", href: "/calculator/vehicle" },
  { name: "4대보험료", href: "/calculator/insurance" },
];

export default function ProductPreview() {
  return (
    <div className="max-w-[1100px] mx-auto mb-16 bg-white border border-ui-border rounded-3xl p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative z-10">
      <div className="bg-ui-surface rounded-t-2xl px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-ui-border gap-3">
        <div className="flex gap-2 flex-wrap">
          {calculators.map((calc) => (
            <Link
              key={calc.name}
              href={calc.href}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold text-text-secondary hover:bg-white hover:text-brand-blue hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all no-underline"
            >
              {calc.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-10 text-center">
        <p className="text-text-secondary text-[15px] mb-6">
          세금이 대략 어느 정도인지 궁금하신가요?<br />
          아래 계산기 중 하나를 선택해서 바로 확인해보세요.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-[700px] mx-auto">
          {calculators.map((calc) => (
            <Link
              key={calc.name}
              href={calc.href}
              className="px-5 py-3.5 bg-ui-surface border border-ui-border rounded-xl text-[14px] font-bold text-text-primary hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all no-underline text-center"
            >
              {calc.name} 계산기 →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const fmt = (v: number) => Math.round(v).toLocaleString("ko-KR");
const num = (v: string | number) =>
  v === "" || v == null ? 0 : Number(v);

type CalcResult = {
  dep: number;
  total: number;
  tag: string;
  r: number;
  biz: number;
  d1: number;
  bd: number;
  d2: number;
  ok: number;
  deny: number;
};

function calc(
  method: string,
  price: number,
  mo: number,
  maint: number,
  log: boolean,
  pct: number
): CalcResult | null {
  let dep: number, total: number, tag: string;
  if (method === "buy") {
    dep = price / 5;
    total = dep + maint;
    tag = "감가상각비";
  } else if (method === "lease") {
    const y = mo * 12;
    dep = y * 0.93;
    total = y + maint;
    tag = "감가상각비 상당액(93%)";
  } else {
    const y = mo * 12;
    dep = y * 0.7;
    total = y + maint;
    tag = "감가상각비 상당액(70%)";
  }
  if (total === 0) return null;
  const r = log ? pct / 100 : total <= 1500 ? 1 : 1500 / total;
  const biz = total * r,
    d1 = total - biz,
    bd = dep * r,
    d2 = Math.max(0, bd - 800);
  return { dep, total, tag, r, biz, d1, bd, d2, ok: biz - d2, deny: d1 + d2 };
}

function InputField({
  label,
  sub,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  sub?: string;
  value: number | string;
  onChange: (v: number | string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-text-secondary mb-2">
        {label}
        {sub && <span className="text-xs font-normal text-slate-400 ml-1">{sub}</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-3.5 bg-ui-surface border border-ui-border rounded-xl focus:bg-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-right font-bold text-text-primary text-[15px]"
        />
        <span className="absolute right-4 top-3.5 text-text-secondary text-sm font-medium">
          만원
        </span>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  icon,
  res,
  entity,
  cmpD1,
}: {
  title: string;
  icon: React.ReactNode;
  res: CalcResult | null;
  entity: string;
  cmpD1: number | null;
}) {
  if (!res)
    return (
      <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col opacity-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        </div>
        <div className="text-sm text-text-secondary text-center py-8">
          금액을 입력해주세요
        </div>
      </div>
    );

  const saved = cmpD1 != null ? cmpD1 - res.d1 : 0;

  return (
    <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,82,255,0.15)] transition-all duration-300 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-baseline">
          <span className="text-[13px] text-text-secondary">{res.tag}</span>
          <span className="text-[15px] font-semibold text-text-primary">{fmt(res.dep)}만원</span>
        </div>
        <div className="flex justify-between items-baseline pb-4 border-b border-ui-border">
          <span className="text-[13px] text-text-secondary">관련비용 총액</span>
          <span className="text-[15px] font-semibold text-text-primary">{fmt(res.total)}만원</span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-[13px] text-text-secondary">업무무관 부인액</span>
          <div className="text-right">
            <span className={`text-lg font-bold ${res.d1 > 0 ? "text-red-500" : "text-green-600"}`}>
              {fmt(res.d1)}만원
            </span>
            <div className={`text-[11px] ${res.d1 > 0 ? "text-red-400" : "text-green-500"}`}>
              {res.d1 > 0
                ? entity === "corp" ? "대표자 급여 합산" : "경비 불인정(소멸)"
                : "없음"}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-[13px] text-text-secondary">감가상각비 한도초과</span>
          <div className="text-right">
            <span className={`text-[15px] font-semibold ${res.d2 > 0 ? "text-brand-blue" : "text-green-600"}`}>
              {fmt(res.d2)}만원
            </span>
            <div className={`text-[11px] ${res.d2 > 0 ? "text-brand-blue" : "text-green-500"}`}>
              {res.d2 > 0 ? "이월 가능" : "없음"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-brand-navy rounded-xl p-5 text-center">
        <div className="text-[12px] text-white/60 mb-1">세법상 인정 경비</div>
        <div className="text-[28px] font-extrabold text-white tracking-tight">
          {fmt(res.ok)}<span className="text-sm font-medium ml-0.5">만원</span>
        </div>
        <div className="text-[11px] text-white/40 mt-1">
          부인액 합계: {fmt(res.deny)}만원
        </div>
      </div>

      {saved > 0 && (
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
          <div className="text-[11px] text-brand-blue">운행일지 작성 시 절감</div>
          <div className="text-[16px] font-bold text-brand-blue">{fmt(saved)}만원</div>
        </div>
      )}
    </div>
  );
}

const BuyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const LeaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const RentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function VehicleCalculator() {
  const [buyPrice, setBuyPrice] = useState<number | string>(8000);
  const [buyMaint, setBuyMaint] = useState<number | string>(500);
  const [leaseMo, setLeaseMo] = useState<number | string>("");
  const [leaseMaint, setLeaseMaint] = useState<number | string>("");
  const [rentMo, setRentMo] = useState<number | string>("");
  const [rentMaint, setRentMaint] = useState<number | string>("");
  const [log, setLog] = useState(false);
  const [pct, setPct] = useState<number | string>(80);
  const [ent, setEnt] = useState("person");

  const buyRes = useMemo(() => num(buyPrice) > 0 ? calc("buy", num(buyPrice), 0, num(buyMaint), log, num(pct)) : null, [buyPrice, buyMaint, log, pct]);
  const leaseRes = useMemo(() => num(leaseMo) > 0 ? calc("lease", 0, num(leaseMo), num(leaseMaint), log, num(pct)) : null, [leaseMo, leaseMaint, log, pct]);
  const rentRes = useMemo(() => num(rentMo) > 0 ? calc("rent", 0, num(rentMo), num(rentMaint), log, num(pct)) : null, [rentMo, rentMaint, log, pct]);

  const buyCmp = useMemo(() => log && num(buyPrice) > 0 ? calc("buy", num(buyPrice), 0, num(buyMaint), false, 0) : null, [buyPrice, buyMaint, log]);
  const leaseCmp = useMemo(() => log && num(leaseMo) > 0 ? calc("lease", 0, num(leaseMo), num(leaseMaint), false, 0) : null, [leaseMo, leaseMaint, log]);
  const rentCmp = useMemo(() => log && num(rentMo) > 0 ? calc("rent", 0, num(rentMo), num(rentMaint), false, 0) : null, [rentMo, rentMaint, log]);

  const anyResult = buyRes || leaseRes || rentRes;
  const noLogWarning = !log && anyResult && (buyRes?.d1! > 0 || leaseRes?.d1! > 0 || rentRes?.d1! > 0);
  const noLogSafe = !log && anyResult && !noLogWarning && ((buyRes && buyRes.d1 === 0) || (leaseRes && leaseRes.d1 === 0) || (rentRes && rentRes.d1 === 0));

  return (
    <div className="min-h-screen bg-white relative">
      <div className="bg-grid" />

      {/* 네비게이션 */}
      <nav className="flex justify-between items-center px-6 lg:px-20 py-5 max-w-[1440px] mx-auto bg-white relative z-20">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-text-primary">
          세무회계 새벽
        </Link>
        <a
          href="https://m.expert.naver.com/expert/profile/home?storeId=100058445&u=%2FPXSLGf999lYdP5IwsGyCb6FWam%2FygHjBfMrSAjEZzI%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-md text-sm font-semibold bg-brand-navy text-white hover:bg-black transition-colors shadow-sm"
        >
          상담 예약하기
        </a>
      </nav>

      <div className="max-w-[1200px] w-full mx-auto px-6 pt-12 pb-20 relative z-10">
        {/* 타이틀 */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">
            무료 세금 계산기
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight mb-4">
            업무용승용차 비용 계산기
          </h1>
          <p className="text-lg text-text-secondary font-medium">
            매입 · 리스 · 렌트를 한눈에 비교해보세요
          </p>
        </div>

        {/* 설정 바 */}
        <div className="bg-white rounded-2xl px-5 md:px-8 py-5 border border-ui-border shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {[
              { k: "corp", l: "법인" },
              { k: "person", l: "개인" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setEnt(t.k)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm transition-all ${
                  ent === t.k
                    ? "bg-white shadow-sm font-bold text-brand-blue"
                    : "font-medium text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-semibold text-text-primary">운행일지 작성</span>
              <button
                onClick={() => setLog(!log)}
                className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${log ? "bg-brand-blue" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute w-5 h-5 rounded-full bg-white top-[2px] shadow transition-all duration-200 ${log ? "left-[26px]" : "left-[2px]"}`}
                />
              </button>
            </div>

            {log && (
              <div className="flex items-center gap-3">
                <label className="text-[15px] font-semibold text-text-primary">업무사용비율</label>
                <div className="relative w-24">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={pct}
                    onChange={(e) => setPct(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-ui-border rounded-lg focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-right font-bold text-text-primary transition-colors shadow-sm"
                  />
                  <span className="absolute right-3 top-2 text-text-secondary font-medium">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 입력 카드 3열 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center"><BuyIcon /></div>
              <h3 className="text-xl font-bold text-text-primary">차량 매입</h3>
            </div>
            <div className="space-y-5">
              <InputField label="차량 매입가액" sub="(취등록세 포함)" value={buyPrice} onChange={setBuyPrice} placeholder="8000" />
              <InputField label="연간 유지비" sub="(주유, 보험, 수리 등)" value={buyMaint} onChange={setBuyMaint} placeholder="500" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center"><LeaseIcon /></div>
              <h3 className="text-xl font-bold text-text-primary">리스</h3>
            </div>
            <div className="space-y-5">
              <InputField label="리스 월 이용료" value={leaseMo} onChange={setLeaseMo} placeholder="150" />
              <InputField label="연간 유지비" sub="(주유, 보험, 수리 등)" value={leaseMaint} onChange={setLeaseMaint} placeholder="300" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ui-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-brand-blue/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center"><RentIcon /></div>
              <h3 className="text-xl font-bold text-text-primary">렌트</h3>
            </div>
            <div className="space-y-5">
              <InputField label="렌트 월 이용료" value={rentMo} onChange={setRentMo} placeholder="130" />
              <InputField label="연간 유지비" sub="(주유, 보험, 수리 등)" value={rentMaint} onChange={setRentMaint} placeholder="200" />
            </div>
          </div>
        </div>

        {/* 결과 카드 3열 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ResultCard title="매입 결과" icon={<BuyIcon />} res={buyRes} entity={ent} cmpD1={buyCmp?.d1 ?? null} />
          <ResultCard title="리스 결과" icon={<LeaseIcon />} res={leaseRes} entity={ent} cmpD1={leaseCmp?.d1 ?? null} />
          <ResultCard title="렌트 결과" icon={<RentIcon />} res={rentRes} entity={ent} cmpD1={rentCmp?.d1 ?? null} />
        </div>

        {/* 안내 */}
        {noLogWarning && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 mb-6">
            <div className="text-[14px] text-red-500 font-semibold mb-1">
              운행일지를 작성하면 업무무관 부인액을 줄일 수 있습니다
            </div>
            <div className="text-[13px] text-text-primary leading-relaxed">
              위 토글을 켜고 업무사용비율을 입력하면 절감 효과를 바로 확인할 수 있습니다.
            </div>
          </div>
        )}
        {noLogSafe && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 mb-6">
            <div className="text-[14px] text-green-600 font-semibold">
              관련비용이 1,500만원 이하 — 운행일지 없이도 전액 인정
            </div>
          </div>
        )}

        {/* 참고사항 */}
        <div className="bg-white rounded-2xl px-6 py-5 mb-8 border border-ui-border shadow-sm">
          <div className="text-[14px] font-bold text-text-primary mb-3">참고사항</div>
          <ul className="m-0 pl-4 text-[12px] text-text-secondary leading-[2] list-disc">
            <li>복식부기의무자에게 적용되는 규정입니다 (간편장부 대상자 미적용)</li>
            <li>경차 · 9인승 이상 · 화물차는 적용 제외</li>
            <li>리스 감가상각비 상당액: 수선유지비 구분 불가 시 93% (법인세법 시행규칙 제27조의2)</li>
            <li>렌트 감가상각비 상당액: 법정 비율 70% (법인세법 시행규칙 제27조의2)</li>
            <li>한도(1,500만원 · 800만원)는 보유 월수 안분 대상입니다</li>
            <li>실제 신고 시 개별 계약 조건과 보유 기간에 따라 달라질 수 있습니다</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-8 border border-ui-border shadow-sm text-center mb-8">
          <p className="text-[15px] text-text-secondary mb-6">
            계산기로 간단하게 확인해보셨다면, 정확한 비용 처리는 세무사와 상담하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-[480px] mx-auto">
            <a
              href="tel:010-3262-3295"
              className="flex-1 px-6 py-3.5 bg-brand-blue text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 transition-colors text-center"
            >
              전화 상담: 010-3262-3295
            </a>
            <a
              href="https://blog.naver.com/tax_dawn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3.5 bg-white text-text-primary border-2 border-ui-border rounded-xl text-[14px] font-bold hover:border-brand-blue hover:text-brand-blue transition-colors text-center"
            >
              블로그에서 사례 보기
            </a>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center text-[11px] text-text-secondary leading-relaxed py-4">
          <div className="font-semibold mb-0.5">세무회계 새벽</div>
          고유빈 세무사 · 김근량 세무사<br />
          서울 송파구 위례서로 252 유원플러스송파 610호<br /><br />
          이 계산기는 참고용이며, 실제 신고 시에는 개별 사실관계에 따라 결과가 달라질 수 있습니다.
        </div>
      </div>
    </div>
  );
}

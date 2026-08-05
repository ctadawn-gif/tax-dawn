"use client";

import { useState, useEffect, useMemo } from "react";

/**
 * 공동주택 공시가격 찾기
 *
 * 국토교통부 공동주택가격 공개데이터(AL_D167)를 법정동 단위 JSON으로 쪼개
 * public/data/apt/ 에 두고, 사용자가 고른 법정동 파일만 내려받아 검색한다.
 * (현재 서울특별시만 수록)
 */

type Index = { y: string; sido: string; sigungu: Record<string, [string, string][]> };
/** [동명, 호명, 전용면적, 공시가격(만원)] */
type Unit = [string, string, number, number];
type DongData = { n: string; y: string; c: Record<string, Unit[]> };

const selectCls =
  "w-full px-3 py-2.5 rounded-xl bg-white border border-ui-border text-[14px] text-text-primary focus:outline-none focus:border-brand-blue transition-colors";

export default function PublicPriceFinder({ onSelect }: { onSelect: (manwon: number) => void }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<Index | null>(null);
  const [sigungu, setSigungu] = useState("");
  const [dongCode, setDongCode] = useState("");
  const [data, setData] = useState<DongData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [complex, setComplex] = useState("");
  const [bldg, setBldg] = useState("");
  const [unit, setUnit] = useState("");

  // 인덱스는 패널을 열 때 한 번만
  useEffect(() => {
    if (!open || index) return;
    fetch("/data/apt/index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setIndex)
      .catch(() => setError("목록을 불러오지 못했습니다."));
  }, [open, index]);

  // 법정동을 고르면 해당 파일만 로드
  useEffect(() => {
    if (!dongCode) { setData(null); return; }
    setLoading(true);
    setError("");
    setComplex(""); setBldg(""); setUnit(""); setQuery("");
    fetch(`/data/apt/${dongCode}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("해당 지역 자료를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [dongCode]);

  const complexes = useMemo(() => (data ? Object.keys(data.c).sort((a, b) => a.localeCompare(b, "ko")) : []), [data]);
  const matches = useMemo(() => {
    if (!query.trim()) return complexes.slice(0, 30);
    const q = query.trim();
    return complexes.filter((c) => c.includes(q)).slice(0, 30);
  }, [complexes, query]);

  const units = complex && data ? data.c[complex] : [];
  const bldgs = useMemo(
    () => [...new Set(units.map((u) => u[0]))].sort((a, b) => a.localeCompare(b, "ko", { numeric: true })),
    [units],
  );
  const unitList = useMemo(
    () =>
      units
        .filter((u) => (bldgs.length > 1 ? u[0] === bldg : true))
        .sort((a, b) => a[1].localeCompare(b[1], "ko", { numeric: true })),
    [units, bldg, bldgs.length],
  );
  const picked = unitList.find((u) => u[1] === unit);

  return (
    <div className="rounded-xl border border-ui-border bg-ui-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white transition-colors"
      >
        <span className="text-[13px] font-bold text-text-primary">
          🔎 주소로 공시가격 찾기
          <span className="ml-1.5 font-normal text-slate-400">아파트·빌라 · 서울</span>
        </span>
        <span className="text-[12px] text-brand-blue font-bold">{open ? "닫기" : "열기"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-ui-border pt-3">
          {error && <p className="text-[12px] font-bold text-red-600">{error}</p>}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={sigungu}
              onChange={(e) => { setSigungu(e.target.value); setDongCode(""); }}
              className={selectCls}
              disabled={!index}
            >
              <option value="">{index ? "구 선택" : "불러오는 중…"}</option>
              {index &&
                Object.keys(index.sigungu).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
            </select>
            <select
              value={dongCode}
              onChange={(e) => setDongCode(e.target.value)}
              className={selectCls}
              disabled={!sigungu}
            >
              <option value="">동 선택</option>
              {index && sigungu &&
                index.sigungu[sigungu].map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
            </select>
          </div>

          {loading && <p className="text-[12px] text-text-secondary">자료를 불러오는 중…</p>}

          {data && !complex && (
            <div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`단지명 검색 (총 ${complexes.length.toLocaleString()}개)`}
                className={selectCls}
              />
              <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border border-ui-border bg-white divide-y divide-slate-100">
                {matches.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setComplex(c); setBldg(""); setUnit(""); }}
                    className="w-full text-left px-3 py-2 text-[13px] text-text-primary hover:bg-blue-50 hover:text-brand-blue transition-colors"
                  >
                    {c}
                  </button>
                ))}
                {matches.length === 0 && (
                  <p className="px-3 py-2 text-[13px] text-slate-400">검색 결과가 없습니다.</p>
                )}
              </div>
            </div>
          )}

          {complex && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-text-primary">{complex}</span>
                <button
                  type="button"
                  onClick={() => { setComplex(""); setBldg(""); setUnit(""); }}
                  className="text-[12px] font-bold text-brand-blue hover:underline"
                >
                  다시 선택
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {bldgs.length > 1 && (
                  <select value={bldg} onChange={(e) => { setBldg(e.target.value); setUnit(""); }} className={selectCls}>
                    <option value="">동 선택</option>
                    {bldgs.map((b) => (
                      <option key={b} value={b}>{b || "(동 없음)"}</option>
                    ))}
                  </select>
                )}
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={selectCls}
                  disabled={bldgs.length > 1 && !bldg}
                >
                  <option value="">호 선택</option>
                  {unitList.map((u, i) => (
                    <option key={`${u[0]}-${u[1]}-${i}`} value={u[1]}>
                      {u[1]}호 · {u[2]}㎡
                    </option>
                  ))}
                </select>
              </div>

              {picked && (
                <div className="rounded-lg bg-white border border-brand-blue/30 p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] text-text-secondary">
                      {data?.y} 기준 공시가격 · 전용 {picked[2]}㎡
                    </div>
                    <div className="text-[17px] font-extrabold text-brand-blue">
                      {(picked[3] * 10000).toLocaleString("ko-KR")}원
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { onSelect(picked[3]); setOpen(false); }}
                    className="shrink-0 px-3 py-2 rounded-lg bg-brand-blue text-white text-[13px] font-bold hover:bg-blue-700 transition-colors"
                  >
                    적용
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-relaxed">
            출처: 국토교통부 공동주택 공시가격(공공데이터). 현재 <b>서울특별시</b>만 수록되어 있으며, 그 외 지역·단독주택은
            직접 입력해 주세요.
          </p>
        </div>
      )}
    </div>
  );
}

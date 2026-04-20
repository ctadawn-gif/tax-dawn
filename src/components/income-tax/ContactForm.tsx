"use client";

import { useState } from "react";

type FormState = {
  name: string;
  phone: string;
  taxType: string;
  memo: string;
};

type Status = "idle" | "submitting" | "success" | "error";

const INITIAL: FormState = {
  name: "",
  phone: "",
  taxType: "",
  memo: "",
};

const TAX_TYPES = [
  "프리랜서 (3.3% 원천징수)",
  "개인사업자",
  "근로 + 사업 복수소득",
  "기한후신고 (작년 미신고)",
  "기타 / 모르겠음",
];

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "이름을 입력해주세요.";
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11)
      return "올바른 연락처를 입력해주세요.";
    if (!phoneDigits.startsWith("01")) return "올바른 휴대폰 번호를 입력해주세요.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrorMsg(error);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\D/g, ""),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "전송 실패. 잠시 후 다시 시도해주세요.");
      }

      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section
        id="inquiry-form"
        className="py-24 px-5 scroll-mt-20"
      >
        <div className="max-w-[640px] mx-auto bg-white rounded-[24px] border border-ui-border shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-10 md:p-14 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-[24px] md:text-[28px] font-extrabold text-text-primary mb-3">
            상담 신청이 접수되었습니다
          </h3>
          <p className="text-[15px] md:text-[16px] text-text-secondary leading-relaxed mb-8">
            담당 세무사가 확인 후, <strong className="text-text-primary">24시간 이내</strong>에 남겨주신 연락처로
            <br />
            카카오톡 또는 문자로 연락드리겠습니다.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-[14px] text-text-secondary hover:text-brand-blue transition-colors underline underline-offset-4"
          >
            다시 신청하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="inquiry-form"
      className="py-24 px-5 scroll-mt-20"
    >
      <div className="max-w-[640px] mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">
            간편 상담 신청
          </span>
          <h2 className="text-[30px] md:text-[36px] font-extrabold tracking-tight text-text-primary mb-3">
            이름·연락처만 남겨주세요
          </h2>
          <p className="text-[16px] text-text-secondary font-medium">
            24시간 이내에 카카오톡·문자로 연락드립니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[24px] border border-ui-border shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] p-6 md:p-10 space-y-5"
        >
          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-[14px] font-bold text-text-primary mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="홍길동"
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl border border-ui-border bg-white text-[15px] text-text-primary placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="phone" className="block text-[14px] font-bold text-text-primary mb-2">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", formatPhone(e.target.value))}
              placeholder="010-1234-5678"
              autoComplete="tel"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-xl border border-ui-border bg-white text-[15px] text-text-primary placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* 신고유형 */}
          <div>
            <label htmlFor="taxType" className="block text-[14px] font-bold text-text-primary mb-2">
              신고 유형 <span className="text-slate-400 font-medium">(선택)</span>
            </label>
            <select
              id="taxType"
              value={form.taxType}
              onChange={(e) => update("taxType", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ui-border bg-white text-[15px] text-text-primary focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1rem] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%2364748b%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/></svg>')] pr-10"
            >
              <option value="">선택해주세요</option>
              {TAX_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 메모 */}
          <div>
            <label htmlFor="memo" className="block text-[14px] font-bold text-text-primary mb-2">
              간단 메모 <span className="text-slate-400 font-medium">(선택)</span>
            </label>
            <textarea
              id="memo"
              value={form.memo}
              onChange={(e) => update("memo", e.target.value)}
              placeholder="궁금한 점이나 상황을 간단히 적어주시면 상담이 더 빨라집니다."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-ui-border bg-white text-[15px] text-text-primary placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* 에러 메시지 */}
          {status === "error" && errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium px-4 py-3">
              {errorMsg}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-8 py-4 rounded-xl text-[16px] font-bold bg-brand-blue text-white hover:bg-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                전송 중...
              </>
            ) : (
              "상담 신청하기"
            )}
          </button>

          <p className="text-[12.5px] text-text-secondary text-center leading-relaxed">
            제출 시 <strong>세무회계 새벽</strong>의 개인정보 수집(이름·연락처·메모)에 동의하는 것으로 간주됩니다.
            <br />
            수집된 정보는 상담 목적 외 사용되지 않으며, 상담 완료 후 파기됩니다.
          </p>
        </form>
      </div>
    </section>
  );
}

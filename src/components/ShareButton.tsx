"use client";

import { useEffect, useState } from "react";

/**
 * 카카오톡 공유 버튼
 *
 * - 카카오 JavaScript SDK(Share)로 피드 카드 공유. 앱 키는 지도(Location.tsx)와 동일.
 * - SDK 로드 실패·미지원 환경에서는 Web Share API → 링크 복사 순으로 자동 폴백하므로
 *   어떤 브라우저에서도 버튼이 "먹통"이 되지 않는다.
 * - 카카오 개발자 콘솔에 사이트 도메인이 등록되어 있어야 카카오 공유가 동작한다.
 */

const KAKAO_KEY = "d6b93730d3ff889afd27483d978c6dea";
const SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
const SDK_INTEGRITY = "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: { sendDefault: (opts: unknown) => void };
};

function getKakao(): KakaoSDK | undefined {
  return (window as unknown as { Kakao?: KakaoSDK }).Kakao;
}

function loadSdk(): Promise<KakaoSDK | undefined> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(undefined);
    if (getKakao()) return resolve(getKakao());

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(getKakao()));
      existing.addEventListener("error", () => resolve(undefined));
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.integrity = SDK_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.async = true;
    script.onload = () => resolve(getKakao());
    script.onerror = () => resolve(undefined);
    document.head.appendChild(script);
  });
}

export default function ShareButton({
  title,
  description,
  imageUrl,
  buttonLabel = "계산해보기",
  className = "",
}: {
  title: string;
  description: string;
  /** 절대 경로 권장. 상대 경로면 현재 origin 기준으로 변환 */
  imageUrl: string;
  buttonLabel?: string;
  className?: string;
}) {
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const fallback = async (url: string) => {
    // 2순위: 기기 기본 공유 시트 (모바일에서 카카오톡 포함)
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch {
        return; // 사용자가 취소한 경우 — 조용히 종료
      }
    }
    // 3순위: 링크 복사
    try {
      await navigator.clipboard.writeText(url);
      setToast("링크가 복사되었습니다");
    } catch {
      setToast("링크 복사에 실패했습니다");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const image = imageUrl.startsWith("http") ? imageUrl : `${window.location.origin}${imageUrl}`;

    const kakao = await loadSdk();
    if (!kakao) return fallback(url);

    try {
      if (!kakao.isInitialized()) kakao.init(KAKAO_KEY);
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description,
          imageUrl: image,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [{ title: buttonLabel, link: { mobileWebUrl: url, webUrl: url } }],
      });
    } catch {
      fallback(url);
    }
  };

  return (
    <div className="relative inline-flex no-print">
      <button
        type="button"
        onClick={handleShare}
        aria-label="카카오톡으로 공유하기"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#FEE500] bg-[#FEE500] text-[#3C1E1E] text-[13px] font-bold hover:brightness-95 transition-all shadow-sm ${className}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.99 3 3 6.24 3 10.22c0 2.52 1.64 4.73 4.12 6.01-.18.65-.65 2.35-.75 2.72-.12.46.17.45.36.33.15-.1 2.36-1.6 3.32-2.25.63.09 1.28.14 1.95.14 5.01 0 9-3.24 9-7.22S17.01 3 12 3z" />
        </svg>
        카카오톡 공유
      </button>
      {toast && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">
          {toast}
        </span>
      )}
    </div>
  );
}

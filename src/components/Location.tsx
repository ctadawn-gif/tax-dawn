"use client";

import { useEffect, useRef } from "react";

const PLACE_URL = "https://naver.me/5yP5BKUk";
const KAKAO_MAP_SEARCH_URL = "https://map.kakao.com/link/search/서울 송파구 위례서로 252";
const KAKAO_KEY = "d6b93730d3ff889afd27483d978c6dea";

function KakaoMap({ className = "" }: { className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = () => {
      const kakao = (window as unknown as { kakao?: { maps?: unknown } }).kakao as
        | {
            maps?: {
              load: (cb: () => void) => void;
              Map: new (el: HTMLElement, options: unknown) => unknown;
              LatLng: new (lat: number, lng: number) => unknown;
              Marker: new (options: unknown) => unknown;
              InfoWindow: new (options: unknown) => unknown;
              services: { Geocoder: new () => unknown; Status: { OK: unknown } };
              ZoomControl: new () => unknown;
              ControlPosition: { RIGHT: unknown };
            };
          }
        | undefined;
      if (!kakao?.maps) return;

      kakao.maps.load(() => {
        if (!mapRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maps = kakao.maps as any;
        const map = new maps.Map(mapRef.current, {
          center: new maps.LatLng(37.4784, 127.1434),
          level: 3,
        });

        const geocoder = new maps.services.Geocoder();
        geocoder.addressSearch(
          "서울 송파구 위례서로 252",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result: any, status: any) => {
            if (status === maps.services.Status.OK) {
              const coords = new maps.LatLng(result[0].y, result[0].x);
              new maps.Marker({ map, position: coords });
              const infowindow = new maps.InfoWindow({
                content:
                  '<div style="padding:8px 14px;font-size:14px;font-weight:700;white-space:nowrap;">세무회계 새벽</div>',
              });
              infowindow.open(map, new maps.Marker({ map, position: coords }));
              map.setCenter(coords);
            }
          },
        );

        map.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);
      });
    };

    if ((window as unknown as { kakao?: { maps?: unknown } }).kakao?.maps) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, []);

  return <div ref={mapRef} className={`w-full rounded-2xl overflow-hidden border border-ui-border ${className}`} />;
}

export default function Location() {
  return (
    <>
      <div id="location" className="scroll-mt-16" />
      {/* ── Mobile ─────────────────────────── */}
      <section className="md:hidden bg-white py-16 px-5 w-full flex flex-col">
        <div className="mb-6 flex flex-col items-start">
          <div className="inline-flex items-center justify-center bg-slate-100 text-slate-600 rounded-full px-3 py-1.5 text-[13px] font-semibold mb-3 tracking-tight">
            오시는 길
          </div>
          <h2 className="text-[24px] font-bold text-slate-900 leading-snug tracking-tight">
            세무회계 새벽
          </h2>
        </div>

        <KakaoMap className="h-[260px] mb-5 rounded-[16px]" />

        <article className="bg-white rounded-[16px] border border-slate-100 shadow-sm p-5 mb-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[22px] h-[22px] text-slate-800 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-12ZM5.25 3.75h9v16.5h-9V3.75ZM8.25 7.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm0 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">세무회계 새벽</h3>
          </div>

          <p className="text-[15px] font-medium text-slate-600 leading-[1.6] tracking-tight mb-4">
            서울 송파구 위례서로 252,
            <br />
            유원플러스송파 610호
          </p>

          <div className="bg-amber-50 rounded-md px-3 py-2 text-[13px] text-amber-600 font-medium tracking-tight flex items-center">
            ※ 방문 상담은 예약 후 가능합니다
          </div>
        </article>

        <div className="flex flex-col gap-3">
          <a
            href={PLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center justify-center w-full h-12 border border-slate-200 bg-white text-slate-700 rounded-[12px] text-[15px] font-semibold active:bg-slate-100 transition-colors tracking-tight gap-1.5 shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <rect width="16" height="16" rx="3" fill="#03C75A" />
              <path
                d="M10.74 11.239H9.135V7.498L6.29 11.239H4.456V4.76h1.605v3.742l2.844-3.742h1.835v6.479z"
                fill="white"
              />
            </svg>
            네이버 플레이스에서 보기
          </a>

          <a
            href={KAKAO_MAP_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center justify-center w-full h-12 bg-[#FEE500] text-[#191919] rounded-[12px] text-[15px] font-bold active:scale-[0.98] transition-all tracking-tight gap-1.5 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[18px] h-[18px] shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            카카오맵으로 길찾기
          </a>
        </div>
      </section>

      {/* ── Desktop (기존 유지) ─────────────────────────── */}
      <section
        className="hidden md:block relative pt-14 md:pt-24 pb-14 md:pb-20 px-5 md:px-6"
      >
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-blue-50 text-brand-blue text-[12px] md:text-[13px] font-bold tracking-wide border border-blue-100 mb-3 md:mb-4">
              오시는 길
            </span>
            <h2 className="text-[24px] md:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
              세무회계 새벽
            </h2>
          </div>

          <KakaoMap className="h-[400px]" />

          <div className="mt-4 md:mt-5 bg-white rounded-2xl p-5 md:p-6 border border-ui-border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
              <div>
                <h3 className="text-[15px] md:text-lg font-bold text-text-primary mb-1 leading-snug">
                  서울 송파구 위례서로 252,
                  <br className="md:hidden" /> 유원플러스송파 610호
                </h3>
                <p className="text-[12.5px] md:text-[13px] text-text-secondary">
                  방문 상담은 예약 후 가능합니다
                </p>
              </div>
              <a
                href={PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-5 md:px-6 py-3 bg-white border border-ui-border md:border-2 rounded-xl text-[14px] font-bold text-text-primary text-center hover:border-brand-blue hover:text-brand-blue transition-colors no-underline shrink-0"
              >
                네이버 플레이스에서 보기 →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

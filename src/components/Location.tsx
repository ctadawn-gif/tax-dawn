"use client";

import { useEffect, useRef } from "react";

const PLACE_URL = "https://naver.me/5yP5BKUk";
const KAKAO_KEY = "d6b93730d3ff889afd27483d978c6dea";

function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = () => {
      const kakao = (window as any).kakao;
      if (!kakao?.maps) return;

      kakao.maps.load(() => {
        if (!mapRef.current) return;
        const map = new kakao.maps.Map(mapRef.current, {
          center: new kakao.maps.LatLng(37.4784, 127.1434),
          level: 3,
        });

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch("서울 송파구 위례서로 252", (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            new kakao.maps.Marker({ map, position: coords });
            const infowindow = new kakao.maps.InfoWindow({
              content: '<div style="padding:8px 14px;font-size:14px;font-weight:700;white-space:nowrap;">세무회계 새벽</div>',
            });
            infowindow.open(map, new kakao.maps.Marker({ map, position: coords }));
            map.setCenter(coords);
          }
        });

        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
      });
    };

    if ((window as any).kakao?.maps) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    script.onload = loadMap;
    document.head.appendChild(script);
  }, []);

  return <div ref={mapRef} className="w-full h-[400px] rounded-2xl overflow-hidden border border-ui-border" />;
}

export default function Location() {
  return (
    <section id="location" className="relative pt-24 pb-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[13px] font-bold tracking-wide border border-blue-100 mb-4">
            오시는 길
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
            세무회계 새벽
          </h2>
        </div>

        <KakaoMap />

        <div className="mt-5 bg-white rounded-2xl p-6 border border-ui-border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-1">서울 송파구 위례서로 252, 유원플러스송파 610호</h3>
              <p className="text-[13px] text-text-secondary">방문 상담은 예약 후 가능합니다</p>
            </div>
            <a href={PLACE_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border-2 border-ui-border rounded-xl text-[14px] font-bold text-text-primary hover:border-brand-blue hover:text-brand-blue transition-colors no-underline shrink-0">
              네이버 플레이스에서 보기 →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

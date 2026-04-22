import { ImageResponse } from "next/og";

export const alt = "AI 아닌 세무사가 직접. 종합소득세 신고대행 | 세무회계 새벽";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";


async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export default async function Image() {
  const [pretendardBold, pretendardExtraBold, pretendardRegular] = await Promise.all([
    loadFont(
      "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf",
    ),
    loadFont(
      "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-ExtraBold.otf",
    ),
    loadFont(
      "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Medium.otf",
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          position: "relative",
          fontFamily: "Pretendard",
          letterSpacing: "-0.03em",
        }}
      >
        {/* 하단 블루 그라데이션 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "350px",
            background:
              "linear-gradient(to top, rgba(219, 234, 254, 0.9), rgba(219, 234, 254, 0.3) 40%, transparent)",
          }}
        />
        {/* 블루 블러 오브 */}
        <div
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 800,
            height: 800,
            background: "rgba(191, 219, 254, 0.3)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />

        {/* D-day 뱃지 */}
        <div style={{ display: "flex", position: "relative", zIndex: 10 }}>
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "14px 30px",
              borderRadius: "999px",
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid rgba(254, 202, 202, 0.5)",
            }}
          >
            <span style={{ fontSize: 32 }}>🔥</span>
            <span>2026.06.01 마감</span>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            position: "relative",
            zIndex: 10,
            marginTop: 32,
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.2,
              fontWeight: 800,
              color: "#0f172a",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <span>AI 아닌&nbsp;</span>
              <span style={{ color: "#2563eb" }}>세무사가 직접.</span>
            </div>
            <div>종합소득세 신고대행</div>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <span>세무사 2인 크로스체크</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#cbd5e1",
                display: "flex",
              }}
            />
            <span>500건+</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#cbd5e1",
                display: "flex",
              }}
            />
            <span>10만원부터</span>
          </div>
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 60,
                height: 60,
                background: "#2563eb",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)",
              }}
            >
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span style={{ fontSize: 34, fontWeight: 700, color: "#1e293b" }}>세무회계 새벽</span>
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#64748b",
              background: "rgba(255, 255, 255, 0.8)",
              padding: "10px 24px",
              borderRadius: 12,
              border: "1px solid #f1f5f9",
              display: "flex",
            }}
          >
            dawntax.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: pretendardRegular, weight: 500, style: "normal" },
        { name: "Pretendard", data: pretendardBold, weight: 700, style: "normal" },
        { name: "Pretendard", data: pretendardExtraBold, weight: 800, style: "normal" },
      ],
    },
  );
}

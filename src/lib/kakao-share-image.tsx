import { ImageResponse } from "next/og";

/**
 * 카카오톡 공유용 정사각형 카드 (800×800)
 *
 * 카카오톡 피드는 가로로 긴 이미지(1200×630 OG)를 좌우 크롭해서 보여주기 때문에
 * 가장자리 글자가 잘린다. 공유 전용으로는 1:1 비율을 쓰고, 모든 텍스트를
 * 가운데 정렬 + 넉넉한 여백 안에 배치해 어떤 클라이언트에서도 잘리지 않게 한다.
 */

export const KAKAO_IMAGE_SIZE = { width: 800, height: 800 };

export type KakaoShareContent = {
  badge: string;
  /** 각 줄 배열. accent=true면 파란색 강조 */
  lines: { text: string; accent?: boolean }[];
  /** 하단 점 구분 항목 */
  tags: string[];
};

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export async function renderKakaoShareImage(content: KakaoShareContent): Promise<ImageResponse> {
  const [bold, extraBold, medium] = await Promise.all([
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
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 60px",
          position: "relative",
          fontFamily: "Pretendard",
          letterSpacing: "-0.03em",
          textAlign: "center",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "420px",
            background:
              "linear-gradient(to top, rgba(219, 234, 254, 0.85), rgba(219, 234, 254, 0.25) 45%, transparent)",
          }}
        />

        {/* 뱃지 */}
        <div style={{ display: "flex", position: "relative", zIndex: 10, marginBottom: 40 }}>
          <div
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              padding: "14px 32px",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              border: "1px solid rgba(191, 219, 254, 0.6)",
            }}
          >
            {content.badge}
          </div>
        </div>

        {/* 헤드라인 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 10,
            fontSize: 76,
            lineHeight: 1.25,
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {content.lines.map((l, i) => (
            <div key={i} style={{ display: "flex", color: l.accent ? "#2563eb" : "#0f172a" }}>
              {l.text}
            </div>
          ))}
        </div>

        {/* 태그 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginTop: 36,
            fontSize: 30,
            fontWeight: 500,
            color: "#475569",
            position: "relative",
            zIndex: 10,
          }}
        >
          {content.tags.flatMap((t, i) => {
            const els: React.ReactNode[] = [];
            if (i > 0) {
              els.push(
                <span
                  key={`d${i}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#cbd5e1",
                    display: "flex",
                  }}
                />,
              );
            }
            els.push(<span key={`t${i}`}>{t}</span>);
            return els;
          })}
        </div>

        {/* 브랜드 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginTop: 70,
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              background: "#2563eb",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        <div style={{ marginTop: 14, fontSize: 26, fontWeight: 600, color: "#94a3b8", display: "flex", position: "relative", zIndex: 10 }}>
          dawntax.com
        </div>
      </div>
    ),
    {
      ...KAKAO_IMAGE_SIZE,
      fonts: [
        { name: "Pretendard", data: medium, weight: 500, style: "normal" },
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}

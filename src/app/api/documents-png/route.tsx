import { ImageResponse } from "next/og";

/**
 * 종합소득세 신고 필요자료 안내 PNG 생성
 * 호출: GET /api/documents-png
 * 결과: 1080x1700 PNG 이미지 다운로드
 *
 * 대표님이 카톡/이메일로 고객에게 발송할 수 있도록
 * 표 형태의 안내문을 한 장의 PNG로 출력.
 */

const BASE_URL = "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static";

const FONT_URLS = {
  medium: `${BASE_URL}/Pretendard-Medium.otf`,
  bold: `${BASE_URL}/Pretendard-Bold.otf`,
  extraBold: `${BASE_URL}/Pretendard-ExtraBold.otf`,
};

type Doc = { no: number; name: string; note: string; isAuth?: boolean };

const DOCS: Doc[] = [
  { no: 1, name: "2025년 경조사비", note: "청첩장, 부고문자 캡쳐본" },
  { no: 2, name: "2025년 사업자대출 이자비용", note: "해당사항 있는 경우 전달" },
  { no: 3, name: "2025년 카드이용내역 엑셀파일", note: "1월~12월 / 카드사 알려주시면 다운방법 안내" },
  { no: 4, name: "2025년 대표자 국민연금 납부확인서", note: "카톡인증 시 대신 출력 가능", isAuth: true },
  { no: 5, name: "2025년 대표자 건강보험 납부확인서", note: "카톡인증 시 대신 출력 가능", isAuth: true },
  { no: 6, name: "2025년 타소득 확인 자료", note: "카톡인증 시 대신 출력 가능", isAuth: true },
  { no: 7, name: "2025년 연말정산간소화 자료", note: "카톡인증 시 대신 출력 가능", isAuth: true },
  { no: 8, name: "2025년 기부금 내역", note: "해당사항 있는 경우 전달" },
  { no: 9, name: "2025년 통신비 납부내역", note: "통신사 어플에서 다운받아 전달 부탁드립니다" },
  { no: 10, name: "주민등록등본", note: "현재 전입신고 되어있는 주소지 기준" },
  { no: 11, name: "가족관계증명서", note: "부모님·자녀가 보이게 발급" },
  { no: 12, name: "혼인관계증명서", note: "2025년도에 혼인신고하신 경우만" },
  { no: 13, name: "자동차등록증", note: "본인명의 차량 있으신 경우만" },
];

export async function GET() {
  const [medium, bold, extraBold] = await Promise.all([
    fetch(FONT_URLS.medium).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.bold).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.extraBold).then((r) => r.arrayBuffer()),
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
          padding: "60px 60px 50px",
          fontFamily: "Pretendard",
          letterSpacing: "-0.03em",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "#0052FF",
                color: "white",
                fontSize: 20,
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: 999,
                display: "flex",
              }}
            >
              세무회계 새벽
            </div>
            <div style={{ fontSize: 18, color: "#64748b", fontWeight: 500, display: "flex" }}>
              www.dawntax.com
            </div>
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              display: "flex",
            }}
          >
            2025년도 종합소득세 신고 필요자료
          </div>
        </div>

        {/* 안내 박스 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "#fffbeb",
            border: "2px solid #fde68a",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#92400e",
              display: "flex",
            }}
          >
            자료 전달 전 확인사항
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 모든 자료의 출력 기준일은 &quot;2025년도&quot; 입니다.
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 카카오톡 또는 이메일 cta.ryang@gmail.com 으로 보내주시면 됩니다.
          </div>
          <div style={{ fontSize: 17, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 팩스번호는 0507-1793-5901 입니다.
          </div>
        </div>

        {/* 표 헤더 */}
        <div
          style={{
            display: "flex",
            background: "#0f172a",
            color: "white",
            fontSize: 17,
            fontWeight: 700,
            padding: "12px 0",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div style={{ width: 70, textAlign: "center", display: "flex", justifyContent: "center" }}>
            번호
          </div>
          <div style={{ width: 380, paddingLeft: 16, display: "flex" }}>항목</div>
          <div style={{ flex: 1, paddingLeft: 16, display: "flex" }}>비고</div>
        </div>

        {/* 표 행 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e2e8f0",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
          }}
        >
          {DOCS.map((d, i) => (
            <div
              key={d.no}
              style={{
                display: "flex",
                background: d.isAuth ? "#eff6ff" : "white",
                borderTop: i === 0 ? "none" : "1px solid #f1f5f9",
                padding: "11px 0",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 70,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#475569",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {d.no}
              </div>
              <div
                style={{
                  width: 380,
                  paddingLeft: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {d.isAuth && (
                  <div
                    style={{
                      background: "#0052FF",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 6,
                      display: "flex",
                    }}
                  >
                    인증
                  </div>
                )}
                <div style={{ display: "flex" }}>{d.name}</div>
              </div>
              <div
                style={{
                  flex: 1,
                  paddingLeft: 16,
                  paddingRight: 16,
                  fontSize: 15,
                  fontWeight: 500,
                  color: d.isAuth ? "#1d4ed8" : "#64748b",
                  display: "flex",
                }}
              >
                {d.note}
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 안내 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 18,
            fontSize: 14,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#dbeafe",
              border: "1px solid #bfdbfe",
              borderRadius: 3,
              display: "flex",
            }}
          />
          <div style={{ display: "flex" }}>
            파란 줄 항목은 카톡인증 시 세무사가 대신 출력 가능합니다.
          </div>
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "2px solid #f1f5f9",
            fontSize: 16,
            color: "#475569",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex" }}>
            대표세무사 김근량 010-3262-3295 · 고유빈 010-9374-4916
          </div>
          <div style={{ display: "flex", color: "#0052FF", fontWeight: 800 }}>
            세무회계 새벽
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1200,
      fonts: [
        { name: "Pretendard", data: medium, weight: 500 },
        { name: "Pretendard", data: bold, weight: 700 },
        { name: "Pretendard", data: extraBold, weight: 800 },
      ],
    },
  );
}

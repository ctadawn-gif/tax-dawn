import { ImageResponse } from "next/og";

/**
 * 종합소득세 신고 필요자료 안내 PNG 생성
 * 호출: GET /api/documents-png
 *
 * 그룹 1: 카톡인증으로 대신 출력 가능 (가장 쉬움)
 * 그룹 2: 행정기관 발급 서류
 * 그룹 3: 본인 정리 자료
 */

const BASE_URL =
  "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static";

const FONT_URLS = {
  medium: `${BASE_URL}/Pretendard-Medium.otf`,
  bold: `${BASE_URL}/Pretendard-Bold.otf`,
  extraBold: `${BASE_URL}/Pretendard-ExtraBold.otf`,
};

type Doc = { no: number; name: string; note: string; isAuth?: boolean };
type Group = {
  step: string;
  title: string;
  desc: string;
  accent: "blue" | "slate" | "amber";
  items: Doc[];
};

const GROUPS: Group[] = [
  {
    step: "STEP 1",
    title: "카톡인증으로 끝",
    desc: "사용자 카톡인증만 해주시면 세무사가 대신 출력합니다",
    accent: "blue",
    items: [
      { no: 1, name: "2025년 대표자 국민연금 납부확인서", note: "카톡인증 시 대신 출력 가능", isAuth: true },
      { no: 2, name: "2025년 대표자 건강보험 납부확인서", note: "카톡인증 시 대신 출력 가능", isAuth: true },
      { no: 3, name: "2025년 타소득 확인 자료", note: "카톡인증 시 대신 출력 가능", isAuth: true },
      { no: 4, name: "2025년 연말정산간소화 자료", note: "카톡인증 시 대신 출력 가능", isAuth: true },
    ],
  },
  {
    step: "STEP 2",
    title: "행정기관 발급 서류",
    desc: "정부24·동사무소에서 직접 발급받아 전달",
    accent: "slate",
    items: [
      { no: 5, name: "주민등록등본", note: "현재 전입신고 되어있는 주소지 기준" },
      { no: 6, name: "가족관계증명서", note: "부모님·자녀가 보이게 발급" },
      { no: 7, name: "혼인관계증명서", note: "2025년도에 혼인신고하신 경우만" },
      { no: 8, name: "자동차등록증", note: "본인명의 차량 있으신 경우만" },
    ],
  },
  {
    step: "STEP 3",
    title: "본인 정리 자료",
    desc: "사업·지출 관련 자료를 1년치 정리해서 전달",
    accent: "amber",
    items: [
      { no: 9, name: "2025년 카드이용내역 엑셀파일", note: "1월~12월 / 카드사 알려주시면 다운방법 안내" },
      { no: 10, name: "2025년 통신비 납부내역", note: "통신사 어플에서 다운받아 전달" },
      { no: 11, name: "2025년 사업자대출 이자비용", note: "해당사항 있는 경우 전달" },
      { no: 12, name: "2025년 경조사비", note: "청첩장, 부고문자 캡쳐본" },
      { no: 13, name: "2025년 기부금 내역", note: "해당사항 있는 경우 전달" },
    ],
  },
];

const ACCENT: Record<Group["accent"], { bg: string; fg: string; border: string; rowBg: string }> = {
  blue: { bg: "#0052FF", fg: "#ffffff", border: "#bfdbfe", rowBg: "#eff6ff" },
  slate: { bg: "#475569", fg: "#ffffff", border: "#cbd5e1", rowBg: "#f8fafc" },
  amber: { bg: "#d97706", fg: "#ffffff", border: "#fde68a", rowBg: "#fffbeb" },
};

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
          padding: "70px 70px 50px",
          fontFamily: "Pretendard",
          letterSpacing: "-0.03em",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                background: "#0052FF",
                color: "white",
                fontSize: 22,
                fontWeight: 800,
                padding: "8px 18px",
                borderRadius: 999,
                display: "flex",
              }}
            >
              세무회계 새벽
            </div>
            <div style={{ fontSize: 20, color: "#64748b", fontWeight: 500, display: "flex" }}>
              www.dawntax.com
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.15,
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
            gap: 10,
            background: "#fffbeb",
            border: "2px solid #fde68a",
            borderRadius: 18,
            padding: "22px 28px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#92400e",
              display: "flex",
            }}
          >
            자료 전달 전 확인사항
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 모든 자료의 출력 기준일은 &quot;2025년도&quot; 입니다.
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 카카오톡 또는 이메일{" "}
            <span style={{ fontWeight: 800, marginLeft: 6, marginRight: 6, display: "flex" }}>
              cta.ryang@gmail.com
            </span>{" "}
            으로 보내주시면 됩니다.
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#78350f", display: "flex" }}>
            · 팩스번호는{" "}
            <span style={{ fontWeight: 800, marginLeft: 6, marginRight: 6, display: "flex" }}>
              0507-1793-5901
            </span>{" "}
            입니다.
          </div>
        </div>

        {/* 그룹별 표 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {GROUPS.map((group) => {
            const c = ACCENT[group.accent];
            return (
              <div
                key={group.step}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: `2px solid ${c.border}`,
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {/* 그룹 헤더 */}
                <div
                  style={{
                    background: c.bg,
                    color: c.fg,
                    padding: "14px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: 0,
                      display: "flex",
                    }}
                  >
                    {group.step}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, display: "flex" }}>
                    {group.title}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      opacity: 0.85,
                      display: "flex",
                      marginLeft: 4,
                    }}
                  >
                    {group.desc}
                  </div>
                </div>

                {/* 그룹 행 */}
                {group.items.map((d, i) => (
                  <div
                    key={d.no}
                    style={{
                      display: "flex",
                      background: c.rowBg,
                      borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)",
                      padding: "16px 22px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        textAlign: "center",
                        fontSize: 19,
                        fontWeight: 800,
                        color: c.bg,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {d.no}
                    </div>
                    <div
                      style={{
                        width: 460,
                        paddingLeft: 12,
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#0f172a",
                        display: "flex",
                      }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        paddingLeft: 16,
                        paddingRight: 8,
                        fontSize: 18,
                        fontWeight: 500,
                        color: "#475569",
                        display: "flex",
                      }}
                    >
                      {d.note}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* 하단 브랜드 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 28,
            borderTop: "2px solid #f1f5f9",
            fontSize: 18,
            color: "#475569",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex" }}>
            대표세무사 김근량 010-3262-3295 · 고유빈 010-9374-4916
          </div>
          <div style={{ display: "flex", color: "#0052FF", fontWeight: 800, fontSize: 20 }}>
            세무회계 새벽
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1700,
      fonts: [
        { name: "Pretendard", data: medium, weight: 500 },
        { name: "Pretendard", data: bold, weight: 700 },
        { name: "Pretendard", data: extraBold, weight: 800 },
      ],
    },
  );
}

import { ImageResponse } from "next/og";

/**
 * 네이버 플레이스 업로드용 고객 후기 카드 PNG 생성
 * 호출: GET /api/review-cards?n=0..9
 *
 * 1080x1350 (인스타·네이버 플레이스 친화 비율)
 */

const BASE_URL =
  "https://fastly.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static";

const FONT_URLS = {
  medium: `${BASE_URL}/Pretendard-Medium.otf`,
  bold: `${BASE_URL}/Pretendard-Bold.otf`,
  extraBold: `${BASE_URL}/Pretendard-ExtraBold.otf`,
};

type CardReview = { text: string; reviewer: string; src: "택슬리" | "숨고" | "엑스퍼트" };
type Card = {
  /** 실제 후기에서 발췌한 한 줄. 카드 제목으로 들어감 */
  headline: string;
  /** 위 발췌가 나온 출처 (작성자) */
  headlineBy: string;
  reviews: CardReview[];
};

const CARDS: Card[] = [
  {
    headline: "머리에 쏙쏙 들어오네요",
    headlineBy: "양도차**** 고객님",
    reviews: [
      { text: "복잡하게 느꼈던 내용을 심플하게 설명해주셨습니다", reviewer: "실사법****", src: "택슬리" },
      { text: "알기 쉽게 비유해가면서 설명해주시는데 머리에 쏙쏙 들어오네요", reviewer: "양도차****", src: "택슬리" },
      { text: "여러 상황이 복잡한 부분도 쉽게 풀어 설명해주셔서 너무 좋았습니다. 강추 드립니다", reviewer: "임차료****", src: "택슬리" },
      { text: "제 상황에 맞게 적절히 알기 쉽게 상담해 주셨어요", reviewer: "고지세****", src: "택슬리" },
      { text: "복잡한 절차와 서류 준비 과정을 친절하고 명확하게 설명해 주셔서 이해가 쉬웠습니다", reviewer: "김**", src: "숨고" },
      { text: "복잡한 현안을 잘 요약해서 핵심을 짚어주시고 최종 정리까지 해주시니 매우 만족스러웠습니다", reviewer: "김**", src: "숨고" },
      { text: "이해가 쏙쏙 되게 잘 설명해주십니다", reviewer: "흑**", src: "엑스퍼트" },
      { text: "혼자 찾았을 땐 이해를 잘 못하겠었는데, 이해 잘 되게 답변해주셔서 너무 감사합니다", reviewer: "대여꿀****", src: "택슬리" },
    ],
  },
  {
    headline: "정말 천사가 따로 없네요",
    headlineBy: "sang**** 고객님",
    reviews: [
      { text: "정말 친절하고 전문성 있는 답변 감사합니다. 좋은 서비스 이용하게 되어 기쁘네요", reviewer: "소비세****", src: "택슬리" },
      { text: "친절하게 답변잘해주시고 전문성있고 쉽게 설명해주셔서 이해하기 좋았어요", reviewer: "재산목****", src: "택슬리" },
      { text: "엄청 친절하시고 요구사항을 잘 해결해 주십니다", reviewer: "qocl****", src: "엑스퍼트" },
      { text: "너무 친절하시고 깔끔하게 처리해주셨습니다!", reviewer: "국**", src: "숨고" },
      { text: "너무너무 친절하게 상담해주셨어요", reviewer: "대**", src: "숨고" },
      { text: "친절하시고 빠르게 처리해주세요. 다음에 또 이용할게요!", reviewer: "하**", src: "숨고" },
      { text: "이렇게까지 친절하고 자세하게 설명해 주실지는 꿈에도 몰랐습니다", reviewer: "익명", src: "엑스퍼트" },
      { text: "차분하게 말씀을 잘해주셔서 좋습니다. 앞으로 잘부탁드리겠습니다", reviewer: "면세까****", src: "택슬리" },
    ],
  },
  {
    headline: "답이 진짜 제일 빠르시고요",
    headlineBy: "sall**** 고객님",
    reviews: [
      { text: "답변 굉장히 빠르셨고요, 친절하고 자세하게 설명해주셔서 도움이 많이 됐습니다!", reviewer: "비거주****", src: "택슬리" },
      { text: "답변도 빠르고 다른 분야임에도 불구하고 잘 알려주셨습니다", reviewer: "soni****", src: "엑스퍼트" },
      { text: "급하게 문의 넣었는데 친절하고 빠르게 해결해주셨어요", reviewer: "김**", src: "숨고" },
      { text: "신속하게 답변 주셨고 비용 또한 합리적이어서 부담이 없었음", reviewer: "연결실****", src: "택슬리" },
      { text: "정말 빠르게 상담 진행해주셨어요. 답변도 명확하고 친절하게 해주셔서 감사합니다!", reviewer: "ddin****", src: "엑스퍼트" },
      { text: "빠른 시간내에 처리해주셔서 감사했습니다. 일 처리도 깔끔해 다음에 또 이용하고 싶습니다", reviewer: "고**", src: "숨고" },
      { text: "빠른 상담과 친절한 답변 감사드립니다", reviewer: "urzz****", src: "엑스퍼트" },
      { text: "엄청 친절하시고 빠르게 잘 해결해주셨어요! 앞으로도 세무사님께 부탁드릴 생각입니다", reviewer: "hayo****", src: "엑스퍼트" },
    ],
  },
  {
    headline: "막힌 속이 뻥 뚫렸어요",
    headlineBy: "분납여**** 고객님",
    reviews: [
      { text: "걱정하던 부분이 시원하게 해결 되었습니다", reviewer: "재량행****", src: "택슬리" },
      { text: "제가 궁금한 걸 정확히 군더더기 없이 알기 쉽게 설명해주셨어요. 답답했던 속이 뻥 뚫립니다", reviewer: "주권문****", src: "택슬리" },
      { text: "최고최고!! 정말 명쾌한 답변에 신속한 답변. 막힌 속이 뻥 뚫렸어요", reviewer: "분납여****", src: "택슬리" },
      { text: "답답했던 속이 신속하고 친절하고 전문적인 답변에 확 뚫렸습니다. 다음에 또 이용하고 싶어요!", reviewer: "교육세****", src: "택슬리" },
      { text: "고민이 많은 저희의 상황을 시원하게 정리해주셔서 마음이 한결 가벼워졌습니다", reviewer: "박**", src: "숨고" },
      { text: "답답했던 부분이 너무 시원하게 해결되었어요~", reviewer: "이**", src: "숨고" },
      { text: "묶여 있던 실타래가 풀리기 시작하는 것 같습니다", reviewer: "최**", src: "숨고" },
      { text: "어디에 조언을 구할 곳이 없어서 막막했었습니다. 쉽고 명쾌하게 답변해주셔서 속 시원했습니다!", reviewer: "재무제****", src: "택슬리" },
    ],
  },
  {
    headline: "역시 세무 전문이십니다",
    headlineBy: "빵또아**** 고객님",
    reviews: [
      { text: "역시 세무 전문이십니다!!! 스마트 하셔서 깔끔하게 처리했습니다", reviewer: "빵또아****", src: "택슬리" },
      { text: "오프라인 세무사분들보다 더 신속하고 정확하게 알려주셨습니다. 강추합니다", reviewer: "가설재****", src: "택슬리" },
      { text: "다시 한번 자세히 설명해주시면서 정말 감동 받았습니다", reviewer: "익명", src: "엑스퍼트" },
      { text: "진짜 찐 세무전문가란 이런거구나, 전문지식 & 친절함에 진짜 존경심까지 들었습니다", reviewer: "미**", src: "엑스퍼트" },
      { text: "사업체 운영 하면서 만난 어떤 세무사님보다 친절하시고 명확하게 답변을 주셨어요", reviewer: "익명", src: "엑스퍼트" },
      { text: "단언컨대 제일 전문적이셔서 많은 도움이 됐습니다. 무조건 김근량 세무사님께 오겠습니다", reviewer: "익명", src: "엑스퍼트" },
      { text: "엑스퍼트에서 문의 드린 분 중에 제일 친절하시고 빠르게 답변 주셨어요", reviewer: "yoon****", src: "엑스퍼트" },
      { text: "전문적인 지식으로 답변해주시고 성실하게 답변 해주셔서 감사드립니다", reviewer: "임치문****", src: "택슬리" },
    ],
  },
  {
    headline: "만나서 다행인 것 같아요",
    headlineBy: "트** 고객님",
    reviews: [
      { text: "사업 시작하고 첫 세금 신고라서 막막하던 때에 실력 있고 친절하신 세무사님 만나서 잘 마무리 했어요", reviewer: "핏**", src: "숨고" },
      { text: "정말 상담 빨리해주시고 새벽시간에도 친절합니다. 사업자 처음 내보는데 만나서 다행인 것 같아요", reviewer: "트**", src: "숨고" },
      { text: "세무에 관련하여 지식이 없어서 늘 걱정인데 세금 관련 문의할때마다 또 문의드릴게요", reviewer: "공제사****", src: "택슬리" },
      { text: "세금에 대해 아는게 없어 걱정이 태산이였는데 친절하셔서 마음을 놓았어요", reviewer: "qllo****", src: "엑스퍼트" },
      { text: "초보사업자인데 부가세신고를 못해서 가산세때문에 세금이 많이 나왔어요. 경정신청 후 부가세도 줄고 너무 든든했어요", reviewer: "황**", src: "숨고" },
      { text: "아직은 기장을 안 맡기고 단건으로 진행해도 된다고 정말 솔직하게 말씀해주셨습니다", reviewer: "tjsd****", src: "엑스퍼트" },
      { text: "창업 준비중인데 너무 친절하게 해주셨어요", reviewer: "건**", src: "엑스퍼트" },
      { text: "세무쪽은 정말 하나도 몰랐는데 빠르고 명확한 답변해주셔서 잘 해결했습니다", reviewer: "가결산****", src: "택슬리" },
    ],
  },
  {
    headline: "마음이 한결 가벼워졌어요",
    headlineBy: "박** 고객님",
    reviews: [
      { text: "종합소득세, 부가가치세 관련하여 모르는 부분도 많고 신고를 제대로 한 건지 모르겠었는데 너무 좋았습니다", reviewer: "익명", src: "엑스퍼트" },
      { text: "신규 사업자라서 부가가치세 신고 언제까지 해야하는지 너무 친절하게 설명해주셨습니다", reviewer: "mj24****", src: "엑스퍼트" },
      { text: "부가세 신고 항상 혼자하거나 어플 이용하다가 너무 빠르고 꼼꼼하게 처리해주셔서 종소세까지 맡길 예정입니다", reviewer: "천**", src: "숨고" },
      { text: "이번에 종합소득세 관련해서 고민이 많았는데 마음이 한결 가벼워졌습니다", reviewer: "박**", src: "숨고" },
      { text: "기한후신고 종합소득세 필요한 정보들 너무나도 쉽게 설명해주시고 진행해줬습니다", reviewer: "rlaw****", src: "엑스퍼트" },
      { text: "종합소득세 신고 관련해서 궁굼한게 많았는데 하나라도 더 알려주려고 하십니다", reviewer: "sh93****", src: "엑스퍼트" },
      { text: "제가 직접 종합소득세 신고했더니 금액이 너무 많이 나와 멘탈이 무너졌는데 시원하게 해결해주셨습니다", reviewer: "김**", src: "숨고" },
      { text: "부가가치세 관련 세금계산서 발행 관련 질문을 드렸는데 이해하기 쉽게 친절히 설명해주셨습니다", reviewer: "hei4****", src: "엑스퍼트" },
    ],
  },
  {
    headline: "내집마련계획에 큰 도움이 됐어요",
    headlineBy: "강** 고객님",
    reviews: [
      { text: "양도세때문에 이곳저곳 알아보고 연락드렸는데 일처리도 깔끔하게 잘해주셨고 알기쉽게 설명도 자세히 해주셨어요", reviewer: "이**", src: "숨고" },
      { text: "주택자금조달 계획서 상담했는데 친절하고 알기 쉽게 설명해주셔서 좋았습니다", reviewer: "한**", src: "숨고" },
      { text: "자금조달계획서에 대한 상담을 받았는데 매우 만족스러웠습니다", reviewer: "김**", src: "숨고" },
      { text: "부동산 증여 관련해서 여쭤봤는데 너무 친절하게 잘 알려주셔서 감사했습니다", reviewer: "김**", src: "숨고" },
      { text: "증여세 관련 지분설정에 대해 상담드렸는데 자세한 설명 감사드립니다. 역시 세무사님께 여쭤보는 게 제일 현명해요", reviewer: "이**", src: "숨고" },
      { text: "내집마련계획에 큰 도움이 될 것 같습니다", reviewer: "강**", src: "숨고" },
      { text: "복잡한 상황임에도 그에 맞는 현실적인 분석과 대책 방안을 잘 설명해주셨습니다", reviewer: "손**", src: "숨고" },
      { text: "아파트 매수 관련해서 매우 현실적으로 세세히 상담해주셨습니다. 만족스러운 상담이었습니다", reviewer: "홍**", src: "숨고" },
    ],
  },
  {
    headline: "발 뻗고 잘 수 있겠어요",
    headlineBy: "라** 고객님",
    reviews: [
      { text: "10시가 넘는 시간인데도 너무 친절하게 합리적인 비용으로 상담을 해주셔서 감사합니다", reviewer: "wooj****", src: "엑스퍼트" },
      { text: "주말에 쉬시는데 자세히 설명해주셔서 너무 감사합니다. 도움이 많이 되었어요", reviewer: "psuy****", src: "엑스퍼트" },
      { text: "늦은 시간임에도 사전질문을 바탕으로 상황에 맞게 꼼꼼한 설명을 해주셨습니다", reviewer: "강**", src: "숨고" },
      { text: "주말 저녁이었는데 늦은 시간 상세하게 전화로 상담해주셔서 도움이 많이 되었습니다!", reviewer: "이**", src: "숨고" },
      { text: "늦은 시간에 연락드렸는데 너무 감사했습니다", reviewer: "조**", src: "숨고" },
      { text: "늦은 시간에 요청드렸는데 넘 친절하고 명확하게 알려주셔서 감사합니다. 덕분에 오늘 발 뻗고 잘 수 있겠어요", reviewer: "라**", src: "엑스퍼트" },
      { text: "이른 아침에도 궁금한 사항에 대해 세심하게 알려주셨어요!", reviewer: "구**", src: "숨고" },
      { text: "퇴근 후에만 통화가 가능해서 늦은 시간에 상담 요청드렸는데도 친절하게 진행해주셨어요", reviewer: "신**", src: "숨고" },
    ],
  },
  {
    headline: "재방문 할 의사 101퍼입니다",
    headlineBy: "k2y0**** 고객님",
    reviews: [
      { text: "최고입니다. 계속적으로 세무일 생기면 연락하고 싶어요", reviewer: "공탁오****", src: "택슬리" },
      { text: "추후 또 상담받고 싶은 마음 100% 입니다", reviewer: "본등기****", src: "택슬리" },
      { text: "너무너무 만족합니다. 앞으로 여기에 맡기려고 해요. 정말 추천드려요!!", reviewer: "빵또아****", src: "택슬리" },
      { text: "다음번에도 관련해서 상담할 일이 있으면 다시 찾고 싶어요~", reviewer: "고지세****", src: "택슬리" },
      { text: "앞으로 세무는 여기에 맡기려해요", reviewer: "채**", src: "숨고" },
      { text: "재이용 하고 싶은 마음 큽니다", reviewer: "흑**", src: "엑스퍼트" },
      { text: "추후에 재방문 할 의사 101퍼입니다", reviewer: "k2y0****", src: "엑스퍼트" },
      { text: "세무 상담 필요할때는 무조건 김근량 세무사님께 오겠습니다!!", reviewer: "익명", src: "엑스퍼트" },
    ],
  },
];

const SOURCE_BG: Record<CardReview["src"], string> = {
  택슬리: "#eff6ff",
  숨고: "#f0fdf4",
  엑스퍼트: "#fef3c7",
};
const SOURCE_FG: Record<CardReview["src"], string> = {
  택슬리: "#1d4ed8",
  숨고: "#15803d",
  엑스퍼트: "#b45309",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const n = Math.max(0, Math.min(9, Number(url.searchParams.get("n") ?? "0")));
  const card = CARDS[n];

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
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "70px 70px 60px",
          fontFamily: "Pretendard",
          letterSpacing: "-0.03em",
        }}
      >
        {/* 상단 메타 라인 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 18,
              fontWeight: 700,
              color: "#475569",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0052FF",
                display: "flex",
              }}
            />
            <span style={{ display: "flex" }}>세무회계 새벽 고객 후기</span>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#94a3b8",
              display: "flex",
            }}
          >
            {String(n + 1).padStart(2, "0")} / 10
          </div>
        </div>

        {/* 인용 헤드라인 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              fontSize: 130,
              lineHeight: 0.7,
              fontWeight: 800,
              color: "#0052FF",
              opacity: 0.18,
              display: "flex",
              height: 60,
            }}
          >
            “
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.25,
              display: "flex",
            }}
          >
            {card.headline}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#64748b",
              display: "flex",
            }}
          >
            — {card.headlineBy}
          </div>
        </div>

        {/* 후기 리스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {card.reviews.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                background: "#f8fafc",
                borderRadius: 14,
                padding: "16px 22px",
              }}
            >
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 600,
                  color: "#0f172a",
                  lineHeight: 1.45,
                  display: "flex",
                }}
              >
                {r.text}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    background: SOURCE_BG[r.src],
                    color: SOURCE_FG[r.src],
                    fontSize: 14,
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: 6,
                    display: "flex",
                  }}
                >
                  {r.src}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", display: "flex" }}>
                  {r.reviewer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", display: "flex" }}>
              세무회계 새벽 · dawntax.com
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#64748b", display: "flex" }}>
              대표세무사 김근량 · 010-3262-3295
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        { name: "Pretendard", data: medium, weight: 500 },
        { name: "Pretendard", data: bold, weight: 700 },
        { name: "Pretendard", data: extraBold, weight: 800 },
      ],
    },
  );
}

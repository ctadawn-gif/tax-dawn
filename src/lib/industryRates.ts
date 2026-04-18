// 2025년 귀속 경비율 고시 (국세청고시 제2026-14호)
// 인적용역(940***): 수입 4천만원 이하 기본율, 초과분 초과율 적용

export type IndustryRate = {
  code: string;
  name: string;
  simpleRate: number;
  simpleExcessRate: number | null;
  standardRate: number;
  category: string;
};

export const EXCESS_THRESHOLD = 4000; // 만원

export const INDUSTRY_RATES: IndustryRate[] = [
  // ── 서비스 (인적용역 940***) ──
  { code: "940100", name: "작가", simpleRate: 58.7, simpleExcessRate: 42.2, standardRate: 7.2, category: "서비스" },
  { code: "940200", name: "화가 및 관련예술가", simpleRate: 68.0, simpleExcessRate: 55.2, standardRate: 16.6, category: "서비스" },
  { code: "940301", name: "작곡가", simpleRate: 49.7, simpleExcessRate: 29.6, standardRate: 5.8, category: "서비스" },
  { code: "940302", name: "배우 등", simpleRate: 29.0, simpleExcessRate: 10.6, standardRate: 5.9, category: "서비스" },
  { code: "940303", name: "모델", simpleRate: 40.9, simpleExcessRate: 17.3, standardRate: 10.0, category: "서비스" },
  { code: "940304", name: "가수", simpleRate: 13.5, simpleExcessRate: 4.2, standardRate: 5.7, category: "서비스" },
  { code: "940305", name: "성악가 등", simpleRate: 61.6, simpleExcessRate: 46.2, standardRate: 26.6, category: "서비스" },
  { code: "940306", name: "1인미디어콘텐츠창작자", simpleRate: 64.1, simpleExcessRate: 49.7, standardRate: 12.1, category: "서비스" },
  { code: "940500", name: "연예보조서비스", simpleRate: 70.9, simpleExcessRate: 59.3, standardRate: 16.2, category: "서비스" },
  { code: "940600", name: "자문, 감독, 지도료, 고문료", simpleRate: 58.4, simpleExcessRate: 41.8, standardRate: 7.6, category: "서비스" },
  { code: "940901", name: "바둑기사", simpleRate: 62.6, simpleExcessRate: 47.6, standardRate: 16.9, category: "서비스" },
  { code: "940902", name: "꽃꽂이 및 요리교사", simpleRate: 81.8, simpleExcessRate: 74.5, standardRate: 22.3, category: "서비스" },
  { code: "940903", name: "재단사 및 학원강사", simpleRate: 61.7, simpleExcessRate: 46.4, standardRate: 15.4, category: "서비스" },
  { code: "940904", name: "직업운동가", simpleRate: 54.5, simpleExcessRate: 36.3, standardRate: 15.7, category: "서비스" },
  { code: "940905", name: "유흥접객원 및 댄서", simpleRate: 61.7, simpleExcessRate: 46.4, standardRate: 23.5, category: "서비스" },
  { code: "940906", name: "보험설계사", simpleRate: 77.6, simpleExcessRate: 68.6, standardRate: 28.5, category: "서비스" },
  { code: "940907", name: "음료품배달원", simpleRate: 80.0, simpleExcessRate: 72.0, standardRate: 34.7, category: "서비스" },
  { code: "940908", name: "서적 및 화장품외판원", simpleRate: 75.0, simpleExcessRate: 65.0, standardRate: 19.9, category: "서비스" },
  { code: "940909", name: "컴퓨터프로그래머", simpleRate: 64.1, simpleExcessRate: 49.7, standardRate: 17.4, category: "서비스" },
  { code: "940910", name: "다단계판매원의후원수당", simpleRate: 67.8, simpleExcessRate: 54.9, standardRate: 14.1, category: "서비스" },
  { code: "940911", name: "기타 모집수당, 채권회수수당", simpleRate: 67.7, simpleExcessRate: 54.8, standardRate: 15.8, category: "서비스" },
  { code: "940912", name: "개인간병인", simpleRate: 80.2, simpleExcessRate: 72.3, standardRate: 34.0, category: "서비스" },
  { code: "940913", name: "대리운전기사", simpleRate: 73.7, simpleExcessRate: 63.2, standardRate: 32.2, category: "서비스" },
  { code: "940914", name: "골프장캐디", simpleRate: 74.3, simpleExcessRate: 64.0, standardRate: 20.9, category: "서비스" },
  { code: "940915", name: "목욕관리사", simpleRate: 78.2, simpleExcessRate: 69.5, standardRate: 39.7, category: "서비스" },
  { code: "940916", name: "행사도우미", simpleRate: 69.8, simpleExcessRate: 57.7, standardRate: 15.5, category: "서비스" },
  { code: "940917", name: "심부름용역원", simpleRate: 71.5, simpleExcessRate: 60.1, standardRate: 25.6, category: "서비스" },
  { code: "940918", name: "퀵서비스배달원", simpleRate: 79.4, simpleExcessRate: 71.2, standardRate: 19.8, category: "서비스" },
  { code: "940919", name: "이삿짐운반원", simpleRate: 74.2, simpleExcessRate: 63.9, standardRate: 27.6, category: "서비스" },
  { code: "940920", name: "학습지 방문강사", simpleRate: 75.0, simpleExcessRate: 65.0, standardRate: 31.5, category: "서비스" },
  { code: "940921", name: "교육교구 방문강사", simpleRate: 75.6, simpleExcessRate: 65.8, standardRate: 28.6, category: "서비스" },
  { code: "940922", name: "대여제품 방문점검원", simpleRate: 75.0, simpleExcessRate: 65.0, standardRate: 29.9, category: "서비스" },
  { code: "940923", name: "대출모집인", simpleRate: 67.5, simpleExcessRate: 54.5, standardRate: 28.6, category: "서비스" },
  { code: "940924", name: "신용카드회원모집인", simpleRate: 71.3, simpleExcessRate: 59.8, standardRate: 29.2, category: "서비스" },
  { code: "940925", name: "방과후강사", simpleRate: 69.3, simpleExcessRate: 57.0, standardRate: 19.3, category: "서비스" },
  { code: "940926", name: "소프트웨어프리랜서", simpleRate: 64.4, simpleExcessRate: 50.2, standardRate: 20.9, category: "서비스" },
  { code: "940927", name: "관광통역안내사", simpleRate: 64.1, simpleExcessRate: 49.7, standardRate: 17.0, category: "서비스" },
  { code: "940928", name: "어린이통학버스기사", simpleRate: 72.4, simpleExcessRate: 61.4, standardRate: 19.8, category: "서비스" },
  { code: "940929", name: "중고자동차판매원", simpleRate: 75.0, simpleExcessRate: 65.0, standardRate: 24.2, category: "서비스" },

  // ── 음식 ──
  { code: "552101", name: "한식일반", simpleRate: 89.7, simpleExcessRate: null, standardRate: 9.7, category: "음식" },
  { code: "552102", name: "중국음식점", simpleRate: 88.4, simpleExcessRate: null, standardRate: 10.2, category: "음식" },
  { code: "552103", name: "일본음식점", simpleRate: 86.7, simpleExcessRate: null, standardRate: 10.9, category: "음식" },
  { code: "552104", name: "서양음식점업", simpleRate: 87.4, simpleExcessRate: null, standardRate: 13.4, category: "음식" },
  { code: "552107", name: "치킨", simpleRate: 86.1, simpleExcessRate: null, standardRate: 12.0, category: "음식" },
  { code: "552108", name: "분식집, 간이음식점", simpleRate: 91.0, simpleExcessRate: null, standardRate: 12.1, category: "음식" },
  { code: "552303", name: "커피숍", simpleRate: 87.5, simpleExcessRate: null, standardRate: 15.1, category: "음식" },

  // ── 부동산 ──
  { code: "701102", name: "일반주택임대", simpleRate: 42.6, simpleExcessRate: null, standardRate: 20.2, category: "부동산" },
  { code: "701201", name: "점포(자기땅)", simpleRate: 41.5, simpleExcessRate: null, standardRate: 19.9, category: "부동산" },
  { code: "701202", name: "점포(타인땅), 소규모점포", simpleRate: 36.9, simpleExcessRate: null, standardRate: 12.2, category: "부동산" },
  { code: "701400", name: "전답 및 기타 토지", simpleRate: 14.6, simpleExcessRate: null, standardRate: 3.7, category: "부동산" },

  // ── 소매 ──
  { code: "525101", name: "전자상거래업", simpleRate: 86.0, simpleExcessRate: null, standardRate: 11.4, category: "소매" },
  { code: "525103", name: "전자상거래중개", simpleRate: 86.0, simpleExcessRate: null, standardRate: 10.0, category: "소매" },
  { code: "525104", name: "SNS마켓", simpleRate: 86.0, simpleExcessRate: null, standardRate: 10.4, category: "소매" },
  { code: "525105", name: "해외직구대행업", simpleRate: 86.0, simpleExcessRate: null, standardRate: 15.6, category: "소매" },
  { code: "501202", name: "중고자동차", simpleRate: 91.8, simpleExcessRate: null, standardRate: 2.4, category: "소매" },
  { code: "521100", name: "슈퍼마켓", simpleRate: 95.2, simpleExcessRate: null, standardRate: 2.8, category: "소매" },
  { code: "521992", name: "편의점", simpleRate: 93.7, simpleExcessRate: null, standardRate: 6.0, category: "소매" },

  // ── 서비스 (비인적용역) ──
  { code: "809005", name: "일반교과학원", simpleRate: 80.0, simpleExcessRate: null, standardRate: 21.5, category: "서비스" },
  { code: "809007", name: "공부방, 교습소", simpleRate: 78.0, simpleExcessRate: null, standardRate: 23.4, category: "서비스" },
  { code: "809017", name: "외국어학원", simpleRate: 83.2, simpleExcessRate: null, standardRate: 23.7, category: "서비스" },
  { code: "809016", name: "온라인 교육학원", simpleRate: 83.2, simpleExcessRate: null, standardRate: 32.1, category: "서비스" },
  { code: "741101", name: "변호사", simpleRate: 44.6, simpleExcessRate: null, standardRate: 15.9, category: "서비스" },
  { code: "741107", name: "법무사", simpleRate: 58.3, simpleExcessRate: null, standardRate: 15.5, category: "서비스" },
  { code: "741201", name: "세무사(세무조정,고문료)", simpleRate: 58.2, simpleExcessRate: null, standardRate: 23.0, category: "서비스" },
  { code: "741203", name: "세무사(기장대리)", simpleRate: 72.9, simpleExcessRate: null, standardRate: 23.0, category: "서비스" },
  { code: "742105", name: "건축사", simpleRate: 73.6, simpleExcessRate: null, standardRate: 21.0, category: "서비스" },
  { code: "722000", name: "응용 소프트웨어 개발 및 공급", simpleRate: 75.2, simpleExcessRate: null, standardRate: 24.7, category: "서비스" },
  { code: "721000", name: "컴퓨터시스템통합자문 및 구축", simpleRate: 75.0, simpleExcessRate: null, standardRate: 23.4, category: "서비스" },
  { code: "749910", name: "시각디자인", simpleRate: 78.8, simpleExcessRate: null, standardRate: 19.1, category: "서비스" },
  { code: "749914", name: "인테리어디자인", simpleRate: 81.5, simpleExcessRate: null, standardRate: 21.9, category: "서비스" },
  { code: "749915", name: "제품디자인", simpleRate: 82.0, simpleExcessRate: null, standardRate: 21.0, category: "서비스" },
  { code: "930203", name: "일반미용", simpleRate: 82.4, simpleExcessRate: null, standardRate: 22.0, category: "서비스" },
  { code: "930201", name: "일반이용", simpleRate: 82.7, simpleExcessRate: null, standardRate: 27.3, category: "서비스" },
  { code: "852000", name: "수의업", simpleRate: 65.1, simpleExcessRate: null, standardRate: 12.6, category: "서비스" },
  { code: "702001", name: "부동산중개업", simpleRate: 78.2, simpleExcessRate: null, standardRate: 23.4, category: "부동산" },

  // ── 보건 ──
  { code: "851201", name: "일반과, 내과, 소아과", simpleRate: 70.5, simpleExcessRate: null, standardRate: 27.9, category: "보건" },
  { code: "851209", name: "성형외과", simpleRate: 42.7, simpleExcessRate: null, standardRate: 16.1, category: "보건" },
  { code: "851211", name: "치과의원", simpleRate: 61.7, simpleExcessRate: null, standardRate: 17.2, category: "보건" },
  { code: "851212", name: "한의원", simpleRate: 56.6, simpleExcessRate: null, standardRate: 18.9, category: "보건" },

  // ── 운수 ──
  { code: "602201", name: "택시", simpleRate: 90.8, simpleExcessRate: null, standardRate: 24.3, category: "운수" },
  { code: "602302", name: "대형화물(5톤이상)", simpleRate: 91.1, simpleExcessRate: null, standardRate: 26.9, category: "운수" },
  { code: "602307", name: "용달차(1톤 이하)", simpleRate: 89.7, simpleExcessRate: null, standardRate: 27.9, category: "운수" },
];

export const CATEGORIES = [...new Set(INDUSTRY_RATES.map((r) => r.category))];

export function calcExpenseByRate(
  revenue: number,
  rate: IndustryRate,
  method: "simple" | "standard"
): number {
  if (method === "standard") {
    return revenue * (rate.standardRate / 100);
  }
  // 단순경비율
  if (rate.simpleExcessRate != null && revenue > EXCESS_THRESHOLD) {
    const baseExpense = EXCESS_THRESHOLD * (rate.simpleRate / 100);
    const excessExpense =
      (revenue - EXCESS_THRESHOLD) * (rate.simpleExcessRate / 100);
    return baseExpense + excessExpense;
  }
  return revenue * (rate.simpleRate / 100);
}

export function searchIndustry(query: string): IndustryRate[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return INDUSTRY_RATES.filter(
    (r) =>
      r.code.includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  ).slice(0, 20);
}

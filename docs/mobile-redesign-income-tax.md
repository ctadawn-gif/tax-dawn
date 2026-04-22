# `/income-tax` 모바일 재설계 작업 문서

> 2026 종합소득세 신고대행 랜딩페이지의 모바일 전용 디자인 재설계 기획서.
> PC 버전은 유지, 모바일(375px 기준)만 Variant에서 다시 뽑아 적용.

## 작업 방식

1. Variant에서 섹션별로 모바일 디자인 생성 (체이닝)
2. 생성된 디자인 코드를 Claude Code에 전달 → `md:` 분기로 적용
3. 하단 체크박스로 진행 상황 추적

## 섹션 리스트 및 진행 체크

| # | 섹션 | 컴포넌트 파일 | 모바일 재설계 | Variant | 코드 반영 |
|---|---|---|---|---|---|
| 1 | AnnouncementBar | `src/components/income-tax/AnnouncementBar.tsx` | 롤링 공지 한 줄 | ☐ | ☐ |
| 2 | Navbar | `src/components/Navbar.tsx` | 햄버거 + 로고 + 전화아이콘 sticky | ☐ | ☐ |
| 3 | Hero | `src/components/income-tax/Hero.tsx` | D-day 뱃지 + 3줄 헤드라인 + CTA 2개 | ☐ | ☐ |
| 4 | Differentiators | `src/components/income-tax/Differentiators.tsx` | 세로 카드 스택, 아이콘+제목+2줄 | ☐ | ☐ |
| 5 | TrustBadges | `src/components/income-tax/TrustBadges.tsx` | 2x2 큰 숫자 그리드 | ☐ | ☐ |
| 6 | FeeTable | `src/components/income-tax/FeeTable.tsx` | 세로 카드 3개 비교, 추천 강조 | ☐ | ☐ |
| 7 | Profiles | `src/components/income-tax/Profiles.tsx` | 가로 스와이프 프로필 카드 | ☐ | ☐ |
| 8 | Process | `src/components/income-tax/Process.tsx` | 세로 타임라인 | ☐ | ☐ |
| 9 | Documents | `src/components/income-tax/Documents.tsx` | 업종별 탭 + 아코디언 | ☐ | ☐ |
| 10 | FAQ | `src/components/income-tax/FAQ.tsx` | 아코디언 + 카테고리 칩 | ☐ | ☐ |
| 11 | Testimonials | `src/components/income-tax/IncomeTaxTestimonials.tsx` | 1장씩 스와이프 캐러셀 | ☐ | ☐ |
| 12 | ContactForm | `src/components/income-tax/ContactForm.tsx` | 1컬럼, 필드 48px, 큰 제출 | ☐ | ☐ |
| 13 | FinalCTA | `src/components/income-tax/FinalCTA.tsx` | 풀블리드 CTA 2개 | ☐ | ☐ |
| + | **StickyBottomBar** (신규) | *(새 컴포넌트 필요)* | 항상 하단 고정 "상담신청 / 📞 전화" | ☐ | ☐ |

## 벤치마크 참고 사이트

| 사이트 | 참고 포인트 |
|---|---|
| 토스 (toss.im) | 정보 밀도, 여백 감각, 큰 숫자 카드 |
| 삼쩜삼 (3o3.co.kr) | 직접 경쟁사 — 세무 모바일 UX 전반 |
| 카카오뱅크 / 카카오페이 | 금융 신뢰감, 단계별 플로우 |
| 닥터나우 | 전문가 프로필 카드 패턴 |
| 쿠팡 | 하단 고정 CTA, 전환 최적화 |
| 네이버 고객센터 | FAQ 카테고리 칩 |
| 배민 | 리뷰 캐러셀 스와이프 UX |

## 톤앤매너

- 전문성 있되 딱딱하지 않게
- 네이버 모바일 수준의 정보 밀도
- 파란색(#2563eb 계열) 포인트 + 흰 배경
- 숫자/실적은 크고 대담하게

## Variant 초기 프롬프트

```
세무사 사무실(세무회계 새벽)의 종합소득세 신고대행 랜딩페이지를
모바일 전용(375px)으로 설계해줘. PC 버전은 이미 존재하고,
모바일만 처음부터 다시 디자인하는 작업이야.

[프로젝트 맥락]
- 2026년 5월 종합소득세 신고시즌 대응
- 타깃: 프리랜서, 개인사업자, N잡러 (네이버 블로그 유입이 주)
- 핵심 차별점: AI 자동신고 아님, 대표세무사 2인 직접 크로스체크
- 목표: 상담신청 폼 제출 전환

[참고 벤치마크]
- 토스 (toss.im) — 정보 밀도, 여백 감각, 큰 숫자 카드
- 삼쩜삼 (3o3.co.kr) — 직접 경쟁사, 세무 모바일 UX 패턴
- 카카오뱅크 / 카카오페이 — 금융 신뢰감, 단계별 플로우
- 닥터나우 — 전문가 프로필 카드 패턴
- 쿠팡 — 하단 고정 CTA

[톤앤매너]
- 전문성 있되 딱딱하지 않게
- 네이버 모바일 수준 정보 밀도 (한 화면에 많이 보이되 답답하지 않게)
- 파란색(#2563eb 계열) 포인트 + 깔끔한 흰 배경
- 숫자/실적은 크고 대담하게

[필수 섹션과 모바일 요구사항]
1. AnnouncementBar: 롤링 공지 한 줄
2. Navbar: 햄버거 + 로고 + 전화아이콘 (상단 sticky)
3. Hero: D-day 뱃지 / 헤드라인 3줄 이내 / 서브카피 2줄 / 메인 CTA + 전화 보조 버튼
4. Differentiators: 세로 카드 3~4개, 아이콘+제목+2줄
5. TrustBadges: 2x2 큰 숫자 그리드 (500건+, 15년+, 2인 검토, 환급만족)
6. FeeTable: 세로 카드 3개 (기본/추천/프리미엄), 추천은 브랜드 컬러 보더
7. Profiles: 가로 스와이프 프로필 카드 2장 (고유빈, 김근량 세무사)
8. Process: 세로 타임라인, 번호 원과 연결선
9. Documents: 업종별 탭(직장인/프리랜서/사업자) + 아코디언
10. FAQ: 아코디언 + 상단 카테고리 칩
11. Testimonials: 1장씩 스와이프 캐러셀 + dot 인디케이터
12. ContactForm: 1컬럼, 필드 48px 높이, 큰 제출 버튼
13. FinalCTA: 풀블리드 CTA 2개 (상담신청 / 전화걸기)
+ 하단 고정 CTA 바: "무료상담" / "📞 전화" 2버튼

[요청]
먼저 Hero 섹션만 한 개 디자인해줘. 확정되면 나머지 섹션을
체이닝으로 이어서 만들자.
```

## 주요 카피 (이미 확정된 것)

- 메인 헤드라인: "AI 자동신고가 아닌, 대표 세무사가 직접 신고합니다."
- 서브카피: "과다하게 돌려받은 환급금은 몇 년 뒤 가산세와 함께 돌아옵니다. 매년 500건 이상의 신고를, 대표세무사 2인이 직접 크로스체크합니다."
- D-day 뱃지: "D-{일수} · 2026년 6월 1일 신고 마감"
- 세무사 2인: 고유빈(남), 김근량(여) — 서울 송파구 위례서로 252 유원플러스송파 610호

## 연락처 정보

- 대표 전화: 010-3262-3295
- 네이버 톡톡: https://talk.naver.com/ct/wbwmjv1
- 이메일: noreply@dawntax.com (발신), cta.dawn@gmail.com & cta.ryang@gmail.com (수신)

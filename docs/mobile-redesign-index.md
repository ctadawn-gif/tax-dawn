# 전체 사이트 모바일 재설계 마스터 인덱스

> tax-dawn 웹사이트를 **PC 유지 + 모바일 재설계(375px)** 방식으로 전면 개편.
> Variant에서 디자인 뽑기 → Claude Code가 `md:` 분기로 적용 → 체크리스트로 진행 관리.

## 🎯 최상위 목표

- PC는 괜찮으므로 건드리지 않음
- 모바일을 "PC 욱여넣은 것"이 아닌 **모바일 우선 설계**로 재구축
- 블로그 → 모바일 유입이 주 채널이므로 모바일이 사실상 **메인 뷰**

## 📚 문서 구조

| 문서 | 대상 페이지 | 우선순위 |
|---|---|---|
| [income-tax](mobile-redesign-income-tax.md) | `/income-tax` (종소세 신고대행 랜딩) | **1 — 진행 중** |
| [calculators](mobile-redesign-calculators.md) | `/calculator/*` (6개 계산기) | **2** |
| [home](mobile-redesign-home.md) | `/` (메인 홈) | **3** |
| [info-pages](mobile-redesign-info-pages.md) | `/about`, `/contact`, `/updates` | **4** |

## 🗓️ 추천 작업 순서

```
Phase 1 — /income-tax           (5월 시즌 대비, 전환 핵심)
Phase 2 — 계산기 공통 템플릿     (1개 디자인 → 6개 적용 = ROI 최고)
Phase 3 — / (홈)                (블로그 유입 첫 인상)
Phase 4 — /about, /contact, /updates  (마무리)
```

## 🧩 전체 사이트 공통 모바일 요소

페이지와 무관하게 모든 곳에 적용되는 패턴.

### 1. Navbar (모바일)
- 햄버거 아이콘 + 로고 + 📞 전화 아이콘 (우측)
- 상단 sticky
- 햄버거 탭 시 전체 메뉴 오버레이 (홈 / 계산기 / 소개 / 연락처 / 블로그)

### 2. AnnouncementBar
- 한 줄 롤링 공지
- "시즌 한정" 같은 메시지를 상단에 배치
- 모바일에서는 세로 높이 최소화

### 3. Footer
- 모바일용 축약: 상호 / 대표자 / 사업자번호 / 주소 / 대표번호만
- 아코디언으로 "서비스/회사/고객센터" 접기

### 4. **StickyBottomBar (신규)**
- **모든 페이지 하단 고정** 2버튼: [무료상담] [📞 전화]
- 상담 폼이 있는 섹션에 진입하면 자동 숨김
- 전환률 핵심 — 쿠팡/배민 스타일

### 5. 공통 스타일 가이드
```
컬러:
- 브랜드 블루: #2563eb (brand-blue)
- 배경: 흰색 기본
- 텍스트: #0f172a (primary), #64748b (secondary)

타이포:
- 모바일 헤드라인: 24~28px
- 모바일 서브: 14~15px
- CTA 버튼: 15~16px bold

여백:
- 섹션 상하: pt-10 pb-12 (md:pt-24 md:pb-24)
- 좌우: px-5 (md:px-8)
- 카드 padding: p-5 (md:p-8)

인터랙션:
- 터치 영역 최소 44x44px (iOS) / 48x48px (Android)
- 버튼 py-3.5 이상
- 링크 간격 vertical 8px+
```

## ✅ 전체 진행 대시보드

### Phase 1 — /income-tax
- [ ] Hero
- [ ] Differentiators
- [ ] TrustBadges
- [ ] FeeTable
- [ ] Profiles
- [ ] Process
- [ ] Documents
- [ ] FAQ
- [ ] Testimonials
- [ ] ContactForm
- [ ] FinalCTA

### Phase 2 — 계산기 공통
- [ ] Hero
- [ ] 입력 영역 (아코디언)
- [ ] 결과 요약 sticky
- [ ] 결과 상세 (타임라인)
- [ ] 시즌 CTA 배너
- [ ] 참고사항
- [ ] 최종 CTA
- [ ] 6개 계산기 적용 완료

### Phase 3 — 홈 (/)
- [ ] Hero
- [ ] Services
- [ ] Problem
- [ ] Testimonials
- [ ] CTA
- [ ] Location

### Phase 4 — 정보 페이지
- [ ] /contact
- [ ] /about
- [ ] /updates

### 공통 (전체 페이지 영향)
- [ ] Navbar 모바일 재설계
- [ ] AnnouncementBar 모바일 최적화
- [ ] Footer 모바일 축약
- [ ] StickyBottomBar 신규 구현

## 🔧 기술 구현 원칙

1. **PC 코드는 건드리지 않음** — 모든 변경은 mobile-first로 쓰고 `md:` 이상에서 PC 기존 스타일 유지
2. **컴포넌트 분기**: 모바일/PC 구조가 크게 다를 때는 같은 컴포넌트 내 조건부 렌더 (Tailwind `hidden md:block` / `md:hidden`)
3. **Variant 코드는 참고용**: 디자인 감각/레이아웃만 참고, 코드는 프로젝트 컨벤션(Tailwind + 기존 컴포넌트 구조)에 맞게 재작성
4. **Next.js 16 주의**: `node_modules/next/dist/docs/` 참조, 기존 아키텍처 유지

## 📝 카피/정보 원본

- 블로그: https://blog.naver.com/tax_dawn
- 네이버 플레이스: https://naver.me/5yP5BKUk
- 대표 전화: 010-3262-3295
- 대표세무사: 고유빈(남), 김근량(여)
- 주소: 서울 송파구 위례서로 252 유원플러스송파 610호
- 메인 브랜드 컬러: `#2563eb` (Tailwind `blue-600`)
- 기존 카피는 [landing-종합소득세-copy.md](landing-종합소득세-copy.md) 참조

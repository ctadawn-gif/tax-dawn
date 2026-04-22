import type { Metadata } from "next";
import "./globals.css";
import FloatingTalk from "@/components/FloatingTalk";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dawntax.com"),
  title: {
    default: "세무회계 새벽 | 무료 세금 계산기 6종",
    template: "%s | 세무회계 새벽",
  },
  description:
    "종합소득세, 부가세, 상속·증여세, 취득세, 4대보험료까지 — 로그인 없이 3분이면 내 세금을 확인할 수 있습니다. 세무사가 직접 만든 무료 계산기.",
  openGraph: {
    title: "세무회계 새벽 | 무료 세금 계산기",
    description: "종소세·부가세·상속증여세·취득세·4대보험 계산기",
    type: "website",
    locale: "ko_KR",
    siteName: "세무회계 새벽",
  },
  twitter: {
    card: "summary_large_image",
    title: "세무회계 새벽 | 무료 세금 계산기",
    description: "종소세·부가세·상속증여세·취득세·4대보험 계산기",
  },
  verification: {
    google: "sSGI8YNGJUTOdLmL7jIc8WkB-654YhwQnRoEI06CqaM",
    other: {
      "naver-site-verification": "b99527fd08c040bee26d33c7f5ab814124bb575c",
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "AccountingService"],
  name: "세무회계 새벽",
  alternateName: "Tax Dawn",
  url: "https://www.dawntax.com",
  logo: "https://www.dawntax.com/logo.png",
  image: "https://www.dawntax.com/logo.png",
  description:
    "종합소득세·부가세·상속증여세·취득세·4대보험까지, 세무사가 직접 만든 무료 세금 계산기 6종과 대표세무사 2인 크로스체크 신고대행.",
  priceRange: "₩₩",
  address: {
    "@type": "PostalAddress",
    streetAddress: "위례서로 252",
    addressLocality: "송파구",
    addressRegion: "서울특별시",
    addressCountry: "KR",
  },
  areaServed: { "@type": "Country", name: "KR" },
  telephone: ["+82-10-3262-3295", "+82-10-9374-4916"],
  sameAs: [
    "https://blog.naver.com/tax_dawn",
    "https://naver.me/5yP5BKUk",
  ],
  employee: [
    {
      "@type": "Person",
      name: "김근량",
      jobTitle: "대표세무사",
      telephone: "+82-10-3262-3295",
      knowsAbout: ["종합소득세", "부가가치세", "사업자 기장대행"],
    },
    {
      "@type": "Person",
      name: "고유빈",
      jobTitle: "대표세무사",
      telephone: "+82-10-9374-4916",
      knowsAbout: ["상속세", "증여세", "자금조달계획서", "자금출처 소명", "양도세"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingTalk />
        <ScrollToTop />
      </body>
    </html>
  );
}

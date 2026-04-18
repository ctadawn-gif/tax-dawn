import type { Metadata } from "next";
import "./globals.css";
import FloatingTalk from "@/components/FloatingTalk";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "세무회계 새벽 | 무료 세금 계산기 6종",
  description:
    "종합소득세, 부가세, 상속·증여세, 취득세, 4대보험료까지 — 로그인 없이 3분이면 내 세금을 확인할 수 있습니다. 세무사가 직접 만든 무료 계산기.",
  openGraph: {
    title: "세무회계 새벽 | 무료 세금 계산기",
    description: "종소세·부가세·상속증여세·취득세·4대보험 계산기",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
    locale: "ko_KR",
    siteName: "세무회계 새벽",
  },
  twitter: {
    card: "summary_large_image",
    title: "세무회계 새벽 | 무료 세금 계산기",
    description: "종소세·부가세·상속증여세·취득세·4대보험 계산기",
    images: ["/og-image.jpg"],
  },
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
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingTalk />
        <ScrollToTop />
      </body>
    </html>
  );
}

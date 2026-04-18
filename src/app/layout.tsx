import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세무회계 새벽 | 상속세·증여세·종합소득세 무료 계산기",
  description:
    "상속세, 증여세, 종합소득세 — 내 세금이 얼마인지 3분이면 계산됩니다. 세무사가 만든 무료 세금 계산기 6종.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

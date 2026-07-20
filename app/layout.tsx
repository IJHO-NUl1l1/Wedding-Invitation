import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-invitation-three-omega.vercel.app"),
  title: "고희성 ♥ 박지서 결혼합니다",
  description: "2026년 11월 14일 토요일 오후 12시 20분, 신도림 웨스턴 베니비스 그레이스홀에서 결혼합니다.",
  openGraph: {
    title: "고희성 ♥ 박지서 결혼합니다",
    description: "2026년 11월 14일 토요일 오후 12시 20분 · 신도림 웨스턴 베니비스 그레이스홀",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "https://picsum.photos/seed/wedding-heesung-jiseo/1200/630",
        width: 1200,
        height: 630,
        alt: "고희성 ♥ 박지서 결혼합니다",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKR.variable} ${cormorant.variable} ${greatVibes.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

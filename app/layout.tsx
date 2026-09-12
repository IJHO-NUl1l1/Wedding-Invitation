import type { Metadata, Viewport } from "next";
import { Hahmlet, Nanum_Pen_Script, Yellowtail } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const hahmlet = Hahmlet({
  variable: "--font-hahmlet",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nanumPen = Nanum_Pen_Script({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

const yellowtail = Yellowtail({
  variable: "--font-script",
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
        url: "/icons/icon.png",
        width: 1324,
        height: 1324,
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
      className={`${hahmlet.variable} ${nanumPen.variable} ${yellowtail.variable} h-full`}
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

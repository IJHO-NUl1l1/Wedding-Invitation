import type { Metadata, Viewport } from "next";
import { Hahmlet, Yellowtail } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const hahmlet = Hahmlet({
  variable: "--font-hahmlet",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * 2차 수정 4번: 손글씨체는 모두 교보 손글씨 2025 이유빈.
 * 교보문고 공식 배포 파일을 그대로 쓴다. 라이선스가 포맷 변경(woff2 변환·서브셋 포함)을
 * 금지하므로 TTF 원본을 바꾸지 말 것.
 */
const kyoboHand = localFont({
  variable: "--font-hand",
  src: "../public/fonts/KyoboHandwriting2025lyb.ttf",
  weight: "400",
  display: "swap",
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
      className={`${hahmlet.variable} ${kyoboHand.variable} ${yellowtail.variable} h-full`}
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

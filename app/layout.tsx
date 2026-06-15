import type { Metadata } from "next";
import { Noto_Serif_KR, Cormorant_Garamond, Great_Vibes } from "next/font/google";
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

export const metadata: Metadata = {
  title: "고희성 ♥ 박지서 결혼합니다",
  description: "2026년 11월 14일 토요일 오후 12시 20분, 신도림 웨스턴 베니비스 그레이스홀에서 결혼합니다.",
  openGraph: {
    title: "고희성 ♥ 박지서 결혼합니다",
    description: "2026년 11월 14일 토요일 오후 12시 20분",
    type: "website",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

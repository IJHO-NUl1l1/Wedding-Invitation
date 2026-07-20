"use client";

import { useEffect } from "react";
import { weddingData } from "@/app/data/mock";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";

const SITE_URL = "https://wedding-invitation-three-omega.vercel.app";
const OG_IMAGE = `${SITE_URL}/icon.svg`;

export default function KakaoShareButton() {
  useEffect(() => {
    console.log("[Kakao] SDK 로드 확인:", !!window.Kakao);
    console.log("[Kakao] JS Key:", KAKAO_JS_KEY ? "있음" : "없음 (env 확인 필요)");
    if (!window.Kakao) {
      console.warn("[Kakao] window.Kakao 없음 — SDK 스크립트 미로드");
      return;
    }
    if (window.Kakao.isInitialized()) {
      console.log("[Kakao] 이미 초기화됨");
      return;
    }
    if (KAKAO_JS_KEY) {
      window.Kakao.init(KAKAO_JS_KEY);
      console.log("[Kakao] init 완료, isInitialized:", window.Kakao.isInitialized());
    } else {
      console.error("[Kakao] NEXT_PUBLIC_KAKAO_JS_KEY 없음");
    }
  }, []);

  const handleShare = () => {
    console.log("[Kakao] 버튼 클릭");
    console.log("[Kakao] window.Kakao:", !!window.Kakao);
    console.log("[Kakao] isInitialized:", window.Kakao?.isInitialized());
    if (!window.Kakao?.isInitialized()) {
      console.error("[Kakao] 초기화 안 됨 — 공유 중단");
      return;
    }
    console.log("[Kakao] sendDefault 호출");
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${weddingData.groom.name} ♥ ${weddingData.bride.name} 결혼합니다`,
        description: `${weddingData.wedding.date} ${weddingData.wedding.dayOfWeek} ${weddingData.wedding.time}\n${weddingData.venue.name} ${weddingData.venue.hall}`,
        imageUrl: OG_IMAGE,
        link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
      },
      buttons: [
        {
          title: "청첩장 보기",
          link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL },
        },
      ],
    });
  };

  return (
    <button
      onClick={handleShare}
      aria-label="카카오톡으로 공유"
      className="fixed bottom-6 right-5 z-40 flex items-center gap-2 bg-[#FEE500] text-[#3C1E1E] text-xs font-serif rounded-full px-4 py-2.5 shadow-lg active:brightness-95 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 1C4.582 1 1 3.91 1 7.5c0 2.284 1.44 4.29 3.622 5.476L3.75 16.5l4.02-2.675A9.317 9.317 0 009 14c4.418 0 8-2.91 8-6.5S13.418 1 9 1z"
          fill="#3C1E1E"
        />
      </svg>
      카카오톡 공유
    </button>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EnvelopeCover from "@/app/components/EnvelopeCover";
import HeroSection from "@/app/components/HeroSection";
import CoupleSection from "@/app/components/CoupleSection";
import StoryGallery from "@/app/components/StoryGallery";
import DateSection from "@/app/components/DateSection";
import VenueSection from "@/app/components/VenueSection";
import DecisionSection from "@/app/components/DecisionSection";
import GuestbookSection from "@/app/components/GuestbookSection";
import ClosingSection from "@/app/components/ClosingSection";
import KakaoShareButton from "@/app/components/KakaoShareButton";
import MusicToggle from "@/app/components/MusicToggle";
import RsvpModal from "@/app/components/RsvpModal";

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative">
      {/* 봉투 커버: z-50 오버레이로 콘텐츠 위에 표시되다가 페이드아웃 */}
      <AnimatePresence>
        {!opened && (
          <EnvelopeCover
            key="envelope"
            onOpen={() => {
              setOpened(true);
              // 클릭 제스처 안에서 재생을 시작해야 자동재생이 허용된다
              window.dispatchEvent(new Event("bgm-start"));
              // 봉투 연출이 끝난 뒤 참석 여부 모달 등장
              setTimeout(() => window.dispatchEvent(new Event("rsvp-show")), 1600);
            }}
          />
        )}
      </AnimatePresence>

      {/* 내부 콘텐츠: 봉투 열림과 동시에 렌더 시작 (봉투가 z-50으로 가림) */}
      {opened && (
        <>
          <HeroSection />
          <CoupleSection />
          <StoryGallery />
          <DecisionSection />
          <DateSection />
          <VenueSection />
          <GuestbookSection />
          <ClosingSection />
          <KakaoShareButton />
        </>
      )}

      {/* 항상 마운트: 봉투 열기 클릭 제스처에서 bgm-start를 받아 재생 시작 */}
      <MusicToggle />
      <RsvpModal />
    </main>
  );
}

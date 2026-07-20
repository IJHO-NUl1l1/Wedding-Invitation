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

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative">
      {/* 봉투 커버: z-50 오버레이로 콘텐츠 위에 표시되다가 페이드아웃 */}
      <AnimatePresence>
        {!opened && (
          <EnvelopeCover key="envelope" onOpen={() => setOpened(true)} />
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
    </main>
  );
}

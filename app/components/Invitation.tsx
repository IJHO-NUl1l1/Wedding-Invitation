"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/app/components/HeroSection";
import GreetingSection from "@/app/components/GreetingSection";
import PeopleSection from "@/app/components/PeopleSection";
import StoryGallery from "@/app/components/StoryGallery";
import VenueSection from "@/app/components/VenueSection";
import DateSection from "@/app/components/DateSection";
import GuestbookSection from "@/app/components/GuestbookSection";
import AccountSection from "@/app/components/AccountSection";
import Overlay from "@/app/components/Overlay";
import PersonDetail from "@/app/components/PersonDetail";
import StoryDetail from "@/app/components/StoryDetail";
import KakaoShareButton from "@/app/components/KakaoShareButton";
import MusicToggle from "@/app/components/MusicToggle";
import RsvpButton from "@/app/components/RsvpButton";
import RsvpModal from "@/app/components/RsvpModal";
import { CLOSE_AT, isClosed } from "@/lib/expiry";

type Person = "groom" | "bride" | "story";

const OVERLAY_BG: Record<Person, string> = {
  groom: "var(--cream)",
  bride: "var(--cream)",
  story: "var(--maroon)",
};

export default function Invitation() {
  const [person, setPerson] = useState<Person | null>(null);
  // 페이지가 정적으로 미리 렌더되므로 폐쇄 판정은 클라이언트 시각으로 한다.
  // 판정 전(null)에는 아무것도 그리지 않아 청첩장이 잠깐 보였다 사라지는 것을 막는다.
  const [closed, setClosed] = useState<boolean | null>(null);

  useEffect(() => setClosed(isClosed()), []);

  if (closed === null) return <main className="min-h-dvh bg-ink" />;
  if (closed) return <ClosedNotice />;

  return (
    <main className="relative bg-ink">
      <HeroSection />
      <GreetingSection />
      <PeopleSection onOpen={setPerson} />
      <StoryGallery />
      <VenueSection />
      <DateSection />
      <GuestbookSection />
      <AccountSection />

      <Overlay
        open={person !== null}
        onClose={() => setPerson(null)}
        background={person ? OVERLAY_BG[person] : undefined}
      >
        {person === "story" ? (
          <StoryDetail />
        ) : person ? (
          <PersonDetail who={person} />
        ) : null}
      </Overlay>

      {/* 항상 떠 있는 컨트롤 */}
      <MusicToggle />
      <RsvpButton />
      <KakaoShareButton />
      <RsvpModal />
    </main>
  );
}

function ClosedNotice() {
  return (
    <main className="min-h-dvh bg-ink flex flex-col items-center justify-center px-8 text-center">
      <p className="font-script text-pink text-4xl leading-tight">Thank You</p>
      <p className="font-hand text-white text-[22px] mt-8 leading-relaxed">
        저희 두 사람의 시작을
        <br />
        함께 축복해 주셔서 감사합니다.
      </p>
      <p className="text-white/55 text-[13px] mt-8 leading-6">
        청첩장은 {CLOSE_AT.getMonth() + 1}월 {CLOSE_AT.getDate()}일부로 마감되었습니다.
      </p>
    </main>
  );
}

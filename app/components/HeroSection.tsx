"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

// frame-lace.jpg 안쪽 타원 구멍의 실측 위치 (868x859 기준)
const HOLE = { left: "23.3%", top: "18.7%", width: "51.5%", height: "61.2%" };

export default function HeroSection() {
  const { cover, wedding, venue } = weddingData;

  return (
    <section className="relative min-h-dvh bg-ink flex flex-col items-center justify-center gap-1 px-5 pt-10 pb-28">
      <motion.h1
        className="font-script text-pink text-[2.6rem] leading-tight text-center -rotate-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {cover.titleEn}
      </motion.h1>

      <motion.p
        className="font-hand text-white text-xl mt-2 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        ✻ {cover.subtitleEn} ✻
      </motion.p>

      {/* 레이스 프레임 + 타원 구멍 안의 사진 */}
      <motion.div
        className="relative w-full max-w-[25rem] aspect-[868/859] mt-5"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.9 }}
      >
        <div className="absolute rounded-[50%] overflow-hidden" style={HOLE}>
          <Image
            src={cover.image}
            alt="신랑 신부"
            fill
            priority
            sizes="(max-width: 400px) 60vw, 220px"
            className="object-cover"
          />
        </div>
        {/* 레이스는 검정 배경 위 흰 무늬. 원본 배경이 완전한 검정(#000)이 아니라
            screen 합성 시 사각형 자국이 남으므로, 대비를 올려 배경을 검정으로 눌러준다. */}
        <Image
          src={cover.frame}
          alt=""
          fill
          priority
          sizes="(max-width: 400px) 100vw, 352px"
          className="object-contain mix-blend-screen pointer-events-none [filter:brightness(0.85)_contrast(1.7)]"
        />
      </motion.div>

      <motion.div
        className="mt-6 text-center text-white space-y-1.5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p className="text-[15px] tracking-tight">
          {wedding.date} ({wedding.dayOfWeek.charAt(0)}) 12:20분
        </p>
        <p className="text-[15px] tracking-tight">{venue.name}</p>
        <p className="text-[13px] text-white/70">{venue.addressDetail}</p>
      </motion.div>
    </section>
  );
}

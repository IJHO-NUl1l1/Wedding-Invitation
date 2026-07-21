"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { weddingData } from "@/app/data/mock";

export default function HeroSection() {
  return (
    <section className="relative w-full h-svh overflow-hidden">
      {/* 배경 사진 */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <Image
          src="https://picsum.photos/seed/weddingmain/800/1200"
          alt="웨딩 사진"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal/50" />
      </motion.div>

      {/* 중앙 장식 프레임 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <motion.div
          className="relative border border-white/50 px-10 py-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
        >
          {/* 프레임 모서리 장식 */}
          <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white/80 -translate-x-px -translate-y-px" />
          <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white/80 translate-x-px -translate-y-px" />
          <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white/80 -translate-x-px translate-y-px" />
          <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white/80 translate-x-px translate-y-px" />

          <motion.p
            className="font-cormorant italic text-white/80 tracking-[0.25em] text-xs mb-5 uppercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            We're Getting Married
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
          >
            <span className="font-script text-4xl text-white">
              {weddingData.groom.nameEn}
            </span>
            <span className="text-blush text-2xl font-cormorant">&</span>
            <span className="font-script text-4xl text-white">
              {weddingData.bride.nameEn}
            </span>
          </motion.div>

          <motion.div
            className="w-16 h-px bg-white/50 mx-auto mb-5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          />

          <motion.p
            className="text-white font-serif text-base tracking-widest mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            {weddingData.groom.name} · {weddingData.bride.name}
          </motion.p>

          <motion.p
            className="text-white/70 font-cormorant text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {weddingData.wedding.date} {weddingData.wedding.dayOfWeek}
          </motion.p>
        </motion.div>

        {/* 인사말 */}
        <motion.p
          className="text-white/80 text-xs text-center leading-6 mt-8 font-serif whitespace-pre-line px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          {weddingData.greeting}
        </motion.p>
      </div>

      {/* 스크롤 유도 */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-white/60 text-xs tracking-[0.15em] font-cormorant uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

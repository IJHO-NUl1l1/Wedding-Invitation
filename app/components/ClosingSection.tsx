"use client";

import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

export default function ClosingSection() {
  const { groom, bride, wedding, closingMessage } = weddingData;

  return (
    <motion.section
      className="py-20 px-6 bg-cream text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9 }}
    >
      {/* 상단 장식선 */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="w-10 h-px bg-blush/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-blush/50" />
        <div className="w-10 h-px bg-blush/40" />
      </div>

      {/* 이니셜 */}
      <motion.p
        className="font-script text-6xl text-blush-dark mb-8"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        H & J
      </motion.p>

      {/* 마무리 문구 */}
      <motion.p
        className="font-serif text-charcoal text-sm leading-8 mb-8 whitespace-pre-line"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.65 }}
      >
        {closingMessage}
      </motion.p>

      {/* 신랑신부 서명 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mb-10"
      >
        <p className="font-cormorant italic text-charcoal-light tracking-widest text-sm">
          {groom.name} · {bride.name} 올림
        </p>
      </motion.div>

      {/* 하단 장식선 */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-8 h-px bg-blush/35" />
        <div className="w-1 h-1 rounded-full bg-blush/35" />
        <div className="w-8 h-px bg-blush/35" />
      </div>

      <p className="mt-6 text-xs text-charcoal-light/50 font-cormorant tracking-wider">
        {wedding.date} {wedding.dayOfWeek}
      </p>

      {/* BGM 출처 (CC BY 3.0 라이선스 표기 의무) */}
      <p className="mt-4 text-[10px] text-charcoal-light/35 font-cormorant tracking-wide">
        Music: &ldquo;Heartwarming&rdquo; Kevin MacLeod (incompetech.com) · CC BY 3.0
      </p>
    </motion.section>
  );
}

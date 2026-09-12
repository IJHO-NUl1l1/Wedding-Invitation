"use client";

import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

/** 시안의 흩뿌려진 분홍 장식 (꽃·하트·점) */
const ORNAMENTS = [
  { char: "✻", top: "6%", left: "14%", size: "text-lg" },
  { char: "•", top: "3%", left: "52%", size: "text-xs" },
  { char: "♥", top: "13%", left: "30%", size: "text-sm" },
  { char: "✻", top: "11%", left: "72%", size: "text-base" },
  { char: "•", top: "20%", left: "88%", size: "text-xs" },
  { char: "✻", top: "44%", left: "88%", size: "text-lg" },
  { char: "♥", top: "40%", left: "8%", size: "text-sm" },
  { char: "•", top: "56%", left: "46%", size: "text-xs" },
  { char: "♥", top: "72%", left: "36%", size: "text-base" },
  { char: "✻", top: "76%", left: "78%", size: "text-lg" },
  { char: "•", top: "68%", left: "12%", size: "text-xs" },
];

export default function GreetingSection() {
  const { greetingQuote, greetingLines } = weddingData;

  return (
    <section className="relative bg-ink px-6 py-20 overflow-hidden">
      {/* 인용시 */}
      <motion.div
        className="max-w-md mx-auto text-white/90 font-hand text-[19px] leading-9 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
      >
        {greetingQuote.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="mt-3 text-right text-white/70 text-[17px]">{greetingQuote.source}</p>
      </motion.div>

      {/* 초대 문구 */}
      <div className="relative max-w-md mx-auto mt-16">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {ORNAMENTS.map((o, i) => (
            <span
              key={i}
              className={`absolute text-pink/80 ${o.size}`}
              style={{ top: o.top, left: o.left }}
            >
              {o.char}
            </span>
          ))}
        </div>

        <div className="relative font-hand text-white text-[26px] leading-[2.6] text-center">
          {greetingLines.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

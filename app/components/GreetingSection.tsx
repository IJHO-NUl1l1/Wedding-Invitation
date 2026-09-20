"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { greetingBg } from "@/app/data/images";
import { weddingData } from "@/app/data/mock";

/** 초대 문구 주변에 흩뿌린 분홍 장식 (꽃·하트·점), 문구 영역 기준 % */
const ORNAMENTS = [
  { char: "✻", top: "2%", left: "4%", size: "text-[4.2cqw]" },
  { char: "♥", top: "10%", left: "90%", size: "text-[3.4cqw]" },
  { char: "•", top: "44%", left: "-2%", size: "text-[2.6cqw]" },
  { char: "✻", top: "50%", left: "94%", size: "text-[4.2cqw]" },
  { char: "♥", top: "88%", left: "8%", size: "text-[3.4cqw]" },
  { char: "•", top: "92%", left: "86%", size: "text-[2.6cqw]" },
];

/**
 * 인사말. 2차 수정에서 받은 흰 편지지(점선 테두리 + 리본) 위에 인용시와 초대 문구를 올린다.
 * 편지지 비율이 고정이라 글씨는 cqw 단위로 종이 폭에 맞춰 커지고 작아진다.
 */
export default function GreetingSection() {
  const { greetingQuote, greetingLines } = weddingData;

  return (
    <section className="bg-ink px-4 py-10">
      <div className="relative max-w-md mx-auto" style={{ containerType: "inline-size" }}>
        <Image
          src={greetingBg}
          alt=""
          width={900}
          height={1417}
          className="block w-full h-auto"
        />

        {/* 점선 테두리 안쪽, 리본 아래 영역 */}
        <div className="absolute left-[10%] right-[10%] top-[13%] bottom-[6%] flex flex-col justify-center font-hand text-ink">
          <motion.div
            className="text-center text-[5.4cqw] leading-[1.75] text-ink/80"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            {greetingQuote.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="mt-[1.5cqw] text-right text-[4.8cqw] text-ink/60">{greetingQuote.source}</p>
          </motion.div>

          <div className="relative mt-[7cqw]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {ORNAMENTS.map((o, i) => (
                <span
                  key={i}
                  className={`absolute text-pink ${o.size}`}
                  style={{ top: o.top, left: o.left }}
                >
                  {o.char}
                </span>
              ))}
            </div>

            <div className="relative text-center text-[6.2cqw] leading-[1.9] break-keep">
              {greetingLines.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

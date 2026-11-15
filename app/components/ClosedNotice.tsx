"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/app/components/SectionTitle";

/*
 * 예식이 끝난 뒤 더 이상 쓰지 않는 자리를 덮는 안내.
 *
 * 그 부분의 코드를 지우지 않고 이 안내로 갈아끼우기만 한다. 나중에 청첩장을 완전히 닫거나
 * 되돌릴 때 lib/expiry.ts 의 스위치만 바꾸면 된다.
 */
export default function ClosedNotice({
  title,
  lines,
  compact,
}: {
  /** 원래 그 자리에 있던 제목. 없으면 제목 없이 안내만 보여준다 */
  title?: string;
  lines: string[];
  /** 방명록 작성칸처럼 섹션 안의 일부만 덮을 때 */
  compact?: boolean;
}) {
  return (
    <motion.section
      className={compact ? "" : "bg-ink px-6 py-16"}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {title && <SectionTitle>{title}</SectionTitle>}

      <div
        className={`mx-auto max-w-sm rounded-2xl border border-white/15 bg-white/5 px-6 py-8 text-center ${
          compact ? "" : "mt-2"
        }`}
      >
        {lines.map((line, i) => (
          <p
            key={line}
            className={`break-keep leading-6 ${
              i === 0 ? "text-[15px] text-white" : "mt-2 text-[13px] text-white/55"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </motion.section>
  );
}

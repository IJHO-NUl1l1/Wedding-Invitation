"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

type Item = {
  key: string;
  src: string;
  alt: string;
  /** 시안 페이지 기준 중심 좌표(%) */
  cx: number;
  cy: number;
  /** 시안 페이지 폭 대비 요소 폭(%) */
  w: number;
  /** 시안에서 기울어진 각도(°, 양수 = 시계방향) */
  deg: number;
  /** 흰 여백을 두른 폴라로이드 느낌 */
  card?: boolean;
};

// 배열 순서 = 뒤→앞. 가족사진(맨뒤) → 흰 편지(엄마) → 아이사진 → 갈색 편지(아빠, 맨앞은 그대로 유지).
const GROOM: Item[] = [
  { key: "family", src: "/images/family-groom.jpg", alt: "가족사진", cx: 32, cy: 57, w: 65, deg: 0 },
  { key: "letter-m", src: "/images/letter-groom-mother.jpg", alt: "어머니의 편지", cx: 33, cy: 19, w: 59, deg: 17 },
  { key: "child", src: "/images/child-groom.jpg", alt: "어린 시절", cx: 79, cy: 28, w: 29, deg: -15, card: true },
  { key: "letter-f", src: "/images/letter-groom-father.jpg", alt: "아버지의 편지", cx: 66, cy: 76, w: 65, deg: -15 },
];

// 배열 순서 = 뒤→앞. 흰 편지가 맨 뒤, 가족사진이 맨 앞.
const BRIDE: Item[] = [
  { key: "letter-f", src: "/images/letter-bride-father.jpg", alt: "아버지의 편지", cx: 25, cy: 29, w: 50, deg: -5 },
  { key: "letter-m", src: "/images/letter-bride-mother.jpg", alt: "어머니의 편지", cx: 72, cy: 40, w: 53, deg: 13 },
  { key: "child", src: "/images/child-bride-cutout.png", alt: "어린 시절", cx: 92, cy: 22, w: 24, deg: 0 },
  { key: "family", src: "/images/family-bride.jpg", alt: "가족사진", cx: 48, cy: 77, w: 88, deg: 0 },
];

export default function PersonDetail({ who }: { who: "groom" | "bride" }) {
  const items = who === "groom" ? GROOM : BRIDE;
  const person = who === "groom" ? weddingData.groom : weddingData.bride;
  // 사진이 실제로 준비된 뒤에 나타나게 한다. 로딩 전에 애니메이션이 끝나면 툭 튀어나온다.
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-dvh bg-cream px-4 pt-16 pb-24">
      <p className="font-hand text-[27px] text-ink/85 text-center mb-3">
        {who === "groom" ? "신랑" : "신부"} {person.name}
      </p>

      <div className="relative w-full max-w-md mx-auto aspect-[495/881]">
        {items.map((it, i) => (
          <motion.div
            key={it.key}
            className={`absolute ${it.card ? "bg-white p-1.5" : ""}`}
            style={{
              left: `${it.cx}%`,
              top: `${it.cy}%`,
              width: `${it.w}%`,
              translate: "-50% -50%",
            }}
            initial={{ opacity: 0, y: 22, scale: 0.96, filter: "blur(8px)", rotate: it.deg }}
            animate={
              loaded[it.key]
                ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotate: it.deg }
                : { opacity: 0, y: 22, scale: 0.96, filter: "blur(8px)", rotate: it.deg }
            }
            transition={{ duration: 0.9, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={it.src}
              alt={it.alt}
              width={1000}
              height={1300}
              // 손글씨 편지라 기본 압축(75)에서는 획이 뭉갠다
              quality={92}
              className="w-full h-auto"
              onLoad={() => setLoaded((m) => ({ ...m, [it.key]: true }))}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

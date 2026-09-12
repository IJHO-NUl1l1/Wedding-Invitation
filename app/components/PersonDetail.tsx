"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

/**
 * 시안 4·5페이지를 그대로 옮긴 콜라주.
 *
 * 시안 페이지가 495x881(≈9:16)이라 같은 비율의 캔버스를 두고, 각 요소를
 * 시안에서 실측한 "중심 좌표 + 폭 + 회전각"으로 배치한다. 폭만 지정하고
 * 높이는 원본 비율대로 두는데, 시안은 편지를 크롭해 썼기 때문에 세로 길이는
 * 시안보다 조금 길다. 편지 내용이 잘리지 않는 쪽을 택했다.
 *
 * 배열 순서가 곧 z-order(뒤 → 앞)다.
 */
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

const GROOM: Item[] = [
  { key: "letter-m", src: "/images/letter-groom-mother.jpg", alt: "어머니의 편지", cx: 32, cy: 17, w: 55, deg: -2 },
  { key: "family", src: "/images/family-groom.jpg", alt: "가족사진", cx: 30, cy: 57, w: 61, deg: 0 },
  { key: "child", src: "/images/child-groom.jpg", alt: "어린 시절", cx: 72, cy: 28, w: 28, deg: 4, card: true },
  { key: "letter-f", src: "/images/letter-groom-father.jpg", alt: "아버지의 편지", cx: 62, cy: 72, w: 64, deg: -8 },
];

const BRIDE: Item[] = [
  { key: "letter-f", src: "/images/letter-bride-father.jpg", alt: "아버지의 편지", cx: 25, cy: 29, w: 43, deg: -2 },
  { key: "child", src: "/images/child-bride-cutout.png", alt: "어린 시절", cx: 78, cy: 22, w: 27, deg: 3 },
  { key: "letter-m", src: "/images/letter-bride-mother.jpg", alt: "어머니의 편지", cx: 75, cy: 43, w: 52, deg: 4 },
  { key: "family", src: "/images/family-bride.jpg", alt: "가족사진", cx: 48, cy: 74, w: 86, deg: -1 },
];

export default function PersonDetail({ who }: { who: "groom" | "bride" }) {
  const items = who === "groom" ? GROOM : BRIDE;
  const person = who === "groom" ? weddingData.groom : weddingData.bride;

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
            initial={{ opacity: 0, y: 14, rotate: it.deg }}
            animate={{ opacity: 1, y: 0, rotate: it.deg }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={it.src}
              alt={it.alt}
              width={1000}
              height={1300}
              // 손글씨 편지라 기본 압축(75)에서는 획이 뭉갠다
              quality={92}
              className="w-full h-auto"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";
import { openZoom } from "@/app/components/ZoomViewer";

type Item = {
  key: string;
  src: string;
  alt: string;
  /** 시안 페이지 기준 중심 좌표(%) */
  cx: number;
  cy: number;
  /** 시안 페이지 폭 대비 요소 폭(%) */
  w: number;
  /** 기울어진 각도(°, 양수 = 시계방향) */
  deg: number;
};

/*
 * 2차 수정 시안(v2-revision-0914/03-groom, 04-bride) 실측값. 배열 순서 = 뒤→앞.
 * 수정사항 5번에 따라 손글씨 제목을 없애고 사진을 화면 가득 키웠다.
 */
const GROOM: Item[] = [
  { key: "letter-m", src: "/images/groom-01.jpg", alt: "어머니의 편지", cx: 53.9, cy: 18.1, w: 72.6, deg: -7.7 },
  { key: "family", src: "/images/people-01.jpg", alt: "가족사진", cx: 66.7, cy: 56.8, w: 57.5, deg: 1.8 },
  { key: "child", src: "/images/groom-03.jpg", alt: "어린 시절", cx: 17.6, cy: 54.1, w: 30, deg: -4 },
  { key: "letter-f", src: "/images/groom-02.jpg", alt: "아버지의 편지", cx: 46.9, cy: 86.5, w: 76, deg: 11.8 },
];

const BRIDE: Item[] = [
  { key: "letter-f", src: "/images/bride-01.jpg", alt: "아버지의 편지", cx: 31.2, cy: 24.5, w: 62, deg: -7.3 },
  // 이전 버전 사진은 가로가 더 넓어서(595x1149), 시안의 새 사진과 높이가 비슷하도록 폭을 키웠다
  { key: "child", src: "/images/bride-03.png", alt: "어린 시절", cx: 75.7, cy: 21.4, w: 30, deg: 0 },
  { key: "family", src: "/images/people-02.jpg", alt: "가족사진", cx: 64.8, cy: 57.7, w: 65.4, deg: 0 },
  { key: "letter-m", src: "/images/bride-02.jpg", alt: "어머니의 편지", cx: 37.5, cy: 82.2, w: 68.9, deg: 10.1 },
];

export default function PersonDetail({ who }: { who: "groom" | "bride" }) {
  const items = who === "groom" ? GROOM : BRIDE;
  const person = who === "groom" ? weddingData.groom : weddingData.bride;
  // 사진이 실제로 준비된 뒤에 나타나게 한다. 로딩 전에 애니메이션이 끝나면 툭 튀어나온다.
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-dvh bg-cream px-2 pt-14 pb-28">
      <h2 className="sr-only">
        {who === "groom" ? "신랑" : "신부"} {person.name}
      </h2>

      <div className="relative w-full max-w-md mx-auto aspect-[495/881]">
        {items.map((it, i) => (
          <motion.button
            key={it.key}
            type="button"
            onClick={() => openZoom(it.src, it.alt)}
            aria-label={`${it.alt} 크게 보기`}
            className="absolute cursor-zoom-in"
            style={{
              left: `${it.cx}%`,
              top: `${it.cy}%`,
              width: `${it.w}%`,
              translate: "-50% -50%",
            }}
            initial={{ opacity: 0, y: 10, rotate: it.deg }}
            animate={
              loaded[it.key]
                ? { opacity: 1, y: 0, rotate: it.deg }
                : { opacity: 0, y: 10, rotate: it.deg }
            }
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={it.src}
              alt={it.alt}
              width={1000}
              height={1300}
              // 손글씨 편지라 기본 압축(75)에서는 획이 뭉갠다
              quality={90}
              className="block w-full h-auto"
              onLoad={() => setLoaded((m) => ({ ...m, [it.key]: true }))}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

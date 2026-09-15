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
  height: number;
  cx: number;
  cy: number;
  w: number;
  deg: number;
};

/**
 * 시안 6페이지. 적갈 바탕에 사진 2장과 메모지 2장을 어긋나게 배치한다.
 * 좌표는 직접 조정한 값이며 배열 순서가 z-order(뒤 → 앞)다.
 * 메모지는 두 사람이 직접 쓴 실물 사진이다(오른쪽 위 모눈 = 신부, 왼쪽 아래 노란 줄 = 신랑).
 */
export default function StoryDetail() {
  const { storyPage } = weddingData;
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const items: Item[] = [
    { key: "bubbles", src: storyPage.photos[0], alt: "비눗방울 사진", height: 1400, cx: 30, cy: 24, w: 59, deg: 10 },
    { key: "memo-grid", src: storyPage.memos[0], alt: "신부의 메모", height: 1000, cx: 80, cy: 25, w: 57, deg: -10 },
    { key: "roses", src: storyPage.photos[1], alt: "장미를 든 신부", height: 1400, cx: 67, cy: 76, w: 55, deg: 0 },
    { key: "memo-lined", src: storyPage.memos[1], alt: "신랑의 메모", height: 1000, cx: 18, cy: 72, w: 60, deg: 10 },
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden bg-maroon px-4 pt-16 pb-24">
      {/* 화면 제목은 없앴다. 스크린리더용 이름만 남긴다. */}
      <h2 className="sr-only">우리의 이야기</h2>

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
              height={it.height}
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

"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import * as img from "@/app/data/images";
import { weddingData } from "@/app/data/mock";
import { openZoom } from "@/app/components/ZoomViewer";

type Item = {
  key: string;
  src: StaticImageData;
  alt: string;
  /** 시안 페이지 기준 중심 좌표(%) */
  cx: number;
  cy: number;
  /** 시안 페이지 폭 대비 요소 폭(%) */
  w: number;
  /** 기울어진 각도(°, 양수 = 시계방향) */
  deg: number;
  /** false면 눌러도 크게 보기가 열리지 않는다 */
  zoom?: boolean;
};

/*
 * 2차 수정 시안(v2-revision-0914/03-groom, 04-bride) 실측값. 배열 순서 = 뒤→앞.
 * 수정사항 5번에 따라 손글씨 제목을 없애고 사진을 화면 가득 키웠다.
 */
const GROOM: Item[] = [
  { key: "family", src: img.groomFamily, alt: "가족사진", cx: 66.7, cy: 56.8, w: 59, deg: 1.8 },
  { key: "letter-m", src: img.groomLetterMother, alt: "어머니의 편지", cx: 55, cy: 15, w: 78, deg: -8.5 },
  { key: "letter-f", src: img.groomLetterFather, alt: "아버지의 편지", cx: 48, cy: 89, w: 80, deg: 16 },
  { key: "child", src: img.groomChild, alt: "어린 시절", cx: 17, cy: 54.1, w: 68, deg: -5, zoom: false },
];

const BRIDE: Item[] = [
  { key: "family", src: img.brideFamily, alt: "가족사진", cx: 68, cy: 57.7, w: 75, deg: 0 },
  { key: "letter-f", src: img.brideLetterFather, alt: "아버지의 편지", cx: 30, cy: 24, w: 62, deg: -7.3 },
  { key: "letter-m", src: img.brideLetterMother, alt: "어머니의 편지", cx: 36, cy: 85, w: 68.9, deg: 10.1 },
  { key: "child", src: img.brideChild, alt: "어린 시절", cx: 85, cy: 28, w: 50, deg: 0, zoom: false },
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
        {items.map((it, i) => {
          const zoomable = it.zoom !== false;
          return (
          <motion.button
            key={it.key}
            type="button"
            // 어린 시절 사진은 확대하지 않는다. disabled 버튼은 탭을 삼켜 아래 사진으로 넘어가지도 않는다.
            disabled={!zoomable}
            tabIndex={zoomable ? undefined : -1}
            onClick={zoomable ? () => openZoom(it.src, it.alt) : undefined}
            aria-label={zoomable ? `${it.alt} 크게 보기` : undefined}
            className={`absolute ${zoomable ? "cursor-zoom-in" : "cursor-default"}`}
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
            whileTap={zoomable ? { scale: 0.98 } : undefined}
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
          );
        })}
      </div>
    </div>
  );
}

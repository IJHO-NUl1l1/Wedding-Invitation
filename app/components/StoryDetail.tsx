"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

/**
 * 시안 6페이지. 적갈 바탕에 사진 2장과 메모지 2장을 어긋나게 배치한다.
 * 시안에서 실측한 중심 좌표·폭·각도를 그대로 쓰며, 배열 순서가 z-order(뒤 → 앞)다.
 * 메모지는 시안처럼 오른쪽 위가 흰 모눈종이, 왼쪽 아래가 노란 줄종이다.
 */
type Item =
  | { kind: "photo"; key: string; src: string; cx: number; cy: number; w: number; deg: number }
  | { kind: "memo"; key: string; paper: "grid" | "lined"; text: string; cx: number; cy: number; w: number; deg: number };

export default function StoryDetail() {
  const { storyPage } = weddingData;
  // 사진은 로딩이 끝난 뒤 나타나게 한다. 메모지는 이미지가 아니라 바로 등장.
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const items: Item[] = [
    { kind: "photo", key: "bubbles", src: storyPage.photos[0], cx: 30, cy: 24, w: 59, deg: 10 },
    { kind: "memo", key: "memo1", paper: "grid", text: storyPage.notes[0], cx: 88, cy: 25, w: 60, deg: -12 },
    { kind: "photo", key: "roses", src: storyPage.photos[1], cx: 67, cy: 76, w: 55, deg: 0 },
    { kind: "memo", key: "memo2", paper: "lined", text: storyPage.notes[1], cx: 18, cy: 72, w: 60, deg: 10 },
  ];

  return (
    <div className="min-h-dvh bg-maroon px-4 pt-16 pb-24">
      <p className="font-hand text-[27px] text-white/85 text-center mb-3">우리의 이야기</p>

      <div className="relative w-full max-w-md mx-auto aspect-[495/881]">
        {items.map((it, i) => (
          <motion.div
            key={it.key}
            className="absolute"
            style={{
              left: `${it.cx}%`,
              top: `${it.cy}%`,
              width: `${it.w}%`,
              translate: "-50% -50%",
            }}
            initial={{ opacity: 0, y: 10, rotate: it.deg }}
            animate={
              it.kind === "memo" || loaded[it.key]
                ? { opacity: 1, y: 0, rotate: it.deg }
                : { opacity: 0, y: 10, rotate: it.deg }
            }
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {it.kind === "photo" ? (
              <Image
                src={it.src}
                alt=""
                width={1000}
                height={1400}
                quality={90}
                className="w-full h-auto"
                onLoad={() => setLoaded((m) => ({ ...m, [it.key]: true }))}
              />
            ) : (
              <Memo paper={it.paper} text={it.text} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Memo({ paper, text }: { paper: "grid" | "lined"; text: string }) {
  const grid = paper === "grid";
  return (
    <div
      className={`relative aspect-[5/4] px-4 py-6 ${grid ? "bg-white" : "bg-[#FBF3B6]"}`}
      style={
        grid
          ? {
              backgroundImage:
                "repeating-linear-gradient(rgba(90,140,200,.28) 0 1px, transparent 1px 15px), repeating-linear-gradient(90deg, rgba(90,140,200,.28) 0 1px, transparent 1px 15px)",
            }
          : {
              backgroundImage:
                "repeating-linear-gradient(transparent 0 26px, rgba(0,0,0,.12) 26px 27px)",
            }
      }
    >
      <p className="font-hand text-[24px] text-ink/75">{text}</p>
    </div>
  );
}

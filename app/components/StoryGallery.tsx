"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { weddingData } from "@/app/data/mock";

const CARD_W = 200;
const CARD_H = 305;
const SIDE_OFFSET = 180;   // 좌우 카드 중심 거리
const SIDE_SCALE = 0.83;   // 크기 차이 축소 (was 0.67)
const SIDE_OPACITY = 0.6;  // 더 선명하게
const SIDE_BLUR = 1.6;     // 흐림 대폭 감소 (was 3.5)
const THRESHOLD = 46;

function SlideCard({
  story,
  showCaption,
}: {
  story: { image: string; caption: string };
  showCaption?: boolean;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg select-none"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <Image
        src={story.image}
        alt={story.caption}
        fill
        className="object-cover pointer-events-none"
        unoptimized
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
      {showCaption && (
        <p className="absolute bottom-4 left-3 right-3 text-white text-xs font-serif text-center leading-5">
          {story.caption}
        </p>
      )}
    </div>
  );
}

export default function StoryGallery() {
  const [current, setCurrent] = useState(0);
  const dragX = useMotionValue(0);
  const stories = weddingData.story;
  const n = stories.length;
  const prevIdx = (current - 1 + n) % n;
  const nextIdx = (current + 1) % n;

  // 포인터 드래그 상태
  const pointerStart = useRef<{ x: number; t: number } | null>(null);
  const sessionId = useRef(0); // 중간에 새 드래그 시작 시 이전 await 무효화

  // ── Current 카드 transforms ──────────────────────────────────────────────
  const curScale = useTransform(
    dragX,
    [-SIDE_OFFSET, 0, SIDE_OFFSET],
    [SIDE_SCALE, 1, SIDE_SCALE]
  );
  const curOpacity = useTransform(
    dragX,
    [-SIDE_OFFSET * 1.15, -SIDE_OFFSET, 0, SIDE_OFFSET, SIDE_OFFSET * 1.15],
    [0, SIDE_OPACITY, 1, SIDE_OPACITY, 0]
  );
  const curBlurRaw = useTransform(
    dragX,
    [-SIDE_OFFSET, 0, SIDE_OFFSET],
    [SIDE_BLUR, 0, SIDE_BLUR]
  );
  const curFilter = useTransform(curBlurRaw, (v) => `blur(${v}px)`);

  // ── Prev 카드 (기본 위치: −SIDE_OFFSET) ─────────────────────────────────
  const prevCardX = useTransform(dragX, (d) => d - SIDE_OFFSET);
  const prevAbsDist = useTransform(prevCardX, (x) => Math.abs(x));
  const prevScale = useTransform(
    prevAbsDist,
    [0, SIDE_OFFSET, SIDE_OFFSET * 1.15],
    [1, SIDE_SCALE, SIDE_SCALE * 0.72]
  );
  const prevOpacity = useTransform(
    prevAbsDist,
    [0, SIDE_OFFSET * 0.65, SIDE_OFFSET * 1.15],
    [1, SIDE_OPACITY, 0]
  );
  const prevBlurRaw = useTransform(prevAbsDist, [0, SIDE_OFFSET], [0, SIDE_BLUR]);
  const prevFilter = useTransform(prevBlurRaw, (v) => `blur(${v}px)`);

  // ── Next 카드 (기본 위치: +SIDE_OFFSET) ─────────────────────────────────
  const nextCardX = useTransform(dragX, (d) => d + SIDE_OFFSET);
  const nextAbsDist = useTransform(nextCardX, (x) => Math.abs(x));
  const nextScale = useTransform(
    nextAbsDist,
    [0, SIDE_OFFSET, SIDE_OFFSET * 1.15],
    [1, SIDE_SCALE, SIDE_SCALE * 0.72]
  );
  const nextOpacity = useTransform(
    nextAbsDist,
    [0, SIDE_OFFSET * 0.65, SIDE_OFFSET * 1.15],
    [1, SIDE_OPACITY, 0]
  );
  const nextBlurRaw = useTransform(nextAbsDist, [0, SIDE_OFFSET], [0, SIDE_BLUR]);
  const nextFilter = useTransform(nextBlurRaw, (v) => `blur(${v}px)`);

  // ── 전체 영역 포인터 이벤트 핸들러 ────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId); // 영역 벗어나도 추적
    sessionId.current++;
    pointerStart.current = { x: e.clientX, t: Date.now() };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    dragX.set(e.clientX - pointerStart.current.x);
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dt = Math.max(1, Date.now() - pointerStart.current.t);
    const vel = (dx / dt) * 1000; // px/s
    pointerStart.current = null;
    const sid = sessionId.current;

    if (dx < -THRESHOLD || vel < -380) {
      await animate(dragX, -SIDE_OFFSET, { duration: 0.19, ease: "easeOut" });
      if (sessionId.current !== sid) return;
      setCurrent((c) => (c + 1) % n);
      dragX.set(0);
    } else if (dx > THRESHOLD || vel > 380) {
      await animate(dragX, SIDE_OFFSET, { duration: 0.19, ease: "easeOut" });
      if (sessionId.current !== sid) return;
      setCurrent((c) => (c - 1 + n) % n);
      dragX.set(0);
    } else {
      // 임계값 미달 → 부드럽게 원위치
      animate(dragX, 0, { type: "spring", stiffness: 260, damping: 26 });
    }
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
    animate(dragX, 0, { type: "spring", stiffness: 260, damping: 26 });
  };

  return (
    <motion.section
      className="py-16 bg-cream overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10 px-6">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Our Story</p>
        <h2 className="font-serif text-2xl text-charcoal">두 사람의 연애 스토리</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      {/* ── 슬라이더: 전체 영역이 터치 감지 ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden touch-none select-none"
        style={{ height: CARD_H + 24, cursor: "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Prev */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            x: prevCardX,
            scale: prevScale,
            opacity: prevOpacity,
            filter: prevFilter,
          }}
        >
          <SlideCard story={stories[prevIdx]} />
        </motion.div>

        {/* Next */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            x: nextCardX,
            scale: nextScale,
            opacity: nextOpacity,
            filter: nextFilter,
          }}
        >
          <SlideCard story={stories[nextIdx]} />
        </motion.div>

        {/* Current – on top */}
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{
            x: dragX,
            scale: curScale,
            opacity: curOpacity,
            filter: curFilter,
          }}
        >
          <SlideCard story={stories[current]} showCaption />
        </motion.div>
      </div>

      {/* ── 인디케이터 ── */}
      <div className="flex justify-center gap-2 mt-4">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx);
              dragX.set(0);
            }}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? "w-5 h-1.5 bg-blush-dark"
                : "w-1.5 h-1.5 bg-blush/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-charcoal-light/50 font-cormorant mt-3 tracking-wider">
        옆으로 밀어 넘기기
      </p>

      {/* ── 인용구 ── */}
      <motion.div
        className="mx-6 mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="font-script text-blush-dark text-3xl mb-3">&ldquo;</p>
        <p className="font-serif text-charcoal text-xs leading-7 whitespace-pre-line">
          {weddingData.storyQuote}
        </p>
        <p className="font-script text-blush-dark text-3xl mt-1">&rdquo;</p>
      </motion.div>
    </motion.section>
  );
}

"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/app/data/mock";

const CARD_W = 200;
const CARD_H = 305;
const SIDE_OFFSET = 180;
const SIDE_SCALE = 0.83;
const SIDE_OPACITY = 0.6;
const SIDE_BLUR = 1.6;
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

  const containerRef = useRef<HTMLDivElement>(null);
  // { x, y: 터치 시작 좌표, t: 시작 시각 }
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const sessionId = useRef(0);
  // 수평 드래그 여부 판정 (최초 이동 방향으로 결정)
  const isHorizontal = useRef<boolean | null>(null);

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

  // ── Prev 카드 transforms ─────────────────────────────────────────────────
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

  // ── Next 카드 transforms ─────────────────────────────────────────────────
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

  // ── 슬라이드 완료 처리 ───────────────────────────────────────────────────
  const doTransition = async (dx: number, vel: number, sid: number) => {
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
      animate(dragX, 0, { type: "spring", stiffness: 260, damping: 26 });
    }
  };

  // ── 네이티브 터치 이벤트 (non-passive로 scroll preventDefault 가능) ──────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      sessionId.current++;
      isHorizontal.current = null; // 방향 미결정
      pointerStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        t: Date.now(),
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pointerStart.current) return;
      const dx = e.touches[0].clientX - pointerStart.current.x;
      const dy = e.touches[0].clientY - pointerStart.current.y;

      // 최초 이동 방향 결정 (5px 이상 움직였을 때)
      if (isHorizontal.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        isHorizontal.current = Math.abs(dx) >= Math.abs(dy);
      }

      if (isHorizontal.current) {
        e.preventDefault(); // 수평 드래그 → 페이지 스크롤 차단
        dragX.set(dx);
      }
      // 수직이면 preventDefault 하지 않아 페이지 스크롤 정상 동작
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!pointerStart.current || !isHorizontal.current) {
        pointerStart.current = null;
        isHorizontal.current = null;
        return;
      }
      const touch = e.changedTouches[0];
      const dx = touch.clientX - pointerStart.current.x;
      const dt = Math.max(1, Date.now() - pointerStart.current.t);
      const vel = (dx / dt) * 1000;
      const sid = sessionId.current;
      pointerStart.current = null;
      isHorizontal.current = null;
      void doTransition(dx, vel, sid);
    };

    const onTouchCancel = () => {
      pointerStart.current = null;
      isHorizontal.current = null;
      animate(dragX, 0, { type: "spring", stiffness: 260, damping: 26 });
    };

    // touchmove는 non-passive여야 preventDefault() 동작
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 데스크탑 마우스 드래그 (포인터 이벤트) ──────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // 터치는 위 useEffect에서 처리
    e.currentTarget.setPointerCapture(e.pointerId);
    sessionId.current++;
    pointerStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    isHorizontal.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !pointerStart.current) return;
    dragX.set(e.clientX - pointerStart.current.x);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dt = Math.max(1, Date.now() - pointerStart.current.t);
    const vel = (dx / dt) * 1000;
    const sid = sessionId.current;
    pointerStart.current = null;
    void doTransition(dx, vel, sid);
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

      {/* ── 슬라이더 ── */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center overflow-hidden select-none"
        style={{ height: CARD_H + 24, cursor: "grab", touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Prev */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ x: prevCardX, scale: prevScale, opacity: prevOpacity, filter: prevFilter }}
        >
          <SlideCard story={stories[prevIdx]} />
        </motion.div>

        {/* Next */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ x: nextCardX, scale: nextScale, opacity: nextOpacity, filter: nextFilter }}
        >
          <SlideCard story={stories[nextIdx]} />
        </motion.div>

        {/* Current */}
        <motion.div
          className="absolute pointer-events-none z-10"
          style={{ x: dragX, scale: curScale, opacity: curOpacity, filter: curFilter }}
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
              idx === current ? "w-5 h-1.5 bg-blush-dark" : "w-1.5 h-1.5 bg-blush/40"
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

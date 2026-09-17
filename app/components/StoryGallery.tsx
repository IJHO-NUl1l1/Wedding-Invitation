"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import Overlay from "@/app/components/Overlay";

/** 접힌 상태에서 4번째 줄(10·11·12)이 위쪽만 보이는 비율 */
const PEEK = 0.32;

/*
 * 확대 뷰어의 사진 요청 조건. 미리 받아두는 사진도 반드시 같은 값을 써야 한다.
 * next/image는 sizes·quality로 주소를 만들기 때문에, 값이 하나라도 다르면 다른 주소를 받아 캐시가 맞지 않는다.
 * 뷰어 폭은 max-w-md(448px)라 그보다 큰 화면에서도 448px 기준으로만 받는다.
 */
const VIEWER_SIZES = "(max-width: 448px) 100vw, 448px";
const VIEWER_QUALITY = 75;
/** 지금 사진 기준으로 미리 받아둘 사진. 다음 쪽으로 넘기는 경우가 많아 뒤로 두 장을 받는다. */
const PRELOAD_OFFSETS = [1, 2, -1];

export default function StoryGallery() {
  const { gallery, galleryPreviewCount } = weddingData;
  const [expanded, setExpanded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // maxHeight의 %는 부모 높이를 참조해 여기선 쓸 수 없다. 실제 셀 높이를 재서 픽셀로 계산한다.
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [peekHeight, setPeekHeight] = useState<number | null>(null);
  /** 페이드는 4번째 줄에만 건다. 3번째 줄까지 덮으면 처음 보이는 9장이 어두워진다. */
  const [fadeHeight, setFadeHeight] = useState(0);
  /** 21장을 모두 펼친 실제 높이. 넉넉한 값(4000 등)을 목표로 두면 애니메이션 초반에 다 펼쳐져 순식간에 끝난다. */
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const cell = grid.firstElementChild as HTMLElement | null;
      if (!cell) return;
      const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
      setPeekHeight(cell.offsetHeight * (3 + PEEK) + gap * 3);
      setFadeHeight(cell.offsetHeight * PEEK + gap);
      setFullHeight(grid.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  // 펼치는 동안 화면도 같이 천천히 내려가 새로 드러나는 사진을 따라 보게 한다
  const expand = () => {
    setExpanded(true);
    if (peekHeight === null || fullHeight === null) return;
    const from = window.scrollY;
    const to = from + (fullHeight - peekHeight) * 0.7;
    animate(from, to, {
      duration: 1.8,
      ease: [0.65, 0, 0.35, 1],
      // html에 scroll-behavior: smooth가 걸려 있어 매 프레임 이동은 즉시 이동으로 줘야 끊기지 않는다
      onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    });
  };

  // 접으면 아래쪽 사진들이 사라지며 화면이 갤러리 밑으로 떨어지므로 갤러리 맨 위로 올려준다
  // scrollIntoView의 부드러운 스크롤은 높이가 줄어드는 도중 끊겨 목표를 지나치므로, 위치를 정해 직접 옮긴다
  const collapse = () => {
    setExpanded(false);
    const section = sectionRef.current;
    if (!section) return;
    const target = section.getBoundingClientRect().top + window.scrollY;
    animate(window.scrollY, target, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    });
  };

  /** 넘김 방향. 0이면 처음 열린 것이라 좌우 이동 없이 페이드로만 등장한다. */
  const [dir, setDir] = useState(0);

  const move = (step: number) => {
    setDir(step);
    setViewerIndex((i) => (i === null ? i : (i + step + gallery.length) % gallery.length));
  };

  const openViewer = (i: number) => {
    setDir(0);
    setViewerIndex(i);
  };

  return (
    /* 시안 지시: 갤러리는 섹션 제목 없음 */
    <section ref={sectionRef} className="bg-ink px-5 py-12">
      <div className="max-w-md mx-auto">
        <motion.div
          className="relative overflow-hidden"
          initial={false}
          animate={{
            maxHeight:
              peekHeight === null || fullHeight === null
                ? undefined
                : expanded
                  ? fullHeight
                  : peekHeight,
          }}
          // 펼칠 때는 화면이 내려가는 게 눈에 보이도록 천천히, 접을 때는 조금 빠르게
          transition={
            expanded
              ? { duration: 1.8, ease: [0.65, 0, 0.35, 1] }
              : { duration: 1, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div ref={gridRef} className="grid grid-cols-3 gap-1.5">
            {gallery.map((src, i) => {
              // 더보기 전에는 살짝 걸쳐 보이는 10번째 사진부터 누를 수 없다
              const locked = !expanded && i >= galleryPreviewCount;
              return (
              <motion.button
                key={src}
                onClick={() => openViewer(i)}
                disabled={locked}
                tabIndex={locked ? -1 : undefined}
                aria-hidden={locked || undefined}
                className={`relative aspect-square overflow-hidden ${locked ? "pointer-events-none" : ""}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  // 펼칠 때 숨어있던 사진들이 순서대로 스르륵 드러나게 한다
                  delay: i < galleryPreviewCount ? (i % 9) * 0.04 : (i - galleryPreviewCount) * 0.05,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 448px) 33vw, 150px"
                  className="object-cover"
                />
              </motion.button>
              );
            })}
          </div>

          {/* 접힌 동안 아래쪽을 검은 바탕으로 덮었다가, 펼치면 아래로 걷힌다 */}
          <AnimatePresence>
            {!expanded && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b from-ink/10 via-ink/55 to-ink"
                style={{ height: fadeHeight }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* 펼치기 ↔ 접기. 같은 자리에서 버튼만 바뀐다. */}
        <AnimatePresence mode="wait" initial={false}>
          {!expanded ? (
            <motion.div
              key="more"
              className="flex justify-center -mt-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={expand}
                aria-expanded={false}
                className="flex flex-col items-center gap-1 px-9 py-3 text-pink-soft active:scale-95 transition-transform"
              >
                <span className="text-[17px]">더보기</span>
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="less"
              className="flex justify-center mt-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <button
                onClick={collapse}
                aria-expanded
                className="flex flex-col items-center gap-1 px-9 py-3 text-pink-soft active:scale-95 transition-transform"
              >
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronUp className="w-5 h-5" />
                </motion.span>
                <span className="text-[17px]">접기</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 사진 확대 뷰어 */}
      <Overlay
        open={viewerIndex !== null}
        onClose={() => setViewerIndex(null)}
        background="rgba(0,0,0,0.96)"
      >
        {viewerIndex !== null && (
          <motion.div
            className="min-h-dvh flex flex-col items-center justify-center gap-5 px-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 이전/다음 사진이 겹쳐진 채 교차하도록 절대 배치한다 */}
            <div className="relative w-full max-w-md aspect-[2/3] overflow-hidden">
              <AnimatePresence custom={dir} initial={false}>
                <motion.div
                  key={viewerIndex}
                  className="absolute inset-0"
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d === 0 ? 0 : d > 0 ? 70 : -70, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? -70 : 70, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    // 충분히 끌었거나 빠르게 튕겼으면 넘긴다
                    if (info.offset.x < -70 || info.velocity.x < -450) move(1);
                    else if (info.offset.x > 70 || info.velocity.x > 450) move(-1);
                  }}
                >
                  <Image
                    src={gallery[viewerIndex]}
                    alt=""
                    fill
                    quality={VIEWER_QUALITY}
                    sizes={VIEWER_SIZES}
                    loading="eager"
                    draggable={false}
                    className="object-contain select-none"
                  />
                </motion.div>
              </AnimatePresence>

              {/* 앞뒤 사진을 뷰어와 같은 주소로 미리 받아 둔다. 넘기는 순간 캐시에서 바로 뜬다. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
                {PRELOAD_OFFSETS.map((offset) => {
                  const j = (viewerIndex + offset + gallery.length) % gallery.length;
                  return (
                    <Image
                      key={j}
                      src={gallery[j]}
                      alt=""
                      fill
                      quality={VIEWER_QUALITY}
                      sizes={VIEWER_SIZES}
                      loading="eager"
                      className="object-contain"
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/80">
              <button
                onClick={() => move(-1)}
                aria-label="이전 사진"
                className="p-2 active:scale-90 transition-transform"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm tabular-nums">
                {viewerIndex + 1} / {gallery.length}
              </span>
              <button
                onClick={() => move(1)}
                aria-label="다음 사진"
                className="p-2 active:scale-90 transition-transform"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </Overlay>
    </section>
  );
}

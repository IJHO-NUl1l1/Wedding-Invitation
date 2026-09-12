"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import Overlay from "@/app/components/Overlay";

/** 접힌 상태에서 보일 높이 = 3행 + 다음 행이 살짝 걸치는 만큼 */
const PEEK_ROWS = 3.18;

export default function StoryGallery() {
  const { gallery, galleryPreviewCount } = weddingData;
  const [expanded, setExpanded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // maxHeight의 %는 부모 높이를 참조해 여기선 쓸 수 없다. 실제 셀 높이를 재서 픽셀로 계산한다.
  const gridRef = useRef<HTMLDivElement>(null);
  const [peekHeight, setPeekHeight] = useState<number | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const cell = grid.firstElementChild as HTMLElement | null;
      if (!cell) return;
      const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
      setPeekHeight(cell.offsetHeight * PEEK_ROWS + gap * 3);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  const move = (step: number) =>
    setViewerIndex((i) => (i === null ? i : (i + step + gallery.length) % gallery.length));

  return (
    /* 시안 지시: 갤러리는 섹션 제목 없음 */
    <section className="bg-ink px-5 py-12">
      <div className="max-w-md mx-auto">
        <motion.div
          className="relative overflow-hidden"
          initial={false}
          animate={{
            maxHeight: expanded || peekHeight === null ? 4000 : peekHeight,
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div ref={gridRef} className="grid grid-cols-3 gap-1.5">
            {gallery.map((src, i) => (
              <motion.button
                key={src}
                onClick={() => setViewerIndex(i)}
                className="relative aspect-square overflow-hidden"
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
            ))}
          </div>

          {/* 접힌 동안 아래쪽을 검은 바탕으로 덮었다가, 펼치면 아래로 걷힌다 */}
          <AnimatePresence>
            {!expanded && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-ink/85 to-ink"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {!expanded && (
            <motion.div
              className="flex justify-center -mt-2"
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setExpanded(true)}
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
          <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-4">
            <div className="relative w-full max-w-md aspect-[2/3]">
              <Image
                src={gallery[viewerIndex]}
                alt=""
                fill
                quality={90}
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-6 text-white/80">
              <button onClick={() => move(-1)} aria-label="이전 사진" className="p-2">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-sm tabular-nums">
                {viewerIndex + 1} / {gallery.length}
              </span>
              <button onClick={() => move(1)} aria-label="다음 사진" className="p-2">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </Overlay>
    </section>
  );
}

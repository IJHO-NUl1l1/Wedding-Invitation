"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import Overlay from "@/app/components/Overlay";

export default function StoryGallery() {
  const { gallery, galleryPreviewCount } = weddingData;
  const [expanded, setExpanded] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const visible = expanded ? gallery : gallery.slice(0, galleryPreviewCount);

  const move = (step: number) => {
    setViewerIndex((i) => {
      if (i === null) return i;
      return (i + step + gallery.length) % gallery.length;
    });
  };

  return (
    /* 시안 지시: 갤러리는 섹션 제목 없음 */
    <section className="bg-ink px-5 py-16">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1.5">
        {visible.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setViewerIndex(i)}
            className="relative aspect-square overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 9) * 0.04 }}
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

      {!expanded && gallery.length > galleryPreviewCount && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExpanded(true)}
            className="px-7 py-2.5 rounded-full bg-pink-soft text-ink text-sm active:scale-95 transition-transform"
          >
            더보기
          </button>
        </div>
      )}

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

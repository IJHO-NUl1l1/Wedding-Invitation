"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useBackLayer } from "@/lib/backstack";

type Target = { src: string; alt: string };

/** 어디서든 사진을 전체화면 확대 뷰어로 연다. */
export function openZoom(src: string, alt = "") {
  window.dispatchEvent(new CustomEvent<Target>("zoom-open", { detail: { src, alt } }));
}

/**
 * 사진 전체화면 뷰어. 확대는 여기서만 된다.
 * 페이지 자체의 확대는 viewport 설정과 html의 touch-action으로 막혀 있고,
 * 이 뷰어는 브라우저 확대가 아니라 라이브러리가 제스처를 받아 사진만 키운다.
 */
export default function ZoomViewer() {
  const [target, setTarget] = useState<Target | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setTarget((e as CustomEvent<Target>).detail);
    window.addEventListener("zoom-open", onOpen);

    // iOS Safari는 viewport의 확대 금지를 무시하므로 핀치 제스처 자체를 막는다
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);

    return () => {
      window.removeEventListener("zoom-open", onOpen);
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
    };
  }, []);

  useBackLayer(target !== null, () => setTarget(null));

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <TransformWrapper
            minScale={1}
            maxScale={5}
            centerOnInit
            limitToBounds
            doubleClick={{ mode: "toggle", step: 2.5 }}
            wheel={{ step: 0.15 }}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <motion.div
                className="relative h-dvh w-screen"
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={target.src}
                  alt={target.alt}
                  fill
                  priority
                  quality={90}
                  // 확대했을 때도 흐리지 않게 화면 폭보다 큰 원본을 받는다
                  sizes="200vw"
                  draggable={false}
                  className="object-contain select-none"
                />
              </motion.div>
            </TransformComponent>
          </TransformWrapper>

          <button
            onClick={() => setTarget(null)}
            aria-label="닫기"
            className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white active:scale-95 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="pointer-events-none absolute inset-x-0 bottom-7 text-center text-[12px] text-white/50">
            두 손가락으로 벌리거나 두 번 눌러 확대할 수 있어요
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

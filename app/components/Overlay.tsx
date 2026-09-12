"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** 오버레이 배경색 (시안의 페이지별 배경) */
  background?: string;
  children: React.ReactNode;
};

export default function Overlay({ open, onClose, background = "var(--ink)", children }: Props) {
  // 이 오버레이가 직접 history 항목을 추가했는지 추적. popstate로 닫힌 경우
  // 다시 back()을 호출하면 안 되므로 구분이 필요하다.
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("overlay-open");

    window.history.pushState({ overlay: true }, "");
    pushedRef.current = true;

    const handlePop = () => {
      pushedRef.current = false;
      onCloseRef.current();
    };
    window.addEventListener("popstate", handlePop);

    return () => {
      window.removeEventListener("popstate", handlePop);
      document.body.classList.remove("overlay-open");
      // 닫기 버튼으로 닫은 경우엔 우리가 넣은 history 항목을 되돌린다
      if (pushedRef.current) {
        pushedRef.current = false;
        window.history.back();
      }
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 overflow-y-auto overscroll-contain"
          style={{ background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* 음악 토글이 우상단에 고정이라 닫기는 좌상단에 둔다 */}
          <button
            onClick={onClose}
            aria-label="닫기"
            className="fixed top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/35 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useBackLayer } from "@/lib/backstack";

type Props = {
  open: boolean;
  onClose: () => void;
  /** 오버레이 배경색 (시안의 페이지별 배경) */
  background?: string;
  children: React.ReactNode;
};

export default function Overlay({ open, onClose, background = "var(--ink)", children }: Props) {
  useBackLayer(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden overscroll-contain"
          style={{ background }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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

"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeCover({ onOpen }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="relative flex flex-col items-center px-8 w-full max-w-sm">

        {/* 봉투 */}
        <div className="relative w-72 mb-8" style={{ height: "208px" }}>
          <svg
            viewBox="0 0 288 208"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full drop-shadow-lg"
          >
            {/* 봉투 본체 */}
            <rect x="4" y="40" width="280" height="164" rx="4" fill="#FBF7F3" stroke="#E8C5D0" strokeWidth="1.5" />
            {/* 봉투 바닥 대각선 */}
            <path d="M4 204 L100 130 M284 204 L188 130" stroke="#E8C5D0" strokeWidth="1" opacity="0.5" />
            {/* 뚜껑 */}
            <path d="M4 40 L144 130 L284 40 Z" fill="#F5EDE8" stroke="#E8C5D0" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>

          {/* 씰 */}
          <div
            style={{
              position: "absolute",
              bottom: "76px",
              left: 0, right: 0,
              textAlign: "center",
              fontSize: "13px",
              color: "rgba(232,197,208,0.9)",
              userSelect: "none",
            }}
          >
            ♥
          </div>
        </div>

        {/* 텍스트 */}
        <div className="text-center mb-10">
          <p className="text-xs text-charcoal-light tracking-[0.2em] uppercase mb-3 font-cormorant">
            Wedding Invitation
          </p>
          <p className="text-charcoal text-sm leading-7 font-serif">
            소중한 분께 드리는 초대장이 도착했습니다
          </p>
        </div>

        {/* 열기 버튼 */}
        <button
          onClick={onOpen}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-xs text-charcoal-light tracking-[0.15em] font-cormorant group-hover:text-gold transition-colors">
            초대장 열기
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-blush-dark group-hover:text-gold transition-colors" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}

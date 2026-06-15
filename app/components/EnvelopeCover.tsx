"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeCover({ onOpen }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-cream"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeInOut" } }}
      >
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-8 w-24 h-24 border border-blush/40 rounded-full" />
          <div className="absolute top-12 left-12 w-16 h-16 border border-blush/30 rounded-full" />
          <div className="absolute bottom-8 right-8 w-24 h-24 border border-blush/40 rounded-full" />
          <div className="absolute bottom-12 right-12 w-16 h-16 border border-blush/30 rounded-full" />
          <div className="absolute top-1/4 right-6 w-2 h-2 bg-gold/40 rounded-full" />
          <div className="absolute top-1/3 left-6 w-1.5 h-1.5 bg-blush/60 rounded-full" />
          <div className="absolute bottom-1/3 right-10 w-1 h-1 bg-sage/50 rounded-full" />
        </div>

        {/* 봉투 본체 */}
        <div className="relative flex flex-col items-center px-8 w-full max-w-sm">
          {/* 봉투 SVG 장식 */}
          <motion.div
            className="relative w-72 h-52 mb-8"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <svg viewBox="0 0 288 208" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              {/* 봉투 몸체 */}
              <rect x="4" y="40" width="280" height="164" rx="4" fill="#FBF7F3" stroke="#E8C5D0" strokeWidth="1.5"/>
              {/* 봉투 뚜껑 (삼각형) */}
              <path d="M4 44 L144 130 L284 44" fill="#F5EDE8" stroke="#E8C5D0" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* 봉투 내부 접힘선 */}
              <path d="M4 204 L100 130 M284 204 L188 130" stroke="#E8C5D0" strokeWidth="1" opacity="0.6"/>
              {/* 봉투 씰 (하트) */}
              <path d="M144 118 C144 118 134 108 134 102 C134 97 138 94 141 94 C142.5 94 144 95 144 95 C144 95 145.5 94 147 94 C150 94 154 97 154 102 C154 108 144 118 144 118Z" fill="#E8C5D0"/>
            </svg>

            {/* 편지 내용 미리보기 */}
            <div className="absolute inset-0 flex items-center justify-center pt-10">
              <div className="text-center">
                <p className="font-script text-2xl text-gold tracking-wider">H & J</p>
              </div>
            </div>
          </motion.div>

          {/* 텍스트 */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <p className="text-xs text-charcoal-light tracking-[0.2em] uppercase mb-3 font-cormorant">
              Wedding Invitation
            </p>
            <p className="text-charcoal text-sm leading-7 font-serif">
              소중한 분께 드리는 초대장이 도착했습니다
            </p>
          </motion.div>

          {/* 열기 버튼 */}
          <motion.button
            onClick={onOpen}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileTap={{ scale: 0.96 }}
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
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

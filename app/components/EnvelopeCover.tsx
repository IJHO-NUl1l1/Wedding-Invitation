"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Stage = "idle" | "opening" | "rising" | "expanding";

interface Props {
  onOpen: () => void;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export default function EnvelopeCover({ onOpen }: Props) {
  const [stage, setStage] = useState<Stage>("idle");

  const handleOpen = async () => {
    if (stage !== "idle") return;
    setStage("opening");          // 뚜껑 열림
    await delay(480);
    setStage("rising");           // 편지 슬라이드업
    await delay(650);
    setStage("expanding");        // 화면 전체 채움 → onOpen
  };

  const isActive = stage !== "idle";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* 배경 장식 */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-8 left-8 w-24 h-24 border border-blush/40 rounded-full" />
        <div className="absolute top-12 left-12 w-16 h-16 border border-blush/30 rounded-full" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border border-blush/40 rounded-full" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border border-blush/30 rounded-full" />
        <div className="absolute top-1/4 right-6 w-2 h-2 bg-gold/40 rounded-full" />
        <div className="absolute top-1/3 left-6 w-1.5 h-1.5 bg-blush/60 rounded-full" />
        <div className="absolute bottom-1/3 right-10 w-1 h-1 bg-sage/50 rounded-full" />
      </motion.div>

      <div className="relative flex flex-col items-center px-8 w-full max-w-sm">

        {/* ── 봉투 ── */}
        <motion.div
          className="relative w-72 mb-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ height: "208px", perspective: "900px" }}
        >
          {/* 봉투 본체 SVG (뚜껑 제외) */}
          <svg
            viewBox="0 0 288 208"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full drop-shadow-lg"
          >
            <rect x="4" y="40" width="280" height="164" rx="4" fill="#FBF7F3" stroke="#E8C5D0" strokeWidth="1.5" />
            <path d="M4 204 L100 130 M284 204 L188 130" stroke="#E8C5D0" strokeWidth="1" opacity="0.5" />
          </svg>

          {/* CSS 뚜껑 — transformOrigin top, rotateX로 뒤로 젖혀짐 */}
          <motion.div
            className="absolute overflow-visible"
            style={{
              top: "19.2%",
              left: "1.4%",
              right: "1.4%",
              height: "43.3%",
              transformOrigin: "top center",
            }}
            animate={
              isActive
                ? { rotateX: -170, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }
                : { rotateX: 0 }
            }
          >
            <div
              className="w-full h-full"
              style={{ background: "#F5EDE8", clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-blush/80 text-[10px] select-none">
              ♥
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 90" fill="none">
              <path d="M0 0 L140 90 L280 0" stroke="#E8C5D0" strokeWidth="1.5" />
            </svg>
          </motion.div>

          {/* 편지 카드 — 봉투 안에서 위로 슬라이드 */}
          <motion.div
            className="absolute left-5 right-5 bg-white border border-blush/25 rounded-xl shadow-sm overflow-hidden z-10"
            style={{ bottom: "4px" }}
            initial={{ y: 0, opacity: 0, height: "68px" }}
            animate={
              stage === "rising" || stage === "expanding"
                ? { y: -108, opacity: 1, height: "88px" }
                : stage === "opening"
                ? { y: 0, opacity: 0.4, height: "68px" }
                : { y: 0, opacity: 0, height: "68px" }
            }
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="h-full flex flex-col items-center justify-center gap-1.5">
              <p className="font-script text-gold text-2xl leading-none">H & J</p>
              <div className="w-14 h-px bg-blush/40" />
              <p className="font-cormorant italic text-[10px] text-charcoal-light tracking-[0.2em]">
                Wedding Invitation
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 텍스트 */}
        <motion.div
          className="text-center mb-10"
          animate={{ opacity: isActive ? 0 : 1, y: isActive ? -8 : 0 }}
          transition={{ duration: 0.3 }}
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
          onClick={handleOpen}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          disabled={stage !== "idle"}
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

      {/* 화면 전체 채움 오버레이 — 편지가 페이지로 열리는 효과 */}
      {stage === "expanding" && (
        <motion.div
          className="fixed inset-0 bg-cream z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onAnimationComplete={onOpen}
        />
      )}
    </motion.div>
  );
}

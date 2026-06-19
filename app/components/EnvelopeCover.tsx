"use client";

import { ChevronDown } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeCover({ onOpen }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream overflow-hidden">
      <div className="flex flex-col items-center px-8 w-full max-w-sm">

        <div className="relative w-72 mb-8" style={{ height: "208px" }}>
          <svg viewBox="0 0 288 208" fill="none" className="absolute inset-0 w-full h-full drop-shadow-lg">
            <rect x="4" y="40" width="280" height="164" rx="4" fill="#FBF7F3" stroke="#E8C5D0" strokeWidth="1.5" />
            <path d="M4 204 L104 134 M284 204 L184 134" stroke="#E8C5D0" strokeWidth="1" opacity="0.5" />
            <path d="M4 40 L144 130 L284 40 Z" fill="#F5EDE8" stroke="#E8C5D0" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", top: "52%", left: 0, right: 0, textAlign: "center", fontSize: "12px", color: "rgba(196,163,90,0.85)", userSelect: "none" }}>
            ♥
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-xs text-charcoal-light tracking-[0.2em] uppercase mb-3 font-cormorant">Wedding Invitation</p>
          <p className="text-charcoal text-sm leading-7 font-serif">소중한 분께 드리는 초대장이 도착했습니다</p>
        </div>

        <button onClick={onOpen} className="flex flex-col items-center gap-2 cursor-pointer group">
          <span className="text-xs text-charcoal-light tracking-[0.15em] font-cormorant group-hover:text-gold transition-colors">초대장 열기</span>
          <ChevronDown className="w-5 h-5 text-blush-dark group-hover:text-gold transition-colors" />
        </button>
      </div>
    </div>
  );
}

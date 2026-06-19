"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeCover({ onOpen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const doneRef = useRef(false);

  const handleOpen = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setIsOpen(true);
    // flap 0.4s + letter delay 0.6s + letter 0.4s = 1.0s
    setTimeout(onOpen, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream overflow-hidden gap-8">

      <div className={`envelope ${isOpen ? "open" : "close"}`} onClick={handleOpen}>
        <div className="front flap" />
        <div className="front pocket" />
        <div className="letter">
          <div className="h-full flex flex-col items-center justify-center gap-1.5">
            <p className="font-script text-gold text-2xl leading-none">H & J</p>
            <div className="w-14 h-px bg-blush/40" />
            <p className="font-cormorant italic text-[10px] text-charcoal-light tracking-[0.2em]">
              Wedding Invitation
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-charcoal-light tracking-[0.2em] uppercase mb-3 font-cormorant">
          Wedding Invitation
        </p>
        <p className="text-charcoal text-sm leading-7 font-serif">
          소중한 분께 드리는 초대장이 도착했습니다
        </p>
      </div>

      <button onClick={handleOpen} className="flex flex-col items-center gap-2 cursor-pointer group">
        <span className="text-xs text-charcoal-light tracking-[0.15em] font-cormorant group-hover:text-gold transition-colors">
          초대장 열기
        </span>
        <ChevronDown className="w-5 h-5 text-blush-dark group-hover:text-gold transition-colors" />
      </button>
    </div>
  );
}

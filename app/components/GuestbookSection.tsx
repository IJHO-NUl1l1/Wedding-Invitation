"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { weddingData } from "@/app/data/mock";

export default function GuestbookSection() {
  return (
    <motion.section
      className="py-16 px-6 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Guestbook</p>
        <h2 className="font-serif text-2xl text-charcoal">방명록</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      <div className="max-w-sm mx-auto">
        {/* 장식 박스 */}
        <div className="relative border border-blush/30 rounded-2xl p-8 text-center bg-cream/50">
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blush/50 -translate-x-px -translate-y-px rounded-tl" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blush/50 translate-x-px -translate-y-px rounded-tr" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blush/50 -translate-x-px translate-y-px rounded-bl" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blush/50 translate-x-px translate-y-px rounded-br" />

          <MessageCircle className="w-8 h-8 text-blush mx-auto mb-4" />

          <p className="font-serif text-charcoal text-sm leading-7 mb-6">
            결혼을 축하하는 마음을<br />
            따뜻한 한마디로 남겨주세요.
          </p>

          <a
            href={weddingData.guestbookUrl}
            className="inline-block w-full py-3.5 text-sm font-serif text-white bg-blush-dark rounded-full shadow-sm active:opacity-80 transition-opacity"
          >
            방명록 남기기
          </a>
        </div>
      </div>
    </motion.section>
  );
}

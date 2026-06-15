"use client";

import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

export default function DecisionSection() {
  return (
    <motion.section
      className="py-16 px-6 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Why We Said Yes</p>
        <h2 className="font-serif text-2xl text-charcoal">결혼을 결심하게 된 계기</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        {/* 신랑 편 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blush/20 flex items-center justify-center text-xs">🤵</div>
            <p className="font-cormorant italic text-gold tracking-widest text-sm">{weddingData.groom.firstName}&apos;s Story</p>
          </div>
          <div className="w-full h-px bg-blush/30 mb-4" />
          <p className="font-serif text-charcoal text-sm leading-7">
            {weddingData.groom.decisionStory}
          </p>
        </motion.div>

        {/* 구분 장식 */}
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="w-10 h-px bg-blush/30" />
          <span className="font-script text-blush text-xl">♥</span>
          <div className="w-10 h-px bg-blush/30" />
        </div>

        {/* 신부 편 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blush/20 flex items-center justify-center text-xs">👰</div>
            <p className="font-cormorant italic text-gold tracking-widest text-sm">{weddingData.bride.firstName}&apos;s Story</p>
          </div>
          <div className="w-full h-px bg-blush/30 mb-4" />
          <p className="font-serif text-charcoal text-sm leading-7">
            {weddingData.bride.decisionStory}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Copy, Check, ChevronDown } from "lucide-react";
import { weddingData } from "@/app/data/mock";

function AccountCard({ name, bank, number }: { name: string; bank: string; number: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between bg-cream border border-blush/30 rounded-xl px-4 py-3 mt-2">
      <div>
        <p className="text-xs text-charcoal-light font-cormorant tracking-wider">{bank}</p>
        <p className="text-sm text-charcoal font-serif mt-0.5">{number}</p>
        <p className="text-xs text-charcoal-light mt-0.5">{name}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-xs text-blush-dark border border-blush/50 rounded-full px-3 py-1.5 active:bg-blush/10 transition-colors"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start border-b border-blush/15 py-2.5 gap-3">
      <span className="text-xs text-charcoal-light font-cormorant tracking-wide w-14 flex-shrink-0 pt-px">
        {label}
      </span>
      <span className="text-xs text-charcoal font-serif leading-5">{value}</span>
    </div>
  );
}

function PersonCard({
  person,
  role,
  roleEn,
}: {
  person: typeof weddingData.bride;
  role: string;
  roleEn: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="bg-white rounded-2xl border border-blush/20 shadow-sm px-5 py-5"
    >
      {/* 역할 + 이름 헤더 */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-cormorant italic text-gold text-sm tracking-wider">{roleEn}</span>
        <span className="font-serif text-xl text-charcoal">{person.name}</span>
        <span className="text-xs text-charcoal-light font-serif ml-auto">
          {person.parents}의 {role === "신랑" ? "아들" : "딸"}
        </span>
      </div>

      {/* 구분선 */}
      <div className="w-full h-px bg-blush/25 mb-1" />

      {/* 프로필 항목 */}
      <ProfileRow label="생년월일" value={person.birthday} />
      <ProfileRow label="직업" value={person.job} />
      <ProfileRow label="취미" value={person.hobbies} />
      <ProfileRow label="성격" value={person.personality} />

      {/* 마음 전하기 */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-charcoal-light border border-blush/40 rounded-full py-2.5 active:bg-blush/10 transition-colors"
      >
        <span>마음 전하기</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <AccountCard name={person.name} bank={person.account.bank} number={person.account.number} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CoupleSection() {
  return (
    <motion.section
      className="py-16 px-5 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">The Couple</p>
        <h2 className="font-serif text-2xl text-charcoal">신랑 · 신부 소개</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      {/* 프로필 사진 나란히 */}
      <div className="flex items-end justify-center gap-6 mb-8">
        {/* 신부 */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blush/40 mb-2 shadow-sm">
            <Image
              src="https://picsum.photos/seed/brideprofile/200/200"
              alt="박지서"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="text-xs text-charcoal-light font-cormorant tracking-widest uppercase">Bride</p>
          <p className="font-serif text-base text-charcoal mt-0.5">박지서</p>
        </div>

        {/* 중앙 하트 */}
        <div className="flex flex-col items-center pb-6 gap-1">
          <div className="w-px h-6 bg-blush/30" />
          <span className="font-script text-blush-dark text-2xl">♥</span>
          <div className="w-px h-6 bg-blush/30" />
        </div>

        {/* 신랑 */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blush/40 mb-2 shadow-sm">
            <Image
              src="https://picsum.photos/seed/groomprofile/200/200"
              alt="고희성"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="text-xs text-charcoal-light font-cormorant tracking-widest uppercase">Groom</p>
          <p className="font-serif text-base text-charcoal mt-0.5">고희성</p>
        </div>
      </div>

      {/* 프로필 카드 세로 배치 */}
      <div className="space-y-4 max-w-sm mx-auto">
        <PersonCard person={weddingData.bride} role="신부" roleEn="Bride" />
        <PersonCard person={weddingData.groom} role="신랑" roleEn="Groom" />
      </div>
    </motion.section>
  );
}

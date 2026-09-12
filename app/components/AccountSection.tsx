"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import SectionTitle from "@/app/components/SectionTitle";

function AccountCard({
  side,
  name,
  bank,
  number,
}: {
  side: string;
  name: string;
  bank: string;
  number: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3.5">
      <div>
        <p className="text-[13px] text-pink tracking-wider">{side}</p>
        <p className="text-[17px] text-white mt-1">
          {bank} {number}
        </p>
        <p className="text-[13px] text-white/60 mt-0.5">{name}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-xs text-ink bg-pink-soft rounded-full px-3 py-1.5 active:scale-95 transition-transform"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

export default function AccountSection() {
  const { groom, bride } = weddingData;

  return (
    <section className="bg-ink px-6 py-12">
      <SectionTitle>마음 전하실 곳</SectionTitle>
      <div className="max-w-md mx-auto space-y-3">
        <AccountCard
          side="신랑측"
          name={groom.name}
          bank={groom.account.bank}
          number={groom.account.number}
        />
        <AccountCard
          side="신부측"
          name={bride.name}
          bank={bride.account.bank}
          number={bride.account.number}
        />
      </div>
    </section>
  );
}

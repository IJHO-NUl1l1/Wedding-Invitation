"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy } from "lucide-react";
import { weddingData, type Account } from "@/app/data/mock";
import SectionTitle from "@/app/components/SectionTitle";

function AccountRow({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(account.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] text-pink">
          {account.role} {account.name}
        </p>
        {/* 은행과 계좌번호는 줄을 나눠 어느 계좌든 같은 모양으로 읽히게 한다 */}
        <p className="mt-1 text-[14px] text-white/70">{account.bank}</p>
        <p className="text-[16px] text-white tabular-nums break-all">{account.number}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 flex items-center gap-1 text-xs text-ink bg-pink-soft rounded-full px-3 py-1.5 active:scale-95 transition-transform"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

/** 신랑측·신부측을 각각 접었다 펼치는 묶음. 부모님 계좌까지 늘어나 한 번에 다 펼치면 길다. */
function Group({ title, accounts }: { title: string; accounts: Account[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-4 text-[17px] text-white"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 text-pink transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="divide-y divide-white/10 border-t border-white/10">
              {accounts.map((a) => (
                <AccountRow key={a.role} account={a} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AccountSection() {
  const { accounts } = weddingData;

  return (
    <section className="bg-ink px-6 py-12">
      <SectionTitle>마음 전하실 곳</SectionTitle>
      <div className="max-w-md mx-auto space-y-3">
        <Group title="신랑측에 마음 전하기" accounts={accounts.groom} />
        <Group title="신부측에 마음 전하기" accounts={accounts.bride} />
      </div>
    </section>
  );
}

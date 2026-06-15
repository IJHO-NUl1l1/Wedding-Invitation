"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const PAGE_SIZE = 3;

function GuestbookCarousel({ entries }: { entries: Entry[] }) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const isHorizontal = useRef<boolean | null>(null);
  const totalPages = Math.ceil(entries.length / PAGE_SIZE);

  const go = (dx: number) => {
    if (dx < -40 && page < totalPages - 1) { setDir(-1); setPage((p) => p + 1); }
    else if (dx > 40 && page > 0) { setDir(1); setPage((p) => p - 1); }
    pointerStart.current = null;
    isHorizontal.current = null;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      pointerStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isHorizontal.current = null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pointerStart.current) return;
      const dx = e.touches[0].clientX - pointerStart.current.x;
      const dy = e.touches[0].clientY - pointerStart.current.y;
      if (isHorizontal.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        isHorizontal.current = Math.abs(dx) >= Math.abs(dy);
      }
      if (isHorizontal.current) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!pointerStart.current || !isHorizontal.current) return;
      go(e.changedTouches[0].clientX - pointerStart.current.x);
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [page, totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const onUp = (ev: MouseEvent) => {
      go(ev.clientX - startX);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mouseup", onUp);
  };

  const pageEntries = entries.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const variants = {
    enter: (d: number) => ({ x: d < 0 ? "55%" : "-55%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d < 0 ? "-55%" : "55%", opacity: 0 }),
  };

  return (
    <div className="px-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-blush/20" />
        <MessageCircle className="w-3.5 h-3.5 text-blush/50" />
        <div className="flex-1 h-px bg-blush/20" />
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className="select-none cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-2"
          >
            {pageEntries.map((entry) => (
              <div key={entry.id} className="bg-cream rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-sm text-charcoal">{entry.name}</span>
                  <span className="text-[10px] text-charcoal-light font-cormorant">
                    {new Date(entry.created_at).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
                  </span>
                </div>
                <p className="font-serif text-xs text-charcoal leading-5 whitespace-pre-wrap line-clamp-3">
                  {entry.message}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > page ? -1 : 1); setPage(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === page ? "w-4 h-1.5 bg-blush-dark" : "w-1.5 h-1.5 bg-blush/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuestbookSection() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), message: message.trim() }),
    });

    if (res.ok) {
      setSubmitted(true);
      setName("");
      setMessage("");
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다");
    }
    setSubmitting(false);
  };

  return (
    <motion.section
      className="py-16 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10 px-6">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Guestbook</p>
        <h2 className="font-serif text-2xl text-charcoal">방명록</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
        <p className="font-serif text-xs text-charcoal-light mt-4 leading-6">
          두 사람의 새 출발을 축하하는<br />따뜻한 한마디를 남겨주세요
        </p>
      </div>

      {/* 작성 폼 */}
      <div className="px-6 mb-10">
        {submitted ? (
          <motion.div
            className="bg-cream rounded-2xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="font-script text-blush-dark text-3xl mb-2">♥</p>
            <p className="font-serif text-sm text-charcoal mb-1">소중한 메시지 감사합니다</p>
            <p className="font-serif text-xs text-charcoal-light mb-4">검토 후 게재됩니다</p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-serif text-blush-dark underline underline-offset-2"
            >
              다시 작성
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              ref={nameRef}
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              required
              className="w-full px-4 py-3 border border-blush/30 rounded-xl text-sm font-serif text-charcoal bg-cream focus:outline-none focus:border-blush-dark placeholder:text-charcoal-light/40"
            />
            <textarea
              placeholder="축하 메시지를 남겨주세요 (300자 이내)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              rows={4}
              required
              className="w-full px-4 py-3 border border-blush/30 rounded-xl text-sm font-serif text-charcoal bg-cream focus:outline-none focus:border-blush-dark placeholder:text-charcoal-light/40 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-charcoal-light font-cormorant">
                {message.length} / 300
              </span>
              {error && (
                <span className="text-xs text-red-400 font-serif">{error}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !message.trim()}
              className="w-full py-3 bg-blush text-white font-serif text-sm rounded-xl tracking-widest disabled:opacity-40 active:bg-blush-dark transition-colors"
            >
              {submitting ? "전송 중..." : "메시지 보내기"}
            </button>
          </form>
        )}
      </div>

      {/* 승인된 방명록 — 가로 스와이프 캐러셀 */}
      {entries.length > 0 && <GuestbookCarousel entries={entries} />}
    </motion.section>
  );
}

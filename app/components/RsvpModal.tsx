"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { weddingData } from "@/app/data/mock";

const ID_KEY = "rsvp-id"; // 마지막 응답의 uuid — 재제출 시 교체용
const ANSWER_KEY = "rsvp-answer"; // "attend" | "decline"

type Side = "groom" | "bride";

export default function RsvpModal() {
  const { wedding, venue } = weddingData;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [side, setSide] = useState<Side | null>(null);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const show = () => {
      setDone(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener("rsvp-show", show);
    return () => window.removeEventListener("rsvp-show", show);
  }, []);

  // 맨 아래까지 내려가면 한 번만 자동으로 띄운다. 이미 응답했으면 띄우지 않는다.
  useEffect(() => {
    if (localStorage.getItem(ANSWER_KEY)) return;
    let fired = false;
    const onScroll = () => {
      if (fired || document.body.classList.contains("overlay-open")) return;
      const reachedBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (!reachedBottom) return;
      fired = true;
      setDone(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 모달이 열려 있는 동안 뒤로가기로 닫히게 하고 배경 스크롤을 잠근다
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overlay-open");
    window.history.pushState({ rsvp: true }, "");
    let pushed = true;
    const pop = () => {
      pushed = false;
      setOpen(false);
    };
    window.addEventListener("popstate", pop);
    return () => {
      window.removeEventListener("popstate", pop);
      document.body.classList.remove("overlay-open");
      if (pushed) window.history.back();
    };
  }, [open]);

  const submit = async () => {
    if (attending === null) {
      setError("참석 여부를 선택해주세요");
      return;
    }
    if (!name.trim()) {
      setError("성함을 입력해주세요");
      return;
    }
    if (!side) {
      setError("신랑측/신부측을 선택해주세요");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          name: name.trim(),
          side,
          headcount: attending ? headcount : 0,
          replaceId: localStorage.getItem(ID_KEY) ?? undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "전송에 실패했어요. 잠시 후 다시 시도해주세요");
        return;
      }
      if (data?.id) localStorage.setItem(ID_KEY, data.id);
      localStorage.setItem(ANSWER_KEY, attending ? "attend" : "decline");
      setDone(true);
      setTimeout(() => setOpen(false), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-sm rounded-3xl bg-ink border border-white/15 px-6 py-7 my-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="absolute top-4 right-4 text-white/60"
            >
              <X className="w-5 h-5" />
            </button>

            {done ? (
              <p className="py-10 text-center text-white text-lg">
                소중한 마음 감사합니다
              </p>
            ) : (
              <>
                {/* 시안 2-2: 감사 인사 대신 예식 정보 */}
                <div className="text-center text-white pb-5 mb-5 border-b border-white/12">
                  <p className="text-pink text-sm">참석 여부</p>
                  <p className="mt-2.5 text-[15px]">
                    {wedding.date} {wedding.dayOfWeek} {wedding.time}
                  </p>
                  <p className="mt-1 text-[13px] text-white/75">
                    {venue.name} {venue.hall}
                  </p>
                </div>

                {/* 시안 2-1: 한 화면에 모두 */}
                <div className="space-y-4">
                  <Field label="참석 여부">
                    <div className="flex gap-2">
                      <Choice active={attending === true} onClick={() => setAttending(true)}>
                        참석
                      </Choice>
                      <Choice active={attending === false} onClick={() => setAttending(false)}>
                        불참
                      </Choice>
                    </div>
                  </Field>

                  <Field label="성함">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="성함을 입력해주세요"
                      maxLength={20}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-sm text-white focus:outline-none focus:border-pink placeholder:text-white/35"
                    />
                  </Field>

                  <Field label="어느 측 하객이신가요">
                    <div className="flex gap-2">
                      <Choice active={side === "groom"} onClick={() => setSide("groom")}>
                        신랑측
                      </Choice>
                      <Choice active={side === "bride"} onClick={() => setSide("bride")}>
                        신부측
                      </Choice>
                    </div>
                  </Field>

                  {attending !== false && (
                    <Field label="참석 인원">
                      <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-2.5">
                        <button
                          onClick={() => setHeadcount((n) => Math.max(1, n - 1))}
                          aria-label="인원 줄이기"
                          className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white tabular-nums">{headcount}명</span>
                        <button
                          onClick={() => setHeadcount((n) => Math.min(20, n + 1))}
                          aria-label="인원 늘리기"
                          className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </Field>
                  )}
                </div>

                {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

                <button
                  onClick={submit}
                  disabled={submitting}
                  className="w-full mt-6 py-3.5 rounded-full bg-pink-soft text-ink text-sm disabled:opacity-40 active:scale-[0.99] transition-transform"
                >
                  {submitting ? "전송 중…" : "전달하기"}
                </button>
                <p className="text-[11px] text-white/45 text-center mt-3">
                  마음이 바뀌시면 다시 보내주셔도 괜찮아요
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12px] text-white/60 mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl text-sm transition-colors ${
        active
          ? "bg-pink-soft text-ink"
          : "border border-white/20 bg-white/5 text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

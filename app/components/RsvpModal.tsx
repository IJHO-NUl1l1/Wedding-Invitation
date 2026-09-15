"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, X } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import { useBackLayer } from "@/lib/backstack";

/**
 * 직전 응답을 브라우저에 저장해 둔다. id를 함께 보내면 서버가 이전 행을 지우고
 * 새로 넣으므로 같은 사람이 여러 번 보내도 한 건만 남는다.
 */
const SAVED_KEY = "rsvp-saved";

type Saved = {
  id?: string;
  attending: boolean;
  name: string;
  side: Side;
  headcount: number;
};

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

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
  /** 이전에 보낸 응답. 있으면 폼 대신 요약 화면부터 보여준다. */
  const [saved, setSaved] = useState<Saved | null>(null);
  /** 이미 응답한 사람이 요약을 보고 "다시 제출하기"를 눌렀는지 */
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const show = () => {
      const prev = readSaved();
      setSaved(prev);
      if (prev) {
        setAttending(prev.attending);
        setName(prev.name);
        setSide(prev.side);
        setHeadcount(prev.headcount || 1);
      }
      setEditing(false);
      setDone(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener("rsvp-show", show);
    return () => window.removeEventListener("rsvp-show", show);
  }, []);

  // 맨 아래까지 내려가면 한 번만 자동으로 띄운다. 이미 응답했으면 띄우지 않는다.
  // 모바일은 주소창 때문에 innerHeight가 계속 바뀌어 스크롤 계산이 어긋나므로,
  // 페이지 끝에 둔 감시용 요소가 화면에 들어오는지로 판단한다.
  useEffect(() => {
    if (readSaved()) return;
    const sentinel = document.getElementById("rsvp-bottom-sentinel");
    if (!sentinel) return;

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (fired || !entries.some((e) => e.isIntersecting)) return;
        if (document.body.classList.contains("overlay-open")) return;
        // 이 세션에서 방금 제출했을 수도 있으니 발동 시점에 다시 확인한다
        if (readSaved()) {
          io.disconnect();
          return;
        }
        fired = true;
        io.disconnect();
        setDone(false);
        setError("");
        setOpen(true);
      },
      { rootMargin: "0px 0px 120px 0px" }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // 모달이 열려 있는 동안 뒤로가기로 닫히게 하고 배경 스크롤을 잠근다.
  // 내부 페이지 위에서도 열리므로 레이어 깊이를 공유하는 훅을 쓴다.
  useBackLayer(open, () => setOpen(false));

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
          // 이전 응답 id를 함께 보내면 서버가 그 행을 지우고 새로 넣는다 → 중복 방지
          replaceId: saved?.id,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "전송에 실패했어요. 잠시 후 다시 시도해주세요");
        return;
      }
      const next: Saved = {
        id: data?.id,
        attending,
        name: name.trim(),
        side,
        headcount: attending ? headcount : 0,
      };
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSaved(next);
      setDone(true);
      setTimeout(() => setOpen(false), 2600);
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

            {saved && !editing && !done ? (
              /* 이미 응답한 사람에게는 폼 대신 지금까지의 응답을 먼저 보여준다 */
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-pink text-sm">참석 여부</p>
                <p className="mt-4 text-[19px] text-white">이미 응답해 주셨어요</p>

                <div className="mx-auto mt-5 w-full max-w-[15rem] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-white/85">
                  <p>
                    {saved.side === "groom" ? "신랑측" : "신부측"} · {saved.name}
                  </p>
                  <p className="mt-1 text-pink">
                    {saved.attending ? `참석 ${saved.headcount}명` : "불참"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditing(true);
                    setError("");
                  }}
                  className="w-full mt-6 py-3.5 rounded-full bg-pink-soft text-ink text-sm active:scale-[0.99] transition-transform"
                >
                  다시 제출하기
                </button>
                <p className="text-[11px] text-white/45 mt-3">
                  다시 보내면 이전 응답이 새 응답으로 바뀝니다
                </p>
              </motion.div>
            ) : done ? (
              <motion.div
                className="py-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-soft text-ink"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
                >
                  <Check className="h-7 w-7" />
                </motion.span>

                <p className="mt-5 text-[19px] text-white">
                  {attending ? "참석 여부를 전달했어요" : "마음 전해드렸어요"}
                </p>
                <p className="mt-2 text-[14px] leading-6 text-white/70">
                  {attending
                    ? "당일 뵙기를 기다리고 있을게요"
                    : "함께해 주시는 마음만으로 충분합니다"}
                </p>

                <div className="mx-auto mt-5 w-full max-w-[15rem] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[14px] text-white/85">
                  <p>
                    {side === "groom" ? "신랑측" : "신부측"} · {name.trim()}
                  </p>
                  <p className="mt-1 text-pink">
                    {attending ? `참석 ${headcount}명` : "불참"}
                  </p>
                </div>

                <p className="mt-4 text-[12px] text-white/45">
                  마음이 바뀌시면 다시 보내주셔도 괜찮아요
                </p>
              </motion.div>
            ) : (
              <>
                {/* 시안 2-2: 감사 인사 대신 예식 정보 */}
                <div className="text-center text-white pb-5 mb-5 border-b border-white/12">
                  <p className="text-pink text-sm">
                    {saved ? "참석 여부 수정" : "참석 여부"}
                  </p>
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
                  {submitting ? "전송 중…" : saved ? "수정해서 다시 보내기" : "전달하기"}
                </button>
                <p className="text-[11px] text-white/45 text-center mt-3">
                  {saved
                    ? "다시 보내면 이전 응답이 바뀝니다"
                    : "마음이 바뀌시면 다시 보내주셔도 괜찮아요"}
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

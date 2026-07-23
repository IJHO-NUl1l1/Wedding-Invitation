"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Minus, Plus, X } from "lucide-react";

type Step = "choice" | "form" | "thanks" | "done";
type Mode = "hidden" | "open" | "min";

const STORAGE_KEY = "rsvp-status"; // "done" | "later"
const ID_KEY = "rsvp-id"; // 마지막 응답의 uuid — 재제출 시 교체용
const ANSWER_KEY = "rsvp-answer"; // "attend" | "decline" — done 화면 표시용

export default function RsvpModal() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [step, setStep] = useState<Step>("choice");
  const [name, setName] = useState("");
  const [side, setSide] = useState<"groom" | "bride" | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [thanksText, setThanksText] = useState("소중한 마음 감사합니다");

  // 봉투 열림 후 page.tsx가 쏘는 이벤트로 등장
  useEffect(() => {
    const show = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "done") {
        setStep("done");
        setMode("min"); // 이미 응답한 사람은 버튼만
      } else {
        setStep("choice");
        setMode("open"); // 미응답·나중에 → 모달 자동 등장
      }
    };
    window.addEventListener("rsvp-show", show);
    return () => window.removeEventListener("rsvp-show", show);
  }, []);

  const minimize = (remember?: "later") => {
    if (remember && localStorage.getItem(STORAGE_KEY) !== "done") {
      localStorage.setItem(STORAGE_KEY, remember);
    }
    setMode("min");
  };

  const send = async (payload: {
    attending: boolean;
    name?: string;
    side?: "groom" | "bride" | null;
    headcount?: number;
  }) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          replaceId: localStorage.getItem(ID_KEY) ?? undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "전송에 실패했어요. 잠시 후 다시 시도해주세요");
        return false;
      }
      if (data?.id) localStorage.setItem(ID_KEY, data.id);
      localStorage.setItem(STORAGE_KEY, "done");
      localStorage.setItem(ANSWER_KEY, payload.attending ? "attend" : "decline");
      return true;
    } finally {
      setSubmitting(false);
    }
  };

  // 불참: 입력 없이 익명 원탭 제출
  const declineNow = async () => {
    const ok = await send({ attending: false });
    if (!ok) return;
    setThanksText("마음만으로도 감사합니다");
    setStep("thanks");
    setTimeout(() => {
      setStep("done");
      setMode("min");
    }, 1400);
  };

  const submitAttend = async () => {
    if (!name.trim()) { setError("이름을 입력해주세요"); return; }
    if (!side) { setError("신랑측/신부측을 선택해주세요"); return; }
    const ok = await send({ attending: true, name: name.trim(), side, headcount });
    if (!ok) return;
    setThanksText("소중한 마음 감사합니다");
    setStep("thanks");
    setTimeout(() => {
      setStep("done");
      setMode("min");
    }, 1400);
  };

  const reopen = () => {
    if (localStorage.getItem(STORAGE_KEY) === "done") setStep("done");
    else setStep("choice");
    setMode("open");
  };

  const sideButton = (value: "groom" | "bride", label: string) => (
    <button
      onClick={() => setSide(value)}
      className={`flex-1 py-2.5 text-xs font-serif rounded-xl border transition-colors ${
        side === value
          ? "bg-blush/20 border-blush-dark text-charcoal"
          : "bg-white border-blush/30 text-charcoal-light"
      }`}
    >
      {label}
    </button>
  );

  const answered = typeof window !== "undefined" ? localStorage.getItem(ANSWER_KEY) : null;

  return (
    <>
      <AnimatePresence>
        {mode === "open" && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-charcoal/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => minimize("later")}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {mode === "open" && (
          <motion.div
            key="modal"
            layoutId="rsvp"
            className="fixed z-40 inset-x-6 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-cream rounded-3xl shadow-xl overflow-hidden"
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <div className="relative px-6 py-8">
              {/* 닫기(최소화) */}
              <button
                onClick={() => minimize("later")}
                aria-label="닫기"
                className="absolute top-4 right-4 text-charcoal-light/50 active:text-charcoal transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {step === "choice" && (
                <div className="text-center">
                  <p className="font-cormorant italic text-gold tracking-widest text-xs mb-2">R.S.V.P.</p>
                  <h3 className="font-serif text-lg text-charcoal mb-1">참석 의사 전달</h3>
                  <p className="font-serif text-xs text-charcoal-light leading-5 mb-6">
                    축하의 마음으로 참석해 주시는 한 분 한 분을
                    <br />
                    소중히 준비하고자 합니다
                  </p>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setStep("form")}
                      className="w-full py-3 bg-blush-dark text-white text-sm font-serif rounded-xl active:brightness-95 transition-all"
                    >
                      참석할게요
                    </button>
                    <button
                      onClick={declineNow}
                      disabled={submitting}
                      className="w-full py-3 bg-white border border-blush/40 text-charcoal text-sm font-serif rounded-xl active:bg-blush/10 disabled:opacity-60 transition-colors"
                    >
                      {submitting ? "전달 중..." : "참석이 어려워요"}
                    </button>
                    <button
                      onClick={() => minimize("later")}
                      className="w-full py-2 text-xs font-serif text-charcoal-light/60 underline underline-offset-2"
                    >
                      나중에 답할게요
                    </button>
                  </div>
                  {error && <p className="mt-3 text-xs text-rose-400 font-serif">{error}</p>}
                </div>
              )}

              {step === "form" && (
                <div>
                  <p className="text-center font-serif text-sm text-charcoal mb-5">
                    참석 정보를 알려주세요
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="성함"
                      maxLength={20}
                      className="w-full px-4 py-3 border border-blush/30 rounded-xl text-sm font-serif text-charcoal bg-white focus:outline-none focus:border-blush-dark placeholder:text-charcoal-light/40"
                    />
                    <div className="flex gap-2">
                      {sideButton("groom", "신랑측")}
                      {sideButton("bride", "신부측")}
                    </div>
                    <div className="flex items-center justify-between bg-white border border-blush/30 rounded-xl px-4 py-2.5">
                      <span className="text-xs font-serif text-charcoal-light">본인 포함 인원</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setHeadcount((n) => Math.max(1, n - 1))}
                          aria-label="인원 줄이기"
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-blush/40 text-charcoal-light active:bg-blush/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-serif text-charcoal">{headcount}</span>
                        <button
                          onClick={() => setHeadcount((n) => Math.min(10, n + 1))}
                          aria-label="인원 늘리기"
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-blush/40 text-charcoal-light active:bg-blush/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-xs text-rose-400 font-serif text-center">{error}</p>}
                    <button
                      onClick={submitAttend}
                      disabled={submitting}
                      className="w-full py-3 bg-blush-dark text-white text-sm font-serif rounded-xl active:brightness-95 disabled:opacity-60 transition-all"
                    >
                      {submitting ? "전달 중..." : "전달하기"}
                    </button>
                    <button
                      onClick={() => setStep("choice")}
                      className="w-full py-1.5 text-xs font-serif text-charcoal-light/60"
                    >
                      ← 다시 선택
                    </button>
                  </div>
                </div>
              )}

              {step === "thanks" && (
                <div className="text-center py-6">
                  <p className="font-script text-blush-dark text-4xl mb-3">♥</p>
                  <p className="font-serif text-sm text-charcoal">{thanksText}</p>
                </div>
              )}

              {step === "done" && (
                <div className="text-center py-2">
                  <p className="font-script text-blush-dark text-4xl mb-3">♥</p>
                  <p className="font-serif text-sm text-charcoal mb-1">
                    {answered === "decline"
                      ? "불참 의사가 전달되었어요"
                      : "참석 의사가 전달되었어요"}
                  </p>
                  <p className="font-serif text-xs text-charcoal-light mb-5">
                    사정이 바뀌면 언제든 변경할 수 있어요
                  </p>
                  <button
                    onClick={() => { setError(""); setStep("choice"); }}
                    className="text-xs font-serif text-blush-dark underline underline-offset-2"
                  >
                    응답 변경하기
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {mode === "min" && (
          <motion.button
            key="fab"
            layoutId="rsvp"
            onClick={reopen}
            aria-label="참석 의사 전달"
            className="fixed bottom-6 left-5 z-40 flex items-center gap-2 bg-blush-dark text-white text-xs font-serif rounded-full px-4 py-2.5 shadow-lg active:brightness-95"
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            <CalendarCheck className="w-4 h-4" />
            참석 여부
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

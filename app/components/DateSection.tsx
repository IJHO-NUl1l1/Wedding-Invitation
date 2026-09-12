"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";
import SectionTitle from "@/app/components/SectionTitle";

const DAYS = ["SUN", "M", "T", "W", "T", "F", "SAT"];

function buildMonth(year: number, month: number) {
  const first = new Date(year, month - 1, 1).getDay();
  const total = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** 의존성은 반드시 타임스탬프(원시값)여야 한다. Date 객체를 넘기면 매 렌더마다 새 객체라 무한 루프가 난다. */
function useCountdown(targetMs: number) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(targetMs - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return left;
}

export default function DateSection() {
  const { wedding } = weddingData;
  const cells = buildMonth(wedding.year, wedding.month);
  const targetMs = new Date(wedding.year, wedding.month - 1, wedding.day, 12, 20).getTime();
  const left = useCountdown(targetMs);

  // 서버/클라이언트 시각 차이로 인한 하이드레이션 불일치를 피하려고 계산 전에는 비워둔다
  const days = left === null ? null : Math.max(0, Math.floor(left / 86400000));
  const hours = left === null ? null : Math.max(0, Math.floor((left / 3600000) % 24));
  const mins = left === null ? null : Math.max(0, Math.floor((left / 60000) % 60));
  const secs = left === null ? null : Math.max(0, Math.floor((left / 1000) % 60));

  return (
    <motion.section
      className="bg-ink px-6 py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <SectionTitle>달력</SectionTitle>

      <div className="max-w-md mx-auto">
        {/* 시안의 분홍 달력 카드 */}
        <div className="rounded-2xl bg-pink-soft px-5 py-7 text-ink">
          <p className="text-center text-xl tracking-tight">
            {wedding.year}.{String(wedding.month).padStart(2, "0")}.
            {String(wedding.day).padStart(2, "0")}. SAT
          </p>
          <p className="text-center text-sm italic mt-0.5">12:20 PM</p>

          <div className="grid grid-cols-7 gap-y-3 mt-6 text-center">
            {DAYS.map((d, i) => (
              <span key={i} className="text-[13px] text-ink/70">
                {d}
              </span>
            ))}
            {cells.map((d, i) => {
              const isWeddingDay = d === wedding.day;
              return (
                <span key={i} className="flex items-center justify-center">
                  {d === null ? (
                    ""
                  ) : isWeddingDay ? (
                    <span className="w-8 h-8 rounded-full bg-ink text-pink-soft flex items-center justify-center text-[15px]">
                      {d}
                    </span>
                  ) : (
                    <span className="text-[15px] text-ink/85">{d}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {/* D-DAY */}
        <div className="mt-6 flex justify-center gap-3 text-white">
          <Unit value={days} label="DAYS" />
          <Unit value={hours} label="HOUR" />
          <Unit value={mins} label="MIN" />
          <Unit value={secs} label="SEC" />
        </div>
      </div>
    </motion.section>
  );
}

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex-1 max-w-[5rem] rounded-xl border border-white/15 bg-white/5 py-3 text-center">
      <p className="text-xl tabular-nums">{value === null ? "–" : value}</p>
      <p className="text-[10px] text-pink tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

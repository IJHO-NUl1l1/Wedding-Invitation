"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

  const unit = (ms: number) => (left === null ? null : Math.max(0, Math.floor(left / ms)));
  const days = unit(86400000);
  const hours = left === null ? null : Math.max(0, Math.floor((left / 3600000) % 24));
  const mins = left === null ? null : Math.max(0, Math.floor((left / 60000) % 60));
  const secs = left === null ? null : Math.max(0, Math.floor((left / 1000) % 60));

  return (
    <motion.section
      className="bg-ink px-5 py-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionTitle>D-DAY</SectionTitle>

      <div className="max-w-md mx-auto">
        {/* 시안의 분홍 달력. 샴페인잔 일러스트는 시안 원본에서 추출해 겹친다. */}
        {/* 위/아래에 여백 띠를 두고 그 안에 일러스트를 넣어 날짜와 겹치지 않게 한다 */}
        <div className="relative overflow-hidden bg-pink-soft px-5 pt-8 pb-32 text-ink">
          <Image
            src="/images/date-glass-right.png"
            alt=""
            width={231}
            height={298}
            className="pointer-events-none absolute right-0 top-1 w-[23%] h-auto"
          />
          <Image
            src="/images/date-glass-left.png"
            alt=""
            width={229}
            height={329}
            className="pointer-events-none absolute left-2 bottom-2 w-[21%] h-auto"
          />

          <p className="relative text-center text-[28px] leading-tight tracking-tight">
            {wedding.year}.{String(wedding.month).padStart(2, "0")}.
            {String(wedding.day).padStart(2, "0")}. SAT
          </p>
          <p className="relative text-center text-[19px] italic mt-1">12:20 PM</p>

          {/* 시안처럼 그리드를 안쪽으로 넣어 좌우 여백에 일러스트가 들어가게 한다 */}
          <div className="relative grid grid-cols-7 gap-y-4 mt-8 text-center">
            {DAYS.map((d, i) => (
              <span key={i} className="text-[15px] text-ink/70">
                {d}
              </span>
            ))}
            {cells.map((d, i) => (
              <span key={i} className="flex items-center justify-center">
                {d === null ? (
                  ""
                ) : d === wedding.day ? (
                  <span className="w-9 h-9 rounded-full bg-ink text-pink-soft flex items-center justify-center text-[18px]">
                    {d}
                  </span>
                ) : (
                  <span className="text-[18px] text-ink/85">{d}</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* D-DAY */}
        <div className="mt-5 flex justify-center text-white">
          <Unit value={days} label="DAYS" />
          <Colon />
          <Unit value={hours} label="HOUR" />
          <Colon />
          <Unit value={mins} label="MIN" />
          <Colon />
          <Unit value={secs} label="SEC" />
        </div>
      </div>
    </motion.section>
  );
}

function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="flex-1 py-3 text-center">
      <p className="text-[26px] tabular-nums leading-none">{value === null ? "–" : value}</p>
      <p className="text-[11px] text-pink tracking-[0.2em] mt-1.5">{label}</p>
    </div>
  );
}

/** 숫자 줄에 맞춰 놓는 구분 기호. 라벨 높이만큼 위로 올려 정렬한다. */
function Colon() {
  return (
    <span aria-hidden className="py-3 text-[26px] leading-none text-white/45">
      :
    </span>
  );
}

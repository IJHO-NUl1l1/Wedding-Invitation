"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/app/data/mock";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= lastDate; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function DateSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [dDays, setDDays] = useState<number | null>(null);

  const { year, month, day } = weddingData.wedding;

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const wedding = new Date(year, month - 1, day);
    wedding.setHours(0, 0, 0, 0);
    setDDays(Math.round((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [year, month, day]);
  const cells = buildCalendar(year, month);

  return (
    <motion.section
      className="py-16 px-6 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Save the Date</p>
        <h2 className="font-serif text-2xl text-charcoal">결혼식 날짜</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      {/* D-Day 카운터 */}
      {dDays !== null && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="inline-flex items-baseline gap-1.5">
            <span className="font-cormorant italic text-gold text-2xl tracking-wider">D</span>
            <span className="font-cormorant text-charcoal-light text-xl">
              {dDays >= 0 ? "-" : "+"}
            </span>
            <span className="font-cormorant text-6xl font-light text-charcoal leading-none">
              {dDays === 0 ? "Day" : Math.abs(dDays)}
            </span>
          </div>
          {dDays === 0 && (
            <p className="font-cormorant italic text-gold text-sm tracking-widest mt-1">
              오늘이 결혼식 날입니다 🎉
            </p>
          )}
        </motion.div>
      )}

      {/* 날짜 강조 텍스트 */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="font-script text-gold text-5xl mb-2">
          {month}.{String(day).padStart(2, "0")}
        </p>
        <p className="text-charcoal font-serif text-sm tracking-widest">
          {year}년 {month}월 {day}일 {weddingData.wedding.dayOfWeek}
        </p>
        <p className="text-charcoal-light font-cormorant text-sm mt-1 tracking-wider">
          {weddingData.wedding.time}
        </p>
      </motion.div>

      {/* 캘린더 */}
      <div ref={ref} className="max-w-xs mx-auto">
        {/* 월 헤더 */}
        <div className="text-center mb-4">
          <p className="font-cormorant text-charcoal tracking-[0.2em] text-base">
            {year} · {String(month).padStart(2, "0")}
          </p>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs py-1 font-cormorant tracking-wider ${
                i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-charcoal-light"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            const isWeddingDay = cell === day;
            return (
              <div key={idx} className="flex items-center justify-center h-9">
                {cell !== null && (
                  <motion.div
                    className={`relative w-8 h-8 flex items-center justify-center rounded-full text-xs font-serif cursor-default ${
                      isWeddingDay
                        ? "bg-blush text-white font-semibold shadow-md"
                        : idx % 7 === 0
                        ? "text-red-300"
                        : idx % 7 === 6
                        ? "text-blue-300"
                        : "text-charcoal-light"
                    }`}
                    initial={isWeddingDay ? { scale: 0.6, opacity: 0 } : { opacity: 0 }}
                    animate={
                      isInView
                        ? isWeddingDay
                          ? { scale: 1.15, opacity: 1 }
                          : { opacity: 1 }
                        : {}
                    }
                    transition={
                      isWeddingDay
                        ? { delay: 0.4 + idx * 0.01, duration: 0.5, type: "spring", stiffness: 200 }
                        : { delay: 0.1 + idx * 0.015, duration: 0.3 }
                    }
                  >
                    {isWeddingDay && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blush/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      />
                    )}
                    {cell}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 장식 */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-blush/50" />
            <span className="font-script text-blush text-xl">♥</span>
            <div className="w-8 h-px bg-blush/50" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

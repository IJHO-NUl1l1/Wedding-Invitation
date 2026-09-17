"use client";

import { motion } from "framer-motion";
import { scribbleAcrossHeart } from "@/lib/crayonHeart";


const PASSES = [
  {
    d: scribbleAcrossHeart({
      slope: 40,
      spreadShort: 20,
      spreadLong: 6,
      shortLength: 12,
      longLength: 36,
      angleJitter: 2,
      spacing: 0.8,
      jitter: 0.4,
      overshootPct: [1, 2.8],
      turnRound: 1.2,
      bend: 1.6,
      lastAngleBoost: 20,
      finishAtTip: true,
      extraStrokes: 1,
      tipAngleBoost: 5,
      extraStrokeScale: 2,
      seed: 11,
    }).d,
    color: "var(--heart)",
    width: 4,
    opacity: 0.95,
    delay: 0,
  },
];

export default function CrayonHeart({
  duration = 1.6,
  delay = 0.2,
  className = "",
}: {
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 52 48"
      aria-hidden
      className={`block h-auto w-full overflow-visible ${className}`}
      initial="blank"
      whileInView="colored"
      viewport={{ once: true, amount: 0.2 }}
    >
      <defs>
        <filter id="crayon-heart-texture" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={2} seed={3} result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter="url(#crayon-heart-texture)">
        {PASSES.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={p.width}
            strokeOpacity={p.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              blank: { pathLength: 0 },
              colored: {
                pathLength: 1,
                transition: { duration, delay: delay + p.delay, ease: "linear" },
              },
            }}
          />
        ))}
      </g>
    </motion.svg>
  );
}

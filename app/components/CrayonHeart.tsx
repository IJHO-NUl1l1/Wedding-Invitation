"use client";

import { motion } from "framer-motion";
import { heartPath } from "@/lib/crayonHeart";

/*
 * 크레파스로 하트를 칠한 듯한 그림. 화면에 들어오면 칠해지는 과정이 보이고, 지나온 자리는 그대로 남는다.
 *
 * 획이 지나는 길은 lib/crayonHeart.ts 의 PEN 표에 좌표로 적혀 있다. 모양을 바꾸려면 그 숫자를 고치면 된다.
 * 여기서는 그 길을 얼마나 굵게, 무슨 색으로, 얼마 동안 그릴지만 정한다.
 */

/** 획 굵기·색. 굵기는 하트 그림판(가로 52) 기준이라 4면 하트 폭의 약 8%다 */
const WIDTH = 4;
const COLOR = "var(--heart)";

export default function CrayonHeart({
  duration = 1.6,
  delay = 0.2,
  className = "",
}: {
  /** 처음부터 끝까지 칠하는 데 걸리는 시간(초) */
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.svg
      viewBox="0 0 52 48"
      aria-hidden
      // 획이 하트 밖으로 나가도 잘리지 않게 한다
      className={`block h-auto w-full overflow-visible ${className}`}
      initial="blank"
      whileInView="colored"
      // 절반쯤 보일 때까지 기다리면 늦게 나타나 보여서, 조금만 보여도 칠하기 시작한다
      viewport={{ once: true, amount: 0.2 }}
    >
      <defs>
        {/*
         * 곧은 선을 크레파스 획처럼 흔들어 주는 필터.
         * scale을 키우면 더 삐뚤빼뚤해지고, baseFrequency를 키우면 잔결이 촘촘해진다.
         * 노이즈 값이 브라우저 색 공간 변환에 흔들리지 않도록 sRGB로 계산한다.
         */}
        <filter id="crayon-heart-texture" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves={2} seed={3} result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale={2.2} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <motion.path
        d={heartPath()}
        fill="none"
        stroke={COLOR}
        strokeWidth={WIDTH}
        strokeOpacity={0.95}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crayon-heart-texture)"
        variants={{
          blank: { pathLength: 0 },
          colored: {
            pathLength: 1,
            // 손으로 칠하듯 처음부터 일정한 속도로. 천천히 시작하는 곡선은 초반에 거의 안 칠해져 기다리는 것처럼 보였다
            transition: { duration, delay, ease: "linear" },
          },
        }}
      />
    </motion.svg>
  );
}

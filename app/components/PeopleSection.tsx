"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";
import CrayonHeart from "@/app/components/CrayonHeart";

type Person = "groom" | "bride" | "story";

const PANEL = "relative aspect-[833/1469]";

/** 판마다 흩어진 분홍 리본 장식 위치 (left %, top %) */
const BOWS_TOP: [number, number][] = [[1, 1], [89, 1], [89, 53], [46, 89], [1, 92], [88, 92]];
const BOWS_BOTTOM: [number, number][] = [[1, 1], [89, 1], [46, 9], [-1, 53], [89, 53], [1, 92], [88, 92]];

const SHADOW = "[text-shadow:0_1px_8px_rgba(0,0,0,0.55)]";

/*
 * 가족사진 속 어린 신랑·신부의 실루엣 윤곽. 사진 기준 % 좌표이며 시계방향.
 * 확대 격자를 대고 모자·귀·옷깃·손 끝을 따라 찍었다. 동생이 앞을 가리는 부분은 그 경계를 따라 닫는다.
 */
const GROOM_KID: [number, number][] = [
  [34.8, 27.3], [38.7, 28.2], [40.6, 30.1], [41.6, 32.6], [41.3, 35.5], [43.2, 36.7],
  [46.8, 38.4], [49.1, 40.6], [50.7, 44.5], [51.4, 46.7], [46.5, 44.8], [41.3, 44.6],
  [37.4, 46.2], [36.1, 48.7], [35.1, 53.0], [34.8, 57.4], [30.9, 57.9], [27.7, 56.9],
  [25.4, 55.5], [23.8, 50.6], [24.7, 47.4], [24.7, 42.1], [27.0, 38.9], [25.7, 36.0],
  [26.4, 34.0], [29.0, 29.6], [31.6, 27.9],
];
const BRIDE_KID: [number, number][] = [
  [64.6, 32.8], [68.7, 34.0], [69.2, 37.7], [69.5, 42.5], [70.1, 49.0], [71.3, 52.6],
  [71.3, 60.6], [71.3, 65.9], [68.1, 70.7], [66.5, 73.5], [61.0, 74.5], [56.5, 73.0],
  [56.2, 70.7], [54.7, 64.7], [55.3, 56.6], [57.0, 50.6], [59.1, 47.3], [58.2, 42.5],
  [58.5, 37.7], [60.2, 34.0],
];

export default function PeopleSection({ onOpen }: { onOpen: (p: Person) => void }) {
  const { people } = weddingData;
  const [groomParents, groomRole] = people.groom.label.split("의 ");
  const [brideParents, brideRole] = people.bride.label.split("의 ");

  return (
    <section id="people-section" className="bg-ink">
      {/* 테마 토큰(bg-pink-page)은 dev 서버를 재시작해야 생성되므로 CSS 변수를 직접 쓴다 */}
      <div className="max-w-md mx-auto overflow-hidden bg-[var(--pink-page)]" style={{ containerType: "inline-size" }}>
        {/* ── 1판: 양가 가족사진 ── */}
        <div className={PANEL}>
          <Bows at={BOWS_TOP} />

          <Tile
            onClick={() => onOpen("groom")}
            label="신랑 페이지 열기"
            src={people.groom.thumb}
            width={1536}
            height={2100}
            cx={37}
            cy={33}
            w={59}
            deg={9}
          >
            <Silhouette points={GROOM_KID} ratio={2048 / 1536} delay={0.8} />
            {/* 3차 수정: 소개 글은 교보 손글씨로, 조금 작게 */}
            <div className={`absolute inset-x-0 top-[5%] text-center text-white font-hand text-[4.8cqw] leading-snug ${SHADOW}`}>
              <p>{groomParents}의</p>
              <p>
                {groomRole}, <span className="text-pink">신랑</span> {people.groom.name}
              </p>
            </div>
            <TapChip className="right-[4%] bottom-[9%]" />
          </Tile>

          <Tile
            onClick={() => onOpen("bride")}
            label="신부 페이지 열기"
            src={people.bride.thumb}
            width={1078}
            height={774}
            cx={48.9}
            cy={75}
            w={86}
            deg={-9.5}
            delay={0.1}
          >
            <Silhouette points={BRIDE_KID} ratio={774 / 1078} delay={1} />
            <div className={`absolute left-[4%] top-[9%] text-left text-white font-hand text-[4.6cqw] leading-[1.45] ${SHADOW}`}>
              <p>{brideParents}의</p>
              <p>{brideRole},</p>
              <p className="text-pink">신부</p>
              <p>{people.bride.name}</p>
            </div>
            <TapChip className="right-[9%] bottom-[5%]" delay={0.6} />
          </Tile>

          <motion.div
            className="pointer-events-none absolute right-[3%] top-[9%] w-max text-right text-[4.6cqw] leading-[1.35] text-ink"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <p>사진을</p>
            <p>눌러보세요!</p>
          </motion.div>
        </div>

        {/* ── 2판: 어린시절 두 사람 + 우리의 이야기 ── */}
        <div className={PANEL}>
          <Bows at={BOWS_BOTTOM} />

          <Tile
            onClick={() => onOpen("story")}
            label="우리의 이야기 열기"
            src={people.story.thumb}
            width={540}
            height={811}
            cx={48.6}
            cy={65.7}
            w={65}
            deg={-8}
          >
            {/* 2판에는 이 사진 하나만 누를 수 있어 1판처럼 순서를 둘 필요가 없다 */}
            <TapChip className="right-[5%] bottom-[11%]" appear={0.15} />
          </Tile>

          {/* 어린시절 사진·하트는 장식이라 눌러도 세부 페이지로 가지 않는다 */}
          {/* 누끼 사진이라 흰 배경(card)을 깔지 않는다. 깔면 투명한 부분이 흰 사각형으로 보인다 */}
          <Tile
            label="어린 시절 신랑"
            src={people.groomChild}
            width={1080}
            height={1440}
            cx={23}
            cy={24}
            w={105}
            deg={2}
            delay={0.1}
          />

          <Tile
            label="어린 시절 신부"
            src={people.brideChild}
            width={312}
            height={916}
            cx={74.5}
            cy={28.9}
            w={22.4}
            deg={-10.25}
            delay={0.2}
          />

          {/*
           * 3차 수정: 손그림 대신 하트. 하트 구멍 뚫린 종이를 대고 크레파스로 대각선 지그재그를 칠한 뒤
           * 종이를 뗀 느낌이다. 화면에 들어오면 칠해지는 과정이 보이고(CrayonHeart), 다 칠한 뒤 아주 느리게 한 번씩 뛴다.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{ left: "50.9%", top: "32.7%", width: "18.6%", translate: "-50% -50%" }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut", delay: 3 }}
            >
              {/* 기다림 없이 바로 칠하기 시작하고, 칠하는 과정이 잘 보이도록 천천히 칠한다 */}
              <CrayonHeart duration={3.2} delay={0} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 누를 수 있는 사진. 바깥은 위치·기울기·등장, 안쪽은 화면에 들어올 때 한 번 살짝 톡 튀는 동작만 맡는다.
 * 계속 흔들리게 하면 산만해서, 누를 수 있다는 신호는 TapChip이 조용히 준다.
 */
function Tile({
  onClick,
  label,
  src,
  width,
  height,
  cx,
  cy,
  w,
  deg,
  delay = 0,
  card,
  children,
}: {
  /** 없으면 누를 수 없는 장식 사진으로 그린다 */
  onClick?: () => void;
  label: string;
  src: string;
  width: number;
  height: number;
  cx: number;
  cy: number;
  w: number;
  deg: number;
  delay?: number;
  /** 흰 배경이 붙은 사진을 카드처럼 보이게 */
  card?: boolean;
  children?: React.ReactNode;
}) {
  const Box = onClick ? motion.button : motion.div;
  return (
    <Box
      {...(onClick
        ? { type: "button" as const, onClick, "aria-label": label }
        : { role: "img", "aria-label": label })}
      className="absolute"
      style={{ left: `${cx}%`, top: `${cy}%`, width: `${w}%`, translate: "-50% -50%" }}
      initial={{ opacity: 0, y: 18, rotate: deg }}
      whileInView={{ opacity: 1, y: 0, rotate: deg }}
      viewport={{ once: true, margin: "-40px" }}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={`relative ${card ? "bg-white" : ""}`}
        initial={{ scale: 1 }}
        whileInView={{ scale: [1, 1.035, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.9 + delay, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes="(max-width: 448px) 90vw, 400px"
          className="block h-auto w-full"
        />
        {onClick && <HandBorder seed={cx * 7 + cy} />}
        {children}
      </motion.div>
    </Box>
  );
}

/**
 * 실루엣 좌표를 부드러운 곡선(캣멀-롬 → 베지어)으로 이어 흰 테두리를 그린다.
 * SVG 좌표계를 사진 비율 그대로(가로 100 × 세로 100·ratio) 잡아 균일하게 늘어나게 한다.
 * 비균일 확대 + non-scaling-stroke 조합은 pathLength 애니메이션의 선 길이를 어긋나게 해 윤곽이 일부만 그려진다.
 */
function Silhouette({
  points,
  ratio,
  delay,
}: {
  points: [number, number][];
  /** 사진 세로/가로 비율 */
  ratio: number;
  delay: number;
}) {
  // 아이를 선이 덮지 않도록 윤곽 중심에서 살짝 바깥으로 벌린 뒤, 세로 좌표를 사진 비율로 바꾼다
  const cxm = points.reduce((s, p) => s + p[0], 0) / points.length;
  const cym = points.reduce((s, p) => s + p[1], 0) / points.length;
  const pts = points.map(
    ([x, y]) => [cxm + (x - cxm) * 1.06, (cym + (y - cym) * 1.04) * ratio] as [number, number]
  );

  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0]} ${p2[1]}`;
  }

  return (
    <svg
      viewBox={`0 0 100 ${(100 * ratio).toFixed(2)}`}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [filter:drop-shadow(0_0_2px_rgba(0,0,0,0.35))]"
    >
      <motion.path
        d={d + " Z"}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.1}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

/**
 * 누를 수 있는 사진 모서리에 붙인 분홍 스티커. 흰 UI 버튼 대신 스크랩북 페이지(리본·하트·분홍 종이)와 어울리도록
 * 연분홍 바탕 + 흰 테두리로 살짝 기울여 붙이고, 뒤로 은은한 물결이 가끔 퍼져 누를 곳임을 알린다.
 */
function TapChip({
  className,
  delay = 0,
  appear = 1.1,
}: {
  className: string;
  delay?: number;
  /** 화면에 들어온 뒤 글씨가 나타나기까지 걸리는 시간(초) */
  appear?: number;
}) {
  // 배경 없이 흰 글씨만. 사진의 점선 테두리와 같은 박자로 깜빡인다.
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay: appear + delay }}
    >
      <motion.span
        className={`inline-block font-hand text-[6.4cqw] leading-none text-white ${SHADOW}`}
        style={{ rotate: -8 }}
        animate={{ y: [0, "-0.8cqw", 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Click!
      </motion.span>
    </motion.span>
  );
}

/**
 * 누를 수 있는 사진을 두르는 손으로 그린 듯한 흰 점선.
 * 모서리·변마다 살짝 흔들린 선을 사진 실제 크기(px)로 그려, 점 간격이 사진 크기와 상관없이 일정하다.
 * 깜빡이는 대신 점선이 사진 둘레를 천천히 돌아 시선을 끈다.
 */
function HandBorder({ seed }: { seed: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = useMemo(() => (size ? wobblyRect(size.w, size.h, seed) : ""), [size, seed]);

  return (
    <span ref={ref} aria-hidden className="pointer-events-none absolute -inset-[2.2cqw]">
      {size && (
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${size.w} ${size.h}`}>
          <motion.path
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="9 17"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}
            animate={{ strokeDashoffset: [0, -52] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )}
    </span>
  );
}

/** 사각형 둘레를 따라 조금씩 어긋난 점을 찍고 부드럽게 이어 손그림처럼 만든다. seed가 같으면 모양도 같다. */
function wobblyRect(w: number, h: number, seed: number) {
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280) - 0.5;
  const amp = 2.2;
  const pts: [number, number][] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 45));
    for (let i = 0; i < n; i++) {
      const t = i / n;
      pts.push([x0 + (x1 - x0) * t + rand() * amp, y0 + (y1 - y0) * t + rand() * amp]);
    }
  };
  edge(0, 0, w, 0);
  edge(w, 0, w, h);
  edge(w, h, 0, h);
  edge(0, h, 0, 0);
  // 끝점을 살짝 지나치게 닫아 손으로 한 바퀴 그린 느낌을 낸다
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let path = `M ${mid(pts[pts.length - 1], pts[0]).join(" ")}`;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % pts.length]);
    path += ` Q ${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return path;
}

function Bows({ at }: { at: [number, number][] }) {
  return (
    <>
      {at.map(([left, top], i) => (
        <Image
          key={i}
          src="/images/people-bow.png"
          alt=""
          width={100}
          height={110}
          // 100x110짜리 투명 장식이라 최적화할 이득이 없고, 최적화 캐시가 옛 파일을 계속 내보낸 적이 있다
          unoptimized
          className="pointer-events-none absolute h-auto w-[12%]"
          style={{ left: `${left}%`, top: `${top}%` }}
        />
      ))}
    </>
  );
}

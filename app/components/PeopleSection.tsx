"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

type Person = "groom" | "bride" | "story";

/** bg-pink-paper.jpg 안쪽 크림 종이 영역의 실측 위치 (944x1666 기준) */
const CREAM = { left: "7%", top: "12.1%", width: "85.8%", height: "77.6%" };

/**
 * 시안 3페이지: 분홍 종이 위 스크랩북 콜라주.
 *
 * 배경을 잘라내지 않고 전체가 보이도록 이미지를 그대로 깔고, 사진·글씨는
 * 안쪽 크림 영역 안에만 배치한다. 좌표는 모두 크림 영역 기준 %이며
 * 시안에서 실측했다. 글씨는 cqw 단위라 컬럼 폭이 좁아져도 같은 비율을 유지한다.
 */
export default function PeopleSection({ onOpen }: { onOpen: (p: Person) => void }) {
  const { people } = weddingData;

  return (
    <section className="bg-ink">
      <div className="relative max-w-md mx-auto">
        <Image
          src="/images/bg-pink-paper.jpg"
          alt=""
          width={944}
          height={1666}
          className="w-full h-auto"
        />

        <div className="absolute" style={{ ...CREAM, containerType: "inline-size" }}>
          {/* 신랑 */}
          <Photo
            onClick={() => onOpen("groom")}
            src={people.groom.thumb}
            alt="신랑 가족사진"
            cx={24}
            cy={20}
            w={33}
            delay={0}
          />
          <Caption left={50} top={7}>
            <p className="text-[5.4cqw] text-ink/80 break-keep">{people.groom.label}</p>
            <p className="mt-[2cqw] text-[7.6cqw]">
              <span className="text-pink-deep">신랑</span>{" "}
              <span className="text-ink">{people.groom.name}</span>
            </p>
          </Caption>

          {/* 신부 */}
          <Photo
            onClick={() => onOpen("bride")}
            src={people.bride.thumb}
            alt="신부 가족사진"
            cx={72}
            cy={48}
            w={48}
            delay={0.1}
          />
          <Caption left={3} top={41}>
            <p className="text-[5.4cqw] text-ink/80 break-keep">{people.bride.label}</p>
            <p className="mt-[2cqw] text-[7.6cqw]">
              <span className="text-pink-deep">신부</span>{" "}
              <span className="text-ink">{people.bride.name}</span>
            </p>
          </Caption>

          {/* 우리의 이야기 */}
          <Photo
            onClick={() => onOpen("story")}
            src={people.story.thumb}
            alt="우리의 이야기"
            cx={52}
            cy={79}
            w={35}
            delay={0.2}
          />
          {/* 사진 좌우로 같은 간격(5%)만큼 띄우려고 왼쪽 글씨는 오른쪽 끝을 기준으로 앵커한다 */}
          <Caption right={70.5} top={63} fit>
            <p className="text-[10cqw] text-ink">{people.story.label}</p>
          </Caption>
          <Caption left={74.5} top={83} fit>
            <p className="text-[10cqw] text-ink">{people.story.name}</p>
          </Caption>
        </div>
      </div>
    </section>
  );
}

function Photo({
  src,
  alt,
  onClick,
  cx,
  cy,
  w,
  delay,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  cx: number;
  cy: number;
  w: number;
  delay: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={alt}
      className="absolute active:scale-[0.98] transition-transform"
      style={{ left: `${cx}%`, top: `${cy}%`, width: `${w}%`, translate: "-50% -50%" }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={src} alt={alt} width={700} height={520} className="w-full h-auto" />
    </motion.button>
  );
}

function Caption({
  left,
  right,
  top,
  fit,
  children,
}: {
  left?: number;
  /** 오른쪽 끝을 기준으로 앵커할 때 사용 */
  right?: number;
  top: number;
  /** 한 단어짜리 글씨는 줄바꿈 없이 내용만큼만 차지하게 한다 */
  fit?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute font-hand ${fit ? "w-max" : ""}`}
      style={{
        left: left === undefined ? undefined : `${left}%`,
        right: right === undefined ? undefined : `${right}%`,
        top: `${top}%`,
        width: fit ? undefined : "44%",
      }}
    >
      {children}
    </div>
  );
}

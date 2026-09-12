"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingData } from "@/app/data/mock";

type Person = "groom" | "bride" | "story";

/**
 * 시안 3페이지: 핑크 종이 위 스크랩북 콜라주. 사진을 누르면 각 상세가 열린다.
 * 시안은 절대 배치지만, 화면 폭에 따라 캡션이 사진을 덮는 문제가 있어
 * 좌우 지그재그 흐름 배치로 같은 인상을 만든다.
 */
export default function PeopleSection({ onOpen }: { onOpen: (p: Person) => void }) {
  const { people } = weddingData;

  return (
    <section
      className="bg-ink bg-cover bg-center px-6 pt-16 pb-28"
      style={{ backgroundImage: "url(/images/bg-pink-paper.jpg)" }}
    >
      <div className="max-w-md mx-auto space-y-12">
        <Row
          onClick={() => onOpen("groom")}
          src={people.groom.thumb}
          alt="신랑 가족사진"
          rotate={-3}
          side="left"
        >
          <p className="text-[14px] text-ink/75">{people.groom.label}</p>
          <p className="mt-1.5 text-[17px]">
            <span className="text-pink-deep">신랑</span>{" "}
            <span className="text-ink">{people.groom.name}</span>
          </p>
        </Row>

        <Row
          onClick={() => onOpen("bride")}
          src={people.bride.thumb}
          alt="신부 가족사진"
          rotate={2.5}
          side="right"
        >
          <p className="text-[14px] text-ink/75">{people.bride.label}</p>
          <p className="mt-1.5 text-[17px]">
            <span className="text-pink-deep">신부</span>{" "}
            <span className="text-ink">{people.bride.name}</span>
          </p>
        </Row>

        {/* 우리의 이야기 — 시안처럼 사진 좌우로 글자를 나눠 배치 */}
        <div className="relative pt-2">
          <p className="font-hand text-[19px] text-ink absolute left-0 top-6">
            {people.story.label}
          </p>
          <motion.button
            onClick={() => onOpen("story")}
            aria-label="우리의 이야기"
            className="block w-[62%] mx-auto shadow-lg active:scale-[0.98] transition-transform"
            initial={{ opacity: 0, y: 18, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src={people.story.thumb}
              alt="우리의 이야기"
              width={700}
              height={1000}
              className="w-full h-auto"
            />
          </motion.button>
          <p className="font-hand text-[19px] text-ink absolute right-0 top-[58%]">
            {people.story.name}
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({
  src,
  alt,
  onClick,
  rotate,
  side,
  children,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  rotate: number;
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const photo = (
    <motion.button
      onClick={onClick}
      aria-label={alt}
      className="w-[56%] shrink-0 shadow-lg active:scale-[0.98] transition-transform"
      initial={{ opacity: 0, y: 18, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <Image src={src} alt={alt} width={700} height={520} className="w-full h-auto" />
    </motion.button>
  );

  const caption = <div className="font-hand flex-1 pt-3">{children}</div>;

  return (
    <div className="flex items-start gap-4">
      {side === "left" ? photo : caption}
      {side === "left" ? caption : photo}
    </div>
  );
}

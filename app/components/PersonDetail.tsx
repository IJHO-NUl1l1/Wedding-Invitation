"use client";

import Image from "next/image";
import { weddingData } from "@/app/data/mock";

/**
 * 시안 4·5페이지: 크림색 바탕에 편지·어린시절·가족사진을 비스듬히 붙인 콜라주.
 * 신랑은 어린시절 사진이 흰 배경 그대로(폴라로이드 느낌), 신부는 누끼본을 쓴다.
 */
export default function PersonDetail({ who }: { who: "groom" | "bride" }) {
  const data = who === "groom" ? weddingData.groomPage : weddingData.bridePage;
  const person = who === "groom" ? weddingData.groom : weddingData.bride;
  const cutout = who === "bride";

  return (
    <div className="min-h-dvh bg-cream px-5 pt-14 pb-28">
      <div className="max-w-md mx-auto">
        <p className="font-hand text-[22px] text-ink/80 text-center mb-8">
          {who === "groom" ? "신랑" : "신부"} {person.name}
        </p>

        <div className="space-y-8">
          {/* 첫 번째 편지 */}
          <figure className="-rotate-2">
            <Image
              src={data.letters[0].image}
              alt={`${data.letters[0].from}의 편지`}
              width={1200}
              height={1400}
              className="w-full h-auto shadow-md"
            />
            <figcaption className="font-hand text-[16px] text-ink/70 mt-2 text-right pr-1">
              {data.letters[0].from}가 보내는 편지
            </figcaption>
          </figure>

          {/* 어린시절 + 가족사진 */}
          <div className="flex items-end gap-4">
            <div className={`w-[38%] ${cutout ? "" : "bg-white p-2 shadow-md"} rotate-2`}>
              <Image
                src={data.childhood}
                alt="어린시절"
                width={600}
                height={1150}
                className="w-full h-auto"
              />
            </div>
            <figure className="flex-1 -rotate-1">
              <Image
                src={data.family}
                alt="가족사진"
                width={1100}
                height={800}
                className="w-full h-auto shadow-md"
              />
            </figure>
          </div>

          {/* 두 번째 편지 */}
          <figure className="rotate-1">
            <Image
              src={data.letters[1].image}
              alt={`${data.letters[1].from}의 편지`}
              width={1200}
              height={1400}
              className="w-full h-auto shadow-md"
            />
            <figcaption className="font-hand text-[16px] text-ink/70 mt-2 text-right pr-1">
              {data.letters[1].from}가 보내는 편지
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

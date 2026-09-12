"use client";

import Image from "next/image";
import { weddingData } from "@/app/data/mock";

/** 시안 6페이지: 적갈색 바탕에 사진과 메모지를 번갈아 배치. 메모 문구는 아직 미작성. */
export default function StoryDetail() {
  const { storyPage } = weddingData;

  return (
    <div className="min-h-dvh bg-maroon px-5 pt-12 pb-28">
      <div className="max-w-md mx-auto space-y-10">
        <p className="font-hand text-[27px] text-white/85 text-center">우리의 이야기</p>

        {storyPage.photos.map((src, i) => (
          <div key={src} className="space-y-4">
            <Image
              src={src}
              alt=""
              width={1000}
              height={1400}
              className={`w-full h-auto ${i % 2 ? "rotate-1" : "-rotate-2"}`}
            />
            <Memo text={storyPage.notes[i]} tilt={i % 2 ? -1.5 : 1.5} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** 시안의 노란 메모지 */
function Memo({ text, tilt }: { text: string; tilt: number }) {
  return (
    <div
      className="relative bg-[#FBF3B6] px-5 py-7 min-h-[7rem]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        aria-hidden
        className="absolute inset-x-5 top-0 bottom-0 bg-[repeating-linear-gradient(transparent,transparent_31px,rgba(0,0,0,0.09)_32px)]"
      />
      <p className="relative font-hand text-[24px] text-ink/70">{text}</p>
    </div>
  );
}

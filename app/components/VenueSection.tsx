"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Phone,
  Train,
  Bus,
  Car,
  SquareParking,
  Banknote,
  ArrowUpDown,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { weddingData, type GuideItem } from "@/app/data/mock";
import SectionTitle from "@/app/components/SectionTitle";

/** 안내 항목별 아이콘. 시안처럼 핑크로 칠해 쓴다. */
const GUIDE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  지하철: Train,
  버스: Bus,
  자가용: Car,
  주차: SquareParking,
  ATM: Banknote,
  엘리베이터: ArrowUpDown,
  식사: Utensils,
};

export default function VenueSection() {
  const { venue, wedding } = weddingData;
  const collapsible = venue.guide.filter((g) => g.collapsible);
  const plain = venue.guide.filter((g) => !g.collapsible);

  return (
    <motion.section
      className="bg-ink px-6 py-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionTitle>오시는 길</SectionTitle>

      <div className="max-w-md mx-auto">
        <div className="text-center text-white mb-6">
          <p className="text-[24px]">
            {wedding.date.replace("년 ", ".").replace("월 ", ".").replace("일", "")} 12:20
          </p>
          <p className="mt-2 text-[18px]">
            {venue.addressDetail.replace(venue.hall, "")}
            <span className="text-pink">{venue.hall}</span>
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/15">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed&z=16`}
            width="100%"
            height="260"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="웨딩홀 위치"
          />
        </div>

        {/* 지도 앱 3종 */}
        <div className="flex gap-2 mt-3">
          <MapLink href={venue.kakaoMapUrl} label="카카오맵" icon="/icons/map-kakao.png" />
          <MapLink href={venue.naverMapUrl} label="네이버지도" icon="/icons/map-naver.png" />
          <MapLink href={venue.tmapUrl} label="티맵" />
        </div>

        {/* 웨딩홀 전화 */}
        <a
          href={`tel:${venue.phone}`}
          className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-pink-soft text-ink text-[16px] active:scale-[0.98] transition-transform"
        >
          <Phone className="w-4 h-4" />
          웨딩홀 전화 {venue.phone}
        </a>

        {/* 2차 수정 9번: 지하철·버스·자가용은 제목만 보이고 화살표를 눌러야 펼쳐진다 */}
        <div className="mt-9 space-y-2.5">
          {collapsible.map((g) => (
            <CollapsibleGuide key={g.label} guide={g} />
          ))}
        </div>

        <div className="mt-9 space-y-7">
          {plain.map((g) => {
            const Icon = GUIDE_ICONS[g.label];
            return (
              <div key={g.label}>
                <p className="flex items-center gap-2 text-[17px] text-pink">
                  {Icon && <Icon className="w-[18px] h-[18px]" />}
                  {g.label}
                </p>
                <GuideContent guide={g} />
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

function CollapsibleGuide({ guide }: { guide: GuideItem }) {
  const [open, setOpen] = useState(false);
  const Icon = GUIDE_ICONS[guide.label];

  return (
    <div className="rounded-xl border border-white/15 bg-white/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3.5 text-[17px] text-pink"
      >
        {Icon && <Icon className="w-[18px] h-[18px]" />}
        <span className="flex-1 text-left">{guide.label}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-4">
              <GuideContent guide={guide} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuideContent({ guide }: { guide: GuideItem }) {
  return (
    <>
      {guide.badges && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {guide.badges.map((n) => (
            <span
              key={n}
              className="rounded-md border border-white/20 bg-white/5 px-2 py-1 text-[13px] tabular-nums text-white/85"
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {/* 단계가 하나뿐이면 번호 없이 한 줄로 */}
      {guide.steps?.length === 1 && (
        <p className="mt-2.5 text-[14px] leading-6 text-white/80 break-keep">{guide.steps[0]}</p>
      )}

      {guide.steps && guide.steps.length > 1 && (
        <ol className="mt-2.5 space-y-1.5">
          {guide.steps.map((step, i) => (
            <li key={step} className="flex gap-2.5">
              <span className="shrink-0 mt-[3px] w-5 h-5 rounded-full bg-white/10 text-[11px] text-pink flex items-center justify-center tabular-nums">
                {i + 1}
              </span>
              <span className="text-[14px] leading-6 text-white/80 break-keep">{step}</span>
            </li>
          ))}
        </ol>
      )}

      {guide.note && (
        <p className="mt-2 text-[14px] leading-6 text-white/80 break-keep">{guide.note}</p>
      )}
      {guide.sub && (
        <p className="mt-1 text-[13px] leading-6 text-white/55 break-keep">{guide.sub}</p>
      )}
    </>
  );
}

function MapLink({ href, label, icon }: { href: string; label: string; icon?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full border border-white/20 bg-white/5 text-white text-[13px] active:scale-95 transition-transform"
    >
      {icon ? (
        <Image src={icon} alt="" width={16} height={16} className="rounded" />
      ) : (
        <span className="w-4 h-4 rounded bg-[#00A3FF] text-[9px] font-bold text-white flex items-center justify-center">
          T
        </span>
      )}
      {label}
    </a>
  );
}

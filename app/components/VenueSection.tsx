"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Train, Bus, Car, Utensils } from "lucide-react";
import { weddingData } from "@/app/data/mock";
import SectionTitle from "@/app/components/SectionTitle";

export default function VenueSection() {
  const { venue, wedding } = weddingData;

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

        <div className="mt-8 space-y-4 text-white/85">
          <Info icon={<Train className="w-4 h-4" />} label="지하철" text={venue.subway} />
          <Info icon={<Bus className="w-4 h-4" />} label="버스" text={venue.bus} />
          <Info icon={<Car className="w-4 h-4" />} label="주차" text={venue.parking} />
          <Info icon={<Utensils className="w-4 h-4" />} label="식사" text={venue.meal} />
        </div>
      </div>
    </motion.section>
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

function Info({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-pink mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-[15px] text-pink">{label}</p>
        <p className="text-[15px] leading-7 text-white/80 mt-0.5">{text}</p>
      </div>
    </div>
  );
}

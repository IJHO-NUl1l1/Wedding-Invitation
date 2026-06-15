"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Car, Utensils, Train, Bus } from "lucide-react";
import { weddingData } from "@/app/data/mock";

export default function VenueSection() {
  const { venue } = weddingData;

  return (
    <motion.section
      className="py-16 bg-cream"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
    >
      <div className="text-center mb-10 px-6">
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-2">Location</p>
        <h2 className="font-serif text-2xl text-charcoal">오시는 길</h2>
        <div className="w-12 h-px bg-blush mx-auto mt-3" />
      </div>

      {/* 지도 */}
      <div className="mx-4 rounded-2xl overflow-hidden shadow-md mb-6 border border-blush/20">
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed&z=16`}
          width="100%"
          height="240"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="웨딩홀 위치"
        />
      </div>

      {/* 장소 정보 */}
      <div className="px-6 space-y-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-blush/10">
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-serif text-charcoal">{venue.name}</p>
              <p className="text-xs text-charcoal-light mt-0.5">{venue.hall}</p>
              <p className="text-xs text-charcoal-light mt-1 leading-5">{venue.address}</p>
              <p className="text-xs text-charcoal-light">{venue.addressDetail}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <p className="text-xs text-charcoal-light leading-5">
              {weddingData.wedding.date} {weddingData.wedding.dayOfWeek} {weddingData.wedding.time}
            </p>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Utensils className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <p className="text-xs text-charcoal-light leading-5">{venue.meal}</p>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Train className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <p className="text-xs text-charcoal-light leading-5">{venue.subway}</p>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <Bus className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <p className="text-xs text-charcoal-light leading-5">{venue.bus}</p>
          </div>

          <div className="flex items-start gap-3">
            <Car className="w-4 h-4 text-blush-dark mt-0.5 flex-shrink-0" />
            <p className="text-xs text-charcoal-light leading-5">{venue.parking}</p>
          </div>
        </div>
      </div>

      {/* 길찾기 버튼 */}
      <div className="flex gap-3 px-6">
        <a
          href={venue.kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-center text-xs font-serif text-charcoal bg-gold-light border border-gold/30 rounded-full active:bg-gold/20 transition-colors"
        >
          카카오맵
        </a>
        <a
          href={venue.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-center text-xs font-serif text-charcoal bg-sage/20 border border-sage/30 rounded-full active:bg-sage/30 transition-colors"
        >
          네이버 지도
        </a>
      </div>
    </motion.section>
  );
}

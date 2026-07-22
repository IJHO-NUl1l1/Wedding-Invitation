"use client";

import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // 봉투 열기 클릭(사용자 제스처) 시점에 재생 시작 — 자동재생 차단 회피
  useEffect(() => {
    const start = () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;
      audio.volume = 0.5;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };
    window.addEventListener("bgm-start", start);
    return () => window.removeEventListener("bgm-start", start);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.5;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "배경음악 끄기" : "배경음악 켜기"}
        className="fixed top-4 right-4 z-40 flex items-center justify-center w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm shadow-md border border-blush/20 active:bg-white transition-colors"
      >
        <span className="relative flex items-center justify-center">
          <Music
            className={`w-4 h-4 transition-colors ${
              playing ? "text-blush-dark" : "text-charcoal-light/50"
            }`}
          />
          {!playing && (
            <span className="absolute w-5 h-px bg-charcoal-light/60 rotate-45 rounded-full" />
          )}
        </span>
      </button>
    </>
  );
}

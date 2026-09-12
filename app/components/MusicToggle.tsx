"use client";

import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // 브라우저 자동재생 정책상 사용자 제스처가 있어야 재생된다.
  // 봉투 화면이 사라졌으므로 첫 상호작용을 재생 트리거로 사용한다.
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
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
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
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />
      <button
        onClick={toggle}
        aria-label={playing ? "배경음악 끄기" : "배경음악 켜기"}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 active:scale-95 transition-transform"
      >
        <span className="relative flex items-center justify-center">
          <Music className={`w-4 h-4 ${playing ? "text-pink" : "text-white/50"}`} />
          {!playing && (
            <span className="absolute w-5 h-px bg-white/60 rotate-45 rounded-full" />
          )}
        </span>
      </button>
    </>
  );
}

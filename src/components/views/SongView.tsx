import {
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import ViewShell from "../world/ViewShell";
import { Image } from "@/components/ui/image";
import { song } from "@/content/song";

interface SongViewProps {
  onBack: () => void;
}

export default function SongView({
  onBack,
}: SongViewProps) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] =
    useState<boolean>(false);

  const [progress, setProgress] =
    useState<number>(0);

  const [duration, setDuration] =
    useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const onTime = () => {
      if (audio.duration) {
        setProgress(
          audio.currentTime / audio.duration
        );
      }
    };

    const onMeta = () => {
      setDuration(audio.duration || 0);
    };

    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };

    audio.addEventListener(
      "timeupdate",
      onTime
    );

    audio.addEventListener(
      "loadedmetadata",
      onMeta
    );

    audio.addEventListener(
      "ended",
      onEnd
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        onTime
      );

      audio.removeEventListener(
        "loadedmetadata",
        onMeta
      );

      audio.removeEventListener(
        "ended",
        onEnd
      );
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
        });
    }
  };

  const seek = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const audio = audioRef.current;

    if (!audio || !audio.duration) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const cx =
      rect.left + rect.width / 2;

    const cy =
      rect.top + rect.height / 2;

    const angle = Math.atan2(
      e.clientY - cy,
      e.clientX - cx
    );

    let deg =
      (angle * 180) / Math.PI + 90;

    if (deg < 0) {
      deg += 360;
    }

    audio.currentTime =
      (deg / 360) * audio.duration;

    setProgress(
      audio.currentTime / audio.duration
    );
  };

  const R = 120;
  const C = 2 * Math.PI * R;

  return (
    <ViewShell
      label="Our Song"
      onBack={onBack}
    >
      <div className="flex flex-col items-center">
        <div
          className="relative cursor-pointer select-none"
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(
            progress * 100
          )}
        >
          <motion.div
            className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80"
            animate={{
              rotate: playing ? 360 : 0,
            }}
            transition={
              playing
                ? {
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                }
                : {
                  duration: 0,
                }
            }
          >
            {/* vinyl */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] to-black shadow-2xl" />

            <div className="absolute inset-3 rounded-full border border-white/5" />

            <div className="absolute inset-6 rounded-full border border-white/5" />

            <div className="absolute inset-12 rounded-full border border-white/5" />

            {/* label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32">
                <Image
                  src={song.albumCover}
                  alt={song.title}
                  fittingType="fill"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* center hole */}
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#020617] ring-2 ring-[#FEF3C7]/40" />
          </motion.div>

          {/* progress ring */}
          <svg className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={R}
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="1.5"
            />

            <circle
              cx="50%"
              cy="50%"
              r={R}
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={
                C * (1 - progress)
              }
              style={{
                transition:
                  "stroke-dashoffset 0.2s linear",
              }}
            />
          </svg>
        </div>

        <div className="mt-10 text-center">
          <h2 className="font-display text-2xl font-light italic text-[#F8FAFC] text-glow sm:text-3xl">
            {song.title}
          </h2>

          <p className="mt-2 font-body text-sm text-[#94A3B8]">
            {song.artist}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          className="group relative mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#FEF3C7]/30 bg-[#FEF3C7]/5 transition-all hover:scale-105 hover:border-[#FEF3C7]/60"
          aria-label={
            playing ? "Pause" : "Play"
          }
        >
          <span className="absolute inset-0 rounded-full bg-[#FEF3C7]/10 blur-md" />

          {playing ? (
            <Pause className="relative h-5 w-5 text-[#FEF3C7]" />
          ) : (
            <Play className="relative ml-0.5 h-5 w-5 text-[#FEF3C7]" />
          )}
        </button>

        <p className="mt-6 max-w-xs font-body text-xs leading-relaxed text-[#94A3B8]/70">
          {duration
            ? "Press play. Let it turn."
            : "Add your track at /public/audio/song.mp3 to hear it spin."}
        </p>

        <audio
          ref={audioRef}
          src={song.src}
          preload="metadata"
        />
      </div>
    </ViewShell>
  );
}
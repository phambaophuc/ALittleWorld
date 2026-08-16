import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Starfield from "./Starfield";
import ShootingStars from "./ShootingStars";
import {
  constellation,
  UNLOCK_KEY,
} from "@/content/constellation";

interface StarMapProps {
  onSelect: (key: string) => void;
}

interface Offset {
  x: number;
  y: number;
}

interface MovePosition {
  clientX: number;
  clientY: number;
}

const CONSTELLATION_PATHS = [
  { d: "M24,15 Q20,30 16,41", faint: false },
  { d: "M16,41 Q35,48 60,49", faint: false },
  { d: "M60,49 Q72,58 80,66", faint: false },
  { d: "M80,66 Q68,80 52,88", faint: false },
  { d: "M73,21 Q68,38 60,49", faint: true },
  { d: "M30,71 Q42,82 52,88", faint: true, dashed: true },
];

export default function StarMap({
  onSelect,
}: StarMapProps) {
  const layerRef =
    useRef<HTMLDivElement | null>(null);

  const [offset, setOffset] = useState<Offset>({
    x: 0,
    y: 0,
  });

  const unlocked =
    typeof window !== "undefined" &&
    localStorage.getItem(UNLOCK_KEY) === "true";

  const handleMove = ({
    clientX,
    clientY,
  }: MovePosition) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    setOffset({
      x: ((clientX - cx) / cx) * 14,
      y: ((clientY - cy) / cy) * 14,
    });
  };

  return (
    <motion.div
      ref={layerRef}
      onMouseMove={(e) =>
        handleMove({
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
      onTouchMove={(e) => {
        const t = e.touches[0];

        if (!t) return;

        handleMove({
          clientX: t.clientX,
          clientY: t.clientY,
        });
      }}
      className="fixed inset-0 z-10 overflow-hidden bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 2.2,
        ease: "easeOut",
      }}
    >
      <style>{`
        @keyframes wmfy-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes wmfy-breathe-soft {
          0%, 100% { box-shadow: 0 0 0 0 rgba(254,243,199,0); }
          50% { box-shadow: 0 0 14px 2px rgba(254,243,199,0.12); }
        }
        @keyframes wmfy-pulse-heart {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.12); }
        }
        @keyframes wmfy-fade-pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        @keyframes wmfy-line-shimmer {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.65; }
        }
      `}</style>

      <motion.div
        className="absolute inset-0"
        animate={{
          x: offset.x,
          y: offset.y,
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 20,
        }}
      >
        <Starfield density={90} />
        <ShootingStars />

        {/* faint cosmic glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b1530] opacity-60 blur-3xl" />

        <div className="pointer-events-none absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-[#FEF3C7]/5 blur-3xl" />

        {/* extremely subtle light haze around the center */}
        <div className="pointer-events-none absolute left-1/2 top-[45%] h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.035)_0%,transparent_60%)]" />
      </motion.div>

      {/* Constellation connector lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="wmfy-constellation-line"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#C4B5FD"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="#FDE68A"
              stopOpacity="0.22"
            />
          </linearGradient>
        </defs>

        {CONSTELLATION_PATHS.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke="url(#wmfy-constellation-line)"
            strokeWidth={p.faint ? 0.1 : 0.14}
            strokeDasharray={p.dashed ? "0.6 1.2" : undefined}
            vectorEffect="non-scaling-stroke"
            style={{
              opacity: p.faint ? 0.4 : 0.6,
              animation:
                "wmfy-line-shimmer 8s ease-in-out infinite",
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </svg>

      {/* Title */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-10 text-center sm:pt-16">
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-[#94A3B8]/80 sm:text-[11px]">
          Một thế giới nhỏ bé ✨
        </p>

        <h1
          className="mt-4 font-display text-4xl font-light italic tracking-wide text-[#FDF6E3] sm:text-6xl"
          style={{
            textShadow:
              "0 0 30px rgba(254,243,199,0.35), 0 0 70px rgba(254,243,199,0.16), 0 2px 24px rgba(0,0,0,0.5)",
          }}
        >
          Dành riêng cho em ❤️
        </h1>

        <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-[#94A3B8]">
          Phiêu du giữa bầu trời. Mỗi ánh sáng là một cánh cửa — hãy mở cánh cửa gọi tên em. ✨
        </p>
      </div>

      <div className="absolute inset-0">
        {constellation.map((star, i) => {
          const locked =
            star.locked && !unlocked;

          const isFinal = star.key === "final";

          return (
            <button
              key={star.key}
              type="button"
              onClick={() => onSelect(star.key)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{
                left: `${star.pos.x}%`,
                top: `${star.pos.y}%`,
              }}
            >
              <motion.span
                className="relative flex items-center justify-center"
                style={{
                  width: isFinal ? 60 : 44,
                  height: isFinal ? 60 : 44,
                  animation: `wmfy-float ${5 + (i % 3) * 0.6
                    }s ease-in-out infinite`,
                  animationDelay: `${i * 0.35}s`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.6 + i * 0.18,
                  ease: "easeOut",
                }}
              >
                <span
                  className="absolute rounded-full blur-xl transition-opacity duration-500 group-hover:opacity-90"
                  style={{
                    inset: isFinal ? -14 : -10,
                    opacity: isFinal ? 0.55 : locked ? 0.2 : 0.4,
                    background: isFinal
                      ? "radial-gradient(circle, rgba(251,113,133,0.35) 0%, rgba(254,243,199,0.12) 45%, transparent 75%)"
                      : locked
                        ? "radial-gradient(circle, rgba(148,163,184,0.18) 0%, transparent 75%)"
                        : "radial-gradient(circle, rgba(254,243,199,0.3) 0%, transparent 75%)",
                  }}
                />

                <span
                  className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500 ${locked
                    ? "bg-[#94A3B8]/10"
                    : isFinal
                      ? "bg-[#FB7185]/25"
                      : "bg-[#FEF3C7]/25"
                    } group-hover:opacity-100`}
                  style={{
                    animation: isFinal
                      ? "wmfy-pulse-heart 3.4s ease-in-out infinite"
                      : undefined,
                  }}
                />

                {!locked && (
                  <span className="absolute inset-0 scale-100 rounded-full border border-[#FEF3C7]/0 opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.6] group-hover:border-[#FEF3C7]/25 group-hover:opacity-100" />
                )}

                {/* core */}
                <span
                  className={`relative flex items-center justify-center rounded-full border transition-all duration-500 ${locked
                    ? "h-7 w-7 border-[#94A3B8]/30 bg-[#0b1530]"
                    : isFinal
                      ? "h-10 w-10 border-[#FDA4AF]/55 bg-gradient-to-b from-[#FEF3C7]/10 to-[#FB7185]/10 group-hover:scale-110 group-hover:border-[#FDA4AF]/80 sm:h-11 sm:w-11"
                      : "h-8 w-8 border-[#FEF3C7]/40 bg-[#FEF3C7]/5 group-hover:scale-110 group-hover:border-[#FEF3C7]/70 sm:h-9 sm:w-9"
                    }`}
                  style={{
                    animation:
                      !locked && !isFinal
                        ? "wmfy-breathe-soft 4.5s ease-in-out infinite"
                        : undefined,
                  }}
                >
                  <span
                    className={`text-lg transition-all duration-300 sm:text-xl ${locked
                      ? "opacity-40 grayscale"
                      : "group-hover:brightness-125"
                      }`}
                  >
                    {locked ? "🔒" : star.icon}
                  </span>
                </span>
              </motion.span>

              <span
                className={`mt-2 block whitespace-nowrap font-display text-sm font-light tracking-wide transition-colors duration-300 sm:text-base ${locked
                  ? "text-[#94A3B8]/50"
                  : isFinal
                    ? "text-[#FDF6E3]/90 group-hover:text-[#FEF3C7]"
                    : "text-[#F8FAFC]/80 group-hover:text-[#FEF3C7]"
                  }`}
              >
                {star.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-8">
        <p
          className="font-body text-[10px] uppercase tracking-[0.5em] text-[#CBD5E1]/50"
          style={{
            animation: "wmfy-fade-pulse 6s ease-in-out infinite",
          }}
        >
          Tự do khám phá · Cứ thong thả nhé ✨
        </p>
      </div>
    </motion.div>
  );
}
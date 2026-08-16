import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const HEAD_COLORS = [
  "#F8FAFC",
  "#FEF3C7",
  "#E2E8F0",
  "#FFF7ED",
] as const;

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

interface Meteor {
  id: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  angleDeg: number;
  length: number;
  size: number;
  brightness: number;
  glow: number;
  headColor: string;
  duration: number;
  peak: number;
}

function makeMeteor(id: number): Meteor {
  // Direction: mostly diagonal downward, left- or rightward.
  const dirX = Math.random() < 0.5 ? 1 : -1;

  // Travel downward-diagonal. Build angle from the horizontal axis.
  const baseAngle =
    dirX > 0 ? rand(20, 35) : rand(145, 160);

  const rad = (baseAngle * Math.PI) / 180;

  const vw =
    typeof window !== "undefined"
      ? window.innerWidth
      : 1200;

  const vh =
    typeof window !== "undefined"
      ? window.innerHeight
      : 800;

  const scale = Math.min(
    1.2,
    Math.max(0.7, vw / 900)
  );

  const distance =
    rand(0.55, 0.95) * Math.max(vw, vh);

  const speed = rand(0.5, 0.95);

  const duration =
    rand(0.9, 1.6) * (1.25 - speed * 0.5);

  // Start somewhere in the upper half,
  // off the visible top edge sometimes.
  const startX = rand(-0.1, 0.9) * vw;
  const startY = rand(-0.05, 0.45) * vh;

  const length =
    rand(60, 180) *
    scale *
    (0.7 + speed * 0.6);

  const size = rand(2, 4) * scale;
  const brightness = rand(0.7, 1);
  const glow = rand(6, 16) * scale;

  const headColor =
    HEAD_COLORS[
      Math.floor(Math.random() * HEAD_COLORS.length)
    ];

  return {
    id,
    startX,
    startY,
    vx: Math.cos(rad) * distance,
    vy: Math.sin(rad) * distance,
    angleDeg: baseAngle,
    length,
    size,
    brightness,
    glow,
    headColor,
    duration,
    peak: brightness,
  };
}

export default function ShootingStars() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  const idRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reduced) return;

    let stopped = false;

    const schedule = () => {
      if (stopped) return;

      // Rare: long gaps, occasionally a quick double.
      const gap = rand(3500, 9000);

      timerRef.current = setTimeout(() => {
        if (stopped) return;

        const id = ++idRef.current;

        setMeteors((m) => [
          ...m,
          makeMeteor(id),
        ]);

        // Small chance of a near-simultaneous second meteor.
        if (Math.random() < 0.22) {
          setTimeout(() => {
            if (stopped) return;

            setMeteors((m) => [
              ...m,
              makeMeteor(++idRef.current),
            ]);
          }, rand(300, 900));
        }

        schedule();
      }, gap);
    };

    // First meteor after a brief delay.
    timerRef.current = setTimeout(
      schedule,
      rand(1500, 4000)
    );

    return () => {
      stopped = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const remove = (id: number) => {
    setMeteors((m) =>
      m.filter((x) => x.id !== id)
    );
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            left: m.startX,
            top: m.startY,
          }}
        >
          <motion.div
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: m.vx,
              y: m.vy,
              opacity: [
                0,
                m.peak,
                m.peak,
                0,
              ],
            }}
            transition={{
              duration: m.duration,
              ease: [0.35, 0, 0.65, 0.5],

              opacity: {
                duration: m.duration,
                times: [0, 0.12, 0.78, 1],
              },
            }}
            onAnimationComplete={() =>
              remove(m.id)
            }
          >
            <div
              style={{
                position: "relative",
                width: 0,
                height: 0,
                transform: `rotate(${m.angleDeg}deg)`,
                transformOrigin: "0 0",
              }}
            >
              {/* Trail: bright near head -> transparent tail */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: -1,
                  width: m.length,
                  height: 2,
                  borderRadius: 2,
                  filter: "blur(0.6px)",
                  background: `linear-gradient(
                    to left,
                    ${m.headColor} 0%,
                    rgba(248,250,252,${0.5 * m.brightness}) 35%,
                    rgba(248,250,252,${0.12 * m.brightness}) 70%,
                    transparent 100%
                  )`,
                }}
              />

              {/* Soft outer glow along the trail */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: -2.5,
                  width: m.length * 0.7,
                  height: 6,
                  borderRadius: 6,
                  filter: "blur(3px)",
                  opacity: 0.5,
                  background: `linear-gradient(
                    to left,
                    ${m.headColor},
                    transparent
                  )`,
                }}
              />

              {/* Bright head */}
              <div
                style={{
                  position: "absolute",
                  left: -m.size / 2,
                  top: -m.size / 2,
                  width: m.size,
                  height: m.size,
                  borderRadius: "50%",
                  background: m.headColor,
                  boxShadow: `0 0 ${m.glow}px ${
                    m.glow / 2
                  }px ${m.headColor}`,
                }}
              />
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
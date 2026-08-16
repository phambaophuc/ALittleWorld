interface StarfieldProps {
  density?: number;
}

interface Star {
  id: string;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
  glow: number;
}

const COLORS = ["#FEF3C7", "#F8FAFC", "#E9D5FF"] as const;

function makeLayer(
  count: number,
  seedA: number,
  seedB: number,
  sizeRange: [number, number],
  opacityRange: [number, number],
  prefix: string
): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const top = (i * seedA) % 100;
    const left = (i * seedB) % 100;

    const sizeT = ((i * 17.31) % 100) / 100;
    const size =
      sizeRange[0] + sizeT * (sizeRange[1] - sizeRange[0]);

    const opacityT = ((i * 29.71) % 100) / 100;
    const opacity =
      opacityRange[0] +
      opacityT * (opacityRange[1] - opacityRange[0]);

    const delay = (i * 13.27) % 6;
    const duration = ((i * 7.91) % 4) + 3;

    const colorIdx = Math.floor((i * 3.1) % COLORS.length);
    const color = COLORS[colorIdx];

    return {
      id: `${prefix}-${i}`,
      top,
      left,
      size,
      delay,
      duration,
      opacity,
      color,
      glow: size * 2.5,
    };
  });
}

export default function Starfield({
  density = 90,
}: StarfieldProps) {
  const far = makeLayer(
    Math.round(density * 1.1),
    41.3,
    67.9,
    [0.5, 1],
    [0.2, 0.4],
    "far"
  );

  const mid = makeLayer(
    Math.round(density * 0.55),
    37.17,
    61.73,
    [0.9, 1.6],
    [0.35, 0.6],
    "mid"
  );

  const near = makeLayer(
    Math.round(density * 0.16),
    53.1,
    29.4,
    [1.6, 2.6],
    [0.6, 0.95],
    "near"
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Nebula clouds — very subtle, slow, and few */}
      <div
        className="absolute -left-[12%] top-[6%] h-[46vmax] w-[46vmax] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute -right-[15%] top-[32%] h-[52vmax] w-[52vmax] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(30,58,138,0.09) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute left-[18%] bottom-[-12%] h-[42vmax] w-[42vmax] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Far layer — dim, static, dense */}
      {far.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Mid layer — some gentle twinkle */}
      {mid.map((s, i) => (
        <span
          key={s.id}
          className={`absolute rounded-full ${i % 4 === 0 ? "animate-twinkle" : ""
            }`}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: `0 0 ${s.glow}px rgba(254,243,199,0.25)`,
          }}
        />
      ))}

      {/* Near layer — bright foreground stars, twinkling */}
      {near.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: `0 0 ${s.glow}px rgba(254,243,199,0.55)`,
          }}
        />
      ))}
    </div>
  );
}
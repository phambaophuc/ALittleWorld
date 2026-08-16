import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Starfield from "../world/Starfield";
import { finalLines } from "@/content/final";

interface FinalViewProps {
  onBack: () => void;
}

export default function FinalView({ onBack }: FinalViewProps) {
  const [line, setLine] = useState<number>(0);

  useEffect(() => {
    if (line >= finalLines.length) return;

    const t = setTimeout(() => {
      setLine((l) => l + 1);
    }, 2600);

    return () => clearTimeout(t);
  }, [line]);

  return (
    <motion.div
      className="fixed inset-0 z-30 overflow-y-auto bg-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.8, ease: "easeInOut" }}
    >
      <Starfield density={120} />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b1530]/70 blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <button
        type="button"
        onClick={onBack}
        className="absolute left-6 top-6 z-10 font-body text-[10px] uppercase tracking-[0.3em] text-[#94A3B8]/70 transition-colors hover:text-[#FEF3C7]"
      >
        ← Trở về
      </button>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-xl">
          <AnimatePresence>
            {finalLines.slice(0, line).map((l: string, i: number) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1.4,
                  ease: "easeOut",
                }}
                className={`mb-8 font-display font-light italic leading-relaxed text-[#F8FAFC] ${
                  i === finalLines.length - 1
                    ? "text-3xl text-[#FEF3C7] text-glow sm:text-5xl"
                    : i === finalLines.length - 2
                    ? "text-2xl sm:text-4xl"
                    : "text-xl sm:text-3xl"
                }`}
              >
                {l}
              </motion.p>
            ))}
          </AnimatePresence>

          {line >= finalLines.length && (
            <motion.button
              type="button"
              onClick={onBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.4,
                delay: 1,
              }}
              className="mt-12 font-body text-[10px] uppercase tracking-[0.4em] text-[#94A3B8] transition-colors hover:text-[#FEF3C7]"
            >
              Cùng nhau khám phá bầu trời một lần nữa →
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
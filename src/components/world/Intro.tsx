import { motion } from "framer-motion";
import Starfield from "./Starfield";

interface IntroProps {
  onEnter: () => void;
}

export default function Intro({ onEnter }: IntroProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#020617] px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <Starfield density={60} />
      </div>

      <motion.p
        className="max-w-md font-display text-2xl font-light leading-relaxed text-[#F8FAFC] sm:text-3xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
      >
        Anh đã làm một điều nho nhỏ dành cho em. ❤️
      </motion.p>

      <motion.button
        type="button"
        onClick={onEnter}
        aria-label="Enter"
        className="group relative mt-16 flex h-20 w-20 items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.6,
          ease: "easeOut",
          delay: 1.6,
        }}
      >
        <span className="absolute inset-0 rounded-full border border-[#FEF3C7]/30 animate-breathe" />
        <span className="absolute inset-2 rounded-full border border-[#FEF3C7]/20" />
        <span className="absolute inset-0 rounded-full bg-[#FEF3C7]/5 blur-md" />

        <span className="font-body text-[11px] uppercase tracking-[0.3em] text-[#FEF3C7] transition-colors group-hover:text-white">
          Bước vào
        </span>
      </motion.button>
    </motion.div>
  );
}
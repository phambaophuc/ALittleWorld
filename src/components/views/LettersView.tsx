import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ViewShell from "../world/ViewShell";
import { letters } from "@/content/letters";

interface LettersViewProps {
  onBack: () => void;
}

export default function LettersView({
  onBack,
}: LettersViewProps) {
  const [open, setOpen] = useState<string | null>(null);

  const current = letters.find(
    (l) => l.id === open
  );

  const haptic = () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate(18);
    }
  };

  return (
    <ViewShell
      label="Letters"
      onBack={onBack}
    >
      <p className="mx-auto mb-10 max-w-sm text-center font-body text-sm leading-relaxed text-[#94A3B8]">
        Mỗi lá thư được cất giữ cho một cảm xúc. Hãy chỉ mở lá thư em cần, vào đúng lúc em cần.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {letters.map((l, i) => (
          <motion.button
            key={l.id}
            type="button"
            onClick={() => {
              haptic();
              setOpen(l.id);
            }}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: "easeOut",
            }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-sm border border-[#FEF3C7]/15 bg-[#0b1530]/40 p-5 text-left backdrop-blur-sm transition-colors hover:border-[#FEF3C7]/40"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#FEF3C7]/10 blur-2xl transition-opacity group-hover:opacity-100" />

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-12 items-center justify-center rounded-sm border border-[#FEF3C7]/30 bg-[#FEF3C7]/5 text-base">
                ✉️
              </span>

              <span className="font-display text-lg font-light italic text-[#F8FAFC]">
                {l.title}
              </span>
            </div>

            <span className="mt-3 block font-body text-[10px] uppercase tracking-[0.3em] text-[#94A3B8] transition-colors group-hover:text-[#FEF3C7]">
              Hãy mở thật nhẹ nhàng →
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#020617]/80 px-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-sm border border-[#FEF3C7]/20 bg-gradient-to-b from-[#0b1530] to-[#020617] p-8 shadow-2xl sm:p-10"
            >
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 text-[#94A3B8] transition-colors hover:text-[#FEF3C7]"
                aria-label="Close letter"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#FEF3C7]/70 text-center">
                Một lá thư dành riêng cho em.
              </p>

              <h3 className="mt-3 font-display text-2xl font-light italic text-[#F8FAFC] text-center">
                {current.title}
              </h3>

              <div className="mx-auto mt-5 h-px w-16 bg-[#FEF3C7]/30" />

              <p className="mt-6 whitespace-pre-line font-body text-base leading-relaxed text-[#F8FAFC]/85 text-justify">
                {current.message}
              </p>

              <p className="mt-8 text-right font-display text-lg font-light italic text-[#FEF3C7]/80">
                — Mãi mãi, là anh.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ViewShell>
  );
}
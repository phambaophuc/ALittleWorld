import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import ViewShell from "../world/ViewShell";
import { secretMessage } from "@/content/secret";
import { UNLOCK_KEY } from "@/content/constellation";

interface SecretViewProps {
  onBack: () => void;
  onGoToGame: () => void;
}

// A very minimal dark screen that reveals something never told.
export default function SecretView({
  onBack,
  onGoToGame,
}: SecretViewProps) {
  const [unlocked] = useState<boolean>(() => {
    return localStorage.getItem(UNLOCK_KEY) === "true";
  });

  const [revealed, setRevealed] = useState<boolean>(false);

  const haptic = () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate([
        0,
        30,
        40,
        20,
      ]);
    }
  };

  if (!unlocked) {
    return (
      <ViewShell
        label="Secret Room"
        onBack={onBack}
      >
        <div className="flex flex-col items-center pt-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#94A3B8]/30 bg-[#0b1530]">
            <Lock className="h-6 w-6 text-[#94A3B8]" />
          </div>

          <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-[#94A3B8]">
            Cánh cửa này vẫn đang khép kín. Hãy hoàn thành trò chơi nhỏ này, và nó sẽ tự mở ra.
          </p>

          <button
            type="button"
            onClick={onGoToGame}
            className="mt-8 font-body text-[11px] uppercase tracking-[0.3em] text-[#FEF3C7] transition-colors hover:text-white"
          >
            Đến trò chơi →
          </button>
        </div>
      </ViewShell>
    );
  }

  return (
    <ViewShell onBack={onBack}>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.button
              key="preface"
              type="button"
              onClick={() => {
                haptic();
                setRevealed(true);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 1,
              }}
              className="max-w-md"
            >
              <p className="font-display text-2xl font-light italic leading-relaxed text-[#F8FAFC] sm:text-3xl">
                {secretMessage.preface}
              </p>

              <span className="mt-8 block font-body text-[10px] uppercase tracking-[0.4em] text-[#FEF3C7]/70">
                Chạm để lắng nghe →
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="reveal"
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1.4,
                ease: "easeOut",
              }}
              className="max-w-prose"
            >
              <p className="mx-auto max-w-md whitespace-pre-line font-body text-lg leading-relaxed text-[#F8FAFC]/90 text-justify">
                {secretMessage.message}
              </p>

              <p className="mt-10 font-display text-xl font-light italic text-[#FEF3C7]/80">
                Giờ thì em đã biết. ❤️
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ViewShell>
  );
}
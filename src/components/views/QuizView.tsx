import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import ViewShell from "../world/ViewShell";
import { quizQuestions } from "@/content/quiz";
import { UNLOCK_KEY } from "@/content/constellation";

interface QuizViewProps {
  onBack: () => void;
  onUnlock?: () => void;
}

export default function QuizView({
  onBack,
  onUnlock,
}: QuizViewProps) {
  const [step, setStep] = useState<number>(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const q = quizQuestions[step];

  const choose = (i: number) => {
    if (reveal) return;

    setPicked(i);
    setReveal(true);

    if (i === q.answer) {
      setScore((s) => s + 1);
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate(
        i === q.answer ? 30 : 12
      );
    }
  };

  const next = () => {
    if (
      step + 1 >= quizQuestions.length
    ) {
      setDone(true);
      localStorage.setItem(
        UNLOCK_KEY,
        "true"
      );

      if (onUnlock) {
        onUnlock();
      }
    } else {
      setStep((s) => s + 1);
      setPicked(null);
      setReveal(false);
    }
  };

  const haptic = () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.vibrate
    ) {
      navigator.vibrate(20);
    }
  };

  return (
    <ViewShell
      label="Mini Game"
      onBack={onBack}
    >
      <div className="flex flex-col items-center">
        {!done ? (
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-center gap-1.5">
              {quizQuestions.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-6 rounded-full transition-all duration-500 ${i < step
                    ? "bg-[#FEF3C7]/60"
                    : i === step
                      ? "bg-[#FEF3C7]"
                      : "bg-[#94A3B8]/20"
                    }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={q.id}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -16,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <p className="text-center font-body text-[10px] uppercase tracking-[0.3em] text-[#FEF3C7]/70">
                  Question {step + 1} of{" "}
                  {quizQuestions.length}
                </p>

                <h2 className="mt-4 text-center font-display text-2xl font-light italic leading-snug text-[#F8FAFC] sm:text-3xl">
                  {q.question}
                </h2>

                <div className="mt-8 space-y-3">
                  {q.options.map(
                    (opt, i) => {
                      const isAnswer =
                        i === q.answer;

                      const isPicked =
                        i === picked;

                      let style =
                        "border-[#94A3B8]/20 bg-[#0b1530]/40 hover:border-[#FEF3C7]/40";

                      if (
                        reveal &&
                        isAnswer
                      ) {
                        style =
                          "border-[#FEF3C7]/60 bg-[#FEF3C7]/10";
                      } else if (
                        reveal &&
                        isPicked &&
                        !isAnswer
                      ) {
                        style =
                          "border-[#94A3B8]/30 bg-[#94A3B8]/5 opacity-50";
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={reveal}
                          onClick={() =>
                            choose(i)
                          }
                          className={`flex w-full items-center justify-between rounded-sm border px-5 py-4 text-left font-body text-sm text-[#F8FAFC]/90 transition-all ${style}`}
                        >
                          <span>
                            {opt}
                          </span>

                          {reveal &&
                            isAnswer && (
                              <Check className="h-4 w-4 text-[#FEF3C7]" />
                            )}
                        </button>
                      );
                    }
                  )}
                </div>

                <AnimatePresence>
                  {reveal && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="mt-8 text-center"
                    >
                      <p className="mx-auto max-w-sm font-display text-lg font-light italic leading-relaxed text-[#FEF3C7]/90">
                        {q.reaction}
                      </p>

                      <button
                        type="button"
                        onClick={next}
                        className="mt-6 font-body text-[11px] uppercase tracking-[0.3em] text-[#94A3B8] transition-colors hover:text-[#FEF3C7]"
                      >
                        {step + 1 >=
                          quizQuestions.length
                          ? "See where it leads →"
                          : "Next →"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-md text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#FEF3C7]/30 bg-[#FEF3C7]/5">
              <span className="text-2xl">
                ✨
              </span>
            </div>

            <h2 className="font-display text-3xl font-light italic text-[#F8FAFC] text-glow">
              Em hiểu chúng ta thật rõ.
            </h2>

            <p className="mt-4 font-body text-sm leading-relaxed text-[#94A3B8]">
              {score} / {quizQuestions.length}. Và rồi, chỉ như thế thôi — cánh cửa từng khép lại trước em, giờ đã được mở ra.
            </p>

            <button
              type="button"
              onClick={() => {
                haptic();
                (onUnlock ?? onBack)();
              }}
              className="mt-8 rounded-sm border border-[#FEF3C7]/40 bg-[#FEF3C7]/5 px-6 py-3 font-body text-[11px] uppercase tracking-[0.3em] text-[#FEF3C7] transition-all hover:scale-105 hover:border-[#FEF3C7]/70"
            >
              Bước vào Căn Phòng Bí Mật
            </button>
          </motion.div>
        )}
      </div>
    </ViewShell>
  );
}
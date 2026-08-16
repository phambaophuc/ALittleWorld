import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import ViewShell from "../world/ViewShell";
import { storyChapters } from "@/content/story";

interface StoryViewProps {
  onBack: () => void;
}

export default function StoryView({
  onBack,
}: StoryViewProps) {
  const [index, setIndex] = useState<number>(0);

  const chapter = storyChapters[index];

  const go = (dir: number) => {
    setIndex((i) =>
      Math.min(
        Math.max(0, i + dir),
        storyChapters.length - 1
      )
    );
  };

  return (
    <ViewShell
      label="Our Story"
      onBack={onBack}
    >
      <div className="flex flex-col items-center text-justify">
        <AnimatePresence mode="wait">
          <motion.article
            key={chapter.id}
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -40,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-sm">
              <Image
                src={chapter.image}
                alt={chapter.title}
                fittingType="fill"
                className="h-56 w-full object-cover sm:h-80 img-fade-b"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
            </div>

            <p className="mt-8 text-center font-body text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
              {chapter.date}
            </p>

            <h2 className="mt-3 text-center font-display text-3xl font-light italic text-[#F8FAFC] sm:text-4xl text-glow">
              {chapter.title}
            </h2>

            <p className="mx-auto mt-6 max-w-prose font-body text-base leading-relaxed text-[#F8FAFC]/85 sm:text-lg">
              {chapter.body}
            </p>
          </motion.article>
        </AnimatePresence>

        <div className="mt-10 flex w-full max-w-xs items-center justify-between">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => go(-1)}
            className="font-body text-[11px] uppercase tracking-[0.3em] text-[#94A3B8] transition-colors hover:text-[#FEF3C7] disabled:opacity-25"
          >
            ← Quay lại
          </button>

          <div className="flex items-center gap-1.5">
            {storyChapters.map(
              (chapter, i) => (
                <span
                  key={chapter.id}
                  className={`h-1 w-1.5 rounded-full transition-all duration-500 ${i === index
                      ? "w-4 bg-[#FEF3C7]"
                      : "bg-[#94A3B8]/30"
                    }`}
                />
              )
            )}
          </div>

          <button
            type="button"
            disabled={
              index ===
              storyChapters.length - 1
            }
            onClick={() => go(1)}
            className="font-body text-[11px] uppercase tracking-[0.3em] text-[#94A3B8] transition-colors hover:text-[#FEF3C7] disabled:opacity-25"
          >
            Tiếp theo →
          </button>
        </div>
      </div>
    </ViewShell>
  );
}
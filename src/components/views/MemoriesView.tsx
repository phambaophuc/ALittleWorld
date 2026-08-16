import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import ViewShell from "../world/ViewShell";
import { memories } from "@/content/memories";

interface MemoriesViewProps {
  onBack: () => void;
}

// A vertical timeline of stolen moments.
export default function MemoriesView({
  onBack,
}: MemoriesViewProps) {
  return (
    <ViewShell
      label="Our Memories"
      onBack={onBack}
    >
      <div className="relative mx-auto max-w-md">
        {/* the spine */}
        <div className="absolute left-[31px] top-2 bottom-2 w-px bg-gradient-to-b from-[#FEF3C7]/40 via-[#94A3B8]/30 to-transparent sm:left-[39px]" />

        <div className="space-y-12">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.7,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className="relative flex gap-5 sm:gap-7"
            >
              <div className="relative z-10 mt-1 flex-shrink-0">
                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#FEF3C7]/30 bg-[#0b1530] sm:h-20 sm:w-20">
                  <Image
                    src={m.image}
                    alt={m.location}
                    fittingType="fill"
                    className="h-14 w-14 rounded-full sm:h-16 sm:w-16"
                  />
                </span>
              </div>

              <div className="flex-1 pt-1">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#FEF3C7]/80">
                  {m.date}
                </p>

                <h3 className="mt-1 font-display text-xl font-light italic text-[#F8FAFC]">
                  {m.location}
                </h3>

                <p className="mt-3 font-body text-sm leading-relaxed text-[#F8FAFC]/80 text-justify">
                  {m.story}
                </p>

                <blockquote className="mt-3 border-l border-[#FEF3C7]/30 pl-3 font-display text-base font-light italic text-[#FEF3C7]/90">
                  {m.quote}
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ViewShell>
  );
}
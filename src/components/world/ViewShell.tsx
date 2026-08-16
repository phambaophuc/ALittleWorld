import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ViewShellProps {
  label?: string;
  onBack: () => void;
  children: ReactNode;
}

export default function ViewShell({
  label,
  onBack,
  children,
}: ViewShellProps) {
  return (
    <motion.div
      className="fixed inset-0 z-20 overflow-y-auto bg-[#020617]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.7,
        ease: "easeInOut",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-[#020617]" />

      <div className="relative mx-auto min-h-full w-full max-w-2xl px-6 pb-16 pt-6 sm:pt-10">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 text-[#94A3B8] transition-colors hover:text-[#FEF3C7]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

          <span className="font-body text-[11px] uppercase tracking-[0.3em]">
            Quay lại bầu trời ✨
          </span>
        </button>

        {label && (
          <motion.p
            className="mt-8 text-center font-body text-[11px] uppercase tracking-[0.45em] text-[#94A3B8]"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            {label}
          </motion.p>
        )}

        <div className="mt-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
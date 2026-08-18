"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import type { ReactNode } from "react";

export function DemoReveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function DemoVideoPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-lg">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF4713] shadow-md">
          <Play className="ml-0.5 h-5 w-5 fill-white text-white" aria-hidden />
        </span>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  );
}

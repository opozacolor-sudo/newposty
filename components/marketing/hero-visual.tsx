"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AtSign, Check, Music2, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ComponentType } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "./social-icons";

const BRAND = "#FF4713";

type Node = {
  id: string;
  Icon: ComponentType<{ className?: string }>;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

const desktopNodes: Node[] = [
  { id: "ig", Icon: InstagramIcon, x: 50, y: 14, duration: 5.2, delay: 0 },
  { id: "fb", Icon: FacebookIcon, x: 78, y: 30, duration: 4.6, delay: 0.45 },
  { id: "yt", Icon: YoutubeIcon, x: 84, y: 62, duration: 5.8, delay: 0.9 },
  { id: "li", Icon: LinkedinIcon, x: 62, y: 86, duration: 4.4, delay: 0.2 },
  { id: "tt", Icon: Music2, x: 38, y: 86, duration: 5.5, delay: 0.7 },
  { id: "th", Icon: AtSign, x: 16, y: 62, duration: 4.8, delay: 1.1 },
  { id: "sh", Icon: Share2, x: 22, y: 30, duration: 5.0, delay: 0.35 },
];

const desktopEdges: Array<[number, number]> = [
  [0, 1],
  [0, 6],
  [2, 3],
  [4, 5],
];

const mobileNodes: Node[] = [
  { ...desktopNodes[0], x: 22, y: 22 },
  { ...desktopNodes[1], x: 78, y: 28 },
  { ...desktopNodes[4], x: 24, y: 74 },
  { ...desktopNodes[2], x: 76, y: 70 },
];

function FloatIcon({
  node,
  reduce,
}: {
  node: Node;
  reduce: boolean | null;
}) {
  const Icon = node.Icon;
  return (
    <motion.div
      className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-sm will-change-transform"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{
        duration: node.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: node.delay,
      }}
    >
      <Icon className="h-[22px] w-[22px] text-[#FF4713]" />
    </motion.div>
  );
}

function ToastCard({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-neutral-100 bg-white px-3 py-2 shadow-lg">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF4713]/10">
        <Check className="h-3.5 w-3.5" color={BRAND} strokeWidth={2.5} />
      </span>
      <p className="text-xs font-medium text-neutral-500">{text}</p>
    </div>
  );
}

function ToastCycle({
  messages,
  reduce,
  className,
}: {
  messages: string[];
  reduce: boolean | null;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={messages[index]}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <ToastCard text={messages[index]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroVisual() {
  const t = useTranslations("Landing");
  const reduce = useReducedMotion();
  const toasts = [t("toastPosted"), t("toastScheduled"), t("toastTiktok")];

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden">
      <div className="relative hidden h-[min(420px,52vh)] w-full lg:block">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          {desktopEdges.map(([from, to]) => {
            const a = desktopNodes[from];
            const b = desktopNodes[to];
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#111111"
                strokeOpacity="0.16"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>
        {desktopNodes.map((node) => (
          <FloatIcon key={node.id} node={node} reduce={reduce} />
        ))}
        <ToastCycle
          messages={toasts}
          reduce={reduce}
          className="absolute left-1/2 top-[46%] z-10 w-max max-w-[85%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-sm lg:hidden">
        {mobileNodes.map((node) => (
          <FloatIcon key={node.id} node={node} reduce={reduce} />
        ))}
        <ToastCycle
          messages={toasts}
          reduce={reduce}
          className="absolute left-1/2 top-1/2 z-10 w-max max-w-[90%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AtSign, Check, Music2, Share2, Video } from "lucide-react";
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
  { id: "yt", Icon: YoutubeIcon, x: 50, y: 10, duration: 3.6, delay: 0.1 },
  { id: "ig", Icon: InstagramIcon, x: 16, y: 24, duration: 4.3, delay: 0.35 },
  { id: "fb", Icon: FacebookIcon, x: 84, y: 22, duration: 3.2, delay: 0.55 },
  { id: "li", Icon: LinkedinIcon, x: 78, y: 52, duration: 4.8, delay: 0.15 },
  { id: "tt", Icon: Music2, x: 12, y: 58, duration: 3.9, delay: 0.7 },
  { id: "th", Icon: AtSign, x: 38, y: 78, duration: 4.5, delay: 0.25 },
  { id: "sh", Icon: Share2, x: 70, y: 80, duration: 3.4, delay: 0.9 },
  { id: "vid", Icon: Video, x: 92, y: 38, duration: 4.1, delay: 0.4 },
];

const desktopEdges: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 4],
  [2, 3],
  [2, 7],
  [3, 6],
  [4, 5],
  [5, 6],
];

const mobileNodes = desktopNodes.slice(0, 4).map((node, index) => ({
  ...node,
  x: [18, 78, 22, 80][index],
  y: [22, 28, 72, 70][index],
}));

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
      animate={reduce ? undefined : { y: [0, -12, 0] }}
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

function ToastCard({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-neutral-100 bg-white px-3 py-2 shadow-lg ${className ?? ""}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF4713]/10">
        <Check className="h-3.5 w-3.5" color={BRAND} strokeWidth={2.5} />
      </span>
      <p className="text-xs font-medium text-neutral-500">{text}</p>
    </div>
  );
}

export function HeroVisual() {
  const t = useTranslations("Landing");
  const reduce = useReducedMotion();
  const [toastIndex, setToastIndex] = useState(0);
  const toasts = [t("toastPosted"), t("toastScheduled")];

  useEffect(() => {
    const id = window.setInterval(() => {
      setToastIndex((current) => (current + 1) % toasts.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [toasts.length]);

  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden">
      <div className="relative hidden aspect-square w-full lg:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          {desktopEdges.map(([from, to], index) => {
            const a = desktopNodes[from];
            const b = desktopNodes[to];
            return (
              <line
                key={index}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#E8E8E8"
                strokeWidth="0.35"
              />
            );
          })}
        </svg>
        {desktopNodes.map((node) => (
          <FloatIcon key={node.id} node={node} reduce={reduce} />
        ))}
        <motion.div
          className="absolute left-[8%] top-[38%] z-10 will-change-transform"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ToastCard text={t("toastPosted")} />
        </motion.div>
        <div className="absolute right-[2%] top-[64%] z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={toastIndex}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
            >
              <ToastCard text={toasts[toastIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-sm lg:hidden">
        {mobileNodes.map((node) => (
          <FloatIcon key={node.id} node={node} reduce={reduce} />
        ))}
        <motion.div
          className="absolute left-1/2 top-[46%] z-10 w-max max-w-[90%] -translate-x-1/2 will-change-transform"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <ToastCard text={t("toastScheduled")} />
        </motion.div>
      </div>
    </div>
  );
}

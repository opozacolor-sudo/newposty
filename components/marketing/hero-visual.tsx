"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

export function HeroVisual() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [allowTilt, setAllowTilt] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const apply = () => setAllowTilt(media.matches && !reduce);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [reduce]);

  const onMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!allowTilt || !wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -(py * 3.5), y: px * 3.5 });
    },
    [allowTilt],
  );

  function onLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(28rem,70vw)] lg:max-w-[min(32rem,56vh)]"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          ref={wrapRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative aspect-square w-full will-change-transform"
          style={{
            transform: allowTilt
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              : undefined,
            transition: "transform 0.35s ease-out",
          }}
        >
          <Image
            src="/hero-orbit-icons.png"
            alt=""
            width={1024}
            height={1024}
            priority
            sizes="(min-width: 1024px) 32rem, 70vw"
            className="h-full w-full object-contain"
          />
          {reduce ? null : (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,71,19,0.4) 0%, rgba(255,71,19,0.14) 42%, rgba(255,71,19,0) 72%)",
              }}
              animate={{ scale: [1, 1.16, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

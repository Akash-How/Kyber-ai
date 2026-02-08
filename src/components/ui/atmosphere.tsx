"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import * as React from "react";

type AtmosphereProps = {
  variant?: "landing" | "chat" | "studio";
  className?: string;
};

type DotPoint = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  tone: "violet" | "indigo" | "slate";
};

const variantMap = {
  landing: {
    base: "from-[#010208] via-[#06091a] to-[#02030a]",
    blobA:
      "bg-[radial-gradient(circle_at_center,rgba(131,88,255,0.18),transparent_70%)]",
    blobB:
      "bg-[radial-gradient(circle_at_center,rgba(105,109,255,0.14),transparent_72%)]",
    blobC:
      "bg-[radial-gradient(circle_at_center,rgba(76,86,185,0.14),transparent_74%)]",
  },
  chat: {
    base: "from-[#010208] via-[#050814] to-[#02030a]",
    blobA:
      "bg-[radial-gradient(circle_at_center,rgba(128,79,255,0.16),transparent_72%)]",
    blobB:
      "bg-[radial-gradient(circle_at_center,rgba(96,102,241,0.12),transparent_74%)]",
    blobC:
      "bg-[radial-gradient(circle_at_center,rgba(88,70,171,0.14),transparent_76%)]",
  },
  studio: {
    base: "from-[#010208] via-[#070a1a] to-[#02030a]",
    blobA:
      "bg-[radial-gradient(circle_at_center,rgba(140,92,255,0.18),transparent_70%)]",
    blobB:
      "bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14),transparent_72%)]",
    blobC:
      "bg-[radial-gradient(circle_at_center,rgba(111,60,199,0.14),transparent_76%)]",
  },
} as const;

const createDots = (
  count: number,
  seed: number,
  minSize: number,
  maxSize: number,
  minOpacity: number,
  maxOpacity: number,
): DotPoint[] => {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const tones: DotPoint["tone"][] = ["violet", "indigo", "slate"];

  return Array.from({ length: count }, () => ({
    x: 2 + rand() * 96,
    y: 2 + rand() * 96,
    size: minSize + rand() * (maxSize - minSize),
    opacity: minOpacity + rand() * (maxOpacity - minOpacity),
    tone: tones[Math.floor(rand() * tones.length)] ?? "violet",
  }));
};

const DOTS_NEAR = createDots(58, 11, 1.2, 3.2, 0.16, 0.34);
const DOTS_MID = createDots(46, 23, 1.0, 2.7, 0.12, 0.28);
const DOTS_FAR = createDots(36, 37, 0.8, 2.2, 0.1, 0.22);

const dotToneClass: Record<DotPoint["tone"], string> = {
  violet: "bg-violet-200",
  indigo: "bg-indigo-200",
  slate: "bg-slate-200",
};

function DotLayer({ dots }: { dots: DotPoint[] }) {
  return (
    <>
      {dots.map((dot, index) => (
        <span
          key={`${dot.x}-${dot.y}-${index}`}
          className={cn(
            "absolute rounded-full blur-[0.4px]",
            dotToneClass[dot.tone],
          )}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            boxShadow: "0 0 5px rgba(167,139,250,0.18)",
          }}
        />
      ))}
    </>
  );
}

export function Atmosphere({ variant = "landing", className }: AtmosphereProps) {
  const cfg = variantMap[variant];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 36, damping: 20 });
  const sy = useSpring(y, { stiffness: 36, damping: 20 });
  const { scrollYProgress } = useScroll();

  const layerAX = useTransform(sx, (v) => `${v * 22}px`);
  const layerAY = useTransform(sy, (v) => `${v * 18}px`);
  const layerBX = useTransform(sx, (v) => `${v * -16}px`);
  const layerBY = useTransform(sy, (v) => `${v * -12}px`);
  const layerCY = useTransform(scrollYProgress, [0, 1], ["0px", "64px"]);

  const dotsNearX = useTransform(sx, (v) => `${v * 14}px`);
  const dotsNearY = useTransform(sy, (v) => `${v * 10}px`);
  const dotsMidX = useTransform(sx, (v) => `${v * -10}px`);
  const dotsMidY = useTransform(sy, (v) => `${v * -6}px`);
  const dotsFarX = useTransform(sx, (v) => `${v * 6}px`);
  const dotsFarY = useTransform(sy, (v) => `${v * -4}px`);
  const dotsScroll = useTransform(scrollYProgress, [0, 1], ["0px", "28px"]);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const targetRef = React.useRef({ x: 50, y: 50 });
  const currentRef = React.useRef({ x: 50, y: 50 });
  const gradientBg = useMotionTemplate`radial-gradient(360px circle at ${mouseX}% ${mouseY}%, rgba(168, 85, 247, 0.08), transparent 62%), radial-gradient(420px circle at ${mouseX}% ${mouseY}%, rgba(99, 102, 241, 0.05), transparent 75%), radial-gradient(520px circle at ${mouseX}% ${mouseY}%, rgba(0, 0, 0, 0), transparent 82%)`;

  React.useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      x.set(nx);
      y.set(ny);

      const next = {
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      };

      const maxJumpPx = 220;
      const maxJumpXPct = (maxJumpPx / window.innerWidth) * 100;
      const maxJumpYPct = (maxJumpPx / window.innerHeight) * 100;

      const dx = next.x - currentRef.current.x;
      const dy = next.y - currentRef.current.y;

      targetRef.current = {
        x:
          currentRef.current.x +
          Math.sign(dx) * Math.min(Math.abs(dx), maxJumpXPct),
        y:
          currentRef.current.y +
          Math.sign(dy) * Math.min(Math.abs(dy), maxJumpYPct),
      };
    };

    const minFrameMs = 1000 / 45;
    let lastFrameTs = 0;

    const tick = (ts: number) => {
      if (ts - lastFrameTs < minFrameMs) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      lastFrameTs = ts;

      const lerpStrength = 0.2;
      currentRef.current = {
        x:
          currentRef.current.x +
          (targetRef.current.x - currentRef.current.x) * lerpStrength,
        y:
          currentRef.current.y +
          (targetRef.current.y - currentRef.current.y) * lerpStrength,
      };
      mouseX.set(currentRef.current.x);
      mouseY.set(currentRef.current.y);
      raf = window.requestAnimationFrame(tick);
    };

    let raf = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mouseX, mouseY, x, y]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-b", cfg.base)} />

      <motion.div
        style={{ x: layerAX, y: layerAY }}
        className={cn(
          "absolute -left-24 top-[-12rem] h-[28rem] w-[28rem] blur-[92px]",
          cfg.blobA,
        )}
      />
      <motion.div
        style={{ x: layerBX, y: layerBY }}
        className={cn(
          "absolute right-[-9rem] top-[6rem] h-[24rem] w-[24rem] blur-[98px]",
          cfg.blobB,
        )}
      />
      <motion.div
        style={{ y: layerCY }}
        className={cn(
          "absolute left-[24%] bottom-[-14rem] h-[32rem] w-[32rem] blur-[108px]",
          cfg.blobC,
        )}
      />

      <div className="absolute inset-0 [transform:perspective(1200px)]">
        <motion.div
          style={{ x: dotsFarX, y: dotsFarY }}
          className="absolute inset-0"
        >
          <DotLayer dots={DOTS_FAR} />
        </motion.div>
        <motion.div
          style={{ x: dotsMidX, y: dotsMidY }}
          className="absolute inset-0"
        >
          <DotLayer dots={DOTS_MID} />
        </motion.div>
        <motion.div
          style={{ x: dotsNearX, y: dotsNearY }}
          className="absolute inset-0"
        >
          <motion.div style={{ y: dotsScroll }} className="absolute inset-0">
            <DotLayer dots={DOTS_NEAR} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{
          background: gradientBg,
          willChange: "transform, background",
          transform: "translate3d(0,0,0)",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:46px_46px] opacity-[0.04]" />
    </div>
  );
}

export default Atmosphere;

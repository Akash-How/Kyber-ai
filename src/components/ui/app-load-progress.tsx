"use client";

import { motion } from "framer-motion";
import * as React from "react";

export default function AppLoadProgress() {
  const [progress, setProgress] = React.useState(8);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const next = prev + Math.max(0.8, (92 - prev) * 0.08);
        return Math.min(next, 92);
      });
    };

    interval = setInterval(tick, 120);

    const finish = () => {
      setProgress(100);
      window.setTimeout(() => setVisible(false), 280);
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0.85 }}
      animate={{ opacity: progress >= 100 ? 0 : 0.55 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none fixed left-0 right-0 top-0 z-[120] h-[2px]"
      aria-hidden
    >
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        className="h-full bg-violet-300/90 shadow-[0_0_8px_rgba(168,85,247,0.35)]"
      />
    </motion.div>
  );
}

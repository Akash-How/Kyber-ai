"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

export default function KyberBrand() {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative inline-block"
    >
      <Link
        href="/"
        className="group relative inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 backdrop-blur-md"
      >
        <span className="relative h-2.5 w-2.5 rounded-full bg-violet-300/80 shadow-[0_0_14px_rgba(168,85,247,0.5)]" />

        <span className="relative overflow-hidden">
          <span className="block text-base font-semibold tracking-[0.08em] text-white/86 transition-all duration-500 group-hover:tracking-[0.12em] group-hover:text-white">
            KYBER
          </span>
          <motion.span
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: hovered ? "120%" : "-120%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-y-0 w-12 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(221,214,254,0.45),rgba(255,255,255,0))] blur-[0.4px]"
          />
        </span>
      </Link>
    </motion.div>
  );
}

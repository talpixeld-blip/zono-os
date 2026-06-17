"use client";

import { motion } from "./motion";
import { cn } from "@/lib/utils";

/** Small purple ZONO orb — the assistant avatar. Not the focal point. */
export function ZonoOrb({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "from-brand to-brand-light relative inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br text-white shadow-[0_8px_22px_rgba(124,58,237,0.4)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute rounded-full bg-white/90"
        style={{ width: size * 0.16, height: size * 0.16, top: size * 0.34, left: size * 0.3 }}
      />
      <span
        className="absolute rounded-full bg-white/90"
        style={{ width: size * 0.16, height: size * 0.16, top: size * 0.34, right: size * 0.3 }}
      />
      <span
        className="absolute rounded-full bg-white/40"
        style={{ width: size * 0.5, height: size * 0.5, top: -size * 0.12, left: size * 0.12 }}
      />
    </span>
  );
}

interface FloatingAssistantProps {
  message: string;
  className?: string;
}

/** A small floating assistant chip used near the map. */
export function FloatingAssistant({ message, className }: FloatingAssistantProps) {
  return (
    <motion.div
      className={cn("flex items-center gap-2.5", className)}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ZonoOrb size={44} />
      <div className="bg-card/95 border-line max-w-[230px] rounded-2xl border px-3.5 py-2.5 shadow-lg backdrop-blur">
        <p className="text-brand text-[10px] font-bold">זונו · עכשיו</p>
        <p className="text-ink text-xs font-semibold leading-snug">{message}</p>
      </div>
    </motion.div>
  );
}

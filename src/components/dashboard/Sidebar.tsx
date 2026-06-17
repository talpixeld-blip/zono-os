"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/mock";
import { Icon } from "./Icon";

/**
 * Slim, white RTL sidebar. Sits on the right (start side) in RTL.
 * Active item gets the purple treatment. Hidden on mobile (bottom nav instead).
 */
export function Sidebar() {
  const [activeId, setActiveId] = useState(
    navItems.find((n) => n.active)?.id ?? "home",
  );

  return (
    <aside className="bg-card/80 border-line sticky top-0 hidden h-screen w-[88px] shrink-0 flex-col items-center border-s py-6 backdrop-blur-xl lg:flex">
      <div className="bg-brand text-white mb-8 grid h-11 w-11 place-items-center rounded-2xl text-lg font-black shadow-[0_8px_20px_rgba(124,58,237,0.35)]">
        Z
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              title={item.label}
              className={cn(
                "group relative flex w-[64px] flex-col items-center gap-1 rounded-2xl px-2 py-2.5 transition-all",
                active
                  ? "bg-brand-soft text-brand-strong"
                  : "text-muted hover:bg-surface hover:text-ink",
              )}
            >
              {active && (
                <span className="bg-brand absolute -end-[10px] top-1/2 h-7 w-1 -translate-y-1/2 rounded-full" />
              )}
              <Icon name={item.icon} size={22} strokeWidth={active ? 2.1 : 1.75} />
              <span className="text-[10px] font-semibold leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

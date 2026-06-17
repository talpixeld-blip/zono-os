"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/data/mock";
import { Icon } from "./Icon";

/** Bottom navigation shown on mobile in place of the sidebar. */
export function MobileNav() {
  const [activeId, setActiveId] = useState(
    mobileNavItems.find((n) => n.active)?.id ?? "home",
  );

  return (
    <nav className="bg-card/90 border-line fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      {mobileNavItems.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors",
              active ? "text-brand" : "text-muted",
            )}
          >
            <Icon name={item.icon} size={22} strokeWidth={active ? 2.2 : 1.75} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

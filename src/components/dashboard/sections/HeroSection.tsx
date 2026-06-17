"use client";

import {
  currentAgent,
  heroAssistantMessage,
  mapPins,
  newOpportunitiesToday,
} from "@/data/mock";
import { Icon } from "../Icon";
import { CityMap } from "../CityMap";
import { FloatingAssistant } from "../FloatingAssistant";
import { motion } from "../motion";

/** Hero "city command center" — the dominant first impression. */
export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.4fr)]"
    >
      {/* Text block */}
      <div className="flex flex-col justify-center">
        <p className="text-muted text-sm font-semibold">{currentAgent.greeting}</p>
        <h1 className="text-ink mt-2 text-3xl font-black leading-[1.15] sm:text-4xl">
          זונו מצא{" "}
          <span className="text-brand">{newOpportunitiesToday}</span> הזדמנויות
          חדשות בזון שלך
        </h1>
        <p className="text-muted mt-3 max-w-md text-base leading-relaxed">
          מפה חיה של נכסים, קונים, מוכרים והזדמנויות בזמן אמת.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="bg-brand hover:bg-brand-strong inline-flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(124,58,237,0.32)] transition">
            <Icon name="Sparkles" size={18} strokeWidth={2.1} />
            צפה בהזדמנויות
          </button>
          <button className="bg-card border-line text-ink hover:border-brand-light inline-flex h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-bold transition">
            <Icon name="Map" size={18} />
            סרוק שוק היום
          </button>
        </div>

        {/* tiny live stat row */}
        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2">
          {[
            { k: "נכסים פעילים", v: "18" },
            { k: "קונים חמים", v: "24" },
            { k: "עסקאות החודש", v: "12" },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-ink text-xl font-black">{s.v}</p>
              <p className="text-muted text-xs font-medium">{s.k}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Map — dominant element */}
      <div className="relative h-[340px] overflow-hidden rounded-[26px] border border-line bg-card shadow-[0_20px_50px_rgba(124,58,237,0.12)] sm:h-[420px]">
        <CityMap pins={mapPins} />
        <FloatingAssistant
          message={heroAssistantMessage}
          className="absolute bottom-4 end-4"
        />
      </div>
    </motion.section>
  );
}

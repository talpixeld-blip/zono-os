import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { HeroSection } from "@/components/dashboard/sections/HeroSection";
import { OpportunitiesSection } from "@/components/dashboard/sections/OpportunitiesSection";
import { PropertiesSection } from "@/components/dashboard/sections/PropertiesSection";
import { HeatmapSection } from "@/components/dashboard/sections/HeatmapSection";
import { JourneysSection } from "@/components/dashboard/sections/JourneysSection";
import { MatchingSection } from "@/components/dashboard/sections/MatchingSection";
import { DealsSection } from "@/components/dashboard/sections/DealsSection";
import { MarketSection } from "@/components/dashboard/sections/MarketSection";
import { CommandSection } from "@/components/dashboard/sections/CommandSection";

export default function Home() {
  return (
    <DashboardShell>
      <HeroSection />
      <OpportunitiesSection />
      <PropertiesSection />
      <HeatmapSection />
      <JourneysSection />
      <MatchingSection />
      <DealsSection />
      <MarketSection />
      <CommandSection />
    </DashboardShell>
  );
}

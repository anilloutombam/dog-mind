import { FeatureHighlights } from "@/components/dog-mind/feature-highlights";
import { Hero } from "@/components/dog-mind/hero";
import { SiteFooter } from "@/components/dog-mind/site-footer";
import { SiteHeader } from "@/components/dog-mind/site-header";
import { DogAnalysisWorkspace } from "@/features/dog-analysis/dog-analysis-workspace";

export default function Home() {
  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteHeader />
      <Hero />
      <DogAnalysisWorkspace />
      <FeatureHighlights />
      <SiteFooter />
    </main>
  );
}

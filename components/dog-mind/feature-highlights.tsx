import { BrainCircuit, LockKeyhole, Zap, type LucideIcon } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Fast as zoomies", text: "A full personality read in seconds." },
  { icon: BrainCircuit, title: "Smart, not serious", text: "Built with AI, made for delight." },
  { icon: LockKeyhole, title: "Your photo stays yours", text: "Processed securely, never posted." },
];

export function FeatureHighlights() {
  return <section className="features">{FEATURES.map((feature) => <Feature key={feature.title} {...feature} />)}</section>;
}

function Feature({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="feature"><span><Icon size={19} /></span><div><h3>{title}</h3><p>{text}</p></div></div>;
}

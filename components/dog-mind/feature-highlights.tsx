import { BrainCircuit, Heart, MessageCircle, type LucideIcon } from "lucide-react";

const FEATURES = [
  { icon: BrainCircuit, title: "Advanced AI Analysis", text: "We analyze subtle body language signals invisible to the human eye.", tone: "purple" },
  { icon: Heart, title: "Mood & Emotion Detection", text: "Understand how your dog is feeling right now.", tone: "pink" },
  { icon: MessageCircle, title: "Inner Thoughts Decoded", text: "Get a funny, wholesome glimpse into your dog’s imaginary monologue.", tone: "yellow" },
];

export function FeatureHighlights() {
  return <section className="features">{FEATURES.map((feature) => <Feature key={feature.title} {...feature} />)}</section>;
}

function Feature({ icon: Icon, title, text, tone }: { icon: LucideIcon; title: string; text: string; tone: string }) {
  return <div className={`feature ${tone}`}><span><Icon size={25} /></span><div><h3>{title}</h3><p>{text}</p></div></div>;
}

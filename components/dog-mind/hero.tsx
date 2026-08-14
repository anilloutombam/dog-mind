import Image from "next/image";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="eyebrow"><Sparkles size={14} /> AI-powered dog decoder</div>
      <h1>Ever wonder what your<br /><span>dog is thinking?</span></h1>
      <p>Drop in a photo. We’ll read the body language, decode the mood,<br className="desktop-break" /> and reveal the very important thoughts behind those eyes.</p>
      <div className="dog-peek" aria-hidden="true">
        <div className="peek-glow" />
        <Image src="/dog-mind-mascot.png" alt="" width={190} height={190} priority />
        <span className="peek-bubble">woof?</span>
      </div>
    </section>
  );
}

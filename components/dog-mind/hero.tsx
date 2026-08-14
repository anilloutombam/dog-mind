import { Heart, PawPrint, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="eyebrow"><Sparkles size={14} /> Your dog has thoughts. We help translate them. 🐶</div>
      <h1>What’s going on<br />in that <span>fluffy head?</span></h1>
      <p>Upload a photo of your dog and we’ll analyze their<br className="desktop-break" /> body language, mood, and secret thoughts.</p>
      <div className="hero-doodles" aria-hidden="true">
        <Heart className="doodle-heart heart-left" />
        <Heart className="doodle-heart heart-right" />
        <PawPrint className="doodle-paw paw-left" />
        <PawPrint className="doodle-paw paw-right" />
      </div>
    </section>
  );
}

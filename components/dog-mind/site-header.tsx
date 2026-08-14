import { PawPrint, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Dog Mind home">
        <span className="brand-mark"><PawPrint size={21} /></span>
        <span>Dog<span>Mind</span></span>
      </a>
      <div className="top-note"><ShieldCheck size={15} /> Private by design</div>
    </header>
  );
}

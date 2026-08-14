import { CircleHelp, PawPrint } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Dog Mind home">
        <span className="brand-mark"><PawPrint size={25} /></span>
        <span>Dog Mind</span>
      </a>
      <a className="top-note" href="#how-it-works"><CircleHelp size={16} /> How it works</a>
    </header>
  );
}

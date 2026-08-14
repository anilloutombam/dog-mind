import { UploadedImage } from "./uploaded-image";

type AnalyzingCardProps = { previewUrl: string; progress: number };

export function AnalyzingCard({ previewUrl, progress }: AnalyzingCardProps) {
  return (
    <div className="analyzing-card">
      <div className="scan-photo">
        <UploadedImage src={previewUrl} alt="Dog being analyzed" />
        <span className="scan-line" />
      </div>
      <div className="analyzing-copy">
        <span className="live-pill"><i /> ANALYZING</span>
        <h3>Sniffing out the clues…</h3>
        <p>Our AI is studying every head tilt and eyebrow raise.</p>
      </div>
      <div className="progress-row">
        <span>{progress}%</span>
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
          <span className="progress-dog" style={{ left: `${Math.min(progress, 94)}%` }}>🐕</span>
        </div>
      </div>
    </div>
  );
}

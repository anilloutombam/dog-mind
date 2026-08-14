import { Lightbulb } from "lucide-react";
import { getDogFact } from "../constants";

type AnalyzingCardProps = { progress: number };

export function AnalyzingCard({ progress }: AnalyzingCardProps) {
  const fact = getDogFact(progress);
  return (
    <div className="analyzing-card">
      <div className="analyzing-copy">
        <h3>Analyzing your dog’s vibe...</h3>
        <p>Our AI is looking at body language,<br />facial expressions, and tail wags.</p>
      </div>
      <div className="progress-row">
        <div
          className="progress-track is-running"
          role="progressbar"
          aria-label="Dog photo analysis progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div style={{ width: `${progress}%` }} />
          <span className="progress-dog" style={{ left: `${Math.min(progress, 94)}%` }} title="Running through the clues!">
            <i className="runner-dust dust-one" />
            <i className="runner-dust dust-two" />
            <b aria-hidden="true">🐕</b>
          </span>
        </div>
        <strong>{progress}%</strong>
      </div>
      <div className="dog-fact" aria-live="polite">
        <Lightbulb size={22} />
        <p key={fact} className="dog-fact-copy"><strong>Did you know?</strong>{fact}</p>
      </div>
    </div>
  );
}

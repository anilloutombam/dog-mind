import { Check, Heart } from "lucide-react";
import { ANALYSIS_STEPS, getActiveStep } from "../constants";
import type { AnalysisState } from "../types";

type AnalysisStepsProps = { status: AnalysisState; progress: number };

export function AnalysisSteps({ status, progress }: AnalysisStepsProps) {
  const activeStep = getActiveStep(progress);
  return (
    <aside className="steps-panel">
      <div className="panel-heading compact"><div><span className="step-number">2</span><div><h2>We work our magic</h2><p>Usually takes 10–15 seconds</p></div></div></div>
      <div className="steps-list">
        {ANALYSIS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const done = status === "complete" || (status === "analyzing" && index < activeStep);
          const active = status === "analyzing" && index === activeStep;
          return (
            <div className={`analysis-step ${done ? "done" : ""} ${active ? "active" : ""}`} key={step.title}>
              <span className="step-icon">{done ? <Check size={17} /> : <Icon size={19} />}</span>
              <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              {active && <span className="step-pulse" />}
            </div>
          );
        })}
      </div>
      <div className="promise"><Heart size={18} /><div><strong>No judgment. Just vibes.</strong><span>Every dog is a good dog.</span></div></div>
    </aside>
  );
}

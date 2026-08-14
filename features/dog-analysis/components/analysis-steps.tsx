import { Check } from "lucide-react";
import { ANALYSIS_STEPS, getActiveStep } from "../constants";
import type { AnalysisState } from "../types";

type AnalysisStepsProps = { status: AnalysisState; progress: number };

export function AnalysisSteps({ status, progress }: AnalysisStepsProps) {
  const activeStep = getActiveStep(progress);
  return (
    <div className="steps-panel">
      <div className="steps-list">
        {ANALYSIS_STEPS.map((step, index) => {
          const Icon = step.icon;
          const done = status === "complete" || (status === "analyzing" && index < activeStep);
          const active = status === "analyzing" && index === activeStep;
          return (
            <div className={`analysis-step ${done ? "done" : ""} ${active ? "active" : ""}`} key={step.title}>
              <span className="step-icon">{done ? <Check size={17} /> : <Icon size={19} />}</span>
              <div><h3>{step.title}</h3></div>
              {done && <Check className="step-check" size={15} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

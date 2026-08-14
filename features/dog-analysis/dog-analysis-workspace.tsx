"use client";

import { AnalysisSteps } from "./components/analysis-steps";
import { AnalyzingCard } from "./components/analyzing-card";
import { UploadPanel } from "./components/upload-panel";
import { useDogAnalysis } from "./use-dog-analysis";

export function DogAnalysisWorkspace() {
  const analysis = useDogAnalysis();
  return (
    <section className="workspace" id="how-it-works" aria-label="Dog photo analyzer">
      <UploadPanel
        hasFile={Boolean(analysis.file)} fileName={analysis.file?.name} previewUrl={analysis.previewUrl} status={analysis.status}
        progress={analysis.progress} error={analysis.error} result={analysis.result}
        retryAfter={analysis.retryAfter}
        onSelect={analysis.selectFile} onAnalyze={analysis.analyze} onReset={analysis.reset}
        onTrySample={analysis.trySample}
      />
      {analysis.status === "analyzing" && <div className="analysis-panel">
        <AnalyzingCard progress={analysis.progress} />
        <AnalysisSteps status={analysis.status} progress={analysis.progress} />
      </div>}
    </section>
  );
}

"use client";

import { AnalysisSteps } from "./components/analysis-steps";
import { UploadPanel } from "./components/upload-panel";
import { useDogAnalysis } from "./use-dog-analysis";

export function DogAnalysisWorkspace() {
  const analysis = useDogAnalysis();
  return (
    <section className="workspace" aria-label="Dog photo analyzer">
      <UploadPanel
        hasFile={Boolean(analysis.file)} previewUrl={analysis.previewUrl} status={analysis.status}
        progress={analysis.progress} error={analysis.error} result={analysis.result}
        onSelect={analysis.selectFile} onAnalyze={analysis.analyze} onReset={analysis.reset}
      />
      <AnalysisSteps status={analysis.status} progress={analysis.progress} />
    </section>
  );
}

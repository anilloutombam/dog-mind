import { FileImage, RotateCcw, WandSparkles } from "lucide-react";
import type { AnalysisState, DogAnalysis } from "../types";
import { AnalyzingCard } from "./analyzing-card";
import { PhotoDropzone } from "./photo-dropzone";
import { ResultCard } from "./result-card";

type UploadPanelProps = {
  hasFile: boolean; previewUrl: string; status: AnalysisState; progress: number;
  error: string; result: DogAnalysis | null; onSelect: (file?: File) => void;
  onAnalyze: () => void; onReset: () => void;
};

export function UploadPanel(props: UploadPanelProps) {
  const { hasFile, previewUrl, status, progress, error, result, onSelect, onAnalyze, onReset } = props;
  return (
    <div className="upload-panel">
      <div className="panel-heading">
        <div><span className="step-number">1</span><div><h2>Show us your dog</h2><p>One clear photo works best</p></div></div>
        {hasFile && status !== "analyzing" && <button className="text-button" onClick={onReset}><RotateCcw size={14} /> Start over</button>}
      </div>
      {status === "complete" && result ? <ResultCard analysis={result} previewUrl={previewUrl} onReset={onReset} />
        : status === "analyzing" ? <AnalyzingCard previewUrl={previewUrl} progress={progress} />
        : <>
          <PhotoDropzone previewUrl={previewUrl} onSelect={onSelect} onRemove={onReset} />
          <div className="file-help"><span><FileImage size={14} /> JPG, PNG or WebP</span><span>Up to 5 MB</span></div>
          {error && <p className="error-message">{error}</p>}
          <button className="analyze-button" disabled={!hasFile} onClick={onAnalyze}><WandSparkles size={18} /> Decode my dog’s mind</button>
        </>}
    </div>
  );
}

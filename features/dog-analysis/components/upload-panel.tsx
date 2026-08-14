import Image from "next/image";
import { Dog, RotateCcw, WandSparkles } from "lucide-react";
import type { AnalysisState, DogAnalysis } from "../types";
import { PhotoDropzone } from "./photo-dropzone";
import { ResultCard } from "./result-card";

type UploadPanelProps = {
  hasFile: boolean; fileName?: string; previewUrl: string; status: AnalysisState; progress: number;
  error: string; result: DogAnalysis | null; onSelect: (file?: File) => void;
  retryAfter: number;
  onAnalyze: () => void; onReset: () => void;
  onTrySample: () => void;
};

export function UploadPanel(props: UploadPanelProps) {
  const { hasFile, fileName, previewUrl, status, error, retryAfter, result, onSelect, onAnalyze, onReset, onTrySample } = props;
  return (
    <div className="upload-panel">
      <div className="dog-peek" aria-hidden="true">
        <div className="peek-glow" />
        <Image src="/peeking-dog-v2.png" alt="" width={1285} height={490} priority />
        <span className="peek-lines"><i /><i /><i /></span>
      </div>
      {status === "complete" && result ? <ResultCard analysis={result} previewUrl={previewUrl} onReset={onReset} />
        : <>
          <PhotoDropzone fileName={fileName} previewUrl={previewUrl} onSelect={onSelect} onRemove={onReset} />
          {error && <div className="error-state" role="alert"><p className="error-message">{error}</p>{hasFile && <button type="button" className="secondary-action" onClick={onAnalyze} disabled={retryAfter > 0}><RotateCcw size={15} /> {retryAfter > 0 ? `Try again in ${retryAfter}s` : "Try again now"}</button>}</div>}
          {hasFile && status !== "analyzing" && !error && <button className="analyze-button" onClick={onAnalyze}><WandSparkles size={18} /> Analyze my dog</button>}
          {!hasFile && status === "idle" && <button className="sample-button" type="button" onClick={onTrySample}><Dog size={17} /> Try a sample dog</button>}
        </>}
    </div>
  );
}

import { Check, RotateCcw } from "lucide-react";
import type { DogAnalysis } from "../types";
import { UploadedImage } from "./uploaded-image";

type ResultCardProps = { analysis: DogAnalysis; previewUrl: string; onReset: () => void };

export function ResultCard({ analysis, previewUrl, onReset }: ResultCardProps) {
  if (!analysis.isDog) {
    return (
      <div className="result-card not-dog">
        <span>🧐</span><h3>That’s suspiciously not a dog.</h3>
        <p>Try another photo with your pup front and center.</p>
        <button className="analyze-button" onClick={onReset}>Choose another photo</button>
      </div>
    );
  }

  return (
    <div className="result-card">
      <div className="result-top">
        <UploadedImage src={previewUrl} alt="Analyzed dog" />
        <div>
          <span className="result-label"><Check size={13} /> DECODER COMPLETE</span>
          <h3>{analysis.mood}</h3><p>{analysis.confidence}% confidence</p>
        </div>
      </div>
      <p className="summary">{analysis.summary}</p>
      <div className="thought"><span>💭 INNER MONOLOGUE</span><blockquote>“{analysis.thought}”</blockquote></div>
      <div className="meters">
        {Object.entries(analysis.signals).map(([label, value]) => (
          <div key={label}><span>{label}</span><strong>{value}%</strong><i><b style={{ width: `${value}%` }} /></i></div>
        ))}
      </div>
      <button className="analyze-button" onClick={onReset}><RotateCcw size={17} /> Decode another dog</button>
    </div>
  );
}

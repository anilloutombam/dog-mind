import { Check, RotateCcw } from "lucide-react";
import type { DogAnalysis } from "../types";
import { UploadedImage } from "./uploaded-image";
import { VoicePlayer } from "./voice-player";
import { AskYourDog } from "./ask-your-dog";
import { ShareResultButton } from "./share-result-button";

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
          <h3>{analysis.mood}</h3>
          <p>{analysis.confidence}% mood confidence</p>
          <p className="breed-guess">Likely {analysis.breedGuess} · {analysis.breedConfidence}% visual guess</p>
        </div>
      </div>
      <p className="summary">{analysis.summary}</p>
      <div className="thought"><span>💭 INNER MONOLOGUE</span><blockquote>“{analysis.thought}”</blockquote></div>
      <VoicePlayer text={analysis.thought} voiceStyle={analysis.voiceStyle} breedGuess={analysis.breedGuess} />
      <AskYourDog analysis={analysis} />
      <div className="meters">
        {Object.entries(analysis.signals).map(([label, value]) => (
          <div key={label}><span>{label}</span><strong>{value}%</strong><i><b style={{ width: `${value}%` }} /></i></div>
        ))}
      </div>
      <div className="result-actions"><ShareResultButton analysis={analysis} previewUrl={previewUrl} /><button className="analyze-button" onClick={onReset}><RotateCcw size={17} /> Decode another dog</button></div>
    </div>
  );
}

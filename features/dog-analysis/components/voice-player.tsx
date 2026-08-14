"use client";

import { LoaderCircle, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDogVoice } from "../use-dog-voice";
import type { VoiceStyle } from "../types";

const VOICE_LABELS: Record<VoiceStyle, string> = {
  bright: "Bright & bouncy",
  warm: "Warm & friendly",
  bold: "Bold & confident",
  dramatic: "Dramatic & expressive",
  gentle: "Gentle & calm",
  gruff: "Deep & mischievous",
};

type VoicePlayerProps = { text: string; voiceStyle: VoiceStyle; breedGuess: string };

export function VoicePlayer({ text, voiceStyle, breedGuess }: VoicePlayerProps) {
  const [selectedStyle, setSelectedStyle] = useState(voiceStyle);

  return (
    <div className="voice-player">
      <p className="voice-personality">
        <span>{VOICE_LABELS[selectedStyle]} voice</span>
        Inspired by this pup’s {breedGuess.toLowerCase()} look and personality
      </p>
      <label className="voice-select">Voice personality
        <select value={selectedStyle} onChange={(event) => setSelectedStyle(event.target.value as VoiceStyle)}>
          {Object.entries(VOICE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <VoiceControls key={`${text}-${selectedStyle}`} text={text} voiceStyle={selectedStyle} />
    </div>
  );
}

function VoiceControls({ text, voiceStyle }: { text: string; voiceStyle: VoiceStyle }) {
  const voice = useDogVoice(text, voiceStyle);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (voice.state === "ready") audioRef.current?.play().catch(() => undefined);
  }, [voice.state]);

  return <>
      {voice.state === "ready" && voice.audioUrl ? (
        <>
          <audio ref={audioRef} src={voice.audioUrl} controls preload="metadata" />
          <button className="voice-retry" type="button" onClick={() => voice.generate(true)} aria-label="Generate the voice again">
            <RotateCcw size={15} /> New take
          </button>
        </>
      ) : (
        <button className="voice-button" type="button" onClick={() => voice.generate()} disabled={voice.state === "loading"}>
          {voice.state === "loading" ? <LoaderCircle className="voice-spinner" size={18} /> : <Volume2 size={18} />}
          {voice.state === "loading" ? "Finding the perfect dog voice…" : "Hear this dog’s voice"}
        </button>
      )}
      {voice.error && <div className="inline-error" role="alert"><p className="voice-error">{voice.error}</p><button className="voice-retry" type="button" onClick={() => voice.generate(true)}><RotateCcw size={14} /> Retry voice</button></div>}
    </>;
}

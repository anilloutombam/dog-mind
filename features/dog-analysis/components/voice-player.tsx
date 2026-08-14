"use client";

import { LoaderCircle, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDogVoice } from "../use-dog-voice";

export function VoicePlayer({ text }: { text: string }) {
  const voice = useDogVoice(text);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (voice.state === "ready") audioRef.current?.play().catch(() => undefined);
  }, [voice.state]);

  return (
    <div className="voice-player">
      {voice.state === "ready" && voice.audioUrl ? (
        <>
          <audio ref={audioRef} src={voice.audioUrl} controls preload="metadata" />
          <button className="voice-retry" type="button" onClick={voice.generate} aria-label="Generate the voice again">
            <RotateCcw size={15} /> New take
          </button>
        </>
      ) : (
        <button className="voice-button" type="button" onClick={voice.generate} disabled={voice.state === "loading"}>
          {voice.state === "loading" ? <LoaderCircle className="voice-spinner" size={18} /> : <Volume2 size={18} />}
          {voice.state === "loading" ? "Teaching your dog to talk…" : "Give my dog a voice"}
        </button>
      )}
      {voice.error && <p className="voice-error" role="alert">{voice.error}</p>}
    </div>
  );
}

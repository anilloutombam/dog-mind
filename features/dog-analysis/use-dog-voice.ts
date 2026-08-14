"use client";

import { useCallback, useEffect, useState } from "react";
import type { VoiceStyle } from "./types";

type VoiceState = "idle" | "loading" | "ready" | "error";
const audioCache = new Map<string, Blob>();

export function useDogVoice(text: string, voiceStyle: VoiceStyle) {
  const [state, setState] = useState<VoiceState>("idle");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const clearAudio = useCallback(() => {
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }, []);

  useEffect(() => () => clearAudio(), [clearAudio]);
  const generate = useCallback(async (force = false) => {
    if (state === "loading") return;
    setState("loading");
    setError("");
    clearAudio();

    try {
      const cacheKey = `${voiceStyle}:${text}`;
      const cached = !force ? audioCache.get(cacheKey) : undefined;
      if (cached) {
        setAudioUrl(URL.createObjectURL(cached));
        setState("ready");
        return;
      }
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceStyle }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Voice generation failed.");
      }

      const blob = await response.blob();
      audioCache.set(cacheKey, blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setState("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Voice generation failed.");
      setState("error");
    }
  }, [clearAudio, state, text, voiceStyle]);

  return { state, audioUrl, error, generate };
}

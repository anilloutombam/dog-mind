"use client";

import { useCallback, useEffect, useState } from "react";

type VoiceState = "idle" | "loading" | "ready" | "error";

export function useDogVoice(text: string) {
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

  const generate = useCallback(async () => {
    if (state === "loading") return;
    setState("loading");
    setError("");
    clearAudio();

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Voice generation failed.");
      }

      const url = URL.createObjectURL(await response.blob());
      setAudioUrl(url);
      setState("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Voice generation failed.");
      setState("error");
    }
  }, [clearAudio, state, text]);

  return { state, audioUrl, error, generate };
}

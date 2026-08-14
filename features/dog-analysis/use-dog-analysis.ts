"use client";

import { useCallback, useEffect, useState } from "react";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./constants";
import type { AnalysisState, DogAnalysis } from "./types";

const resultCache = new Map<string, DogAnalysis>();

const SAMPLE_ANALYSIS: DogAnalysis = {
  isDog: true,
  breedGuess: "Golden Retriever",
  breedConfidence: 92,
  dogSize: "large",
  voiceStyle: "warm",
  mood: "Sunshine-powered optimist",
  confidence: 96,
  signals: { happiness: 98, energy: 82, mischief: 64 },
  observations: ["Relaxed open mouth", "Bright, attentive eyes", "Ears resting naturally"],
  thought: "I have reviewed the evidence and conclude that we both deserve a snack.",
  summary: "A cheerful, engaged pup radiating friendly energy—with just enough mischief to keep the treat cupboard under surveillance.",
};

async function imageCacheKey(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const INITIAL_STATE = {
  file: null,
  previewUrl: "",
  status: "idle" as AnalysisState,
  progress: 0,
  error: "",
  result: null,
};

export function useDogAnalysis() {
  const [file, setFile] = useState<File | null>(INITIAL_STATE.file);
  const [previewUrl, setPreviewUrl] = useState(INITIAL_STATE.previewUrl);
  const [status, setStatus] = useState<AnalysisState>(INITIAL_STATE.status);
  const [progress, setProgress] = useState(INITIAL_STATE.progress);
  const [error, setError] = useState(INITIAL_STATE.error);
  const [retryAfter, setRetryAfter] = useState(0);
  const [result, setResult] = useState<DogAnalysis | null>(INITIAL_STATE.result);

  useEffect(() => {
    if (status !== "analyzing") return;
    const timer = window.setInterval(() => {
      setProgress((value) => value >= 91 ? value : value + Math.max(1, Math.round((92 - value) / 9)));
    }, 420);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = window.setInterval(() => {
      setRetryAfter((seconds) => Math.max(0, seconds - 1));
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [retryAfter]);

  const reset = useCallback(() => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return "";
    });
    setFile(null);
    setResult(null);
    setError("");
    setRetryAfter(0);
    setProgress(0);
    setStatus("idle");
  }, []);

  const selectFile = useCallback((nextFile?: File) => {
    if (!nextFile) return;
    setError("");
    setRetryAfter(0);

    if (!ACCEPTED_IMAGE_TYPES.includes(nextFile.type as typeof ACCEPTED_IMAGE_TYPES[number])) {
      setError("Choose a JPG, PNG, or WebP image.");
      setStatus("error");
      return;
    }
    if (nextFile.size > MAX_IMAGE_SIZE) {
      setError("That photo is over 5 MB. Try a smaller one.");
      setStatus("error");
      return;
    }

    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return URL.createObjectURL(nextFile);
    });
    setFile(nextFile);
    setResult(null);
    setProgress(0);
    setStatus("ready");
  }, []);

  const analyze = useCallback(async () => {
    if (!file) return;
    setStatus("analyzing");
    setProgress(8);
    setError("");

    const body = new FormData();
    body.append("image", file);

    try {
      const cacheKey = await imageCacheKey(file);
      const cached = resultCache.get(cacheKey);
      if (cached) {
        setProgress(100);
        setResult(cached);
        setStatus("complete");
        return;
      }
      const response = await fetch("/api/analyze", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setRetryAfter(typeof data.retryAfter === "number" ? Math.max(0, Math.ceil(data.retryAfter)) : 0);
        throw new Error(data.error || "We couldn’t read that photo.");
      }

      setProgress(100);
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      resultCache.set(cacheKey, data as DogAnalysis);
      setResult(data as DogAnalysis);
      setStatus("complete");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [file]);

  const trySample = useCallback(() => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl?.startsWith("blob:")) URL.revokeObjectURL(currentUrl);
      return "/unsplash-dog.jpg";
    });
    setFile(null);
    setError("");
    setRetryAfter(0);
    setProgress(100);
    setResult(SAMPLE_ANALYSIS);
    setStatus("complete");
  }, []);

  return { file, previewUrl, status, progress, error, retryAfter, result, selectFile, analyze, reset, trySample };
}

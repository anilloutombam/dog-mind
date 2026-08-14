"use client";

import { useCallback, useEffect, useState } from "react";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./constants";
import type { AnalysisState, DogAnalysis } from "./types";

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

  const reset = useCallback(() => {
    setPreviewUrl((currentUrl) => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      return "";
    });
    setFile(null);
    setResult(null);
    setError("");
    setProgress(0);
    setStatus("idle");
  }, []);

  const selectFile = useCallback((nextFile?: File) => {
    if (!nextFile) return;
    setError("");

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
      const response = await fetch("/api/analyze", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn’t read that photo.");

      setProgress(100);
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      setResult(data as DogAnalysis);
      setStatus("complete");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [file]);

  return { file, previewUrl, status, progress, error, result, selectFile, analyze, reset };
}

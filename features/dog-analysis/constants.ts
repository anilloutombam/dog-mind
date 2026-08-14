import { BrainCircuit, Eye, Sparkles } from "lucide-react";
import type { AnalysisStep } from "./types";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { title: "Scanning the scene", detail: "Finding your pup", icon: Eye },
  { title: "Reading body language", detail: "Ears, eyes & posture", icon: BrainCircuit },
  { title: "Decoding the vibe", detail: "Translating dog energy", icon: Sparkles },
];

export function getActiveStep(progress: number) {
  if (progress < 34) return 0;
  if (progress < 70) return 1;
  return 2;
}

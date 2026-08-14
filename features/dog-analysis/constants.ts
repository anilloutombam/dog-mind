import { BrainCircuit, Heart, ImageUp, MessageCircle, ScanSearch } from "lucide-react";
import type { AnalysisStep } from "./types";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { title: "Image uploaded", detail: "", icon: ImageUp },
  { title: "Detecting dog", detail: "", icon: ScanSearch },
  { title: "Analyzing body language", detail: "", icon: BrainCircuit },
  { title: "Reading the mood", detail: "", icon: Heart },
  { title: "Generating dog thoughts", detail: "", icon: MessageCircle },
];

export const DOG_FACTS = [
  "Dogs communicate with their whole body—ears, eyes, mouth, posture, and tail all add context. 🐾",
  "A wagging tail is not always a happy signal; its height, speed, and the rest of the body matter too. 🐕",
  "A classic play bow—front legs down, back end up—is often an invitation to have fun. 🎾",
  "Soft eyes and a loose, wiggly posture can be signs that a dog feels relaxed. ✨",
  "Yawning can mean tiredness, but in some situations it can also accompany stress or uncertainty. 🥱",
] as const;

export function getActiveStep(progress: number) {
  if (progress < 18) return 0;
  if (progress < 36) return 1;
  if (progress < 64) return 2;
  if (progress < 86) return 3;
  return 4;
}

export function getDogFact(progress: number) {
  return DOG_FACTS[getActiveStep(progress)];
}

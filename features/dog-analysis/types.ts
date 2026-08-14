import { z } from "zod";

export const VOICE_STYLES = ["bright", "warm", "bold", "dramatic", "gentle", "gruff"] as const;

export type VoiceStyle = (typeof VOICE_STYLES)[number];

export const dogAnalysisSchema = z.object({
  isDog: z.boolean(),
  breedGuess: z.string().trim().min(1).max(60),
  breedConfidence: z.number().int().min(0).max(100),
  dogSize: z.enum(["small", "medium", "large", "unknown"]),
  voiceStyle: z.enum(VOICE_STYLES),
  mood: z.string().max(80),
  confidence: z.number().int().min(0).max(100),
  signals: z.object({
    happiness: z.number().int().min(0).max(100),
    energy: z.number().int().min(0).max(100),
    mischief: z.number().int().min(0).max(100),
  }),
  observations: z.array(z.string()).max(5),
  thought: z.string().max(160),
  summary: z.string().max(200),
});

export type DogAnalysis = z.infer<typeof dogAnalysisSchema>;

export type AnalysisState = "idle" | "ready" | "analyzing" | "complete" | "error";

export type AnalysisStep = {
  title: string;
  detail: string;
  icon: React.ComponentType<{ size?: number }>;
};

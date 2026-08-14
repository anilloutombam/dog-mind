export const VOICE_STYLES = ["bright", "warm", "bold", "dramatic", "gentle", "gruff"] as const;

export type VoiceStyle = (typeof VOICE_STYLES)[number];

export type DogAnalysis = {
  isDog: boolean;
  breedGuess: string;
  breedConfidence: number;
  dogSize: "small" | "medium" | "large" | "unknown";
  voiceStyle: VoiceStyle;
  mood: string;
  confidence: number;
  signals: {
    happiness: number;
    energy: number;
    mischief: number;
  };
  observations: string[];
  thought: string;
  summary: string;
};

export type AnalysisState = "idle" | "ready" | "analyzing" | "complete" | "error";

export type AnalysisStep = {
  title: string;
  detail: string;
  icon: React.ComponentType<{ size?: number }>;
};

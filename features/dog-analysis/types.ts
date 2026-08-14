export type DogAnalysis = {
  isDog: boolean;
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

export type AnalysisSessionInput = {
  resumeText: string;
  jobDescriptionText?: string;
  source?: "upload" | "demo" | "manual";
  updatedAt: number;
};

const KEY = "kyber-analysis-session";

export function saveAnalysisSession(input: AnalysisSessionInput) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(input));
}

export function loadAnalysisSession(): AnalysisSessionInput | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AnalysisSessionInput;
    if (!parsed?.resumeText) return null;
    return parsed;
  } catch {
    return null;
  }
}

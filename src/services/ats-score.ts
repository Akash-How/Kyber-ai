export type AtsScoreResult = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
};

const STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "will", "have", "your", "about", "you", "our", "are", "job", "role",
]);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));

const unique = (items: string[]) => Array.from(new Set(items));

export const calculateATSScore = async (input: {
  resumeText: string;
  jobDescriptionText: string;
}): Promise<AtsScoreResult> => {
  const resumeTokens = unique(tokenize(input.resumeText));
  const jdTokens = unique(tokenize(input.jobDescriptionText));

  const jdTop = jdTokens.slice(0, 45);
  const matched = jdTop.filter((token) => resumeTokens.includes(token));
  const missing = jdTop.filter((token) => !resumeTokens.includes(token)).slice(0, 12);

  const ratio = jdTop.length === 0 ? 0 : matched.length / jdTop.length;
  const score = Math.max(12, Math.min(98, Math.round(ratio * 100)));

  const recommendations = [
    "Mirror critical job-description keywords in your summary and experience bullets.",
    "Add measurable impact metrics (%, $, time saved) for each role.",
    "Move top 6 required skills near the top of your resume.",
  ];

  if (missing.length > 0) {
    recommendations.unshift(`Address missing keywords: ${missing.slice(0, 5).join(", ")}.`);
  }

  return {
    score,
    matchedKeywords: matched.slice(0, 14),
    missingKeywords: missing,
    recommendations,
  };
};

export type ParsedResume = {
  name: string;
  email: string;
  headline: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
};

const normalize = (input: string) =>
  input.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();

const linesOf = (input: string) =>
  normalize(input)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const extractEmail = (text: string) =>
  text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";

const guessName = (lines: string[]) => {
  for (const line of lines.slice(0, 8)) {
    if (line.length < 3 || line.length > 60) continue;
    if (/\d|@|https?:\/\//i.test(line)) continue;
    if (line.split(" ").length > 4) continue;
    if (line === line.toUpperCase()) continue;
    return line;
  }
  return "Candidate";
};

const collectSection = (lines: string[], keys: string[]) => {
  const start = lines.findIndex((line) =>
    keys.some((key) => line.toLowerCase().includes(key.toLowerCase())),
  );
  if (start < 0) return [];

  const rows: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i]!;
    if (/^(experience|education|projects|skills|certifications|summary|profile)\b/i.test(line)) {
      break;
    }
    if (line) rows.push(line);
  }
  return rows;
};

const splitSkills = (rows: string[]) =>
  rows
    .join(" | ")
    .split(/[,|/]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .slice(0, 20);

export const parseResumeText = async (rawText: string): Promise<ParsedResume> => {
  const text = normalize(rawText);
  const lines = linesOf(rawText);

  const email = extractEmail(text);
  const name = guessName(lines);

  const headline =
    lines.find((line) =>
      /(engineer|developer|designer|manager|analyst|architect|lead)/i.test(line),
    ) ?? "Professional";

  const summaryLines = collectSection(lines, ["summary", "profile", "about"]);
  const summary =
    summaryLines.slice(0, 3).join(" ") ||
    lines.slice(0, 5).join(" ").slice(0, 380) ||
    "Motivated professional seeking impactful opportunities.";

  return {
    name,
    email,
    headline,
    summary,
    skills: splitSkills(collectSection(lines, ["skills", "technical skills", "core skills"])),
    experience: collectSection(lines, ["experience", "work experience"]).slice(0, 8),
    education: collectSection(lines, ["education"]).slice(0, 5),
  };
};

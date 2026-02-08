import type { ParsedResume } from "@/services/resume-parser";

export const generateCoverLetter = async (input: {
  resumeSummary: Pick<ParsedResume, "name" | "headline" | "summary" | "skills">;
  jobDescription: string;
  company: string;
  role: string;
}): Promise<{ coverLetterText: string }> => {
  const { resumeSummary, company, role, jobDescription } = input;
  const topSkills =
    resumeSummary.skills.slice(0, 4).join(", ") || "full-stack development";
  const jdLine =
    jobDescription.split("\n").find((line) => line.trim().length > 20) ??
    "driving product impact";

  const intro =
    "I am excited to apply for the " +
    role +
    " position. As a " +
    resumeSummary.headline +
    ", I bring hands-on experience delivering user-focused solutions with strong execution discipline.";

  const alignment =
    "My core strengths include " +
    topSkills +
    ". I am particularly aligned with your focus on " +
    jdLine.trim() +
    ".";

  const letter = [
    "Dear Hiring Team at " + company + ",",
    "",
    intro,
    "",
    resumeSummary.summary,
    "",
    alignment,
    "",
    "I would value the opportunity to contribute quickly, collaborate across product and engineering, and help your team ship meaningful outcomes.",
    "",
    "Thank you for your time and consideration.",
    "",
    "Sincerely,",
    resumeSummary.name,
  ].join("\n");

  return { coverLetterText: letter };
};

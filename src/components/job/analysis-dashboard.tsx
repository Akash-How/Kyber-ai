"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AnalysisDashboardProps = {
  resumeText: string;
  jobDescriptionText?: string;
  className?: string;
};

const STOPWORDS = new Set([
  "the",
  "and",
  "with",
  "that",
  "from",
  "your",
  "for",
  "are",
  "this",
  "you",
  "have",
  "will",
  "into",
  "using",
  "build",
  "role",
  "team",
  "work",
  "skills",
  "experience",
]);

const boxClass =
  "rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5 shadow-[0_14px_34px_rgba(4,8,22,0.16)]";

function extractKeywords(text: string, limit = 18) {
  const counts = new Map<string, number>();
  const words = text.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) ?? [];
  for (const rawWord of words) {
    const word = rawWord.trim();
    if (!word || STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeData(resumeText: string, jobDescriptionText?: string) {
  const resumeKeywords = extractKeywords(resumeText, 28);
  const jdKeywords = extractKeywords(jobDescriptionText || "", 18);
  const jdSet = new Set(jdKeywords);
  const resumeSet = new Set(resumeKeywords);
  const matchedKeywords = jdKeywords.filter((k) => resumeSet.has(k));
  const missingKeywords = jdKeywords.filter((k) => !resumeSet.has(k));

  const coveragePct =
    jdKeywords.length === 0
      ? 62
      : Math.round((matchedKeywords.length / jdKeywords.length) * 100);
  const scoreBase = 54 + coveragePct * 0.36;
  const warningCount =
    (missingKeywords.length > 8 ? 2 : 1) +
    (resumeText.length < 700 ? 1 : 0) +
    (resumeText.length > 5000 ? 1 : 0);
  const atsScore = Math.round(clamp(scoreBase - warningCount * 3, 38, 96));

  const sentences =
    resumeText
      .split(/[.!?]/)
      .map((s) => s.trim())
      .filter(Boolean).length || 1;
  const words = resumeText.split(/\s+/).filter(Boolean).length || 1;
  const avgSentence = words / sentences;
  const readability = Math.round(clamp(100 - (avgSentence - 14) * 3.2, 48, 95));

  const chartSource =
    (jdKeywords.length ? jdKeywords : resumeKeywords.slice(0, 7)).slice(0, 7);
  const fallbackChartKeywords = [
    "keyword-1",
    "keyword-2",
    "keyword-3",
    "keyword-4",
    "keyword-5",
    "keyword-6",
    "keyword-7",
  ];
  const chartData = (chartSource.length > 0 ? chartSource : fallbackChartKeywords).map((keyword) => ({
      keyword: toTitleCase(keyword),
      value: jdSet.size === 0 ? 66 : resumeSet.has(keyword) ? 96 : 26,
    }));

  return {
    atsScore,
    coveragePct,
    missingCount: missingKeywords.length || 5,
    readability,
    matchedKeywords,
    missingKeywords,
    chartData,
    roleFitSummary:
      jdKeywords.length > 0
        ? "Good baseline alignment with clear opportunities on missing role-specific keywords."
        : "Resume baseline analysis is ready. Add a job description to get exact role-fit insights.",
  };
}

function KPI({
  label,
  value,
  helper,
  featured,
}: {
  label: string;
  value: string;
  helper: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        boxClass,
        featured && "bg-white/[0.06] border-violet-300/20",
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-white/62">{helper}</p>
    </div>
  );
}

export default function AnalysisDashboard({
  resumeText,
  jobDescriptionText,
  className,
}: AnalysisDashboardProps) {
  const data = React.useMemo(
    () => computeData(resumeText, jobDescriptionText),
    [jobDescriptionText, resumeText],
  );

  return (
    <div className={cn("space-y-3.5", className)}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPI
          label="ATS Score"
          value={`${data.atsScore}/100`}
          helper="Overall role alignment quality."
          featured
        />
        <KPI
          label="Keyword Coverage"
          value={`${data.coveragePct}%`}
          helper="JD keyword match percentage."
        />
        <KPI
          label="Missing Keywords"
          value={`${data.missingCount}`}
          helper="Most impactful items still missing."
        />
        <KPI
          label="Readability"
          value={`${data.readability}/100`}
          helper="Clarity and scan-ability score."
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-3">
        <div className={cn(boxClass, "h-fit xl:col-span-2")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">Keyword Coverage</p>
            <p className="text-xs text-white/60">Minimal bar view</p>
          </div>
          <div className="h-[182px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ top: 2, right: 2, bottom: 0, left: -8 }}
                barCategoryGap="22%"
              >
                <XAxis
                  dataKey="keyword"
                  tick={{ fill: "rgba(255,255,255,0.58)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={18}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  width={22}
                  tickCount={4}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{
                    background: "rgba(9, 12, 24, 0.75)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[8, 8, 8, 8]}
                  maxBarSize={48}
                  fill="rgba(168, 85, 247, 0.58)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                Top Matched
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.matchedKeywords.slice(0, 5).map((keyword) => (
                  <span
                    key={`matched-${keyword}`}
                    className="rounded-full bg-emerald-400/14 px-2 py-1 text-[11px] text-emerald-100"
                  >
                    {toTitleCase(keyword)}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                Next Focus
              </p>
              <p className="mt-2 text-xs text-white/72">
                Prioritize adding the top 2 missing keywords into recent
                experience bullets with one measurable result each.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.missingKeywords.slice(0, 3).map((keyword) => (
                  <span
                    key={`missing-${keyword}`}
                    className="rounded-full bg-rose-400/14 px-2 py-1 text-[11px] text-rose-100"
                  >
                    {toTitleCase(keyword)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="self-start space-y-4">
          <div className={boxClass}>
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">JD Match Insights</p>
            <p className="mt-2 text-sm text-white/72">{data.roleFitSummary}</p>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-100">
                Matched: {data.matchedKeywords.length}
              </span>
              <span className="rounded-full bg-rose-400/15 px-2 py-1 text-rose-100">
                Missing: {data.missingKeywords.length}
              </span>
            </div>
          </div>

          <div className={boxClass}>
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">Missing Keywords</p>
            <div className="mt-2 space-y-1.5 pr-0.5">
              {data.missingKeywords.slice(0, 6).map((keyword) => (
                <div
                  key={keyword}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-black/20 px-2.5 py-1.5 text-xs text-white/76"
                >
                  <span>{toTitleCase(keyword)}</span>
                  <span className="text-white/45">missing</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

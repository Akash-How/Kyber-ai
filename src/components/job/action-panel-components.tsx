"use client";

import { cn } from "@/lib/utils";
import { useTamboComponentState } from "@tambo-ai/react";
import { Check, Info, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { z } from "zod";

const panelBase =
  "rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.28)]";

const chipBase =
  "rounded-full border px-2.5 py-1 text-xs transition hover:opacity-90";

export const jobKeywordExtractorSchema = z.object({
  title: z.string().optional(),
  keywords: z.array(z.string()),
});

export const JobKeywordExtractor = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof jobKeywordExtractorSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ title = "Job Keywords", keywords = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ selected: string[] }>(
    "action.keyword-extractor",
    { selected: [] },
  );

  const selected = state?.selected ?? [];

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">{title}</p>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0, 18).map((keyword) => {
          const active = selected.includes(keyword);
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                const next = active
                  ? selected.filter((k) => k !== keyword)
                  : [...selected, keyword];
                setState({ selected: next });
              }}
              className={cn(
                chipBase,
                active
                  ? "border-cyan-300/40 bg-cyan-400/20 text-cyan-100"
                  : "border-white/20 bg-black/20 text-white/75",
              )}
            >
              {keyword}
            </button>
          );
        })}
      </div>
    </div>
  );
});
JobKeywordExtractor.displayName = "JobKeywordExtractor";

export const atsScoreBarSchema = z.object({
  score: z.number().min(0).max(100),
  reasoning: z.string().optional(),
});

export const ATSScoreBar = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof atsScoreBarSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ score = 0, reasoning, className, ...props }, ref) => {
  const [displayScore, setDisplayScore] = React.useState(0);

  React.useEffect(() => {
    const target = Math.max(0, Math.min(100, score));
    const start = displayScore;
    const duration = 900;
    const startTs = performance.now();

    let raf = 0;
    const step = (ts: number) => {
      const elapsed = ts - startTs;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(start + (target - start) * eased);
      setDisplayScore(next);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">ATS Score</p>
        <p className="text-sm font-semibold text-white">{displayScore}/100</p>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-300"
          initial={{ width: "4%" }}
          animate={{ width: `${Math.max(4, Math.min(score, 100))}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      {reasoning && <p className="mt-2 text-xs text-white/70">{reasoning}</p>}
    </div>
  );
});
ATSScoreBar.displayName = "ATSScoreBar";

const skillItemSchema = z.object({
  skill: z.string(),
  importance: z.number().min(1).max(10).optional(),
});

export const skillGapListSchema = z.object({
  missingSkills: z.array(skillItemSchema),
});

export const SkillGapList = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof skillGapListSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ missingSkills = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{
    have: string[];
    ignore: string[];
  }>("action.skill-gap", { have: [], ignore: [] });

  const have = state?.have ?? [];
  const ignore = state?.ignore ?? [];

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Skill Gap</p>
      <div className="space-y-2">
        {missingSkills.slice(0, 8).map(({ skill, importance = 5 }) => (
          <div key={skill} className="rounded-lg border border-white/10 bg-black/20 p-2">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-white/90">{skill}</span>
              <span className="text-white/50">P{importance}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setState({
                    have: have.includes(skill) ? have.filter((s) => s !== skill) : [...have, skill],
                    ignore,
                  })
                }
                className={cn(
                  "rounded-md px-2 py-1 text-xs",
                  have.includes(skill)
                    ? "bg-emerald-400/20 text-emerald-100"
                    : "bg-white/10 text-white/70",
                )}
              >
                Have this
              </button>
              <button
                type="button"
                onClick={() =>
                  setState({
                    have,
                    ignore: ignore.includes(skill) ? ignore.filter((s) => s !== skill) : [...ignore, skill],
                  })
                }
                className={cn(
                  "rounded-md px-2 py-1 text-xs",
                  ignore.includes(skill)
                    ? "bg-amber-400/20 text-amber-100"
                    : "bg-white/10 text-white/70",
                )}
              >
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
SkillGapList.displayName = "SkillGapList";

const rewriteItemSchema = z.object({
  id: z.string(),
  original: z.string(),
  rewrite: z.string(),
});

export const rewriteSuggestionsSchema = z.object({
  suggestions: z.array(rewriteItemSchema),
});

export const RewriteSuggestions = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof rewriteSuggestionsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ suggestions = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ accepted: string[] }>(
    "action.rewrite-suggestions",
    { accepted: [] },
  );
  const accepted = state?.accepted ?? [];

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Rewrite Suggestions</p>
      <div className="space-y-2">
        {suggestions.slice(0, 4).map((item) => {
          const isAccepted = accepted.includes(item.id);
          return (
            <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-2">
              <p className="line-clamp-2 text-xs text-white/55">{item.original}</p>
              <p className="mt-1 line-clamp-3 text-xs text-cyan-100">{item.rewrite}</p>
              <button
                type="button"
                onClick={() =>
                  setState({
                    accepted: isAccepted
                      ? accepted.filter((id) => id !== item.id)
                      : [...accepted, item.id],
                  })
                }
                className={cn(
                  "mt-2 rounded-md px-2 py-1 text-xs",
                  isAccepted
                    ? "bg-emerald-400/20 text-emerald-100"
                    : "bg-white/10 text-white/75",
                )}
              >
                {isAccepted ? "Accepted" : "Accept"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});
RewriteSuggestions.displayName = "RewriteSuggestions";

export const toneSliderSchema = z.object({
  value: z.number().min(0).max(100).optional(),
});

export const ToneSlider = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof toneSliderSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ value = 50, className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ value: number }>(
    "action.tone-slider",
    { value },
  );
  const slider = state?.value ?? value;

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Tone</p>
      <input
        type="range"
        min={0}
        max={100}
        value={slider}
        onChange={(e) => setState({ value: Number(e.target.value) })}
        className="w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-white/60">
        <span>Formal</span>
        <span>Friendly</span>
        <span>Confident</span>
      </div>
    </div>
  );
});
ToneSlider.displayName = "ToneSlider";

export const stylePresetPickerSchema = z.object({
  presets: z.array(z.string()),
});

export const StylePresetPicker = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof stylePresetPickerSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ presets = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ selected: string }>(
    "action.style-preset",
    { selected: presets[0] ?? "Balanced" },
  );
  const selected = state?.selected ?? presets[0] ?? "Balanced";

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Style Preset</p>
      <div className="flex flex-wrap gap-2">
        {presets.slice(0, 6).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setState({ selected: preset })}
            className={cn(
              chipBase,
              preset === selected
                ? "border-cyan-300/40 bg-cyan-400/20 text-cyan-100"
                : "border-white/20 bg-black/20 text-white/75",
            )}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
});
StylePresetPicker.displayName = "StylePresetPicker";

export const openingParagraphRefinerSchema = z.object({
  options: z.array(z.string()),
});

export const OpeningParagraphRefiner = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof openingParagraphRefinerSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ options = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Opening Refiner</p>
      <div className="space-y-2">
        {options.slice(0, 3).map((option, index) => (
          <div key={`${index}-${option}`} className="rounded-lg border border-white/10 bg-black/20 p-2 text-xs text-white/80 line-clamp-3">
            {option}
          </div>
        ))}
      </div>
    </div>
  );
});
OpeningParagraphRefiner.displayName = "OpeningParagraphRefiner";

export const missingKeywordsListSchema = z.object({
  keywords: z.array(z.string()),
});

export const MissingKeywordsList = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof missingKeywordsListSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ keywords = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Missing Keywords</p>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0, 16).map((keyword) => (
          <span key={keyword} className="rounded-full border border-rose-300/30 bg-rose-400/10 px-2 py-1 text-xs text-rose-100">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
});
MissingKeywordsList.displayName = "MissingKeywordsList";

export const atsWarningsSchema = z.object({
  warnings: z.array(z.string()),
});

export const ATSWarnings = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof atsWarningsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ warnings = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">ATS Warnings</p>
      <div className="space-y-2">
        {warnings.slice(0, 5).map((warning) => (
          <div key={warning} className="flex items-start gap-2 rounded-lg border border-amber-300/25 bg-amber-300/10 p-2 text-xs text-amber-100">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5" />
            <span>{warning}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
ATSWarnings.displayName = "ATSWarnings";

export const impactBulletGeneratorSchema = z.object({
  bullets: z.array(z.string()),
});

export const ImpactBulletGenerator = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof impactBulletGeneratorSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ bullets = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Impact Bullets</p>
      <ul className="space-y-2 text-xs text-white/80">
        {bullets.slice(0, 5).map((bullet) => (
          <li key={bullet} className="rounded-lg border border-white/10 bg-black/20 p-2">
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
});
ImpactBulletGenerator.displayName = "ImpactBulletGenerator";

export const metricsSuggestionPanelSchema = z.object({
  metrics: z.array(z.string()),
});

export const MetricsSuggestionPanel = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof metricsSuggestionPanelSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ metrics = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Metrics Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {metrics.slice(0, 10).map((metric) => (
          <span key={metric} className="rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
            {metric}
          </span>
        ))}
      </div>
    </div>
  );
});
MetricsSuggestionPanel.displayName = "MetricsSuggestionPanel";

export const actionVerbBoosterSchema = z.object({
  verbs: z.array(z.string()),
});

export const ActionVerbBooster = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof actionVerbBoosterSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ verbs = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Action Verb Booster</p>
      <div className="flex flex-wrap gap-2">
        {verbs.slice(0, 14).map((verb) => (
          <span key={verb} className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">
            {verb}
          </span>
        ))}
      </div>
    </div>
  );
});
ActionVerbBooster.displayName = "ActionVerbBooster";

export const exportOptionsSchema = z.object({
  docTitle: z.string().optional(),
  textToCopy: z.string().optional(),
});

export const ExportOptions = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof exportOptionsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ docTitle = "Document", textToCopy = "", className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ copied: boolean }>(
    "action.export-options",
    { copied: false },
  );

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Export</p>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className="rounded-md bg-white/10 px-2 py-2 text-xs text-white/80">PDF</button>
        <button type="button" className="rounded-md bg-white/10 px-2 py-2 text-xs text-white/80">DOCX</button>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(textToCopy || docTitle);
            setState({ copied: true });
            setTimeout(() => setState({ copied: false }), 1200);
          }}
          className="rounded-md bg-white/10 px-2 py-2 text-xs text-white/80"
        >
          {state?.copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1 text-[11px] text-white/55">
        {state?.copied ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
        <span>{docTitle}</span>
      </div>
    </div>
  );
});
ExportOptions.displayName = "ExportOptions";

const checklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const finalChecklistSchema = z.object({
  items: z.array(checklistItemSchema),
});

export const FinalChecklist = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof finalChecklistSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ items = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ done: string[] }>(
    "action.final-checklist",
    { done: [] },
  );
  const done = state?.done ?? [];

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Final Checklist</p>
      <div className="space-y-2">
        {items.slice(0, 8).map((item) => {
          const checked = done.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setState({
                  done: checked ? done.filter((id) => id !== item.id) : [...done, item.id],
                })
              }
              className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-left text-xs text-white/80"
            >
              <span className={cn("h-3.5 w-3.5 rounded border", checked ? "bg-emerald-300/70 border-emerald-200" : "border-white/40")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
FinalChecklist.displayName = "FinalChecklist";

const formattingRowSchema = z.object({
  label: z.string(),
  status: z.enum(["ok", "warning"]),
});

export const formattingPreviewSchema = z.object({
  rows: z.array(formattingRowSchema),
});

export const FormattingPreview = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof formattingPreviewSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ rows = [], className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Formatting Preview</p>
      <div className="space-y-2">
        {rows.slice(0, 6).map((row) => (
          <div key={`${row.label}-${row.status}`} className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-xs">
            <span className="text-white/80">{row.label}</span>
            <span className={cn("rounded px-1.5 py-0.5", row.status === "ok" ? "bg-emerald-400/20 text-emerald-100" : "bg-amber-300/20 text-amber-100")}>
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
FormattingPreview.displayName = "FormattingPreview";


export const jdMatchInsightsSchema = z.object({
  matchedKeywords: z.array(z.string()),
  missingKeywordsCount: z.number(),
  roleFitSummary: z.string(),
  hasJobDescription: z.boolean().optional(),
  ctaText: z.string().optional(),
});

export const JDMatchInsights = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof jdMatchInsightsSchema> & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      matchedKeywords = [],
      missingKeywordsCount = 0,
      roleFitSummary,
      hasJobDescription = false,
      ctaText = "Paste Job Description to improve accuracy",
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(panelBase, className)} {...props}>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">JD Match Insights</p>
        <p className="text-xs text-white/75">{roleFitSummary}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-emerald-200">Matched: {matchedKeywords.length}</span>
          <span className="text-rose-200">Missing: {missingKeywordsCount}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {matchedKeywords.slice(0, 8).map((keyword) => (
            <span key={keyword} className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[11px] text-emerald-100">
              {keyword}
            </span>
          ))}
        </div>
        {!hasJobDescription && (
          <div className="mt-3 rounded-md border border-amber-300/25 bg-amber-300/10 px-2 py-1.5 text-[11px] text-amber-100">
            {ctaText}
          </div>
        )}
      </div>
    );
  },
);
JDMatchInsights.displayName = "JDMatchInsights";

export const missingKeywordsSchema = z.object({
  keywords: z.array(z.string()),
});

export const MissingKeywords = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof missingKeywordsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ keywords = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ highlighted: string[] }>(
    "action.missing-keywords",
    { highlighted: [] },
  );
  const highlighted = state?.highlighted ?? [];

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Missing Keywords</p>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0, 18).map((keyword, index) => {
          const active = highlighted.includes(keyword);
          return (
            <motion.button
              key={keyword}
              type="button"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.025, ease: "easeOut" }}
              onClick={() => {
                const next = active
                  ? highlighted.filter((k) => k !== keyword)
                  : [...highlighted, keyword];
                setState({ highlighted: next });
              }}
              className={cn(
                "rounded-full border px-2 py-1 text-xs",
                active
                  ? "border-cyan-300/40 bg-cyan-400/20 text-cyan-100"
                  : "border-rose-300/30 bg-rose-400/10 text-rose-100",
              )}
            >
              {keyword}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-white/50">Click a chip to mark where it should appear in your resume/cover letter.</p>
    </div>
  );
});
MissingKeywords.displayName = "MissingKeywords";

export const rewriteOptionsSchema = z.object({
  options: z.array(z.string()),
});

export const RewriteOptions = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof rewriteOptionsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ options = [], className, ...props }, ref) => {
  const [state, setState] = useTamboComponentState<{ selected: string | null }>(
    "action.rewrite-options",
    { selected: null },
  );

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Rewrite Options</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {options.slice(0, 3).map((option) => {
          const active = state?.selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setState({ selected: option })}
              className={cn(
                "rounded-md px-2 py-2 text-xs",
                active
                  ? "border border-cyan-300/40 bg-cyan-400/20 text-cyan-100"
                  : "border border-white/15 bg-black/20 text-white/80",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
});
RewriteOptions.displayName = "RewriteOptions";

export const measurableImpactSuggestionsSchema = z.object({
  suggestions: z.array(z.string()),
});

export const MeasurableImpactSuggestions = React.forwardRef<
  HTMLDivElement,
  z.infer<typeof measurableImpactSuggestionsSchema> & React.HTMLAttributes<HTMLDivElement>
>(({ suggestions = [], className, ...props }, ref) => {
  const compactItems =
    (suggestions.length > 0 ? suggestions : [
      "Add one clear metric (%, $, time saved).",
      "Show scale: users, requests, regions, or teams.",
      "State business impact in one short line.",
    ])
      .slice(0, 3)
      .map((item) => (item.length > 96 ? `${item.slice(0, 93)}...` : item));

  return (
    <div ref={ref} className={cn(panelBase, className)} {...props}>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/55">Impact Focus</p>
      <ul className="space-y-1.5 text-xs text-white/78">
        {compactItems.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-black/15 px-2.5 py-2"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300/70" />
            <span className="line-clamp-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
MeasurableImpactSuggestions.displayName = "MeasurableImpactSuggestions";


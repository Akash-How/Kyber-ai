"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, CircleAlert } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const atsScoreCardSchema = z.object({
  score: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  matchedKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type ATSScoreCardProps = z.infer<typeof atsScoreCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

const scoreTone = (score: number) => {
  if (score >= 80) return "text-emerald-300";
  if (score >= 60) return "text-amber-300";
  return "text-rose-300";
};

export const ATSScoreCard = React.forwardRef<HTMLDivElement, ATSScoreCardProps>(
  (
    { score, missingKeywords, matchedKeywords, recommendations, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
          className,
        )}
        {...props}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">ATS Match</p>
        <div className="mt-1 flex items-end gap-2">
          <span className={cn("text-5xl font-semibold", scoreTone(score))}>{score}</span>
          <span className="pb-2 text-sm text-white/60">/100</span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-200">Matched Keywords</p>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.slice(0, 12).map((k) => (
                <span key={k} className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-rose-200">Missing Keywords</p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.slice(0, 12).map((k) => (
                <span key={k} className="rounded-full border border-rose-300/30 bg-rose-400/10 px-2 py-1 text-xs text-rose-100">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {recommendations.slice(0, 4).map((r, idx) => (
            <div key={`${idx}-${r}`} className="flex gap-2 text-sm text-white/80">
              {idx === 0 ? (
                <CircleAlert className="mt-0.5 h-4 w-4 text-amber-300" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
              )}
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

ATSScoreCard.displayName = "ATSScoreCard";

export default ATSScoreCard;

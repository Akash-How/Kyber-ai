"use client";

import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const resumeSummaryCardSchema = z.object({
  name: z.string(),
  email: z.string(),
  headline: z.string(),
  summary: z.string(),
});

export type ResumeSummaryCardProps = z.infer<typeof resumeSummaryCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const ResumeSummaryCard = React.forwardRef<HTMLDivElement, ResumeSummaryCardProps>(
  ({ name, email, headline, summary, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-cyan-300/15 p-2">
            <UserRound className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white">{name}</h3>
            <p className="text-sm text-white/65">{email}</p>
            <p className="mt-1 text-sm text-cyan-100">{headline}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/80">{summary}</p>
      </div>
    );
  },
);

ResumeSummaryCard.displayName = "ResumeSummaryCard";

export default ResumeSummaryCard;

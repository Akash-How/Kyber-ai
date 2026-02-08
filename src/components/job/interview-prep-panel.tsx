"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string(),
  sampleAnswer: z.string(),
});

export const interviewPrepPanelSchema = z.object({
  role: z.string(),
  questions: z.array(questionSchema),
});

export type InterviewPrepPanelProps = z.infer<typeof interviewPrepPanelSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const InterviewPrepPanel = React.forwardRef<
  HTMLDivElement,
  InterviewPrepPanelProps
>(({ role, questions, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
        className,
      )}
      {...props}
    >
      <h3 className="text-xl font-semibold text-white">Interview Prep</h3>
      <p className="mt-1 text-sm text-white/65">Role: {role}</p>

      <div className="mt-4 space-y-3">
        {questions.slice(0, 6).map((q, idx) => (
          <article key={`${idx}-${q.question}`} className="rounded-xl border border-white/15 bg-black/25 p-3">
            <h4 className="text-sm font-medium text-cyan-100">Q{idx + 1}. {q.question}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{q.sampleAnswer}</p>
          </article>
        ))}
      </div>
    </div>
  );
});

InterviewPrepPanel.displayName = "InterviewPrepPanel";

export default InterviewPrepPanel;

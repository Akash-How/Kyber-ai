"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

export const skillsGapPanelSchema = z.object({
  missingSkills: z.array(z.string()),
  prioritySkills: z.array(z.string()),
  roadmapSteps: z.array(z.string()),
});

export type SkillsGapPanelProps = z.infer<typeof skillsGapPanelSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const SkillsGapPanel = React.forwardRef<HTMLDivElement, SkillsGapPanelProps>(
  ({ missingSkills, prioritySkills, roadmapSteps, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
          className,
        )}
        {...props}
      >
        <h3 className="text-xl font-semibold text-white">Skills Gap Analysis</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <section>
            <p className="mb-2 text-sm font-medium text-rose-200">Missing Skills</p>
            <ul className="space-y-2 text-sm text-white/80">
              {missingSkills.slice(0, 10).map((skill) => (
                <li key={skill} className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <p className="mb-2 text-sm font-medium text-cyan-200">Priority Skills</p>
            <ul className="space-y-2 text-sm text-white/80">
              {prioritySkills.slice(0, 10).map((skill) => (
                <li key={skill} className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-3 py-2">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-5">
          <p className="mb-2 text-sm font-medium text-white/80">Roadmap</p>
          <ol className="space-y-2 text-sm text-white/75">
            {roadmapSteps.slice(0, 6).map((step, idx) => (
              <li key={`${idx}-${step}`} className="rounded-lg border border-white/15 bg-black/25 px-3 py-2">
                {idx + 1}. {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    );
  },
);

SkillsGapPanel.displayName = "SkillsGapPanel";

export default SkillsGapPanel;

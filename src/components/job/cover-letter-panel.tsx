"use client";

import { cn } from "@/lib/utils";
import { useTamboComponentState } from "@tambo-ai/react";
import * as React from "react";
import { z } from "zod";

export const coverLetterPanelSchema = z.object({
  company: z.string(),
  role: z.string(),
  coverLetterText: z.string(),
});

type CoverLetterPanelState = {
  draft: string;
};

export type CoverLetterPanelProps = z.infer<typeof coverLetterPanelSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const CoverLetterPanel = React.forwardRef<HTMLDivElement, CoverLetterPanelProps>(
  ({ company, role, coverLetterText, className, ...props }, ref) => {
    const [state, setState] = useTamboComponentState<CoverLetterPanelState>(
      "jedi-hire.cover-letter",
      { draft: coverLetterText },
    );

    React.useEffect(() => {
      if (!state?.draft) {
        setState({ draft: coverLetterText });
      }
    }, [coverLetterText, setState, state?.draft]);

    const draft = state?.draft ?? coverLetterText;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
          className,
        )}
        {...props}
      >
        <h3 className="text-xl font-semibold text-white">Cover Letter</h3>
        <p className="mt-1 text-sm text-white/65">
          {role} at {company}
        </p>
        <textarea
          value={draft}
          onChange={(e) => setState({ draft: e.target.value })}
          className="mt-4 h-72 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-sm leading-relaxed text-white/85 outline-none placeholder:text-white/30"
        />
      </div>
    );
  },
);

CoverLetterPanel.displayName = "CoverLetterPanel";

export default CoverLetterPanel;

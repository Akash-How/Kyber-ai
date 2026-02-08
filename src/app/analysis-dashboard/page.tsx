"use client";

import AnalysisDashboard from "@/components/job/analysis-dashboard";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import Atmosphere from "@/components/ui/atmosphere";
import { loadAnalysisSession } from "@/lib/analysis-session";
import { components, tools } from "@/lib/tambo";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

const QUICK_ACTIONS = [
  {
    label: "Keywords",
    prompt:
      "Show missing keywords and keyword fixes. Render MissingKeywordsList.",
  },
  {
    label: "Rewrite",
    prompt: "Rewrite my summary confidently. Render RewriteOptions.",
  },
  {
    label: "Export",
    prompt: "Prepare export. Render ExportOptions + FinalChecklist + FormattingPreview.",
  },
];

function DashboardShell() {
  const router = useRouter();
  const { thread, sendThreadMessage, isIdle } = useTamboThread();
  const [session, setSession] = React.useState<ReturnType<typeof loadAnalysisSession>>(null);
  const [processing, setProcessing] = React.useState(false);
  const [command, setCommand] = React.useState("");
  const hasAutoTriggeredRef = React.useRef(false);
  const processingTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setSession(loadAnalysisSession());
  }, []);

  React.useEffect(() => {
    if (!session || hasAutoTriggeredRef.current || !isIdle) return;
    hasAutoTriggeredRef.current = true;
    setProcessing(true);

    const prompt = [
      "Generate action panel insights from this resume and job description.",
      "Render ATSScoreBar + JDMatchInsights + MissingKeywords + ToneSlider + RewriteOptions + MeasurableImpactSuggestions.",
      "",
      "Resume:",
      session.resumeText,
      "",
      "Job Description:",
      session.jobDescriptionText ||
        "No job description provided. Use inferred ATS suggestions and include a CTA to paste JD.",
    ].join("\n");

    void sendThreadMessage(prompt, { streamResponse: true }).finally(() => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
      processingTimeoutRef.current = window.setTimeout(
        () => setProcessing(false),
        400,
      );
    });
  }, [isIdle, sendThreadMessage, session]);

  const activePanel =
    [...thread.messages].reverse().find((m) => Boolean(m.renderedComponent))
      ?.renderedComponent ?? null;

  const submitCommand = React.useCallback(async () => {
    const text = command.trim();
    if (!text || !isIdle) return;
    setProcessing(true);
    setCommand("");
    await sendThreadMessage(text, { streamResponse: true }).finally(() => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
      processingTimeoutRef.current = window.setTimeout(
        () => setProcessing(false),
        350,
      );
    });
  }, [command, isIdle, sendThreadMessage]);

  React.useEffect(
    () => () => {
      if (processingTimeoutRef.current) {
        window.clearTimeout(processingTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <Atmosphere variant="studio" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1200px] px-5 py-4 md:px-7 md:py-5"
      >
        <header className="mb-5 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/74 hover:text-white">
            Home
          </Link>
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="rounded-lg border border-white/15 bg-white/6 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
          >
            Open Chat
          </button>
        </header>

        {!session ? (
          <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 text-sm text-white/74 backdrop-blur-xl">
            Upload a resume to generate your ATS dashboard and actions.
          </div>
        ) : (
          <div className="grid items-start gap-3.5 lg:grid-cols-[1.4fr_0.6fr]">
            <section className="h-[calc(100vh-8.5rem)] overflow-hidden rounded-3xl border border-white/12 bg-black/28 p-3.5 backdrop-blur-xl">
              <div className="h-full overflow-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(167,139,250,0.32)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-300/28 hover:[&::-webkit-scrollbar-thumb]:bg-violet-300/45 [&::-webkit-scrollbar-corner]:bg-transparent">
                <AnalysisDashboard
                  resumeText={session.resumeText}
                  jobDescriptionText={session.jobDescriptionText}
                />
              </div>
            </section>

            <section className="relative h-[calc(100vh-8.5rem)] overflow-hidden rounded-3xl border border-white/12 bg-black/30 p-3.5 md:p-4 backdrop-blur-xl">
              <div className="h-full overflow-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(167,139,250,0.32)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-300/28 hover:[&::-webkit-scrollbar-thumb]:bg-violet-300/45 [&::-webkit-scrollbar-corner]:bg-transparent">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">
                  Generative Action Panel
                </h2>
                <AnimatePresence>
                  {(processing || !isIdle) && (
                    <motion.div
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/55"
                    >
                      <motion.span
                        className="h-1.5 w-1.5 rounded-full bg-violet-300/70"
                        animate={{ opacity: [0.35, 0.9, 0.35] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      Analyzing
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.16em] text-white/52">Ask Kyber</p>
                <div className="flex items-center gap-2">
                  <input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void submitCommand();
                      }
                    }}
                    placeholder="Show missing keywords - Rewrite my summary confidently - Generate impact bullets - Export final version"
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white/85 placeholder:text-white/38 focus:border-violet-300/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void submitCommand()}
                    disabled={!isIdle || !command.trim()}
                    className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-xs text-white/84 hover:bg-white/14 disabled:opacity-45"
                  >
                    Ask
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {activePanel ? (
                  <motion.div
                    key={`analysis-panel-${thread.messages.length}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32 }}
                  >
                    {activePanel}
                  </motion.div>
                ) : (
                  <div className="rounded-2xl border border-violet-300/25 bg-violet-300/10 p-4 text-sm text-violet-100">
                    Upload a resume to generate your ATS dashboard and actions.
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-white/48">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      disabled={!isIdle}
                      onClick={() => void sendThreadMessage(item.prompt, { streamResponse: true })}
                      className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/80 transition hover:-translate-y-px hover:border-white/22 hover:text-white disabled:opacity-45"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              </div>
            </section>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function AnalysisDashboardPage() {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <DashboardShell />
    </TamboProvider>
  );
}


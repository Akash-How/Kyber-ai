"use client";

import Atmosphere from "@/components/ui/atmosphere";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { saveAnalysisSession } from "@/lib/analysis-session";
import { components, tools } from "@/lib/tambo";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";

const RIGHT_PANEL_ACTIONS = [
  {
    label: "ATS Optimize",
    prompt:
      "Optimize this resume for ATS. Render ATSScoreBar + MissingKeywordsList + ATSWarnings.",
  },
  {
    label: "Tailor for Google SWE",
    prompt:
      "Tailor for Google SWE role. Render JobKeywordExtractor + SkillGapList + RewriteSuggestions.",
  },
  {
    label: "Tone: Confident",
    prompt:
      "Improve tone to confident. Render ToneSlider + StylePresetPicker + OpeningParagraphRefiner.",
  },
  {
    label: "Add Impact",
    prompt:
      "Add measurable impact bullets. Render ImpactBulletGenerator + MetricsSuggestionPanel + ActionVerbBooster.",
  },
  {
    label: "Finalize",
    prompt:
      "Finalize now. Render FinalChecklist + FormattingPreview + ExportOptions.",
  },
];

const RECOMMENDED_FLOW = [
  "Upload Resume",
  "ATS Optimize",
  "Add Impact",
  "Finalize",
];

function ChatDisclaimerStrip() {
  return (
    <motion.div
      initial={{ opacity: 0.45, y: 0 }}
      animate={{ opacity: 0.45, y: 0 }}
      whileHover={{ opacity: 0.85 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="pointer-events-auto absolute bottom-0 left-1/2 z-[60] w-max -translate-x-1/2 select-none text-xs font-medium leading-none tracking-normal text-white/45 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
    >
      Powered by Tambo, caffeine, and mild panic. Akash®
    </motion.div>
  );
}

function ActionPanelSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="h-16 rounded-xl border border-white/10 bg-white/5"
        >
          <div className="h-full w-full animate-pulse rounded-xl bg-[linear-gradient(100deg,rgba(255,255,255,0.02)_20%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.02)_80%)]" />
        </div>
      ))}
    </div>
  );
}

function ChatShell() {
  const { thread, sendThreadMessage, isIdle } = useTamboThread();
  const router = useRouter();
  const [demoToastVisible, setDemoToastVisible] = React.useState(false);
  const demoNavigateTimeoutRef = React.useRef<number | null>(null);

  const actionPanels = [...thread.messages]
    .reverse()
    .filter((m) => Boolean(m.renderedComponent))
    .slice(0, 4)
    .map((m) => m.renderedComponent);

  const [panelProgressVisible, setPanelProgressVisible] = React.useState(false);
  const [progressCycle, setProgressCycle] = React.useState(0);
  const previousIdleRef = React.useRef(isIdle);

  React.useEffect(() => {
    if (previousIdleRef.current && !isIdle) {
      setPanelProgressVisible(true);
      setProgressCycle((v) => v + 1);
    }

    if (!previousIdleRef.current && isIdle) {
      const timeout = setTimeout(() => setPanelProgressVisible(false), 400);
      previousIdleRef.current = isIdle;
      return () => clearTimeout(timeout);
    }

    previousIdleRef.current = isIdle;
    return undefined;
  }, [isIdle]);

  React.useEffect(() => {
    const onDemoMode = (event: Event) => {
      const detail = (event as CustomEvent<{
        resumeText: string;
        jobDescriptionText: string;
      }>).detail;
      if (!detail?.resumeText || !detail?.jobDescriptionText) return;
      saveAnalysisSession({
        resumeText: detail.resumeText,
        jobDescriptionText: detail.jobDescriptionText,
        source: "demo",
        updatedAt: Date.now(),
      });
      setDemoToastVisible(true);
      if (demoNavigateTimeoutRef.current) {
        window.clearTimeout(demoNavigateTimeoutRef.current);
      }
      demoNavigateTimeoutRef.current = window.setTimeout(
        () => router.push("/analysis-dashboard"),
        180,
      );
    };

    window.addEventListener("jedi-hire:demo-mode", onDemoMode as EventListener);
    return () =>
      window.removeEventListener(
        "jedi-hire:demo-mode",
        onDemoMode as EventListener,
      );
  }, [router]);

  React.useEffect(
    () => () => {
      if (demoNavigateTimeoutRef.current) {
        window.clearTimeout(demoNavigateTimeoutRef.current);
      }
    },
    [],
  );

  React.useEffect(() => {
    const onResumeUploaded = (event: Event) => {
      const detail = (event as CustomEvent<{ resumeText?: string; jobDescriptionText?: string }>).detail;
      if (!detail?.resumeText) return;
      saveAnalysisSession({
        resumeText: detail.resumeText,
        jobDescriptionText: detail.jobDescriptionText,
        source: "upload",
        updatedAt: Date.now(),
      });
      router.push("/analysis-dashboard");
    };

    window.addEventListener("kyber:resume-uploaded", onResumeUploaded as EventListener);
    return () =>
      window.removeEventListener(
        "kyber:resume-uploaded",
        onResumeUploaded as EventListener,
      );
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <Atmosphere variant="chat" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1380px] px-6 py-8 md:px-10"
      >
        <header className="mb-6 flex items-center">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Home
          </Link>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/50">Recommended Flow</span>
          {RECOMMENDED_FLOW.map((step, index) => (
            <React.Fragment key={step}>
              <span className="rounded-full border border-white/20 bg-white/8 px-2.5 py-1 text-[11px] text-white/75">
                {step}
              </span>
              {index < RECOMMENDED_FLOW.length - 1 && (
                <span className="text-white/35">-&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="h-[82vh] overflow-hidden rounded-3xl border border-white/15 bg-black/28 backdrop-blur-xl">
            <MessageThreadFull className="h-full max-w-none" />
          </section>

          <section className="relative h-[82vh] overflow-auto rounded-3xl border border-white/15 bg-black/30 p-4 backdrop-blur-xl">
            <AnimatePresence>
              {panelProgressVisible && (
                <motion.div
                  key={`progress-shell-${progressCycle}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isIdle ? 0 : 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-[2px] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-violet-300/35" />
                  <motion.div
                    className="absolute top-0 h-full w-28 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(221,214,254,0.85)_50%,rgba(255,255,255,0)_100%)] blur-[0.4px]"
                    initial={{ x: "-30%" }}
                    animate={{ x: ["-30%", "130%"] }}
                    transition={{
                      duration: 1.15,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/45">
              AI Action Panel
            </h2>

            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              {RIGHT_PANEL_ACTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  disabled={!isIdle}
                  onClick={() =>
                    void sendThreadMessage(item.prompt, { streamResponse: true })
                  }
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-xs text-white/85 transition hover:bg-white/16 disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {!isIdle && actionPanels.length === 0 && <ActionPanelSkeleton />}

              {actionPanels.length > 0 ? (
                actionPanels.map((panel, index) => (
                  <motion.div
                    key={`panel-${thread.messages.length}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                  >
                    {panel}
                  </motion.div>
                ))
              ) : isIdle ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-violet-300/25 bg-violet-300/10 p-4 text-sm text-violet-100">
                    Upload a resume to generate your ATS dashboard and actions.
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </motion.div>
      <AnimatePresence>
        {demoToastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-6 left-6 z-[65] rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-xs text-white/82 backdrop-blur-md"
          >
            Loaded demo resume. Generating ATS insights...
          </motion.div>
        )}
      </AnimatePresence>
      <ChatDisclaimerStrip />
    </main>
  );
}

export default function ChatPage() {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <ChatShell />
    </TamboProvider>
  );
}

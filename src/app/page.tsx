import Atmosphere from "@/components/ui/atmosphere";
import HeroShowcase from "@/components/ui/hero-showcase";
import KyberBrand from "@/components/ui/kyber-brand";
import {
  CheckCircle2,
  Gauge,
  History,
  Layers2,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Target,
  WandSparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Gauge,
    title: "ATS Match Score",
    description:
      "See how well your resume aligns with each role and follow clear improvement steps.",
  },
  {
    icon: ScanSearch,
    title: "Keyword Coverage",
    description:
      "Extract role keywords and instantly spot what is missing from your resume or letter.",
  },
  {
    icon: Target,
    title: "Impact Bullets",
    description:
      "Convert weak lines into measurable achievements using stronger verbs and metrics.",
  },
  {
    icon: SlidersHorizontal,
    title: "Tone Control",
    description:
      "Move between formal, friendly, and confident tones and regenerate instantly.",
  },
  {
    icon: Layers2,
    title: "Formatting & Structure",
    description:
      "Detect readability issues and structure risks that lower recruiter clarity.",
  },
  {
    icon: WandSparkles,
    title: "Instant Customization",
    description:
      "Tailor your cover letter to any company and role without rewriting from zero.",
  },
  {
    icon: History,
    title: "Version History",
    description:
      "Keep multiple drafts and compare changes so your best version is never lost.",
  },
];

const steps = [
  {
    title: "Upload or Paste",
    description:
      "Add your resume, cover letter, and job description in seconds.",
  },
  {
    title: "Get AI-Guided Optimization",
    description:
      "The AI renders the right tools automatically for ATS, rewrites, tone, and keywords.",
  },
  {
    title: "Finalize & Export",
    description:
      "Select the strongest version, apply changes, and export with confidence.",
  },
];

const featuredFeatureTitles = new Set(["ATS Match Score", "Impact Bullets"]);
const featuredCardDetails: Record<
  string,
  {
    stats: Array<{ label: string; value: string }>;
    bullets: string[];
    chips: string[];
  }
> = {
  "ATS Match Score": {
    stats: [
      { label: "Match Score", value: "82/100" },
      { label: "Missing Keywords", value: "12" },
      { label: "Warnings", value: "3" },
    ],
    bullets: [
      "Role-fit confidence",
      "Keyword coverage insights",
      "ATS risk flags",
      "One-click improvement path",
    ],
    chips: ["Keyword Coverage", "Risk Scan", "JD Fit"],
  },
  "Impact Bullets": {
    stats: [
      { label: "Bullets Generated", value: "5" },
      { label: "Metrics Added", value: "3" },
      { label: "Verb Strength", value: "High" },
    ],
    bullets: [
      "Action-verb upgrades",
      "Metric-first rewrites",
      "Business outcome framing",
      "Before/after quality preview",
    ],
    chips: ["Action Verbs", "Metrics", "Outcome Focus"],
  },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <Atmosphere variant="studio" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-[24px] md:px-10">
        <header className="mb-10 flex items-center">
          <KyberBrand />
        </header>

        <section className="mb-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
              Make your resume and cover letter impossible to ignore.
            </h1>
            <p className="mt-5 max-w-3xl text-base text-white/70 md:text-lg">
              An AI-powered assistant that improves clarity, ATS match, and
              impact using Generative UI with Tambo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="rounded-xl bg-violet-400/95 px-6 py-3 text-sm font-semibold text-black hover:bg-violet-300"
              >
                Analyze My Resume
              </Link>
            </div>
          </div>
          <HeroShowcase />
        </section>

        <section className="mb-14">
          <div className="mb-[22px] max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/65">
              Features
            </p>
            <div className="mt-3 flex items-center gap-2 text-white/90">
              <Sparkles className="h-4 w-4 text-violet-300/80" />
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Everything you need to tailor, score, and ship.
              </h2>
            </div>
            <p className="mt-3 text-sm text-white/68 md:text-base">
              Generative UI renders the right tools based on your intent - no
              complex workflows.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isFeatured = featuredFeatureTitles.has(feature.title);
              const detailConfig = featuredCardDetails[feature.title];
              return (
                <article
                  key={feature.title}
                  className={[
                    "group relative overflow-hidden rounded-2xl border p-4",
                    "transition-all duration-200 ease-out hover:-translate-y-[2px]",
                    "border-white/[0.08] bg-white/[0.05] shadow-[0_14px_36px_rgba(7,10,25,0.18)] hover:border-white/[0.16] hover:shadow-[0_16px_40px_rgba(7,10,25,0.28)]",
                    isFeatured
                      ? "md:col-span-2 xl:col-span-2 border-white/[0.11] bg-white/[0.08] p-[18px]"
                      : "",
                  ].join(" ")}
                >
                  {isFeatured && (
                    <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,rgba(99,102,241,0.06)_46%,rgba(0,0,0,0)_74%)]" />
                  )}
                  <Icon className="h-[18px] w-[18px] text-violet-200/75 transition-colors duration-200 group-hover:text-violet-300" />
                  <h3
                    className={
                      isFeatured ? "mt-3 text-lg font-semibold" : "mt-3 text-base font-semibold"
                    }
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={
                      isFeatured
                        ? "mt-[6px] max-w-2xl text-sm leading-relaxed text-white/78"
                        : "mt-[6px] text-sm leading-relaxed text-white/72"
                    }
                  >
                    {feature.description}
                  </p>
                  {isFeatured && detailConfig && (
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-2 sm:grid-cols-3">
                        {detailConfig.stats.map((stat) => (
                          <div key={stat.label}>
                            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                              {stat.label}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-white/88">
                              {stat.value}
                            </p>
                            {stat.label === "Match Score" && (
                              <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[82%] rounded-full bg-violet-300/70" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {detailConfig.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-white/9 px-2.5 py-1 text-[11px] text-white/70"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      <ul className="grid gap-1.5 sm:grid-cols-2">
                        {detailConfig.bullets.map((item) => (
                          <li key={item} className="flex items-center gap-1.5 text-xs text-white/70">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-violet-200/75" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2 text-white/80">
            <Workflow className="h-4 w-4 text-violet-300" />
            <h2 className="text-lg font-semibold">Workflow</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/14 bg-black/24 p-5"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-400/25 text-xs font-semibold text-violet-100">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/70">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-violet-300/25 bg-violet-400/10 p-7">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Ready to tailor your next application?
              </h2>
              <p className="mt-2 text-white/72">
                Start with a job description and let the UI guide the rest.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/chat"
                className="rounded-xl bg-violet-300 px-5 py-3 text-sm font-semibold text-black hover:bg-violet-200"
              >
                Start Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { saveAnalysisSession } from "@/lib/analysis-session";
import { cn } from "@/lib/utils";
import { DEMO_JOB_DESCRIPTION, DEMO_RESUME_TEXT } from "@/services/demo-data";
import { useTamboComponentState } from "@tambo-ai/react";
import { CheckCircle2, FileText, Loader2, TriangleAlert, Upload } from "lucide-react";
import * as React from "react";
import { z } from "zod";

export const resumeUploaderSchema = z.object({
  title: z.string().optional().describe("Main heading for uploader panel"),
  subtitle: z.string().optional().describe("Subheading shown below title"),
  allowedTypes: z
    .array(z.string())
    .optional()
    .describe("Allowed MIME types, e.g. application/pdf"),
});

export type ResumeUploaderProps = z.infer<typeof resumeUploaderSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export type ResumeUploaderState = {
  fileName: string | null;
  parseStatus: "idle" | "parsing" | "parsed" | "error";
  extractedText: string | null;
  errorMessage: string | null;
};

const initialState: ResumeUploaderState = {
  fileName: null,
  parseStatus: "idle",
  extractedText: null,
  errorMessage: null,
};

const extractPdfText = async (file: File): Promise<string> => {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    // CRITICAL FIX: Configure the worker
    // Option 1: Use CDN worker (recommended for quick fix)
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    
    // Option 2: If you have the worker locally, use:
    // pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    
    const bytes = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjs.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;

    const pages: string[] = [];
    for (let n = 1; n <= pdf.numPages; n += 1) {
      const page = await pdf.getPage(n);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => {
          if ("str" in item && typeof item.str === "string") {
            return item.str;
          }
          return '';
        })
        .join(" ")
        .trim();
      pages.push(pageText);
    }
    return pages.join("\n\n").trim();
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const ResumeUploader = React.forwardRef<HTMLDivElement, ResumeUploaderProps>(
  (
    {
      title = "Upload Resume",
      subtitle = "Drop a resume PDF. The assistant will parse and use it in downstream panels.",
      allowedTypes = ["application/pdf"],
      className,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = useTamboComponentState<ResumeUploaderState>(
      "jedi-hire.resume-uploader",
      initialState,
    );
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = React.useState(false);

    const runDemoMode = React.useCallback(() => {
      saveAnalysisSession({
        resumeText: DEMO_RESUME_TEXT,
        jobDescriptionText: DEMO_JOB_DESCRIPTION,
        source: "demo",
        updatedAt: Date.now(),
      });
      setState({
        fileName: "demo-resume.pdf",
        parseStatus: "parsed",
        extractedText: DEMO_RESUME_TEXT,
        errorMessage: null,
      });

      window.dispatchEvent(
        new CustomEvent("jedi-hire:demo-mode", {
          detail: {
            resumeText: DEMO_RESUME_TEXT,
            jobDescriptionText: DEMO_JOB_DESCRIPTION,
          },
        }),
      );
    }, [setState]);

    const handleFile = React.useCallback(
      async (file?: File) => {
        if (!file) return;
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
          setState({
            fileName: file.name,
            parseStatus: "error",
            extractedText: null,
            errorMessage: `Unsupported type: ${file.type || "unknown"}`,
          });
          return;
        }

        setState({
          fileName: file.name,
          parseStatus: "parsing",
          extractedText: null,
          errorMessage: null,
        });

        try {
          const extractedText =
            file.type === "application/pdf"
              ? await extractPdfText(file)
              : await file.text();

          setState({
            fileName: file.name,
            parseStatus: "parsed",
            extractedText: extractedText || "No readable text found.",
            errorMessage: null,
          });

          const normalizedText = extractedText || "No readable text found.";
          saveAnalysisSession({
            resumeText: normalizedText,
            source: "upload",
            updatedAt: Date.now(),
          });
          window.dispatchEvent(
            new CustomEvent("kyber:resume-uploaded", {
              detail: {
                resumeText: normalizedText,
              },
            }),
          );
        } catch (error) {
          console.error("File handling error:", error);
          setState({
            fileName: file.name,
            parseStatus: "error",
            extractedText: null,
            errorMessage:
              error instanceof Error ? error.message : "Failed to parse resume.",
          });
        }
      },
      [allowedTypes, setState],
    );

    const current = state ?? initialState;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]",
          className,
        )}
        {...props}
      >
        <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "mt-4 rounded-xl border-2 border-dashed p-6 text-center transition",
            dragging ? "border-cyan-300/80 bg-cyan-300/10" : "border-white/20 bg-black/20",
          )}
        >
          <Upload className="mx-auto h-8 w-8 text-white/80" />
          <p className="mt-2 text-sm text-white/80">Drop resume here</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          >
            Select PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(",")}
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <button
          type="button"
          onClick={runDemoMode}
          className="mt-3 text-left text-sm text-white/55 transition hover:text-white/90 hover:underline"
        >
          No file right now? Use a demo resume -&gt;
        </button>

        {current.fileName && (
          <div className="mt-4 rounded-xl border border-white/15 bg-black/30 p-3">
            <div className="flex items-center gap-2 text-sm text-white">
              <FileText className="h-4 w-4 text-cyan-200" />
              <span className="truncate">{current.fileName}</span>
              <span className="ml-auto">
                {current.parseStatus === "parsing" && (
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-200" />
                )}
                {current.parseStatus === "parsed" && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                )}
                {current.parseStatus === "error" && (
                  <TriangleAlert className="h-4 w-4 text-rose-300" />
                )}
              </span>
            </div>

            {current.errorMessage && (
              <p className="mt-2 text-xs text-rose-200">{current.errorMessage}</p>
            )}

            {current.extractedText && (
              <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-white/80">
                {current.extractedText.slice(0, 1800)}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  },
);

ResumeUploader.displayName = "ResumeUploader";

export default ResumeUploader;

import { useEffect, useState } from "react";
import { UploadZone } from "./UploadZone";
import { PreviewPanel } from "./PreviewPanel";
import { ScoreCard } from "./ScoreCard";
import { analyzeScreenshot, type AnalysisResult } from "../lib/api";
import { validateScreenshot } from "../lib/validate";
import { generateDesign, type GeneratedDesign } from "../lib/generation";
import { DesignPreview } from "./DesignPreview";
import type { HistoryItem } from "../lib/history";

export function NewAnalysis({ onUploaded }: { onUploaded: (h: HistoryItem) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [design, setDesign] = useState<GeneratedDesign | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  function accept(f: File) {
    const err = validateScreenshot(f);
    setUploadError(err);
    if (err) return;
    setUrl(URL.createObjectURL(f));
    setFile(f);
    setAnalyzeError(null);
    onUploaded({ id: crypto.randomUUID(), name: f.name, size: f.size, uploadedAt: new Date().toISOString() });
  }

  function reset() {
    setFile(null); setUrl(""); setUploadError(null); setAnalyzeError(null); setLoading(false); setResult(null); setDesign(null); setGenerating(false); setGenerationError(null);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setAnalyzeError(null);
    setResult(null);
    try {
      setResult(await analyzeScreenshot(file));
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    if (!file || !result) return;
    setGenerating(true); setGenerationError(null);
    try { setDesign(await generateDesign(file, result)); }
    catch (e) { setGenerationError(e instanceof Error ? e.message : "Design generation failed."); }
    finally { setGenerating(false); }
  }

  return file ? (
    <div className="space-y-4">
      <PreviewPanel file={file} url={url} loading={loading} error={analyzeError} onAnalyze={analyze} onReset={reset} />
      {result && <>
        <ScoreCard result={result} />
        {!design && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Ready to redesign?</h2><p className="text-sm text-slate-500">Use the screenshot and findings to generate a responsive page.</p></div>
          <button onClick={generate} disabled={generating || result.mode === "demo"} className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">{generating ? "Generating design…" : "Generate Improved Design"}</button></div>
          {result.mode === "demo" && <p className="mt-3 text-sm text-amber-700">Design generation requires a real AI analysis. Demo mode cannot generate a grounded redesign.</p>}
          {generationError && <p role="alert" className="mt-3 text-sm text-red-700">{generationError}</p>}
        </section>}
        {design && <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="font-semibold">Improved design preview</h2><p className="text-sm text-slate-500">Rendered in a sandboxed frame; generated scripts are disabled.</p></div>
          <DesignPreview html={design.html} />
          {design.improvements.length > 0 && <div><h3 className="mb-2 font-medium">Changes made</h3><ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">{design.improvements.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {design.components.length > 0 && <p className="text-xs text-slate-500">{design.components.length} reusable React component source file(s) returned.</p>}
        </section>}
      </>}
    </div>
  ) : (
    <UploadZone onFile={accept} error={uploadError} />
  );
}

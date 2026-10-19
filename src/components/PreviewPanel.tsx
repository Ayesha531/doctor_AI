import { formatSize } from "../lib/validate";

export function PreviewPanel({ file, url, loading, error, onAnalyze, onReset }: {
  file: File; url: string; loading: boolean; error: string | null;
  onAnalyze: () => void; onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold">Screenshot preview</h2>
          <p className="truncate text-sm text-slate-500">{file.name} · {formatSize(file.size)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onReset} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50">
            Start new analysis
          </button>
          <button onClick={onAnalyze} disabled={loading} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {loading ? "Analyzing…" : "Analyze Interface"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-4" role="status">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-brand-500 to-blue-500" />
          </div>
          <p className="mt-2 text-sm text-slate-500">Uploading and analyzing with the vision model — this can take 15–60 seconds…</p>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      )}

      <div className="mt-4 max-h-[60vh] overflow-auto rounded-xl border border-slate-200 bg-slate-100">
        <img src={url} alt="Uploaded website screenshot preview" className="mx-auto block h-auto max-w-full" />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Findings from screenshots are AI estimates and cannot verify hidden functionality or real mobile behavior.
      </p>
    </div>
  );
}

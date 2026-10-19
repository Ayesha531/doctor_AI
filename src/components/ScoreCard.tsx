import type { AnalysisResult } from "../lib/api";

const ROWS: [keyof AnalysisResult["scores"], string][] = [
  ["visualHierarchy", "Visual hierarchy"], ["readability", "Readability"],
  ["consistency", "Consistency"], ["accessibility", "Accessibility"],
];

const sevColor = { Critical: "bg-red-100 text-red-700", Moderate: "bg-amber-100 text-amber-800", Minor: "bg-blue-100 text-blue-700" };

export function ScoreCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {result.mode === "demo" && (
        <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">DEMO MODE — no real AI analysis was performed.</p>
      )}
      <div className="flex flex-wrap items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-brand-600">{result.mode === "demo" ? "—" : result.scores.overall}</div>
          <div className="text-xs text-slate-500">Overall / 100</div>
        </div>
        <p className="min-w-[200px] flex-1 text-sm text-slate-700">{result.summary}</p>
      </div>
      {result.mode !== "demo" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROWS.map(([k, label]) => (
            <div key={k}>
              <div className="flex justify-between text-sm"><span>{label}</span><span className="font-medium">{result.scores[k]}</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${result.scores[k]}%` }} /></div>
            </div>
          ))}
        </div>
      )}
      <ul className="mt-5 space-y-3">
        {result.issues.map((i, n) => (
          <li key={n} className="rounded-xl border border-slate-200 p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sevColor[i.severity]}`}>{i.severity}</span>
              <span className="font-semibold">{i.title}</span>
              {i.location && <span className="text-xs text-slate-500">· {i.location}</span>}
            </div>
            <p className="mt-1 text-slate-600">{i.description}</p>
            <p className="mt-1"><b>Recommended fix:</b> {i.recommendedFix}</p>
            <p className="text-slate-600"><b>Usability benefit:</b> {i.usabilityReason}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-500">{result.disclaimer}</p>
    </div>
  );
}

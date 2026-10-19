import type { HistoryItem } from "../lib/history";
import { formatSize, MAX_MB } from "../lib/validate";

export function DashboardHome({ count, onStart, onHistory }: { count: number; onStart: () => void; onHistory: () => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2">
        <h2 className="text-xl font-bold">Welcome to Interface Doctor</h2>
        <p className="mt-1 text-slate-600">Upload a website screenshot to diagnose UI/UX problems and get a better design.</p>
        <button onClick={onStart} className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Start new analysis</button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Screenshots uploaded</p>
        <p className="mt-1 text-3xl font-bold text-brand-600">{count}</p>
        <button onClick={onHistory} className="mt-3 text-sm font-medium text-blue-600 hover:underline">View history</button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">How it works</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Upload a screenshot</li><li>Analyze (coming soon)</li><li>Generate redesign (coming soon)</li>
        </ol>
      </div>
    </div>
  );
}

export function History({ items, onRemove, onClear, onStart }: {
  items: HistoryItem[]; onRemove: (id: string) => void; onClear: () => void; onStart: () => void;
}) {
  if (!items.length)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">No uploads yet.</p>
        <button onClick={onStart} className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">New analysis</button>
      </div>
    );
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{i.name}</p>
              <p className="text-xs text-slate-500">{formatSize(i.size)} · {new Date(i.uploadedAt).toLocaleString()}</p>
            </div>
            <button onClick={() => onRemove(i.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100">Delete</button>
          </li>
        ))}
      </ul>
      <div className="border-t border-slate-100 p-3 text-right">
        <button onClick={onClear} className="text-sm font-medium text-red-600 hover:underline">Clear history</button>
      </div>
    </div>
  );
}

export function Settings({ onClear }: { onClear: () => void }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm">
      <p><span className="font-semibold">Accepted files:</span> PNG, JPG, JPEG up to {MAX_MB} MB.</p>
      <p className="text-slate-600">AI provider settings (OpenAI-compatible) are configured on the server and will be added with the backend phase.</p>
      <button onClick={onClear} className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 hover:bg-red-50">Clear local history</button>
    </div>
  );
}

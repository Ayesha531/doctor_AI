import { useState } from "react";
import { Brand, Sidebar, View } from "./components/Sidebar";
import { NewAnalysis } from "./components/NewAnalysis";
import { DashboardHome, History, Settings } from "./components/Panels";
import { HistoryItem, loadHistory, saveHistory } from "./lib/history";

const TITLES: Record<View, string> = {
  dashboard: "Dashboard", new: "New Analysis", history: "History", settings: "Settings",
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  const update = (items: HistoryItem[]) => { setHistory(items); saveHistory(items); };

  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} onNavigate={setView} open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-8">
          <button className="rounded-lg border border-slate-300 px-3 py-1.5 md:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>☰</button>
          <div className="md:hidden"><Brand /></div>
          <h1 className="hidden text-lg font-semibold md:block">{TITLES[view]}</h1>
        </header>
        <main className="mx-auto max-w-4xl p-4 md:p-8">
          <h1 className="mb-4 text-lg font-semibold md:hidden">{TITLES[view]}</h1>
          {view === "dashboard" && <DashboardHome count={history.length} onStart={() => setView("new")} onHistory={() => setView("history")} />}
          {view === "new" && <NewAnalysis onUploaded={(h) => update([h, ...history])} />}
          {view === "history" && (
            <History items={history} onStart={() => setView("new")}
              onRemove={(id) => update(history.filter((h) => h.id !== id))} onClear={() => update([])} />
          )}
          {view === "settings" && <Settings onClear={() => update([])} />}
        </main>
      </div>
    </div>
  );
}

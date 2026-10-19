export type View = "dashboard" | "new" | "history" | "settings";

const ITEMS: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "new", label: "New Analysis", icon: "＋" },
  { id: "history", label: "History", icon: "↺" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 text-lg text-white">✚</div>
      <div>
        <p className="font-bold leading-tight">Interface Doctor</p>
        <p className="hidden text-[11px] leading-tight text-slate-500 lg:block">Diagnose your design. Improve your interface.</p>
      </div>
    </div>
  );
}

export function Sidebar({ view, onNavigate, open, onClose }: {
  view: View; onNavigate: (v: View) => void; open: boolean; onClose: () => void;
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white p-5 transition-transform md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Brand />
        <nav className="mt-8 space-y-1" aria-label="Main">
          {ITEMS.map((i) => (
            <button
              key={i.id}
              onClick={() => { onNavigate(i.id); onClose(); }}
              aria-current={view === i.id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${view === i.id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <span className="w-5 text-center">{i.icon}</span>
              {i.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

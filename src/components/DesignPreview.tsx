import { useMemo } from "react";

/** Generated markup is placed in a sandboxed srcDoc; scripts and same-origin access are never enabled. */
export function DesignPreview({ html, title = "Improved webpage preview" }: { html: string; title?: string }) {
  const srcDoc = useMemo(() => {
    const safe = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
    return safe;
  }, [html]);
  return <iframe title={title} srcDoc={srcDoc} sandbox="" referrerPolicy="no-referrer" className="h-[620px] w-full rounded-xl border border-slate-200 bg-white" />;
}

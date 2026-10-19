import type { AnalysisResult } from "./api";

export interface GeneratedDesign { html: string; components: { filename?: string; code?: string }[]; improvements: string[] }

export async function generateDesign(file: File, analysis: AnalysisResult): Promise<GeneratedDesign> {
  const form = new FormData();
  form.append("file", file);
  form.append("analysis", JSON.stringify(analysis));
  let response: Response;
  try { response = await fetch("/api/generate", { method: "POST", body: form }); }
  catch { throw new Error("Could not reach the generation API. Check that the FastAPI backend is running."); }
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message || `Generation failed (HTTP ${response.status}).`);
  if (!body || typeof body.html !== "string" || !body.html.trim()) throw new Error("Backend returned no preview markup.");
  return { html: body.html, components: Array.isArray(body.components) ? body.components : [], improvements: Array.isArray(body.improvements) ? body.improvements : [] };
}

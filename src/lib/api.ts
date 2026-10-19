export interface Issue {
  title: string; description: string; severity: "Critical" | "Moderate" | "Minor";
  location: string; recommendedFix: string; usabilityReason: string;
}
export interface Scores {
  overall: number; visualHierarchy: number; readability: number; consistency: number; accessibility: number;
}
export interface AnalysisResult {
  summary: string; scores: Scores; issues: Issue[]; disclaimer: string; mode: "ai" | "demo"; demo: boolean;
}
export interface ApiError extends Error { code?: string }

export async function analyzeScreenshot(file: File): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("file", file);
  let res: Response;
  try { res = await fetch("/api/analyze", { method: "POST", body: form }); }
  catch { throw new Error("Could not reach the backend API. Make sure the FastAPI server is running (npm run dev starts it)."); }
  const text = await res.text();
  let body: any = null;
  try { body = JSON.parse(text); } catch { /* invalid body */ }
  if (!res.ok) {
    const err = body?.error;
    const error: ApiError = new Error(err?.message || `Backend unavailable (HTTP ${res.status}).`);
    error.code = err?.code;
    throw error;
  }
  if (!body || !["ai", "demo"].includes(body.mode) || !Array.isArray(body.issues) || !body.scores)
    throw new Error("Backend returned an invalid analysis report.");
  return body as AnalysisResult;
}

// Starts the FastAPI backend. Installs deps on first run; explains clearly if Python is missing.
import { spawn, spawnSync } from "node:child_process";

const port = process.env.API_PORT || "3001";
const py = ["python3", "python"].find((p) => spawnSync(p, ["--version"]).status === 0);
if (!py) {
  console.error("[api] Python 3 not found. Install Python 3.10+ to run the FastAPI backend (backend/).");
  setInterval(() => {}, 1 << 30);
} else {
  const hasDeps = spawnSync(py, ["-c", "import fastapi, uvicorn, httpx, multipart"]).status === 0;
  if (!hasDeps) {
    console.log("[api] installing Python dependencies…");
    spawnSync(py, ["-m", "pip", "install", "-q", "-r", "backend/requirements.txt"], { stdio: "inherit" });
  }
  const child = spawn(py, ["-m", "uvicorn", "main:app", "--app-dir", "backend", "--reload", "--port", port], { stdio: "inherit" });
  child.on("exit", (c) => { console.error(`[api] exited (${c})`); setInterval(() => {}, 1 << 30); });
}

import base64
import json
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from ai_client import AIError
from analysis import analyze_screenshot, demo_result
from config import ALLOWED_TYPES, MAX_BYTES, ai_config
from generation import generate_design

app = FastAPI(title="Interface Doctor API")

@app.exception_handler(AIError)
async def ai_error_handler(_, exc: AIError):
    return JSONResponse(status_code=exc.status, content={"error": {"code": exc.code, "message": str(exc)}})

async def read_image(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, detail={"code": "INVALID_FILE", "message": "Only PNG or JPG/JPEG screenshots are supported."})
    data = await file.read(MAX_BYTES + 1)
    if not data:
        raise HTTPException(400, detail={"code": "INVALID_FILE", "message": "The uploaded file is empty."})
    if len(data) > MAX_BYTES:
        raise HTTPException(413, detail={"code": "INVALID_FILE", "message": f"File exceeds {MAX_BYTES // 1024 // 1024} MB."})
    if not data.startswith(ALLOWED_TYPES[file.content_type]):
        raise HTTPException(415, detail={"code": "INVALID_FILE", "message": "File contents do not match the declared image type."})
    return f"data:{file.content_type};base64,{base64.b64encode(data).decode()}"

@app.exception_handler(HTTPException)
async def http_error_handler(_, exc: HTTPException):
    detail = exc.detail
    if isinstance(detail, dict) and "code" in detail:
        return JSONResponse(status_code=exc.status_code, content={"error": detail})
    return JSONResponse(status_code=exc.status_code, content={"error": {"code": "HTTP_ERROR", "message": str(detail)}})

@app.get("/api/health")
def health():
    cfg = ai_config()
    return {"ok": True, "aiConfigured": bool(cfg["api_key"]), "model": cfg["model"], "demoMode": cfg["demo"]}

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    data_url = await read_image(file)
    cfg = ai_config()
    if not cfg["api_key"]:
        if cfg["demo"]:
            return demo_result()
        raise AIError("AI_API_KEY is not configured. Set it in the server Secrets panel or enable DEMO_MODE.", 503, "MISSING_API_KEY")
    return await analyze_screenshot(data_url)

@app.post("/api/generate")
async def generate(file: UploadFile = File(...), analysis: str = Form(...)):
    data_url = await read_image(file)
    try:
        parsed = json.loads(analysis)
    except json.JSONDecodeError:
        raise HTTPException(400, detail={"code": "INVALID_ANALYSIS", "message": "Invalid analysis JSON."})
    return await generate_design(data_url, parsed)

import json
import re
import httpx
from config import ai_config

class AIError(Exception):
    def __init__(self, message: str, status: int = 502, code: str = "PROVIDER_ERROR"):
        super().__init__(message)
        self.status, self.code = status, code

def _extract_json(text: str) -> dict:
    text = text.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    if m:
        text = m.group(1)
    try:
        result = json.loads(text)
        if not isinstance(result, dict): raise ValueError("not an object")
        return result
    except (json.JSONDecodeError, ValueError):
        s, e = text.find("{"), text.rfind("}")
        if s >= 0 and e > s:
            try:
                result = json.loads(text[s:e + 1])
                if isinstance(result, dict): return result
            except json.JSONDecodeError: pass
    raise AIError("The AI model returned invalid JSON. Please retry.", code="MALFORMED_MODEL_OUTPUT")

async def chat_json(system: str, user_text: str, image_data_url: str | None = None) -> dict:
    cfg = ai_config()
    if not cfg["api_key"]:
        raise AIError("AI_API_KEY is not configured.", 503, "MISSING_API_KEY")
    content: list = [{"type": "text", "text": user_text}]
    if image_data_url:
        content.append({"type": "image_url", "image_url": {"url": image_data_url}})
    body = {"model": cfg["model"], "temperature": 0.2,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": content}]}
    try:
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(f"{cfg['base_url']}/chat/completions", json=body,
                headers={"Authorization": f"Bearer {cfg['api_key']}"})
    except httpx.HTTPError as exc:
        raise AIError(f"Could not reach the AI provider: {type(exc).__name__}") from exc
    if r.status_code in (401, 403):
        raise AIError("The AI provider rejected the API key. Check AI_API_KEY.")
    if r.status_code == 429:
        raise AIError("The AI provider rate limit was hit. Wait and retry.", 429)
    if r.status_code >= 400:
        raise AIError(f"AI provider error ({r.status_code}). Check model image support.")
    try:
        return _extract_json(r.json()["choices"][0]["message"]["content"])
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise AIError("Unexpected response shape from the AI provider.", code="PROVIDER_ERROR") from exc

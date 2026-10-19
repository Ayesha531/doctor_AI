import os

MAX_BYTES = 5 * 1024 * 1024
ALLOWED_TYPES = {"image/png": b"\x89PNG\r\n\x1a\n", "image/jpeg": b"\xff\xd8\xff"}


def ai_config() -> dict:
    return {
        "api_key": os.environ.get("AI_API_KEY", "").strip(),
        "base_url": os.environ.get("AI_BASE_URL", "https://api.openai.com/v1").rstrip("/"),
        "model": os.environ.get("AI_MODEL", "gpt-4o-mini").strip(),
        "demo": os.environ.get("DEMO_MODE", "").lower() in ("1", "true", "yes"),
    }

from ai_client import chat_json

SYSTEM = """You are a senior front-end engineer. Using the screenshot and the analysis issues, produce an improved,
responsive version of the page that preserves its purpose and essential content. Return ONLY JSON:
{"html": "<complete self-contained HTML document with inline CSS, no external scripts>",
 "components": [{"filename": str, "code": "React TSX source"}],
 "improvements": [str]}"""


async def generate_design(data_url: str, analysis: dict) -> dict:
    import json

    raw = await chat_json(SYSTEM, "Analysis:\n" + json.dumps(analysis.get("issues", []))[:12000], data_url)
    return {
        "html": str(raw.get("html", "")),
        "components": [c for c in raw.get("components", []) if isinstance(c, dict)],
        "improvements": [str(x) for x in raw.get("improvements", [])],
    }

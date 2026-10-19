from pydantic import BaseModel, Field, ValidationError
from ai_client import chat_json, AIError

DISCLAIMER = (
    "Findings are AI estimates based on a screenshot only. They cannot verify hidden "
    "functionality or actual mobile behavior."
)
SYSTEM = """You are a senior UI/UX auditor. Return ONLY JSON with summary, scores (overall, visualHierarchy, readability, consistency, accessibility; each 0-100), and issues (array of {title, description, severity: Critical|Moderate|Minor, location, recommendedFix, usabilityReason}). Report only visible evidence. Consider contrast, spacing, typography, hierarchy, buttons, density, consistency and accessibility."""

class Issue(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = Field(min_length=1, max_length=1200)
    severity: str
    location: str = "Not identifiable"
    recommendedFix: str = Field(min_length=1, max_length=1200)
    usabilityReason: str = Field(min_length=1, max_length=1200)

class Scores(BaseModel):
    overall: int
    visualHierarchy: int
    readability: int
    consistency: int
    accessibility: int

class Report(BaseModel):
    summary: str = Field(min_length=1, max_length=2000)
    scores: Scores
    issues: list[Issue] = Field(max_length=30)


def _score(value):
    if isinstance(value, bool):
        raise ValueError("Score must be numeric")
    try:
        return max(0, min(100, round(float(value))))
    except (TypeError, ValueError, OverflowError) as exc:
        raise ValueError("Score must be numeric") from exc


def normalize(raw: dict) -> dict:
    try:
        if not isinstance(raw, dict):
            raise ValueError("Expected a JSON object")
        score_data = raw.get("scores")
        if not isinstance(score_data, dict):
            raise ValueError("Missing scores")
        keys = ("visualHierarchy", "readability", "consistency", "accessibility")
        scores = {key: _score(score_data.get(key)) for key in keys}
        scores["overall"] = _score(score_data.get("overall", sum(scores.values()) / 4))
        items = raw.get("issues")
        if not isinstance(items, list):
            raise ValueError("Issues must be an array")
        normalized = []
        for item in items:
            if not isinstance(item, dict):
                raise ValueError("Issue must be an object")
            severity = str(item.get("severity", "")).strip().lower()
            if severity not in {"critical", "moderate", "minor"}:
                raise ValueError("Unknown issue severity")
            normalized.append(Issue(
                title=item.get("title", ""), description=item.get("description", ""),
                severity=severity.title(), location=str(item.get("location") or "Not identifiable"),
                recommendedFix=item.get("recommendedFix", item.get("fix", "")),
                usabilityReason=item.get("usabilityReason", item.get("why", "")),
            ).model_dump())
        report = Report(summary=raw.get("summary", ""), scores=scores, issues=normalized)
        result = report.model_dump()
        result.update(mode="ai", demo=False, disclaimer=DISCLAIMER)
        return result
    except (ValidationError, ValueError, TypeError) as exc:
        raise AIError("The AI model returned an incomplete or malformed analysis. Please retry.", code="MALFORMED_MODEL_OUTPUT") from exc

async def analyze_screenshot(data_url: str) -> dict:
    return normalize(await chat_json(SYSTEM, "Analyze this website screenshot.", data_url))


def demo_result() -> dict:
    return {"mode": "demo", "demo": True,
        "summary": "Demo mode is enabled. No AI analysis was performed and no findings are available.",
        "scores": {"overall": 0, "visualHierarchy": 0, "readability": 0, "consistency": 0, "accessibility": 0},
        "issues": [], "disclaimer": DISCLAIMER}

import json
import logging
import os
import re
from pathlib import Path
from typing import Any


BACKEND_DIR = Path(__file__).resolve().parent
LOGGER = logging.getLogger(__name__)
REQUEST_TIMEOUT_SECONDS = 5


def _load_env() -> None:
    env_path = BACKEND_DIR / ".env"
    try:
        from dotenv import load_dotenv

        load_dotenv(env_path)
        return
    except ImportError:
        pass

    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_env()

LLM_API_URL = os.getenv("LLM_API_URL", "https://api.openai.com/v1/chat/completions")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY")


def score_note(note: str) -> dict[str, Any]:
    try:
        result = _score_with_openai(note)
        return {
            "score": result["score"],
            "reason": result["reason"],
            "fallback": False,
        }
    except Exception as exc:
        LOGGER.warning("OpenAI scoring failed or unavailable: %s", _safe_error(exc))
        score = _fallback_score(note)
        return {
            "score": score,
            "reason": "Keyword-based fallback score used because the LLM score was unavailable.",
            "fallback": True,
        }


def _score_with_openai(note: str) -> dict[str, Any]:
    import httpx

    if not OPENAI_API_KEY:
        raise RuntimeError("Missing OpenAI API key")

    prompt = (
        'Score the pain level described in this note. Return JSON only: '
        '{"score": integer 0-10, "reason": "one short sentence"}. '
        f"Note: {note}"
    )
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You score pain levels for synthetic demo notes. Return JSON only.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }

    with httpx.Client(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        response = client.post(LLM_API_URL, headers=headers, json=payload)
        response.raise_for_status()

    body = response.json()
    content = body["choices"][0]["message"]["content"]
    return _parse_score_json(content)


def _safe_error(exc: Exception) -> str:
    status_code = getattr(getattr(exc, "response", None), "status_code", None)
    if status_code is not None:
        return f"HTTP {status_code}"
    return exc.__class__.__name__


def _parse_score_json(content: str) -> dict[str, Any]:
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", content, flags=re.DOTALL)
        if not match:
            raise
        parsed = json.loads(match.group(0))

    score = int(parsed["score"])
    if score < 0 or score > 10:
        raise ValueError("Score must be between 0 and 10")

    reason = str(parsed["reason"]).strip()
    if not reason:
        raise ValueError("Reason is required")

    return {"score": score, "reason": reason}


def _fallback_score(note: str) -> int:
    text = note.lower()
    keyword_scores = [
        (("terrible", "severe", "distressed", "exhausted"), 8),
        (("manageable", "a bit sore", "sore"), 3),
        (("significant", "very difficult", "limited", "minimal movement"), 7),
        (("stronger", "shorter", "needed support", "required assistance"), 6),
        (("moderate", "increased", "more slowly"), 5),
        (("mild", "steady"), 3),
    ]

    for keywords, score in keyword_scores:
        if any(keyword in text for keyword in keywords):
            return score

    if "pain" in text:
        return 4

    return 0

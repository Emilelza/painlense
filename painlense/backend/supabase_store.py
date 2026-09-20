import os
from pathlib import Path
from typing import Any
from urllib.parse import quote


BACKEND_DIR = Path(__file__).resolve().parent


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

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("SUPABASE_KEY")
)


def enabled() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)


def _headers(prefer: str | None = None) -> dict[str, str]:
    headers = {
        "apikey": SUPABASE_KEY or "",
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    if prefer:
        headers["Prefer"] = prefer
    return headers


def _url(table: str, query: str = "") -> str:
    suffix = f"?{query}" if query else ""
    return f"{SUPABASE_URL}/rest/v1/{table}{suffix}"


def get_patient(patient_id: str) -> dict[str, Any] | None:
    import httpx

    query = f"id=eq.{quote(patient_id)}&select=*"
    with httpx.Client(timeout=10) as client:
        response = client.get(_url("patients", query), headers=_headers())
        response.raise_for_status()
    rows = response.json()
    return rows[0] if rows else None


def insert_patient(patient: dict[str, Any]) -> None:
    import httpx

    with httpx.Client(timeout=10) as client:
        response = client.post(_url("patients"), headers=_headers("return=minimal"), json=patient)
        response.raise_for_status()


def get_patient_data(patient_id: str) -> dict[str, Any] | None:
    import httpx

    patient = get_patient(patient_id)
    if patient is None:
        return None

    query = f"patient_id=eq.{quote(patient_id)}&select=*&order=date.asc,id.asc"
    with httpx.Client(timeout=10) as client:
        response = client.get(_url("visits", query), headers=_headers())
        response.raise_for_status()

    visits = response.json()
    return {
        "patient": {
            "id": patient["id"],
            "name": patient["name"],
            "age": patient["age"],
            "care_type": patient["care_type"],
        },
        "visits": [_api_visit(visit) for visit in visits],
    }


def insert_visit(patient_id: str, visit: dict[str, Any]) -> None:
    import httpx

    row = _db_visit(patient_id, visit)
    with httpx.Client(timeout=10) as client:
        response = client.post(_url("visits"), headers=_headers("return=minimal"), json=row)
        response.raise_for_status()


def update_visit_scores(visits: list[dict[str, Any]]) -> None:
    import httpx

    with httpx.Client(timeout=10) as client:
        for visit in visits:
            payload = {
                "raw": visit.get("raw"),
                "corrected": visit.get("corrected"),
            }
            response = client.patch(
                _url("visits", f"id=eq.{quote(visit['id'])}"),
                headers=_headers("return=minimal"),
                json=payload,
            )
            response.raise_for_status()


def _api_visit(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": row["id"],
        "date": row["date"],
        "observer": row["observer"],
        "note": row["note"],
        "raw": row.get("raw"),
        "corrected": row.get("corrected"),
    }


def _db_visit(patient_id: str, visit: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": visit["id"],
        "patient_id": patient_id,
        "date": visit["date"],
        "observer": visit["observer"],
        "note": visit["note"],
        "raw": visit.get("raw"),
        "corrected": visit.get("corrected"),
    }

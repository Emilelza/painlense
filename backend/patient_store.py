import json
import re
from datetime import date
from pathlib import Path
from typing import Any

import supabase_store


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_PATH = DATA_DIR / "visits.json"
ALERT_MESSAGE = "Pain is rising. Please inform the nurse."


def _get_data_path(patient_id: str | None = None) -> Path:
    if not patient_id or patient_id == "CR-001":
        return DATA_PATH
    safe_id = re.sub(r"[^\w\-]", "_", patient_id)
    return DATA_DIR / f"visits_{safe_id}.json"


def load_data(patient_id: str | None = None) -> dict[str, Any]:
    if supabase_store.enabled() and patient_id:
        try:
            data = supabase_store.get_patient_data(patient_id)
            if data is not None:
                return data
        except Exception:
            pass

    path = _get_data_path(patient_id)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))

    return {
        "patient": {
            "id": patient_id or "CR-001",
            "name": patient_id or "Unknown",
            "age": 0,
            "care_type": "palliative care",
        },
        "visits": [],
    }


def save_data(data: dict[str, Any], patient_id: str | None = None) -> None:
    if supabase_store.enabled():
        try:
            # If supabase is enabled, visits are stored in DB
            pass
        except Exception:
            pass
    pid = patient_id or data.get("patient", {}).get("id") or "CR-001"
    path = _get_data_path(pid)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def observer_key(observer: str) -> str:
    match = re.search(r"\b([ABC])\b$", observer.strip(), flags=re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return observer.strip().upper()


def compute_corrections(data: dict[str, Any]) -> dict[str, float]:
    visits = data["visits"]
    scored_visits = [visit for visit in visits if isinstance(visit.get("raw"), (int, float))]
    adjustments = {"A": 0.0, "B": 0.0, "C": 0.0}

    if not scored_visits:
        return adjustments

    overall_average = sum(visit["raw"] for visit in scored_visits) / len(scored_visits)

    for key in adjustments:
        observer_scores = [
            visit["raw"]
            for visit in scored_visits
            if observer_key(visit.get("observer", "")) == key
        ]
        if observer_scores:
            observer_average = sum(observer_scores) / len(observer_scores)
            adjustments[key] = round(observer_average - overall_average, 2)

    for visit in visits:
        raw = visit.get("raw")
        if isinstance(raw, (int, float)):
            key = observer_key(visit.get("observer", ""))
            visit["corrected"] = round(raw - adjustments.get(key, 0.0), 2)
        else:
            visit["corrected"] = None

    return adjustments


def check_trend(visits: list[dict[str, Any]]) -> dict[str, Any]:
    if len(visits) < 3:
        return {"active": False, "message": ""}

    last_three = visits[-3:]
    scores = [visit.get("corrected") for visit in last_three]
    if all(isinstance(score, (int, float)) for score in scores) and scores[0] < scores[1] < scores[2]:
        return {"active": True, "message": ALERT_MESSAGE}

    return {"active": False, "message": ""}


def patient_response(data: dict[str, Any]) -> dict[str, Any]:
    adjustments = compute_corrections(data)
    return {
        "patient": data["patient"],
        "visits": data["visits"],
        "adjustments": adjustments,
        "alert": check_trend(data["visits"]),
    }


def append_visit(patient_id: str | None, observer: str, note: str, score: int) -> dict[str, Any]:
    data = load_data(patient_id)
    if supabase_store.enabled() and patient_id:
        try:
            visit_id = f"V{len(data['visits']) + 1:03d}"
            visit = {
                "id": visit_id,
                "date": date.today().isoformat(),
                "observer": observer,
                "note": note,
                "raw": score,
                "corrected": None,
            }
            supabase_store.insert_visit(patient_id, visit)
            data = load_data(patient_id)
            patient = patient_response(data)
            supabase_store.update_visit_scores(patient["visits"])
            return patient
        except Exception:
            pass

    next_id = f"V{len(data['visits']) + 1:03d}"
    visit = {
        "id": next_id,
        "date": date.today().isoformat(),
        "observer": observer,
        "note": note,
        "raw": score,
        "corrected": None,
    }
    data["visits"].append(visit)
    patient = patient_response(data)
    save_data(data, patient_id)
    return patient


def create_patient_record(patient_id: str, name: str, age: int, care_type: str, password_hash: str) -> dict[str, Any]:
    if supabase_store.enabled():
        try:
            existing = supabase_store.get_patient(patient_id)
            if existing:
                data = supabase_store.get_patient_data(patient_id)
                if data:
                    return patient_response(data)
            patient_row = {
                "id": patient_id,
                "name": name,
                "age": age,
                "care_type": care_type,
                "password_hash": password_hash,
            }
            supabase_store.insert_patient(patient_row)
            data = {
                "patient": {
                    "id": patient_id,
                    "name": name,
                    "age": age,
                    "care_type": care_type,
                },
                "visits": [],
            }
            return patient_response(data)
        except Exception:
            pass

    path = _get_data_path(patient_id)
    if path.exists():
        data = json.loads(path.read_text(encoding="utf-8"))
        return patient_response(data)

    data = {
        "patient": {
            "id": patient_id,
            "name": name,
            "age": age,
            "care_type": care_type,
        },
        "visits": [],
    }
    save_data(data, patient_id)
    return patient_response(data)


import hashlib
import json
import secrets
from pathlib import Path
from typing import Any

from fastapi import Header, HTTPException


PATIENTS_PATH = Path(__file__).resolve().parent.parent / "data" / "patients.json"
TOKENS: dict[str, str] = {}


def _load_patients() -> list[dict[str, Any]]:
    if not PATIENTS_PATH.exists():
        return []
    return json.loads(PATIENTS_PATH.read_text(encoding="utf-8"))


def _save_patients(patients: list[dict[str, Any]]) -> None:
    PATIENTS_PATH.write_text(json.dumps(patients, indent=2) + "\n", encoding="utf-8")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def local_patient_login_exists(patient_id: str) -> bool:
    return any(p["id"] == patient_id for p in _load_patients())


def add_local_patient_login(patient_id: str, password: str) -> None:
    patients = _load_patients()
    if not any(p["id"] == patient_id for p in patients):
        patients.append({
            "id": patient_id,
            "password_hash": hash_password(password)
        })
        _save_patients(patients)


def login_patient(patient_id: str, password: str) -> dict[str, str] | None:
    pwd_hash = hash_password(password)
    for patient in _load_patients():
        if patient["id"] == patient_id and secrets.compare_digest(patient["password_hash"], pwd_hash):
            token = secrets.token_urlsafe(32)
            TOKENS[token] = patient_id
            return {"token": token, "patient_id": patient_id}
    return None


def require_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.removeprefix("Bearer ").strip()
    patient_id = TOKENS.get(token)
    if not patient_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return patient_id

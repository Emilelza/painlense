import json
from pathlib import Path

import httpx

import supabase_store


ROOT = Path(__file__).resolve().parent.parent
PATIENTS_PATH = ROOT / "data" / "patients.json"
VISITS_PATH = ROOT / "data" / "visits.json"


def main() -> None:
    if not supabase_store.enabled():
        raise SystemExit("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env first.")

    patient_auth_rows = json.loads(PATIENTS_PATH.read_text(encoding="utf-8"))
    visits_data = json.loads(VISITS_PATH.read_text(encoding="utf-8"))
    patient = visits_data["patient"]
    password_hash = patient_auth_rows[0]["password_hash"]

    patient_row = {
        "id": patient["id"],
        "name": patient["name"],
        "age": patient["age"],
        "care_type": patient["care_type"],
        "password_hash": password_hash,
    }
    visit_rows = [
        {
            "id": visit["id"],
            "patient_id": patient["id"],
            "date": visit["date"],
            "observer": visit["observer"],
            "note": visit["note"],
            "raw": visit.get("raw"),
            "corrected": visit.get("corrected"),
        }
        for visit in visits_data["visits"]
    ]

    headers = supabase_store._headers("resolution=merge-duplicates,return=minimal")
    with httpx.Client(timeout=20) as client:
        patient_response = client.post(
            supabase_store._url("patients"),
            headers=headers,
            json=patient_row,
        )
        patient_response.raise_for_status()

        visits_response = client.post(
            supabase_store._url("visits"),
            headers=headers,
            json=visit_rows,
        )
        visits_response.raise_for_status()

    print("Seeded Supabase with the demo patient and visits.")


if __name__ == "__main__":
    main()

import json
from pathlib import Path

from patient_store import compute_corrections
from scoring import score_note


DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "visits.json"


def main() -> None:
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))

    for visit in data["visits"]:
        result = score_note(visit["note"])
        visit["raw"] = result["score"]
        status = "fallback" if result["fallback"] else "llm"
        print(f'{visit["id"]}: raw={visit["raw"]} ({status}) - {result["reason"]}')

    adjustments = compute_corrections(data)
    DATA_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Adjustments: {adjustments}")
    print(f"Saved scores to {DATA_PATH}")


if __name__ == "__main__":
    main()

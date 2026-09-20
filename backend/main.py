from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from auth import add_local_patient_login, hash_password, local_patient_login_exists, login_patient, require_token
from patient_store import append_visit, create_patient_record, load_data, patient_response, save_data
import supabase_store
from scoring import score_note


app = FastAPI(
    title="PainLens API",
    description="Synthetic demo API for PainLens. Not for clinical use.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "PainLens"}


class ScoreNoteRequest(BaseModel):
    observer: str
    note: str


class LoginRequest(BaseModel):
    patient_id: str
    password: str


class VisitRequest(BaseModel):
    observer: str
    note: str
    score: int = Field(ge=0, le=10)


class CreatePatientRequest(BaseModel):
    patient_id: str
    name: str
    age: int = Field(ge=0, le=120)
    care_type: str = "palliative care"
    password: str = Field(min_length=4)


@app.post("/api/login", response_model=None)
def login(request: LoginRequest):
    result = login_patient(request.patient_id, request.password)
    if result is None:
        return JSONResponse(status_code=401, content={"error": "Invalid ID or password"})
    return result


@app.get("/api/patient")
def get_patient(patient_id: str = Depends(require_token)) -> dict:
    data = load_data(patient_id)
    response = patient_response(data)
    save_data(data)
    return response


@app.post("/api/score-note")
def post_score_note(request: ScoreNoteRequest, _patient_id: str = Depends(require_token)) -> dict:
    return score_note(request.note)


@app.post("/api/visits")
def post_visit(request: VisitRequest, patient_id: str = Depends(require_token)) -> dict:
    return append_visit(patient_id, request.observer, request.note, request.score)


@app.post("/api/patients", response_model=None)
def post_patient(request: CreatePatientRequest):
    try:
        patient_id = request.patient_id.strip()
        if not patient_id:
            return JSONResponse(status_code=400, content={"error": "Patient ID is required"})
        if local_patient_login_exists(patient_id):
            return JSONResponse(status_code=409, content={"error": "Patient already exists"})

        password_hash = hash_password(request.password)
        response = create_patient_record(
            patient_id,
            request.name.strip(),
            request.age,
            request.care_type.strip(),
            password_hash,
        )
        add_local_patient_login(patient_id, request.password)
        return response
    except ValueError as exc:
        return JSONResponse(status_code=409, content={"error": str(exc)})

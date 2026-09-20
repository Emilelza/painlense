# PainLens Backend

Synthetic demo backend for PainLens. Not for clinical use.

## Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run at `http://127.0.0.1:8000`.

## Test Health

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "app": "PainLens"
}
```

## Score Visit Notes

Create `backend/.env` with your API key:

```env
OPENAI_API_KEY=your_api_key_here
```

Optional settings:

```env
LLM_MODEL=gpt-4o-mini
LLM_API_URL=https://api.openai.com/v1/chat/completions
```

Then run:

```powershell
cd backend
python score_all.py
```

The script fills the `raw` field for each visit in `../data/visits.json`. If the LLM call fails or returns bad JSON, it uses the keyword fallback and prints `fallback` beside that visit.

## Optional Supabase Storage

Run `backend/supabase_schema.sql` in the Supabase SQL editor to create the `patients` and `visits` tables.

Add your Supabase backend settings to `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Use the service role key only on the backend. Do not expose it in frontend code.

Seed Supabase from the local JSON files:

```powershell
cd backend
python seed_supabase.py
```

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, the backend reads patients and visits from Supabase. Without them, it continues using the local JSON files in `data/`.

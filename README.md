PainLens
Overview

PainLens is a web app for home palliative care teams. It reads visit notes written by different visitors, turns each note into a 0-10 pain score, corrects for each visitor's personal scoring style, and shows whether the patient's pain is really rising. If it is, the app alerts the nurse.

Track: 01, Palliative Care & Patient Support

Problem Statement

In home palliative care, many people visit the same patient: volunteers, nurses, and family. Each person describes pain in their own words. One visitor writes "a bit uncomfortable" and another writes "severe" for the same pain level.

When those notes are put on one chart, the trend jumps up and down. It looks like the patient's pain changed, when often only the visitor changed. Care teams can miss real worsening, or react to noise.

Solution

PainLens separates the patient's real change from the visitor's wording:

A visitor writes a short note after a visit.
An AI model reads the note and returns a 0-10 pain score with a one-line reason.
PainLens compares each visitor's average score with the overall average and adjusts for the difference (for example, a visitor who always scores higher gets a negative adjustment).
The dashboard shows the raw trend next to the corrected trend.
If the corrected score rises across the last three visits, a banner asks the care team to inform the nurse.

PainLens only notices and escalates. It never diagnoses and never suggests treatment.

Features
Patient sign-in with a patient ID and password
Note-to-score: AI reads a visit note and returns a 0-10 pain score with a short reason
Observer correction: automatically adjusts for each visitor's scoring style
Raw vs corrected pain trend charts, side by side
Observer adjustment cards showing who tends to score higher or lower
Rising-pain alert for the care team
Full visit history with notes, raw scores, and corrected scores
Estimated-score fallback, clearly labelled, if the AI service is unavailable
Tech Stack
Frontend: React, Vite, Tailwind CSS, Recharts, Plus Jakarta Sans
Backend: Python, FastAPI
Database: JSON files (no database server)
APIs / Services: OpenAI API for note scoring
Hosting / Deployment: Vercel (frontend), Render (backend), GitHub
Other Tools: Codex, Antigravity, Git
Codex / OpenAI Usage
Ideation: narrowed the track down to one idea and shaped the observer-correction concept
Architecture planning: chose a small stack (React + FastAPI + JSON files) that one person can finish in a night
Code generation: Codex generated the backend (scoring, correction, trend check, API endpoints) and Antigravity generated the frontend from a design mockup
API integration: the OpenAI API turns free-text visit notes into structured 0-10 scores
Debugging: used AI help to fix sign-in, CORS, and deployment problems
Testing: wrote smoke tests for the API endpoints
Documentation: drafted this README and the API contract (API.md)
UI/UX development: built the landing page and dashboard from a mockup
Demo
Live Demo
App: https://painlense.vercel.app
API: https://painlense.onrender.com

Demo sign-in: Patient ID CR-001, Password demo123

The backend runs on a free tier and may take up to about 30 seconds to wake up on the first request.

Demo / Pitch Video

Add your demo or pitch video link here.

Screenshots

Add screenshots of the landing page, the dashboard with both charts, and the score-a-note result here.

How to Run Locally

Backend

bash
git clone https://github.com/Emilelza/painlense.git
cd painlense/backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

Create backend/.env with your own key (never commit this file):

OPENAI_API_KEY=your_key_here
SECRET_KEY=any_long_random_text
bash
uvicorn main:app --reload --port 8000

Frontend (in a second terminal)

bash
cd painlense/frontend
npm install

Create frontend/.env:

VITE_API_BASE=http://127.0.0.1:8000
bash
npm run dev

Open http://localhost:5173 and sign in with CR-001 / demo123.

Additional Notes
All patient data is synthetic. The patient, visits, and notes were written for this demo. No real patient information is used.
Not a medical device. PainLens does not diagnose, treat, or give medical advice. It only highlights a trend for a human to review.
Storage is simple by design. Visits are saved in JSON files, so data added on the free hosting tier may reset when the server restarts.
Scoring is a rough model. The correction is a simple average-based adjustment, chosen to be easy to explain and verify.
Future plans: Malayalam voice notes, handwritten register photos, multiple patients with separate records, and a pre-visit briefing for the next visitor.
Secrets: API keys are stored only in environment variables and are not part of this repository.

# PainLens Guidelines & Rules

- **Demo Purpose**: Demo app called PainLens. Uses synthetic data only; NOT for clinical use.
- **Technology Stack**:
  - Frontend: React + Vite + Tailwind + Recharts in `frontend/`
  - Backend: FastAPI in `backend/`
  - Data Storage: JSON files in `data/`
  - Demo patient access gate only (patient ID + password). No accounts, no registration, no password reset. No database.
- **Visual Design Reference**: `design/mockup.png` (color theme: blue, white, dark navy). Note: The mockup label reads "CareRelay", but the app name is **PainLens**—use **PainLens** everywhere in both the UI and code.
- **Scope & Directory Constraints**:
  - Frontend work belongs ONLY in `frontend/`.
  - Backend work belongs ONLY in `backend/` and `data/`.
- **API Specification**: Read `API.md` before writing any API endpoint or API call.
- **Simplicity**: Keep code simple. Do not add features that were not explicitly requested.
- **Security**: Never commit `.env` files or API keys.

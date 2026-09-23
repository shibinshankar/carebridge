# CareBridge

CareBridge is a hackathon-ready MVP for a 30-day hospital-to-home recovery and readmission prevention platform. It combines a patient-facing dashboard, daily symptom check-ins, medication tracking, appointment reminders, and a nurse/clinical dashboard with deterministic safety rules to surface high-priority alerts for early human intervention.

## Problem Statement

Patients often leave the hospital with recovery instructions but limited follow-up support during the critical first 30 days. This can make it harder to catch warning signs early, manage medications and appointments, and coordinate timely clinical review when needed.

## Solution

CareBridge creates a structured safety net between discharge and full recovery. Patients complete regular check-ins, track medications, view appointments, and receive clear guidance when their submitted information matches predefined warning-sign rules. Clinical staff can review alerts and update statuses from a dedicated dashboard.

## Features

- Patient dashboard with recovery progress, medications, appointments, and latest check-in
- Daily symptom check-in with mood, pain level, medication status, and free-text symptom input
- Deterministic risk engine with predefined high/medium warning-sign rules
- Automatic alert creation for medium and high priority findings
- Nurse dashboard with search, filtering, patient overview, and alert management
- Patient detail page with symptom history, risk trend chart, and alerts
- Medication adherence updates and appointment reminders
- Demo-only authentication for patient and nurse roles
- SQLite-backed local prototype with seeded synthetic data

## Architecture

- Frontend: React + Vite + Tailwind CSS + React Router + Recharts + Lucide React
- Backend: FastAPI + SQLAlchemy + SQLite + Pydantic
- Data model: SQLite database with demo seed data
- Safety engine: deterministic keyword/phrase matching with easy expansion points

## Folder Structure

```text
carebridge/
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── ...
├── backend/
│   ├── routers/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── risk_engine.py
│   ├── seed.py
│   ├── requirements.txt
│   └── carebridge.db
├── .gitignore
├── README.md
└──
```

## Technology Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

## Demo Credentials

- Patient: patient@demo.com / password123
- Nurse: nurse@demo.com / password123

## Installation

### 1) Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2) Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Run the Project

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo Workflow

1. Log in as the patient (`patient@demo.com / password123`).
2. Review the recovery dashboard and medications.
3. Complete the daily check-in with the exact message:
   `I’m feeling more tired today and I’m having increasing difficulty breathing.`
4. Observe that the risk engine detects the warning sign, creates a high-priority alert, and updates the patient status.
5. Log in as the nurse (`nurse@demo.com / password123`).
6. Open the nurse dashboard and confirm the alert appears.
7. Open the patient details page, mark the alert as In Review, then Resolve it.

## API Overview

- `POST /api/login`
- `GET /api/patients`
- `GET /api/patients/{id}`
- `GET /api/patients/{id}/medications`
- `POST /api/medications/{id}/taken`
- `GET /api/patients/{id}/appointments`
- `POST /api/checkins`
- `POST /api/symptoms`
- `GET /api/alerts`
- `PATCH /api/alerts/{id}`
- `GET /api/patients/{id}/risk-history`
- `GET /api/dashboard/stats`

## Risk Engine

The risk engine uses deterministic phrase matching rather than external AI APIs. It scans patient free-text messages for predefined high-priority and medium-priority warning signs and then returns a risk level, risk score, matched signs, and a clear message. The rules are configurable in the backend `risk_engine.py` file and easy to extend for future clinical pathways.

## Important Medical Safety Disclaimer

CareBridge is a prototype designed for hackathon demonstration and educational use only. It does not diagnose medical conditions, replace professional healthcare, or guarantee prevention of readmission. For urgent symptoms or emergency concerns, patients should follow their healthcare team's instructions and contact appropriate emergency or professional care services.

## Future Improvements

- Add stronger role-based permission controls and secure token handling
- Add notifications and SMS/email reminders
- Expand risk engine rules with clinician-approved clinical pathways
- Add analytics for adherence trends, symptom clusters, and readmission prediction
- Integrate EHR or hospital scheduling data
- Add multilingual support and accessibility enhancements

## Notes

- All demo data is synthetic.
- The database will initialize automatically on backend startup.
- The project is intentionally local-only for hackathon simplicity.

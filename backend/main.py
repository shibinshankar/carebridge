from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from database import Base, SessionLocal, engine, get_db
from models import Alert, Appointment, CheckIn, Medication, Patient, Symptom
from schemas import (
    AlertResponse,
    AppointmentResponse,
    CheckInCreate,
    CheckInResponse,
    DashboardStats,
    LoginRequest,
    LoginResponse,
    MedicationResponse,
    PatientResponse,
    RiskHistoryItem,
    SymptomCreate,
    SymptomResponse,
)
from risk_engine import analyze_symptoms

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareBridge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    try:
        from seed import create_demo_data
        create_demo_data()
    except Exception:
        pass


@app.post("/api/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    if payload.email == "patient@demo.com" and payload.password == "password123":
        patient = SessionLocal().query(Patient).filter(Patient.email == payload.email).first()
        return LoginResponse(role="PATIENT", patient_id=patient.id if patient else 1, message="Demo patient login successful.")

    if payload.email == "nurse@demo.com" and payload.password == "password123":
        return LoginResponse(role="NURSE", message="Demo nurse login successful.")

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid demo credentials.")


@app.get("/api/patients", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()


@app.get("/api/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient


@app.get("/api/patients/{patient_id}/medications", response_model=list[MedicationResponse])
def get_medications(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return db.query(Medication).filter(Medication.patient_id == patient_id).all()


@app.post("/api/medications/{medication_id}/taken", response_model=MedicationResponse)
def mark_medication_taken(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(Medication).filter(Medication.id == medication_id).first()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found.")

    medication.status = "TAKEN"
    db.commit()
    db.refresh(medication)
    return medication


@app.get("/api/patients/{patient_id}/appointments", response_model=list[AppointmentResponse])
def get_appointments(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return db.query(Appointment).filter(Appointment.patient_id == patient_id).all()


@app.get("/api/patients/{patient_id}/symptoms", response_model=list[SymptomResponse])
def get_symptoms(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return db.query(Symptom).filter(Symptom.patient_id == patient_id).order_by(Symptom.created_at.desc()).all()


@app.post("/api/checkins", response_model=CheckInResponse)
def create_checkin(payload: CheckInCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    analysis = analyze_symptoms(payload.symptom_message)

    checkin = CheckIn(
        patient_id=payload.patient_id,
        mood=payload.mood,
        pain_level=payload.pain_level,
        symptom_message=payload.symptom_message,
        medication_taken=payload.medication_taken,
        risk_level=analysis["risk_level"],
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)

    symptom = Symptom(
        patient_id=payload.patient_id,
        message=payload.symptom_message,
        detected_symptoms=", ".join(analysis.get("matched_signs", [])) or payload.symptom_message,
        risk_level=analysis["risk_level"],
        risk_score=analysis["risk_score"],
    )
    db.add(symptom)
    db.commit()

    if analysis["risk_level"] in ["MEDIUM", "HIGH"]:
        alert = Alert(
            patient_id=payload.patient_id,
            title="Potential warning sign detected",
            message=analysis["message"],
            priority=analysis["risk_level"],
            status="NEW",
        )
        db.add(alert)
        patient.risk_level = analysis["risk_level"]
        db.commit()

    return checkin


@app.post("/api/symptoms", response_model=SymptomResponse)
def create_symptom(payload: SymptomCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    analysis = analyze_symptoms(payload.message)
    symptom = Symptom(
        patient_id=payload.patient_id,
        message=payload.message,
        detected_symptoms=", ".join(analysis.get("matched_signs", [])) or payload.message,
        risk_level=analysis["risk_level"],
        risk_score=analysis["risk_score"],
    )
    db.add(symptom)
    db.commit()
    db.refresh(symptom)

    if analysis["risk_level"] in ["MEDIUM", "HIGH"]:
        alert = Alert(
            patient_id=payload.patient_id,
            title="Potential warning sign detected",
            message=analysis["message"],
            priority=analysis["risk_level"],
            status="NEW",
        )
        db.add(alert)
        patient.risk_level = analysis["risk_level"]
        db.commit()

    return symptom


@app.get("/api/alerts", response_model=list[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()


@app.patch("/api/alerts/{alert_id}", response_model=AlertResponse)
def update_alert(alert_id: int, payload: dict, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")

    if "status" in payload:
        alert.status = payload["status"]
    if payload.get("resolved_at"):
        alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert


@app.get("/api/patients/{patient_id}/risk-history", response_model=list[RiskHistoryItem])
def get_risk_history(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    symptoms = db.query(Symptom).filter(Symptom.patient_id == patient_id).order_by(Symptom.created_at.asc()).all()
    history = []
    for index, symptom in enumerate(symptoms, start=1):
        history.append(
            RiskHistoryItem(
                day=index,
                risk_level=symptom.risk_level,
                risk_score=symptom.risk_score,
                created_at=symptom.created_at,
            )
        )

    return history


@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_patients = db.query(Patient).count()
    high_risk = db.query(Patient).filter(Patient.risk_level == "HIGH").count()
    medium_risk = db.query(Patient).filter(Patient.risk_level == "MEDIUM").count()
    low_risk = db.query(Patient).filter(Patient.risk_level == "LOW").count()
    open_alerts = db.query(Alert).filter(Alert.status != "RESOLVED").count()

    patients = db.query(Patient).all()
    medication_cases = []
    for patient in patients:
        meds = db.query(Medication).filter(Medication.patient_id == patient.id).all()
        if meds:
            taken = sum(1 for med in meds if med.status == "TAKEN")
            medication_cases.append(taken / len(meds))

    adherence_average = round(sum(medication_cases) / len(medication_cases), 2) if medication_cases else 0.0

    check_in_total = db.query(CheckIn).count()
    check_in_rate = round((check_in_total / max(total_patients, 1)) * 100, 2)

    return DashboardStats(
        total_patients=total_patients,
        high_risk_patients=high_risk,
        medium_risk_patients=medium_risk,
        low_risk_patients=low_risk,
        open_alerts=open_alerts,
        medication_adherence_average=adherence_average * 100,
        check_in_completion_rate=check_in_rate,
    )


@app.get("/")
def read_root():
    return {"message": "CareBridge API is running."}


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

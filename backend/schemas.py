from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    email: str
    diagnosis: str
    discharge_date: datetime
    doctor_name: str
    risk_level: str = "LOW"


class PatientCreate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MedicationBase(BaseModel):
    patient_id: int
    medicine_name: str
    dosage: str
    frequency: str
    scheduled_time: str
    status: str = "PENDING"


class MedicationCreate(MedicationBase):
    pass


class MedicationResponse(MedicationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class AppointmentBase(BaseModel):
    patient_id: int
    doctor_name: str
    appointment_date: datetime
    appointment_time: str
    department: str
    status: str = "SCHEDULED"


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentResponse(AppointmentBase):
    id: int

    class Config:
        from_attributes = True


class SymptomCreate(BaseModel):
    patient_id: int
    message: str


class SymptomResponse(BaseModel):
    id: int
    patient_id: int
    message: str
    detected_symptoms: Optional[str]
    risk_level: str
    risk_score: int
    created_at: datetime

    class Config:
        from_attributes = True


class AlertBase(BaseModel):
    patient_id: int
    title: str
    message: str
    priority: str
    status: str = "NEW"


class AlertCreate(AlertBase):
    pass


class AlertResponse(AlertBase):
    id: int
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


class CheckInCreate(BaseModel):
    patient_id: int
    mood: str
    pain_level: int = Field(..., ge=0, le=10)
    symptom_message: str
    medication_taken: str = "NO"


class CheckInResponse(CheckInCreate):
    id: int
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    role: str
    patient_id: Optional[int] = None
    message: str


class RiskHistoryItem(BaseModel):
    day: int
    risk_level: str
    risk_score: int
    created_at: datetime


class DashboardStats(BaseModel):
    total_patients: int
    high_risk_patients: int
    medium_risk_patients: int
    low_risk_patients: int
    open_alerts: int
    medication_adherence_average: float
    check_in_completion_rate: float


class ErrorResponse(BaseModel):
    detail: str

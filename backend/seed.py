from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Patient, Medication, Appointment, Symptom, Alert, CheckIn


def create_demo_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_patients = db.query(Patient).count()
        if existing_patients > 0:
            return

        now = datetime.utcnow()
        discharge_base = now - timedelta(days=8)

        patient_data = [
            {
                "name": "Ravi Kumar",
                "age": 67,
                "gender": "Male",
                "phone": "+91 90000 11111",
                "email": "patient@demo.com",
                "diagnosis": "Post-operative recovery",
                "discharge_date": discharge_base,
                "doctor_name": "Dr. Mehta",
                "risk_level": "HIGH",
            },
            {
                "name": "Ananya Sharma",
                "age": 54,
                "gender": "Female",
                "phone": "+91 90000 22222",
                "email": "ananya@demo.com",
                "diagnosis": "Cardiac rehabilitation",
                "discharge_date": now - timedelta(days=12),
                "doctor_name": "Dr. Reddy",
                "risk_level": "MEDIUM",
            },
            {
                "name": "Daniel Thomas",
                "age": 45,
                "gender": "Male",
                "phone": "+91 90000 33333",
                "email": "daniel@demo.com",
                "diagnosis": "Mobility recovery",
                "discharge_date": now - timedelta(days=6),
                "doctor_name": "Dr. Singh",
                "risk_level": "LOW",
            },
            {
                "name": "Priya Nair",
                "age": 61,
                "gender": "Female",
                "phone": "+91 90000 44444",
                "email": "priya@demo.com",
                "diagnosis": "Pulmonary recovery",
                "discharge_date": now - timedelta(days=18),
                "doctor_name": "Dr. Iyer",
                "risk_level": "MEDIUM",
            },
            {
                "name": "Arjun Patel",
                "age": 39,
                "gender": "Male",
                "phone": "+91 90000 55555",
                "email": "arjun@demo.com",
                "diagnosis": "Post-surgery monitoring",
                "discharge_date": now - timedelta(days=9),
                "doctor_name": "Dr. Shah",
                "risk_level": "LOW",
            },
            {
                "name": "Meera Joshi",
                "age": 72,
                "gender": "Female",
                "phone": "+91 90000 66666",
                "email": "meera@demo.com",
                "diagnosis": "Heart failure recovery",
                "discharge_date": now - timedelta(days=14),
                "doctor_name": "Dr. Mehta",
                "risk_level": "HIGH",
            },
            {
                "name": "Sahil Khan",
                "age": 50,
                "gender": "Male",
                "phone": "+91 90000 77777",
                "email": "sahil@demo.com",
                "diagnosis": "Orthopedic recovery",
                "discharge_date": now - timedelta(days=10),
                "doctor_name": "Dr. Rao",
                "risk_level": "LOW",
            },
            {
                "name": "Nisha Verma",
                "age": 58,
                "gender": "Female",
                "phone": "+91 90000 88888",
                "email": "nisha@demo.com",
                "diagnosis": "Diabetes and wound recovery",
                "discharge_date": now - timedelta(days=20),
                "doctor_name": "Dr. Nair",
                "risk_level": "MEDIUM",
            },
        ]

        created_patients = []
        for entry in patient_data:
            patient = Patient(**entry)
            db.add(patient)
            db.flush()
            created_patients.append(patient)

        meds = [
            ("Aspirin", "75 mg", "Once daily", "8:00 AM", "TAKEN"),
            ("Metoprolol", "25 mg", "Twice daily", "8:00 AM", "TAKEN"),
            ("Metoprolol", "25 mg", "Twice daily", "8:00 PM", "PENDING"),
            ("Vitamin D", "500 IU", "Once daily", "9:00 AM", "TAKEN"),
            ("Ibuprofen", "200 mg", "Twice daily", "12:00 PM", "PENDING"),
            ("Amoxicillin", "500 mg", "Three times daily", "8:00 AM", "TAKEN"),
            ("Hydration Pack", "1 sachet", "Daily", "6:00 AM", "TAKEN"),
            ("Physio Exercise", "15 mins", "Daily", "7:00 PM", "PENDING"),
        ]

        for index, patient in enumerate(created_patients):
            for med_index, (name, dose, freq, time, status) in enumerate(meds):
                if med_index % len(created_patients) == index % len(created_patients):
                    db.add(
                        Medication(
                            patient_id=patient.id,
                            medicine_name=name,
                            dosage=dose,
                            frequency=freq,
                            scheduled_time=time,
                            status=status,
                        )
                    )

            appointment_date = now + timedelta(days=5)
            db.add(
                Appointment(
                    patient_id=patient.id,
                    doctor_name=patient.doctor_name,
                    appointment_date=appointment_date,
                    appointment_time="10:30 AM",
                    department="Cardiology" if patient.id % 2 == 0 else "General Medicine",
                    status="SCHEDULED",
                )
            )

            db.add(
                CheckIn(
                    patient_id=patient.id,
                    mood="Good" if patient.id % 3 == 0 else "Okay",
                    pain_level=2 if patient.id % 2 == 0 else 4,
                    symptom_message="Feeling better overall today.",
                    medication_taken="YES",
                    risk_level=patient.risk_level,
                )
            )

            if patient.id == 1:
                db.add(
                    Symptom(
                        patient_id=patient.id,
                        message="I'm feeling more tired today and I'm having increasing difficulty breathing.",
                        detected_symptoms="difficulty breathing",
                        risk_level="HIGH",
                        risk_score=90,
                    )
                )
                db.add(
                    Alert(
                        patient_id=patient.id,
                        title="High priority alert",
                        message="Difficulty breathing detected in check-in.",
                        priority="HIGH",
                        status="NEW",
                    )
                )

            else:
                db.add(
                    Symptom(
                        patient_id=patient.id,
                        message="Feeling okay with mild fatigue.",
                        detected_symptoms="mild fatigue",
                        risk_level=patient.risk_level,
                        risk_score=20 if patient.risk_level == "LOW" else 60,
                    )
                )

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_demo_data()

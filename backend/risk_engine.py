import re
from typing import Dict, List


HIGH_PRIORITY_PATTERNS = [
    "difficulty breathing",
    "trouble breathing",
    "severe chest pain",
    "fainting",
    "severe bleeding",
    "sudden confusion",
    "loss of consciousness",
]

MEDIUM_PRIORITY_PATTERNS = [
    "increasing pain",
    "persistent vomiting",
    "fever",
    "dizziness",
    "increasing swelling",
    "worsening weakness",
    "more tired",
]


def analyze_symptoms(message: str) -> Dict[str, object]:
    normalized = message.lower()
    matched_high = []
    matched_medium = []

    for pattern in HIGH_PRIORITY_PATTERNS:
        if pattern in normalized:
            matched_high.append(pattern)

    for pattern in MEDIUM_PRIORITY_PATTERNS:
        if pattern in normalized:
            matched_medium.append(pattern)

    if matched_high:
        return {
            "risk_level": "HIGH",
            "risk_score": 90,
            "matched_signs": matched_high,
            "requires_clinical_review": True,
            "message": "A potentially serious warning sign was detected. Appropriate professional medical assessment may be needed.",
        }

    if matched_medium:
        return {
            "risk_level": "MEDIUM",
            "risk_score": 60,
            "matched_signs": matched_medium,
            "requires_clinical_review": True,
            "message": "A warning sign was detected. Follow your care plan and consider contacting your healthcare team.",
        }

    return {
        "risk_level": "LOW",
        "risk_score": 20,
        "matched_signs": [],
        "requires_clinical_review": False,
        "message": "No predefined warning signs were detected in the message. Continue with routine recovery monitoring.",
    }

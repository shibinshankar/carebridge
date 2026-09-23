import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SymptomCheck from '../components/SymptomCheck';

export default function Symptoms({ patientId }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ mood, painLevel, medicationTaken, symptomMessage }) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.post('/checkins', {
        patient_id: patientId,
        mood,
        pain_level: painLevel,
        symptom_message: symptomMessage,
        medication_taken: medicationTaken,
      });
      setResponse(result.data);
      navigate('/patient');
    } catch (err) {
      setError(err.message || 'Unable to submit check-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Daily check-in</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Symptom check-in</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SymptomCheck onSubmit={handleSubmit} loading={loading} />

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900">Safety reminder</h2>
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5" />
                <p>
                  This check-in is for recovery monitoring only. It does not diagnose or replace professional medical care. For urgent symptoms, please seek appropriate emergency or professional care according to your healthcare team’s instructions.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {response && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-soft">
              <p className="text-lg font-bold text-emerald-700">Check-in submitted</p>
              <p className="mt-2 text-sm text-emerald-700">Risk level: {response.risk_level}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

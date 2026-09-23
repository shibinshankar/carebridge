import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, CalendarDays, Clock3, FileText, Pill, ShieldAlert, Stethoscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';

export default function PatientDetails() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientRes, medsRes, appsRes, symptomsRes, alertsRes, historyRes] = await Promise.all([
          api.get(`/patients/${patientId}`),
          api.get(`/patients/${patientId}/medications`),
          api.get(`/patients/${patientId}/appointments`),
          api.get(`/patients/${patientId}/symptoms`),
          api.get('/alerts'),
          api.get(`/patients/${patientId}/risk-history`),
        ]);

        setPatient(patientRes.data);
        setMedications(medsRes.data);
        setAppointments(appsRes.data);
        setSymptoms(symptomsRes.data);
        setAlerts(alertsRes.data.filter((alert) => alert.patient_id === Number(patientId)));
        setHistory(historyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Patient Details</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{patient?.name}</h1>
            <p className="mt-1 text-slate-500">{patient?.diagnosis}</p>
          </div>
          <RiskBadge level={patient?.risk_level || 'LOW'} className="text-base" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Age</p>
          <p className="mt-2 text-2xl font-bold">{patient?.age}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Doctor</p>
          <p className="mt-2 text-2xl font-bold">{patient?.doctor_name}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Discharge date</p>
          <p className="mt-2 text-xl font-bold">{new Date(patient?.discharge_date).toLocaleDateString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-sm text-slate-500">Days since discharge</p>
          <p className="mt-2 text-2xl font-bold">8</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Medication adherence</h2>
          </div>
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{med.medicine_name}</p>
                  <p className="text-sm text-slate-500">{med.dosage} · {med.scheduled_time}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${med.status === 'TAKEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Appointment history</h2>
          </div>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="rounded-2xl border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">{appt.department}</p>
                <p className="text-sm text-slate-500">{appt.doctor_name}</p>
                <p className="mt-2 text-sm text-slate-600">{new Date(appt.appointment_date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Symptom history</h2>
          </div>
          <div className="space-y-3">
            {symptoms.map((symptom, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 p-3">
                <p className="font-semibold text-slate-800">{symptom.message}</p>
                <p className="mt-1 text-sm text-slate-500">Detected signs: {symptom.detected_symptoms || 'None'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Alerts</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-red-200 bg-red-50 p-3">
                <p className="font-semibold text-red-700">{alert.priority} Priority</p>
                <p className="mt-1 text-sm text-red-700">{alert.message}</p>
                <p className="mt-2 text-xs text-red-600">Status: {alert.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-slate-900">Risk trend</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="risk_score" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

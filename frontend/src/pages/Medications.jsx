import { useEffect, useState } from 'react';
import MedicationCard from '../components/MedicationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function Medications({ patientId }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await api.get(`/patients/${patientId}/medications`);
        setMedications(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load medications.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [patientId]);

  const handleMarkTaken = async (medicationId) => {
    try {
      const response = await api.post(`/medications/${medicationId}/taken`);
      setMedications((current) => current.map((med) => (med.id === medicationId ? response.data : med)));
    } catch (err) {
      setError(err.message || 'Unable to update medication status.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Medication module</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Today's medicines</h1>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {medications.map((medication) => (
          <MedicationCard key={medication.id} medication={medication} onMarkTaken={handleMarkTaken} />
        ))}
      </div>
    </div>
  );
}

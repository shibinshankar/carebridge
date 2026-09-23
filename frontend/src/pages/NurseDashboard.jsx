import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import StatCard from '../components/StatCard';
import PatientTable from '../components/PatientTable';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function NurseDashboard({ patients, alerts, stats }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const sortedPatients = useMemo(
    () =>
      [...patients].sort((a, b) => {
        const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priority[b.risk_level] - priority[a.risk_level];
      }),
    [patients]
  );

  const enrichedPatients = sortedPatients.map((patient) => ({
    ...patient,
    alerts: alerts.filter((alert) => alert.patient_id === patient.id).slice(0, 1),
  }));

  const handleStatusChange = async (alertId, status) => {
    try {
      await api.patch(`/alerts/${alertId}`, { status });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (!patients.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Clinical Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">CareBridge Clinical Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} icon={item.icon} accent={item.accent} />
        ))}
      </div>

      <div className="space-y-6 lg:grid lg:grid-cols-[1.5fr_0.8fr] lg:gap-6">
        <PatientTable
          patients={enrichedPatients}
          onSelect={(patientId) => (window.location.href = `/patients/${patientId}`)}
          search={search}
          onSearch={setSearch}
          filter={filter}
          onFilter={setFilter}
        />

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-lg font-bold text-slate-900">Active Alerts</p>
            <div className="mt-4 space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <RiskBadge level={alert.priority} />
                    <span className="text-xs text-slate-500">{alert.status}</span>
                  </div>
                  <p className="mt-2 font-semibold text-slate-800">{alert.patient?.name || 'Patient'}</p>
                  <p className="mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onChangeStatus={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}

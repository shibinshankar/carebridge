import AlertCard from '../components/AlertCard';

export default function Alerts({ alerts }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Alerts</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">CareBridge alerts</h1>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onChangeStatus={() => {}} />
        ))}
      </div>
    </div>
  );
}

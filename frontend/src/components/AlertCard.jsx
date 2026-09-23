import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';

export default function AlertCard({ alert, onChangeStatus }) {
  const colorMap = {
    HIGH: 'border-red-200 bg-red-50 text-red-700',
    MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
    LOW: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-soft ${colorMap[alert.priority] || colorMap.LOW}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-lg font-bold">{alert.priority} PRIORITY ALERT</p>
        </div>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold uppercase">{alert.status}</span>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p><span className="font-semibold">Patient:</span> {alert.patient?.name}</p>
        <p><span className="font-semibold">Warning:</span> {alert.message}</p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {new Date(alert.created_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onChangeStatus(alert.id, 'NEW')}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
        >
          New
        </button>
        <button
          onClick={() => onChangeStatus(alert.id, 'IN REVIEW')}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
        >
          In Review
        </button>
        <button
          onClick={() => onChangeStatus(alert.id, 'RESOLVED')}
          className="rounded-lg border border-emerald-200 bg-emerald-100 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
        >
          Resolve
        </button>
      </div>
    </div>
  );
}

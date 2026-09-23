import { CheckCircle2, Clock3 } from 'lucide-react';

export default function MedicationCard({ medication, onMarkTaken }) {
  const taken = medication.status === 'TAKEN';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-800">{medication.medicine_name}</p>
          <p className="text-sm text-slate-500">{medication.dosage}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            taken ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {taken ? 'Taken' : 'Pending'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {medication.scheduled_time}
        </span>
        <span>{medication.frequency}</span>
      </div>

      {!taken && (
        <button
          onClick={() => onMarkTaken(medication.id)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark as Taken
        </button>
      )}
    </div>
  );
}

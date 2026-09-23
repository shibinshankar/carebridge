export default function StatCard({ title, value, icon: Icon, accent = 'teal' }) {
  const accentColors = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`rounded-xl p-2 ring-1 ${accentColors[accent] || accentColors.teal}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

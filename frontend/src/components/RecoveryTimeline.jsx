export default function RecoveryTimeline({ currentDay = 8, patientName = 'Patient' }) {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);

  const getStatusColor = (day) => {
    if (day < currentDay) return 'bg-emerald-500';
    if (day === currentDay) return 'bg-primary';
    return 'bg-slate-200';
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Recovery timeline</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{patientName}</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Day {currentDay} / 30</span>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-10">
        {days.map((day) => (
          <div key={day} className="space-y-2">
            <div className={`h-3 rounded-full ${getStatusColor(day)}`} />
            <p className="text-center text-xs text-slate-500">Day {day}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

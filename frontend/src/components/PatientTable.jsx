import { Search } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function PatientTable({ patients, onSelect, search, onSearch, filter, onFilter }) {
  const filteredPatients = patients.filter((patient) => {
    const matchesFilter = filter === 'All' || patient.risk_level === filter;
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Patient overview</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">Recent patient status</h3>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search patient"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary sm:w-52"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => onFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option>All</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 pr-4 font-medium">Patient</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Latest issue</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => onSelect(patient.id)}
                className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {patient.name.split(' ').map((part) => part[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{patient.name}</p>
                      <p className="text-xs text-slate-500">Age {patient.age}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <RiskBadge level={patient.risk_level} />
                </td>
                <td className="py-3 pr-4 text-sm text-slate-600">
                  {patient.alerts?.[0]?.message || 'No concerns'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

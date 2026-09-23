import { Activity, Bell, CalendarDays, HeartPulse, ShieldAlert, Stethoscope } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/patient', label: 'Dashboard', icon: Activity },
  { to: '/patient/symptoms', label: 'Daily Check-in', icon: HeartPulse },
  { to: '/patient/medications', label: 'Medications', icon: ShieldAlert },
  { to: '/patient/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/patient/recovery', label: 'Recovery Timeline', icon: Stethoscope },
  { to: '/nurse', label: 'Clinical Dashboard', icon: Bell },
  { to: '/alerts', label: 'Alerts', icon: Bell },
];

export default function Sidebar({ role }) {
  const visibleLinks = role === 'PATIENT' ? links.filter((link) => link.to !== '/nurse') : links;

  return (
    <aside className="hidden w-64 flex-none border-r border-slate-200 bg-slate-50 p-4 lg:block">
      <div className="space-y-2">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

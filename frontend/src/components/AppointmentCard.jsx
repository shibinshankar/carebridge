import { CalendarDays, Clock3, Stethoscope } from 'lucide-react';

export default function AppointmentCard({ appointment }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Upcoming</p>
          <p className="text-lg font-semibold text-slate-800">{appointment.department}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          {appointment.doctor_name}
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {appointment.appointment_time}
        </div>
      </div>
    </div>
  );
}

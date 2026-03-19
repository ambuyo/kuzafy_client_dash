'use client';

import {
  HiOutlineCalendar,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineX,
} from 'react-icons/hi';
import { APPOINTMENTS, AppointmentStatus } from '@/data/mock';
import { cn } from '@/lib/cn';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; cls: string; icon: React.ElementType }> = {
  confirmed:  { label: 'Confirmed',  cls: 'bg-green-100 text-green-700',  icon: HiOutlineCheckCircle },
  pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700', icon: HiOutlineClock },
  completed:  { label: 'Completed',  cls: 'bg-blue-100 text-blue-700',    icon: HiOutlineCheckCircle },
  no_show:    { label: 'No-show',    cls: 'bg-red-100 text-red-600',      icon: HiOutlineX },
  cancelled:  { label: 'Cancelled',  cls: 'bg-gray-100 text-gray-500',    icon: HiOutlineX },
};

export default function AppointmentsPage() {
  const upcoming = APPOINTMENTS.filter((a) => a.status === 'confirmed' || a.status === 'pending');
  const past     = APPOINTMENTS.filter((a) => a.status === 'completed' || a.status === 'no_show' || a.status === 'cancelled');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-400">{upcoming.length} upcoming · Growth+ tier</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          <HiOutlinePlus className="h-4 w-4" /> New booking
        </button>
      </div>

      {['Upcoming', 'Past'].map((section, si) => {
        const items = si === 0 ? upcoming : past;
        return (
          <div key={section}>
            <h2 className="mb-3 text-sm font-semibold text-gray-600">{section}</h2>
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl bg-white py-12 text-sm text-gray-400 ring-1 ring-gray-100">
                  No {section.toLowerCase()} appointments
                </div>
              ) : (
                items.map((apt) => {
                  const st = STATUS_CONFIG[apt.status];
                  const StatusIcon = st.icon;
                  return (
                    <div key={apt.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                        <HiOutlineCalendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{apt.contactName}</p>
                        <p className="text-sm text-gray-500">{apt.service} · {apt.staff}</p>
                        <p className="text-xs text-gray-400">{apt.date} at {apt.time}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', st.cls)}>
                          <StatusIcon className="h-3 w-3" /> {st.label}
                        </span>
                        {apt.depositPaid && (
                          <span className="text-[10px] text-green-600 font-medium">Deposit paid ✓</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

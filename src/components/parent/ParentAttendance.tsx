import React, { useState, useEffect } from 'react';
import { AttendanceRecord } from '../../types';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const ParentAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch('/api/attendance')
      .then(r => r.json())
      .then(d => setAttendance(d))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Child Attendance History</h1>
        <p className="text-xs text-slate-500">Transparent daily attendance records marked personally by SSR Sir.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Teacher Remark / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {attendance.map(a => (
              <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{a.date}</td>
                <td className="p-4">
                  {a.status === 'present' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  )}
                  {a.status === 'absent' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )}
                  {a.status === 'late' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> Late
                    </span>
                  )}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 italic">{a.remarks || 'Regular class attendance'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

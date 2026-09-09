import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';

interface TeacherHistoryProps {
  title: string;
  endpoint: string;
}

export const TeacherHistory: React.FC<TeacherHistoryProps> = ({ title, endpoint }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(endpoint).then(response => response.json()).then(setItems).catch(() => setItems([]));
  }, [endpoint]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><ClipboardList className="w-6 h-6 text-indigo-600" /> {title}</h1>
        <p className="text-xs text-slate-500">A retained record of submitted requests and their current status.</p>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead><tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase"><th className="p-4">Name / Student</th><th className="p-4">Contact</th><th className="p-4">Details</th><th className="p-4">Status</th><th className="p-4">Date</th></tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => <tr key={item.id} className="text-slate-700 dark:text-slate-300"><td className="p-4 font-bold">{item.studentName || item.name || item.parentName}</td><td className="p-4">{item.phone || item.email || '-'}</td><td className="p-4">{item.class || item.subject || item.message || '-'}</td><td className="p-4">{item.status || 'Received'}</td><td className="p-4">{item.date || '-'}</td></tr>)}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-8 text-center text-slate-500">No history records yet.</p>}
      </div>
    </div>
  );
};
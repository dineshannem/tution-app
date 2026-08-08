import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { PageTransition } from '../PageTransition';

export const TeacherApprovals: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admission-requests')
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch(() => setApplications([]));
  }, []);

  const handleUpdateStatus = async (id: string, action: 'approve' | 'reject') => {
    const res = await fetch(`/api/admission-requests/${id}/${action}`, { method: 'POST' });
    if (!res.ok) return;
    const result = await res.json();
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: result.admission?.status || (action === 'approve' ? 'approved' : 'rejected') } : app)));
  };

  const filtered = applications.filter((app) =>
    app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    app.parentName?.toLowerCase().includes(search.toLowerCase()) ||
    app.phone?.includes(search)
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Approvals</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review new admission applications and approve student enrollment.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, parent, or phone"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 text-center text-slate-500">
              No new applications found.
            </div>
          ) : (
            filtered.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{application.studentName}</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Parent: {application.parentName}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full ${application.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : application.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {application.status || 'Pending'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-slate-600 dark:text-slate-300">
                  <div>
                    <p><strong>Class:</strong> {application.class}</p>
                    <p><strong>Board:</strong> {application.board}</p>
                  </div>
                  <div>
                    <p><strong>Phone:</strong> {application.phone}</p>
                    <p><strong>Date:</strong> {application.date}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(application.id, 'approve')}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(application.id, 'reject')}
                    className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                    Reject
                  </button>
                  <button className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
};

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Search } from 'lucide-react';
import { PageTransition } from '../PageTransition';

export const TeacherDemoDetails: React.FC = () => {
  const [demos, setDemos] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/demo-requests')
      .then((res) => res.json())
      .then((data) => setDemos(data))
      .catch(() => setDemos([]));
  }, []);

  const handleConfirmDemo = async (id: string) => {
    const res = await fetch(`/api/demo-requests/${id}/confirm`, { method: 'POST' });
    if (!res.ok) return;
    const result = await res.json();
    setDemos((prev) => prev.map((demo) => (demo.id === id ? { ...demo, status: result.demo.status } : demo)));
  };

  const filtered = demos.filter((demo) =>
    demo.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    demo.parentName?.toLowerCase().includes(search.toLowerCase()) ||
    demo.phone?.includes(search)
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Demo Requests</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track trial class requests submitted from the public demo form.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, class or phone"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 text-center text-slate-500">
              No demo requests available.
            </div>
          ) : (
            filtered.map((demo) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/40 p-3 text-amber-700 dark:text-amber-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">{demo.studentName}</h2>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Parent: {demo.parentName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    {demo.date}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[12px] text-slate-600 dark:text-slate-300">
                  <div>
                    <p><strong>Class:</strong> {demo.class}</p>
                    <p><strong>Board:</strong> {demo.board}</p>
                  </div>
                  <div>
                    <p><strong>Phone:</strong> {demo.phone}</p>
                    <p><strong>Email:</strong> {demo.email}</p>
                  </div>
                  <div>
                    <p><strong>Preferred Time:</strong> {demo.preferredTime}</p>
                    <p><strong>Status:</strong> {demo.status || 'Pending'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleConfirmDemo(demo.id)}
                    className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
                  >
                    {demo.status === 'contacted' ? 'Confirmed' : 'Confirm Demo'}
                  </button>
                  <button className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition">
                    Review Details
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

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Search } from 'lucide-react';
import { PageTransition } from '../PageTransition';

export const TeacherEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/enquiries')
      .then((res) => res.json())
      .then((data) => setEnquiries(data))
      .catch(() => setEnquiries([]));
  }, []);

  const filtered = enquiries.filter((enquiry) =>
    enquiry.name?.toLowerCase().includes(search.toLowerCase()) ||
    enquiry.phone?.includes(search) ||
    enquiry.message?.toLowerCase().includes(search.toLowerCase())
  );

  const markReviewed = (id: string) => {
    setReviewedIds((prev) => [...prev, id]);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Public Enquiries</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review incoming contact messages sent through the public site.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or message"
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 text-center text-slate-500">
              No enquiry messages available.
            </div>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`rounded-3xl border p-5 shadow-sm ${reviewedIds.includes(item.id) ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}
              >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 p-3 text-indigo-700 dark:text-indigo-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">{item.name}</span>
                    <span>•</span>
                    <span>{item.phone}</span>
                    <span>•</span>
                    <span>{item.email}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.message}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                    <span>{item.subject}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition">Reply</button>
                <button
                  onClick={() => markReviewed(item.id)}
                  className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  {reviewedIds.includes(item.id) ? 'Reviewed' : 'Mark Reviewed'}
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

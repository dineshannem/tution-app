import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TestResult } from '../../types';
import { Award, CheckCircle2 } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (!user?.studentId) {
      setResults([]);
      return;
    }
    fetch(`/api/test-results?studentId=${encodeURIComponent(user.studentId)}`)
      .then(r => r.json())
      .then(d => setResults(d))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Test Results & Marks</h1>
        <p className="text-xs text-slate-500">Track your daily & weekly test performance in Mathematics, Science, and Board exams.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Test Title</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Score Obtained</th>
              <th className="p-4">Percentage</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Teacher Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {results.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.title}</td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{t.subject}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.marksObtained} / {t.maxMarks}</td>
                <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{t.percentage}%</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800">
                    {t.grade}
                  </span>
                </td>
                <td className="p-4 text-slate-500 italic">{t.remarks || 'Keep up the good work!'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

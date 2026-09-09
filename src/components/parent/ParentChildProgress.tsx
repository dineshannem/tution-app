import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TestResult } from '../../types';
import { Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ParentChildProgress: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(students => {
        const childId = user?.studentId || students.find((student: any) => student.parentEmail === user?.email)?.id;
        return childId ? fetch(`/api/test-results?studentId=${encodeURIComponent(childId)}`) : Promise.resolve({ json: () => Promise.resolve([]) });
      })
      .then(r => r.json())
      .then(d => setResults(d))
      .catch(err => console.error(err));
  }, [user?.studentId, user?.email]);

  const chartData = results.map(r => ({
    name: r.title.length > 15 ? r.title.substring(0, 15) + '...' : r.title,
    percentage: r.percentage
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Academic Progress & Test Marks</h1>
        <p className="text-xs text-slate-500">Track score trajectory across daily and weekly board preparation tests.</p>
      </div>

      {/* Trajectory Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Test Performance Growth Curve
        </h3>
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'Score']}
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="table-scroll w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Test Title</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Score</th>
              <th className="p-4">Percentage</th>
              <th className="p-4">Grade</th>
              <th className="p-4">SSR Sir Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {results.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.title}</td>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{t.subject}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.marksObtained} / {t.maxMarks}</td>
                <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.percentage}%</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800">
                    {t.grade}
                  </span>
                </td>
                <td className="p-4 text-slate-500 italic">{t.remarks || 'Excellent progress!'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

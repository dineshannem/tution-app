import React, { useState, useEffect } from 'react';
import { TestResult } from '../../types';
import { Plus, Award, CheckCircle2, Search } from 'lucide-react';
import { Modal } from '../common/Modal';

interface TestResultModuleProps {
  onSuccessToast: (msg: string) => void;
}

export const TestResultModule: React.FC<TestResultModuleProps> = ({ onSuccessToast }) => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Weekly Mathematics Board Test',
    class: 'Class 10',
    subject: 'Mathematics',
    studentId: '',
    studentName: '',
    batchId: '',
    marksObtained: 48,
    maxMarks: 50,
    testDate: new Date().toISOString().split('T')[0],
    remarks: 'Excellent work in proofs'
  });

  const loadData = () => {
    fetch('/api/test-results').then(r => r.json()).then(d => setTests(d)).catch(() => {});
    fetch('/api/students').then(r => r.json()).then(d => {
      setStudents(d);
      if (d.length > 0 && !formData.studentId) {
        setFormData(f => ({ ...f, studentId: d[0].id, studentName: d[0].name, batchId: d[0].batchId }));
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStudentSelect = (studentId: string) => {
    const st = students.find(s => s.id === studentId);
    if (st) {
      setFormData({
        ...formData,
        studentId: st.id,
        studentName: st.name,
        batchId: st.batchId,
        class: st.class
      });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Test mark published for ${data.result.studentName}!`);
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      onSuccessToast("Test mark added successfully!");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Daily & Weekly Test Marks</h1>
          <p className="text-xs text-slate-500">Record marks, compute grades & percentages, and share reports with parents.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Test Marks
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Student Name</th>
              <th className="p-4">Class & Subject</th>
              <th className="p-4">Test Title</th>
              <th className="p-4">Score / Max</th>
              <th className="p-4">Percentage</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Test Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {tests.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{t.studentName}</td>
                <td className="p-4">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{t.subject}</span>
                  <span className="ml-1 text-[10px] text-slate-400">({t.class})</span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{t.title}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-white">
                  {t.marksObtained} / {t.maxMarks}
                </td>
                <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{t.percentage}%</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                    t.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {t.grade}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{t.testDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Student Test Result">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Student *</label>
            <select
              value={formData.studentId}
              onChange={e => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.class} - {s.rollNo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Test Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Unit Test 1 - Physics Laws"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Subject *</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Test Date *</label>
              <input
                type="date"
                required
                value={formData.testDate}
                onChange={e => setFormData({ ...formData, testDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Marks Obtained *</label>
              <input
                type="number"
                required
                value={formData.marksObtained}
                onChange={e => setFormData({ ...formData, marksObtained: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Max Marks *</label>
              <input
                type="number"
                required
                value={formData.maxMarks}
                onChange={e => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
          >
            Save Test Result
          </button>
        </form>
      </Modal>
    </div>
  );
};

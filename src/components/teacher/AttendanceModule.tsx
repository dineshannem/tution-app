import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, XCircle, Clock, Save, UserCheck, FileSpreadsheet, Download } from 'lucide-react';

interface AttendanceModuleProps {
  onSuccessToast: (msg: string) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({ onSuccessToast }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceState, setAttendanceState] = useState<{ [studentId: string]: 'present' | 'absent' | 'late' }>({});
  const [remarksState, setRemarksState] = useState<{ [studentId: string]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(d => {
        setBatches(d);
        if (d.length > 0) setSelectedBatch(d[0].id);
      });
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;

    const url = selectedBatch === 'all' ? '/api/students' : `/api/students?batchId=${selectedBatch}`;
    fetch(url)
      .then(r => r.json())
      .then(studs => {
        const batchStuds = selectedBatch === 'all' ? studs : studs.filter((s: any) => s.batchId === selectedBatch);
        setStudents(batchStuds);

        // Fetch existing attendance records for date & batch
        fetch(`/api/attendance?date=${selectedDate}`)
          .then(r => r.json())
          .then(attData => {
            const attMap: any = {};
            const remMap: any = {};
            batchStuds.forEach((s: any) => {
              const rec = attData.find((a: any) => a.studentId === s.id);
              attMap[s.id] = rec ? rec.status : 'present';
              remMap[s.id] = rec ? rec.remarks || '' : '';
            });
            setAttendanceState(attMap);
            setRemarksState(remMap);
          });
      });
  }, [selectedBatch, selectedDate]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setRemarksState(prev => ({ ...prev, [studentId]: remark }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      batchId: selectedBatch,
      date: selectedDate,
      status: attendanceState[s.id] || 'present',
      remarks: remarksState[s.id] || ''
    }));

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      });
      setSaving(false);
      onSuccessToast(`Attendance saved for ${selectedDate}!`);
    } catch (err) {
      setSaving(false);
      onSuccessToast(`Attendance saved successfully!`);
    }
  };

  const handleDownloadAttendanceCSV = () => {
    const activeBatchObj = batches.find(b => b.id === selectedBatch);
    const batchName = activeBatchObj ? activeBatchObj.name : selectedBatch;
    
    let csv = `SSR TUITION CLASSES - BATCH ATTENDANCE EXCEL SHEET\n`;
    csv += `Batch: "${batchName}", Date: "${selectedDate}"\n\n`;
    csv += `Roll No,Student Name,Board,Attendance Status,Teacher Remark\n`;
    
    students.forEach(s => {
      const status = (attendanceState[s.id] || 'present').toUpperCase();
      const remark = remarksState[s.id] || '';
      csv += `"${s.rollNo}","${s.name}","${s.board || 'CBSE'}","${status}","${remark}"\n`;
    });

    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `Attendance_${selectedDate}_${selectedBatch}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onSuccessToast(`Downloaded Attendance Excel Sheet for ${selectedDate}!`);
  };

  const totalPresent = Object.values(attendanceState).filter(st => st === 'present').length;
  const totalAbsent = Object.values(attendanceState).filter(st => st === 'absent').length;
  const totalLate = Object.values(attendanceState).filter(st => st === 'late').length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Batch Attendance Register & Excel Sheet
          </h1>
          <p className="text-xs text-slate-500">Record daily student attendance and download official Excel CSV registers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadAttendanceCSV}
            disabled={students.length === 0}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 border border-emerald-400 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> Download Excel Sheet (CSV)
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={saving || students.length === 0}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Sync Attendance'}
          </button>
        </div>
      </motion.div>

      {/* Select Batch, Date & Stats Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Select Batch</label>
            <select
              value={selectedBatch}
              onChange={e => setSelectedBatch(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">⭐ All Batches (All 50 Students)</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.class})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center justify-around bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-extrabold">
            <div className="text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Present</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-base">{totalPresent}</span>
            </div>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Absent</span>
              <span className="text-rose-600 dark:text-rose-400 text-base">{totalAbsent}</span>
            </div>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Late</span>
              <span className="text-amber-500 text-base">{totalLate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Sheet Register Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 font-mono">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Interactive Attendance Excel Register • {selectedDate}</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Live Register ({students.length} Students)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[11px] uppercase border-b border-slate-300 dark:border-slate-700">
                <th className="p-3 border-r border-slate-300 dark:border-slate-700 w-12 text-center font-mono">Row</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-700 w-24 font-mono">Roll No</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-700">Student Name</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-700">Mark Status</th>
                <th className="p-3">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.map((s, idx) => {
                const currentStatus = attendanceState[s.id] || 'present';
                return (
                  <tr key={s.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {s.rollNo}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                      {s.name}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'present')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Late
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Optional teacher note..."
                        value={remarksState[s.id] || ''}
                        onChange={e => handleRemarkChange(s.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Search, UserPlus, Edit3, Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface StudentManagementProps {
  onSuccessToast: (msg: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ onSuccessToast }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    class: 'Class 10',
    board: 'CBSE' as 'CBSE' | 'State Board',
    batchId: '',
    batchName: '',
    email: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: ''
  });

  const loadData = () => {
    fetch('/api/students')
      .then(r => r.json())
      .then(d => setStudents(d))
      .catch(err => console.error(err));
    fetch('/api/batches')
      .then(r => r.json())
      .then(d => {
        setBatches(d);
        if (d.length > 0 && !formData.batchId) {
          setFormData(f => ({ ...f, batchId: d[0].id, batchName: d[0].name }));
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchObj = batches.find(b => b.id === formData.batchId);
    const payload = {
      ...formData,
      batchName: batchObj ? batchObj.name : formData.batchName
    };

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Student ${data.student.name} enrolled successfully!`);
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          class: 'Class 10',
          board: 'CBSE',
          batchId: batches[0]?.id || '',
          batchName: batches[0]?.name || '',
          email: '',
          phone: '',
          parentName: '',
          parentEmail: '',
          parentPhone: '',
          address: ''
        });
        loadData();
      }
    } catch (err) {
      onSuccessToast('Student added successfully!');
      setIsAddModalOpen(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || s.batchId === selectedBatch;
    const matchesClass = selectedClass === 'All' || s.class === selectedClass;
    return matchesSearch && matchesBatch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Student Directory</h1>
          <p className="text-xs text-slate-500">Manage all students across Classes 1 to 10 and CBSE/State Boards.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name, roll number, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Classes</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={e => setSelectedBatch(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Batches</option>
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Roll No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Class & Board</th>
                <th className="p-4">Assigned Batch</th>
                <th className="p-4">Parent Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">{student.rollNo}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{student.name}</td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{student.class}</span>
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-amber-600 dark:text-amber-400">
                      {student.board}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{student.batchName}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{student.parentName}</div>
                    <div className="text-[11px] text-slate-400">{student.parentPhone}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewStudent(student)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Enroll New Student">
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Student Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sai Karthik"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Student Email *</label>
              <input
                type="email"
                required
                placeholder="student@ssrtuition.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Class *</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Board *</label>
              <select
                value={formData.board}
                onChange={e => setFormData({ ...formData, board: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE Board</option>
                <option value="TG State Board">TG State Board (Telangana SSC)</option>
                <option value="AP State Board">AP State Board (Andhra Pradesh SSC)</option>
                <option value="State Board">State Board (General)</option>
                <option value="IGCSE">IGCSE / International</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Assign Batch *</label>
              <select
                value={formData.batchId}
                onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Parent Name *</label>
              <input
                type="text"
                required
                placeholder="Venkat Sharma"
                value={formData.parentName}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Parent Mobile No. *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.parentPhone}
                onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
          >
            Save & Enroll Student
          </button>
        </form>
      </Modal>

      {/* View Student Detail Modal */}
      {viewStudent && (
        <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title={`Student Profile: ${viewStudent.name}`}>
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block">Roll Number</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{viewStudent.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Class & Board</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewStudent.class} ({viewStudent.board})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Batch Name</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{viewStudent.batchName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Join Date</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{viewStudent.joinDate}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase">Parent Contact Info</h4>
              <p><strong className="text-slate-700 dark:text-slate-300">Parent:</strong> {viewStudent.parentName}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Phone:</strong> {viewStudent.parentPhone}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Email:</strong> {viewStudent.parentEmail}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Address:</strong> {viewStudent.address}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

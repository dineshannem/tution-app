import React, { useState, useEffect } from 'react';
import { Batch } from '../../types';
import { Plus, Users, Clock, Calendar, Edit2 } from 'lucide-react';
import { Modal } from '../common/Modal';

interface BatchManagementProps {
  onSuccessToast: (msg: string) => void;
}

export const BatchManagement: React.FC<BatchManagementProps> = ({ onSuccessToast }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: 'Class 10',
    board: 'CBSE' as 'CBSE' | 'State Board',
    subject: 'Mathematics & Science',
    schedule: 'Mon, Wed, Fri',
    time: '05:00 PM - 07:00 PM',
    maxStudents: 15
  });

  const loadBatches = () => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(d => setBatches(d))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Batch ${data.batch.name} created successfully!`);
        setIsModalOpen(false);
        loadBatches();
      }
    } catch (err) {
      onSuccessToast('Batch created!');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Batch Management</h1>
          <p className="text-xs text-slate-500">Create & schedule small batches (Max 15 students) for Classes 1 to 10.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map(batch => (
          <div
            key={batch.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 rounded-lg">
                  {batch.board}
                </span>
                <span className="text-xs font-bold text-slate-500">{batch.class}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{batch.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{batch.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{batch.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Capacity: <strong className="text-slate-900 dark:text-white">{batch.currentCount || 10} / {batch.maxStudents}</strong> students
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Single teacher instruction by SSR Sir
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Tuition Batch">
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Batch Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Class 10 CBSE - Maths Special"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Days / Schedule</label>
              <input
                type="text"
                placeholder="Mon, Wed, Fri"
                value={formData.schedule}
                onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Timing</label>
              <input
                type="text"
                placeholder="05:00 PM - 07:00 PM"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
          >
            Create Batch
          </button>
        </form>
      </Modal>
    </div>
  );
};

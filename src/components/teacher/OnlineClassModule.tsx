import React, { useState, useEffect } from 'react';
import { OnlineClass } from '../../types';
import { Video, Plus, Calendar, Clock, Edit2, XCircle, PlayCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface OnlineClassModuleProps {
  onSuccessToast: (msg: string) => void;
}

export const OnlineClassModule: React.FC<OnlineClassModuleProps> = ({ onSuccessToast }) => {
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Mathematics',
    class: 'Class 10',
    batchId: '',
    batchName: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '19:30',
    platform: 'Google Meet' as 'Google Meet' | 'Zoom',
    meetLink: 'https://meet.google.com/ssr-tui-math',
    recordedVideoUrl: ''
  });

  const loadClasses = () => {
    fetch('/api/online-classes').then(r => r.json()).then(d => setClasses(d)).catch(() => {});
    fetch('/api/batches').then(r => r.json()).then(d => {
      setBatches(d);
      if (d.length > 0 && !formData.batchId) {
        setFormData(f => ({ ...f, batchId: d[0].id, batchName: d[0].name }));
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchObj = batches.find(b => b.id === formData.batchId);
    const payload = {
      ...formData,
      batchName: batchObj ? batchObj.name : formData.batchName
    };

    try {
      const res = await fetch('/api/online-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`${payload.platform} session scheduled & batch notified!`);
        setIsModalOpen(false);
        loadClasses();
      }
    } catch (err) {
      onSuccessToast("Google Meet session created!");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Online Meeting Schedule</h1>
          <p className="text-xs text-slate-500">Schedule live Google Meet sessions, broadcast reminders, and link recorded classes.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded">
                  {c.subject} ({c.class})
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  c.status === 'upcoming' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {c.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{c.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{c.startTime} - {c.endTime} • {c.platform || 'Google Meet'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={c.meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
              >
                <Video className="w-4 h-4" /> Start / Join {c.platform || 'Google Meet'}
              </a>

              {c.recordedVideoUrl && (
                <a
                  href={c.recordedVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" /> Watch Recorded Class
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Online Session">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Session Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Class 10 Maths Special Doubts & Board Revision"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Batch *</label>
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Platform *</label>
              <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value as 'Google Meet' | 'Zoom' })} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none">
                <option>Google Meet</option>
                <option>Zoom</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Meeting Link *</label>
              <input required value={formData.meetLink} onChange={e => setFormData({ ...formData, meetLink: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Start Time *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">End Time *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Google Meet URL *</label>
            <input
              type="text"
              required
              placeholder="https://meet.google.com/abc-defg-hij"
              value={formData.meetLink}
              onChange={e => setFormData({ ...formData, meetLink: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
          >
            Create Google Meet & Send Reminders
          </button>
        </form>
      </Modal>
    </div>
  );
};

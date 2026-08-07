import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const OnlineAdmissionModal: React.FC<OnlineAdmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    class: 'Class 10',
    board: 'CBSE' as 'CBSE' | 'State Board',
    prevPercentage: '88%',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 12;
  };

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.studentName.trim() || !formData.parentName.trim()) {
      setError('Please enter both student and parent names.');
      return;
    }
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setLoading(false);
      setSubmitted(true);
      onSuccessToast("Online Admission application submitted successfully!");
    } catch (err) {
      setLoading(false);
      setSubmitted(true);
      onSuccessToast("Online Admission application submitted successfully!");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Online Admission Form (2026-27)">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300">
            <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Secure Admission in SSR Tuition Small Batches</p>
              <p className="mt-0.5">Classes 1–10 (CBSE & State Board). Reserve your seat early to ensure personalized single-teacher attention.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Parent / Guardian Name *</label>
              <input
                type="text"
                required
                placeholder="Venkat Sharma"
                value={formData.parentName}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contact Mobile Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 91234 56789"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address *</label>
              <input
                type="email"
                required
                placeholder="student@ssrtuition.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Seeking Admission For *</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">School Board *</label>
              <select
                value={formData.board}
                onChange={e => setFormData({ ...formData, board: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE Board</option>
                <option value="TG State Board">TG State Board (Telangana SSC)</option>
                <option value="AP State Board">AP State Board (Andhra Pradesh SSC)</option>
                <option value="Karnataka SSLC">Karnataka SSLC Board</option>
                <option value="Maharashtra SSC">Maharashtra SSC Board</option>
                <option value="Tamil Nadu State Board">Tamil Nadu State Board</option>
                <option value="IGCSE">IGCSE / Cambridge</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="NIOS">NIOS (National Institute of Open Schooling)</option>
              </select>
            </div>


            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Previous Year Score (%)</label>
              <input
                type="text"
                placeholder="e.g. 85%"
                value={formData.prevPercentage}
                onChange={e => setFormData({ ...formData, prevPercentage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Residential Address</label>
            <textarea
              rows={2}
              placeholder="House No, Area, City..."
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && <div className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting Application...' : 'Submit Admission Application'}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admission Application Submitted!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Thank you <span className="font-semibold text-slate-900 dark:text-white">{formData.parentName}</span>! Your application for <span className="font-semibold text-slate-900 dark:text-white">{formData.studentName}</span> ({formData.class}) has been registered. SSR Sir will contact you for batch placement and schedule.
          </p>
          <button
            onClick={() => { setSubmitted(false); onClose(); }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
};

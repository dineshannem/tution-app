import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { onlyNumbers, isValidIndianPhone } from '../../lib/validation';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    email: '',
    class: 'Class 10',
    board: 'CBSE' as 'CBSE' | 'State Board',
    preferredTime: '05:00 PM'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidPhone = (value: string) => {
    const digits = onlyNumbers(value, 10);
    return isValidIndianPhone(digits);
  };

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.parentName.trim() || !formData.studentName.trim()) {
      setError('Please fill in both parent and student names.');
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
      const res = await fetch('/api/demo-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to submit demo request.');
      }
      setLoading(false);
      setSubmitted(true);
      onSuccessToast("Free Demo request submitted! SSR Sir will contact you shortly.");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Unable to submit demo request. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register for Free Demo Class">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Experience SSR Sir's Teaching Firsthand!</p>
              <p className="mt-0.5">Attend a 1-day free live/offline batch trial. No obligation. Personal guidance in Telugu & English.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Parent Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Srinivas Reddy"
                value={formData.parentName}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Student Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya"
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile / WhatsApp No. *</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: onlyNumbers(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="parent@gmail.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Class *</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Preferred Batch Time</label>
              <select
                value={formData.preferredTime}
                onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                <option value="05:30 PM">05:30 PM - 07:00 PM</option>
                <option value="07:00 PM">07:00 PM - 08:30 PM</option>
              </select>
            </div>
          </div>

          {error && <div className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting Registration...' : 'Confirm Free Demo Booking'}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Demo Booking Confirmed!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Thank you, <span className="font-semibold text-slate-900 dark:text-white">{formData.parentName}</span>. SSR Sir will contact you on <span className="font-semibold text-slate-900 dark:text-white">{formData.phone}</span> within 2 hours to confirm slot details.
          </p>
          <button
            onClick={() => { setSubmitted(false); onClose(); }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
};

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { onlyNumbers, isValidIndianPhone } from '../../lib/validation';
import { PageTransition } from '../PageTransition';
import { staggerContainer, listItem } from '../../lib/animations';

interface PublicContactProps {
  onSuccessToast: (msg: string) => void;
}

export const PublicContact: React.FC<PublicContactProps> = ({ onSuccessToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidPhone = (value: string) => {
    const digits = onlyNumbers(value, 10);
    return isValidIndianPhone(digits);
  };

  const isValidEmail = (value: string) => value.includes('@') && value.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      setError('Please enter a valid email address containing @ and domain.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please add your enquiry details before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to send enquiry.');
      }
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      onSuccessToast("Enquiry message sent! SSR Sir will contact you shortly.");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Unable to send enquiry. Please try again.');
    }
  };

  return (
    <PageTransition>
      <div className="public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
            Contact Us
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Visit SSR Tuition Learning Center
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Located centrally in Hyderabad with convenient access, safe environment, and direct parent counseling.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
              <h2 className="text-xl font-bold">Contact Details</h2>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block text-sm">Center Address</span>
                    <span>H.No 4-12, Main Road, Near Bus Stop, Hyderabad, Telangana 500038</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-sm">Direct Phone / WhatsApp</span>
                    <span>+91 98765 43210 / +91 91234 56789</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block text-sm">Email Address</span>
                    <span>teacher@ssrtuition.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block text-sm">Batch Hours</span>
                    <span>
                      Mon - Sat: 04:00 PM - 08:30 PM
                      <br />
                      Sunday: Doubts & Special Revision
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg h-64 bg-slate-800 relative flex items-center justify-center p-6 text-center">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80')"
                }}
              />
              <div className="relative z-10 space-y-2 bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700">
                <MapPin className="w-7 h-7 text-rose-500 mx-auto animate-bounce" />
                <h4 className="text-xs font-bold text-white">SSR Tuition Hyderabad Center</h4>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl transition-colors shadow"
                >
                  Open Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
          >
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Send Direct Enquiry</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Parent or Student Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: onlyNumbers(e.target.value, 10) })
                    }
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="parent@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Admission Enquiry"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Mention class, board (CBSE/State), and any specific questions..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              {error && (
                <div className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending Message...' : 'Submit Message to SSR Sir'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
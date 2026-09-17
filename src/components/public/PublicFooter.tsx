import { motion } from 'motion/react';
import { GraduationCap, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface PublicFooterProps {
  setActiveTab?: (tab: string) => void;
  openFreeDemo?: () => void;
  openAdmission?: () => void;
}

export const PublicFooter = ({ setActiveTab, openFreeDemo, openAdmission }: PublicFooterProps) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-20 bg-slate-50 text-slate-900 border-t border-slate-200 dark:bg-slate-950 dark:text-white dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center text-white shadow-lg"
              >
                <GraduationCap className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">SSR TUITION</p>
                <p className="text-[11px] text-amber-700 font-bold tracking-wide dark:text-amber-400">SINGLE TEACHER EXCELLENCE</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-400">
              Dedicated teaching for Classes 1–10 (CBSE & State Board). Personal care by owner-teacher SSR Sir with clear Telugu & English explanation, daily homework checking, and small batch focus.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold dark:text-emerald-400">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">✓</span>
              Small Batches (Max 15 Students)
            </div>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-bold text-slate-900 tracking-wide dark:text-white">QUICK NAVIGATION</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              {[
                { label: 'Home & Overview', tab: 'home' },
                { label: 'About SSR Sir (15+ Yrs Exp)', tab: 'about' },
                { label: 'Classes 1-10 CBSE & State Board', tab: 'courses' },
                { label: 'Classroom & Toppers Gallery', tab: 'gallery' }
              ].map((item) => (
                <motion.button
                  key={item.tab}
                  whileHover={{ x: 6, color: '#a5b4fc' }}
                  onClick={() => setActiveTab?.(item.tab)}
                  className="text-left transition-colors hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ x: 6 }}
                onClick={openFreeDemo}
                className="text-left text-amber-700 font-semibold dark:text-amber-400"
              >
                Book Free Demo Class
              </motion.button>
              <motion.button
                whileHover={{ x: 6 }}
                onClick={openAdmission}
                className="text-left text-indigo-700 font-semibold dark:text-indigo-400"
              >
                Apply Online Admission
              </motion.button>
            </div>
          </motion.div>

          {/* Contact & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-bold text-slate-900 tracking-wide dark:text-white">CONTACT & LOCATION</h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0 dark:text-amber-400" />
                <span>H.No 4-12, Main Road, Near Bus Stop, Hyderabad, Telangana 500038</span>
              </motion.div>
              <motion.a
                href="tel:+919876543210"
                whileHover={{ x: 4, color: '#6ee7b7' }}
                className="flex items-center gap-2.5"
              >
                <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0 dark:text-emerald-400" />
                <span>+91 98765 43210 / +91 91234 56789</span>
              </motion.a>
              <motion.a
                href="mailto:teacher@ssrtuition.com"
                whileHover={{ x: 4, color: '#a5b4fc' }}
                className="flex items-center gap-2.5"
              >
                <Mail className="w-4 h-4 text-indigo-700 flex-shrink-0 dark:text-indigo-400" />
                <span>teacher@ssrtuition.com</span>
              </motion.a>
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-700 mt-0.5 flex-shrink-0 dark:text-sky-400" />
                <span>
                  Mon - Sat: 04:00 PM - 08:30 PM
                  <br />
                  Sunday: Special Doubt Classes
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-bold text-slate-900 tracking-wide dark:text-white">TUITION LOCATION</h4>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden h-40 bg-slate-200 border border-slate-300 shadow-xl flex items-center justify-center dark:bg-slate-800 dark:border-slate-700"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80')"
                }}
              />
              <div className="relative z-10 text-center space-y-2 px-4">
                <MapPin className="w-7 h-7 text-rose-500 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">SSR Tuition Learning Center</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl transition-all shadow"
                >
                  View on Google Maps
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-500"
        >
          <span>© {new Date().getFullYear()} SSR Tuition. All rights reserved. Designed for Student Success.</span>
          <div className="flex items-center gap-3">
            <span>CBSE Board</span>
            <span>•</span>
            <span>Telangana State Board</span>
            <span>•</span>
            <span>Telugu & English Medium</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
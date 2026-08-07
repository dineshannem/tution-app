import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Clock, CheckCircle2, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openFreeDemo: () => void;
  openAdmission: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openFreeDemo, openAdmission }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Teacher Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">SSR TUITION</span>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Single Teacher Excellence</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated teaching for Classes 1–10 (CBSE & State Board). Personal care by owner-teacher SSR Sir with clear Telugu & English explanation, daily homework checking, and small batch focus.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Small Batches (Max 15 Students)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-blue-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-blue-400 transition-colors">
                  About SSR Sir (15+ Yrs Exp)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-blue-400 transition-colors">
                  Classes 1-10 CBSE & State Board
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-blue-400 transition-colors">
                  Classroom & Toppers Gallery
                </button>
              </li>
              <li>
                <button onClick={openFreeDemo} className="text-amber-400 hover:underline font-semibold">
                  Book Free Demo Class
                </button>
              </li>
              <li>
                <button onClick={openAdmission} className="text-blue-400 hover:underline font-semibold">
                  Apply Online Admission
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Location</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>H.No 4-12, Main Road, Near Bus Stop, Hyderabad, Telangana 500038</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 98765 43210 / +91 91234 56789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>teacher@ssrtuition.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Mon - Sat: 04:00 PM - 08:30 PM<br />Sunday: Special Doubt Classes</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Google Maps Embed Mock */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tuition Location</h4>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800 relative h-36 flex flex-col items-center justify-center p-4 text-center group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80')" }} />
              <div className="relative z-10 space-y-2">
                <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                <span className="text-xs font-bold text-white block">SSR Tuition Learning Center</span>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SSR Tuition. All rights reserved. Designed for Student Success.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>CBSE Board</span>
            <span>•</span>
            <span>Telangana State Board</span>
            <span>•</span>
            <span>Telugu & English Medium</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

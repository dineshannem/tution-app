import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, DollarSign, Award, BookOpen, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';

interface ParentDashboardProps {
  setActiveTab: (tab: string) => void;
  openPayModal: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ setActiveTab, openPayModal }) => {
  const { user } = useAuth();
  const [childResults, setChildResults] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.studentId) {
      setChildResults([]);
      return;
    }
    fetch(`/api/test-results?studentId=${encodeURIComponent(user.studentId)}`)
      .then(r => r.json())
      .then(d => setChildResults(d))
      .catch(() => {});
  }, [user]);

  const averageScore = childResults.length
    ? Math.round(childResults.reduce((sum, item) => sum + item.percentage, 0) / childResults.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-white/10 backdrop-blur-2xl">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Parent Portal • Academic Monitoring Desk
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'Parent'}!</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Monitor your child's daily attendance, homework submission rate, test performance, and pay monthly tuition fees securely via Razorpay.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={openPayModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" /> Pay Monthly Fee (Razorpay)
            </button>
            <button
              onClick={() => setActiveTab('p_progress')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/25 border border-emerald-400/30 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" /> View Test Marks Card
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Child Attendance</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">96.5%</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">22 Present / 23 Days</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Average Test Score</span>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 mt-1 block">
              {averageScore ? `${averageScore}%` : 'N/A'}
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1 inline-block bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {childResults.length ? `${childResults.length} tests recorded` : 'No results available'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Current Fee Status</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">Paid</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">July 2026 Cleared</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Teacher Contact</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">SSR Sir (Samba Siva Reddy Annem)</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-300 font-bold mt-1 block">+91 98765 43210</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Teacher Note & Direct Line */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Note from SSR Sir</h3>
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 backdrop-blur-md">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "Sai Karthik is performing exceptionally well in Mathematics quadratic proofs and Physics ray diagrams. His homework is submitted consistently on time. Please ensure he practices 3 board sample papers before next Sunday."
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">— Samba Siva Reddy Annem (Head Teacher)</span>
        </div>
      </div>
    </div>
  );
};

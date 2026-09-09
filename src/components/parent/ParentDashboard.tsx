import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, DollarSign, Award, BookOpen, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';
import { ReviewsEditor } from '../common/ReviewsEditor';
import { getStoredTestimonials } from '../../lib/reviews';

interface ParentDashboardProps {
  setActiveTab: (tab: string) => void;
  openPayModal: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ setActiveTab, openPayModal }) => {
  const { user } = useAuth();
  const [childResults, setChildResults] = useState<any[]>([]);
  const [publishedReviews, setPublishedReviews] = useState(0);

  useEffect(() => {
    const refreshReviews = () => {
      setPublishedReviews(getStoredTestimonials().length);
    };
    refreshReviews();
    window.addEventListener('ssr-reviews-changed', refreshReviews);
    return () => window.removeEventListener('ssr-reviews-changed', refreshReviews);
  }, []);

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
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 shadow-2xl sm:p-7 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(52,211,153,0.32),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.28),_transparent_28%)]" />
        <div className="relative z-10 space-y-3">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            Parent Portal • Academic Monitoring Desk
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">Welcome back, {user?.name || 'Parent'}!</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
            Monitor your child's daily attendance, homework submission rate, test performance, and pay monthly tuition fees securely via Razorpay.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={openPayModal}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-[11px] font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
            >
              <DollarSign className="w-4 h-4" /> Pay Monthly Fee (Razorpay)
            </button>
            <button
              onClick={() => setActiveTab('p_progress')}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-600 px-4 py-2.5 text-[11px] font-extrabold text-white shadow-lg shadow-emerald-500/25 transition-transform hover:-translate-y-0.5"
            >
              <Award className="w-4 h-4" /> View Test Marks Card
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Child Attendance</span>
            <span className="mt-2 block text-3xl font-black text-emerald-600 dark:text-emerald-400">96.5%</span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">22 Present / 23 Days</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Average Test Score</span>
            <span className="mt-2 block text-3xl font-black text-indigo-600 dark:text-indigo-300">
              {averageScore ? `${averageScore}%` : 'N/A'}
            </span>
            <span className="mt-2 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
              {childResults.length ? `${childResults.length} tests recorded` : 'No results available'}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Award className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current Fee Status</span>
            <span className="mt-2 block text-3xl font-black text-emerald-600 dark:text-emerald-400">Paid</span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">July 2026 Cleared</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Teacher Contact</span>
            <span className="mt-2 block text-sm font-black text-slate-900 dark:text-white">SSR Sir (Samba Siva Reddy Annem)</span>
            <span className="mt-2 block text-[11px] font-extrabold text-amber-600 dark:text-amber-300">+91 98765 43210</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <Phone className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Teacher Note & Direct Line */}
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
        <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Note from SSR Sir</h3>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs leading-relaxed text-slate-700 italic dark:text-slate-300">
            "Sai Karthik is performing exceptionally well in Mathematics quadratic proofs and Physics ray diagrams. His homework is submitted consistently on time. Please ensure he practices 3 board sample papers before next Sunday."
          </p>
          <span className="mt-3 block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">— Samba Siva Reddy Annem (Head Teacher)</span>
        </div>
      </div>
      {/* Reviews Editor for parents */}
      <div className="pt-2">
        <ReviewsEditor />
      </div>
    </div>
  );
};

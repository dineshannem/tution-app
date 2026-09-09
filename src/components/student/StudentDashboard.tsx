import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TestResult } from '../../types';
import { BookOpen, CheckCircle2, Video, FileText, Clock, Award, ArrowUpRight } from 'lucide-react';
import { ReviewsEditor } from '../common/ReviewsEditor';
import { getStoredTestimonials } from '../../lib/reviews';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [pendingHomework, setPendingHomework] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
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
    fetch('/api/online-classes')
      .then(r => r.json())
      .then(d => setUpcomingClasses(d.filter((c: any) => c.status === 'upcoming')))
      .catch(() => {});
    fetch('/api/homework')
      .then(r => r.json())
      .then(d => setPendingHomework(d.slice(0, 3)))
      .catch(() => {});
    fetch('/api/test-results')
      .then(r => r.json())
      .then(d => setResults(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-5 shadow-2xl sm:p-7 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.35),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.28),_transparent_28%)]" />
        <div className="relative z-10 space-y-3">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
            Student Portal • {user?.class || 'Class 10'} {user?.board || 'CBSE'}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
            Track your daily attendance, submit homework, join live Google Meet classes with SSR Sir, and download study notes.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('s_classes')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-[11px] font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" /> Join Today's Live Class
            </button>
            <button
              onClick={() => setActiveTab('s_homework')}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-600 px-4 py-2.5 text-[11px] font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" /> Submit Homework
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Attendance Rate</span>
            <span className="mt-2 block text-3xl font-black text-emerald-600 dark:text-emerald-400">96.5%</span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">22 / 23 Days Present</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pending Homework</span>
            <span className="mt-2 block text-3xl font-black text-amber-600 dark:text-amber-400">{pendingHomework.length}</span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">Due this week</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Latest Test Grade</span>
            <span className="mt-2 block text-2xl font-black text-indigo-600 dark:text-indigo-300">
              {results[0] ? `${results[0].grade} (${results[0].percentage}%)` : 'Awaiting Review'}
            </span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">
              {results[0] ? `${results[0].subject} • ${results[0].title}` : 'No recent marks posted yet'}
            </span>
          </div>
        </div>

        <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Published Reviews</span>
            <span className="mt-2 block text-3xl font-black text-indigo-600 dark:text-indigo-300">{publishedReviews}</span>
            <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">Reviews from students & parents</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Homework list */}
        <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Active Homework Assignments</h3>
              {results.length > 0 && (
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Latest exam score: {results[0].percentage}% on {results[0].title}</p>
              )}
            </div>
            <button onClick={() => setActiveTab('s_homework')} className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingHomework.length > 0 ? pendingHomework.map(hw => (
              <div key={hw.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="space-y-1">
                  <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">
                    {hw.subject}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{hw.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Due Date: {hw.dueDate}</p>
                </div>

                <button
                  onClick={() => setActiveTab('s_homework')}
                  className="rounded-xl border border-indigo-400/30 bg-indigo-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/20 transition-transform hover:-translate-y-0.5"
                >
                  Submit
                </button>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                No homework assigned right now. Great job staying on track.
              </div>
            )}
          </div>
        </div>

        {/* Live Classes */}
        <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Next Google Meet Class</h3>
            <button onClick={() => setActiveTab('s_classes')} className="text-xs font-extrabold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
              Schedule
            </button>
          </div>

          {upcomingClasses.length > 0 ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-2xl dark:border-white/15 dark:bg-white/5 dark:text-white">
              <span className="inline-flex rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">
                Today @ {upcomingClasses[0].startTime}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{upcomingClasses[0].title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">Taught live by SSR Sir on Google Meet</p>

              <a
                href={upcomingClasses[0].meetLink}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
              >
                <Video className="h-4 w-4" /> Open Google Meet Link
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              No upcoming online classes right now.
            </div>
          )}
        </div>
      </div>
      {/* Reviews Editor */}
      <div className="pt-2 lg:pt-4">
        <ReviewsEditor />
      </div>
    </div>
  );
};

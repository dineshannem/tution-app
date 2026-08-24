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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-white/10 backdrop-blur-2xl">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Student Portal • {user?.class || 'Class 10'} {user?.board || 'CBSE'}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Track your daily attendance, submit homework, join live Google Meet classes with SSR Sir, and download study notes.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => setActiveTab('s_classes')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" /> Join Today's Live Class
            </button>
            <button
              onClick={() => setActiveTab('s_homework')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Submit Homework
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">96.5%</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">22 / 23 Days Present</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pending Homework</span>
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">{pendingHomework.length}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Due this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Latest Test Grade</span>
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 mt-1 block">
                {results[0] ? `${results[0].grade} (${results[0].percentage}%)` : 'Awaiting Review'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                {results[0] ? `${results[0].subject} • ${results[0].title}` : 'No recent marks posted yet'}
              </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Published Reviews</span>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 mt-1 block">{publishedReviews}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Reviews from students & parents</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Homework list */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Homework Assignments</h3>
              {results.length > 0 && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Latest exam score: {results[0].percentage}% on {results[0].title}</p>
              )}
            </div>
            <button onClick={() => setActiveTab('s_homework')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingHomework.map(hw => (
              <div key={hw.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 backdrop-blur-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {hw.subject}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{hw.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Due Date: {hw.dueDate}</p>
                </div>

                <button
                  onClick={() => setActiveTab('s_homework')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all"
                >
                  Submit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Classes */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Next Google Meet Class</h3>
            <button onClick={() => setActiveTab('s_classes')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Schedule
            </button>
          </div>

          {upcomingClasses.length > 0 ? (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white space-y-3 border border-slate-200 dark:border-white/15 shadow-2xl">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                Today @ {upcomingClasses[0].startTime}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{upcomingClasses[0].title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">Taught live by SSR Sir on Google Meet</p>

              <a
                href={upcomingClasses[0].meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Video className="w-4 h-4" /> Open Google Meet Link
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No upcoming online classes right now.</p>
          )}
        </div>
      </div>
      {/* Reviews Editor */}
      <div className="pt-6 lg:pt-8">
        <ReviewsEditor />
      </div>
    </div>
  );
};

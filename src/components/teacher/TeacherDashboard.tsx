import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Clock,
  Video,
  Plus,
  ArrowUpRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageTransition } from '../PageTransition';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [studentsCount, setStudentsCount] = useState(0);
  const [batchesCount, setBatchesCount] = useState(0);
  const [pendingHomeworks, setPendingHomeworks] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [pendingAdmissions, setPendingAdmissions] = useState(0);
  const [pendingDemos, setPendingDemos] = useState(0);
  const [pendingEnquiries, setPendingEnquiries] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/students').then(r => r.json()).then(d => setStudentsCount(d.length)).catch(() => {});
    fetch('/api/batches').then(r => r.json()).then(d => setBatchesCount(d.length)).catch(() => {});
    fetch('/api/homework-submissions')
      .then(r => r.json())
      .then(d => setPendingHomeworks(d.filter((s: any) => s.status === 'submitted').length))
      .catch(() => {});
    fetch('/api/fees')
      .then(r => r.json())
      .then(d => {
        const paid = d.filter((f: any) => f.status === 'paid').reduce((acc: number, f: any) => acc + f.amount, 0);
        const pend = d.filter((f: any) => f.status === 'pending').reduce((acc: number, f: any) => acc + f.amount, 0);
        setTotalRevenue(paid);
        setPendingFees(pend);
      })
      .catch(() => {});
    fetch('/api/online-classes')
      .then(r => r.json())
      .then(d => setUpcomingClasses(d.filter((c: any) => c.status === 'upcoming')))
      .catch(() => {});
    fetch('/api/admission-requests')
      .then(r => r.json())
      .then(d => setPendingAdmissions(d.filter((a: any) => a.status === 'pending').length))
      .catch(() => {});
    fetch('/api/demo-requests')
      .then(r => r.json())
      .then(d => setPendingDemos(d.filter((demo: any) => demo.status === 'pending').length))
      .catch(() => {});
    fetch('/api/enquiries')
      .then(r => r.json())
      .then(d => setPendingEnquiries(d.length))
      .catch(() => {});
  }, []);

  const revenueChartData = [
    { month: 'Apr', revenue: 21000 },
    { month: 'May', revenue: 23500 },
    { month: 'Jun', revenue: 25000 },
    { month: 'Jul', revenue: 27200 }
  ];

  return (
    <PageTransition>
      <div className="space-y-6 sm:space-y-8 max-w-full">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-5 shadow-2xl sm:p-7 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.35),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.28),_transparent_28%)]" />
          <div className="relative z-10 space-y-3">
            <div className="flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">
              Owner & Head Teacher Portal
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">Welcome back, {user?.name || 'Teacher'}!</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              Here is your daily control overview for Classes 1–10. Manage students, evaluate homework, schedule Google Meet sessions, and track fee payments.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('t_homework')}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-[11px] font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" /> Add Homework
              </button>
              <button
                onClick={() => setActiveTab('t_online_classes')}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-600 px-4 py-2.5 text-[11px] font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
              >
                <Video className="w-4 h-4" /> Schedule Google Meet
              </button>
              <button
                onClick={() => setActiveTab('t_attendance')}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-[11px] font-extrabold text-white backdrop-blur-md transition-transform hover:-translate-y-0.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark Attendance
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Total Active Students</span>
              <span className="mt-2 block text-3xl font-black text-slate-900 dark:text-white">{studentsCount}</span>
              <span className="mt-2 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">Classes 1 to 10</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Active Batches</span>
              <span className="mt-2 block text-3xl font-black text-slate-900 dark:text-white">{batchesCount}</span>
              <span className="mt-2 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">CBSE & State Board</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Fees Collected</span>
              <span className="mt-2 block text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</span>
              <span className="mt-2 block text-[11px] text-slate-500 dark:text-slate-400">Pending: ₹{pendingFees.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pending Admissions</span>
              <span className="mt-2 block text-3xl font-black text-indigo-600 dark:text-indigo-300">{pendingAdmissions}</span>
              <span className="mt-2 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">New applications</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pending Demo Requests</span>
              <span className="mt-2 block text-3xl font-black text-emerald-600 dark:text-emerald-400">{pendingDemos}</span>
              <span className="mt-2 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-300">New trial bookings</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">New Enquiries</span>
              <span className="mt-2 block text-3xl font-black text-purple-600 dark:text-purple-300">{pendingEnquiries}</span>
              <span className="mt-2 inline-block rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-purple-700 dark:text-purple-300">Contact messages</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300">
              <Phone className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Monthly Revenue Analytics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Razorpay and direct fee collection summary</p>
              </div>
              <button onClick={() => setActiveTab('t_fees')} className="flex items-center gap-1 text-xs font-extrabold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
                Fee Details <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', color: '#fff', backdropFilter: 'blur(12px)' }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Upcoming Google Meet Classes</h3>
              <button onClick={() => setActiveTab('t_online_classes')} className="text-xs font-extrabold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400">
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map(c => (
                  <div key={c.id} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">
                        {c.subject} - {c.class}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> {c.startTime}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{c.title}</h4>
                    <a
                      href={c.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
                    >
                      <Video className="h-3.5 w-3.5" /> Join Google Meet
                    </a>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                  No upcoming online classes scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

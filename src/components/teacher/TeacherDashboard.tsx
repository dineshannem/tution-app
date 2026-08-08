import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Plus,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
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
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-white/10 backdrop-blur-xl">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
            Owner & Head Teacher Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || 'Teacher'}!</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Here is your daily control overview for Classes 1–10. Manage students, evaluate homework, schedule Google Meet sessions, and track fee payments.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => setActiveTab('t_homework')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Homework
            </button>
            <button
              onClick={() => setActiveTab('t_online_classes')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" /> Schedule Google Meet
            </button>
            <button
              onClick={() => setActiveTab('t_attendance')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 backdrop-blur-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Total Active Students</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-1 block">{studentsCount}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1 inline-block bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Classes 1 to 10</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active Batches</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white mt-1 block">{batchesCount}</span>
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider mt-1 inline-block bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">CBSE & State Board</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Fees Collected</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">₹{totalRevenue.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Pending: ₹{pendingFees.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pending Admission Requests</span>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 mt-1 block">{pendingAdmissions}</span>
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider mt-1 inline-block bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">New applications</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Pending Demo Requests</span>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{pendingDemos}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider mt-1 inline-block bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">New trial bookings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">New Enquiries</span>
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-300 mt-1 block">{pendingEnquiries}</span>
            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider mt-1 inline-block bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">Contact messages</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts & Upcoming Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Revenue Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Razorpay and direct fee collection summary</p>
            </div>
            <button onClick={() => setActiveTab('t_fees')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
              Fee Details <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-4">
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

        {/* Upcoming Google Meet Classes */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Google Meet Classes</h3>
            <button onClick={() => setActiveTab('t_online_classes')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded">
                      {c.subject} - {c.class}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {c.startTime}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</h4>
                  <a
                    href={c.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 border border-emerald-400/30 mt-1"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Google Meet
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">No upcoming online classes scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

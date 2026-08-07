import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  Users,
  UserPlus,
  CheckCircle2,
  KeyRound,
  BookOpen,
  Award,
  Video,
  Clock,
  ChevronRight
} from 'lucide-react';

interface PortalLoginPageProps {
  setActiveTab: (tab: string) => void;
  onSuccessToast: (msg: string) => void;
  openAdmission: () => void;
  initialRole?: UserRole;
}

export const PortalLoginPage: React.FC<PortalLoginPageProps> = ({
  setActiveTab,
  onSuccessToast,
  openAdmission,
  initialRole = 'student'
}) => {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPlainCreds, setShowPlainCreds] = useState(false);

  const handleQuickFill = (u: string, p: string, r: UserRole) => {
    setRole(r);
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if ((role === 'student' || role === 'parent') && (username.trim().length < 6 || password.trim().length < 6)) {
      setError(`Username and password for ${role.toUpperCase()} must be at least 6 characters long.`);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(username.trim(), password.trim(), role);
    setLoading(false);

    if (result.success) {
      const displayName = result.user?.name || username;
      onSuccessToast(`Welcome ${displayName}! Logged into ${role.toUpperCase()} Portal.`);
      if (role === 'teacher') setActiveTab('t_dashboard');
      else if (role === 'student') setActiveTab('s_dashboard');
      else if (role === 'parent') setActiveTab('p_dashboard');
    } else {
      setError(result.message || 'Invalid username or password. Please check credentials.');
    }
  };

  const portalConfig = {
    teacher: {
      name: 'Teacher & Admin Portal',
      subtitle: 'Dinesh_A Founder & Teacher Console',
      badge: 'Single-Teacher Control',
      icon: Shield,
      gradientHeader: 'from-amber-600 via-amber-700 to-amber-900',
      badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      cardBorder: 'border-amber-500/30 dark:border-amber-500/30',
      btnBg: 'bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 shadow-amber-500/25',
      userPlaceholder: 'Dinesh_A',
      passPlaceholder: 'Dinesh@1',
      highlights: [
        'Complete control over 50 Students & Parents',
        'Direct username & password reset generator',
        'Real-time attendance & exam marks entry for all students',
        'Automatic credentials.txt file synchronization'
      ]
    },
    student: {
      name: 'Student Learning Portal',
      subtitle: 'Classes 1–10 Interactive Academic Hub',
      badge: 'Student Workspace',
      icon: GraduationCap,
      gradientHeader: 'from-indigo-600 via-blue-700 to-indigo-900',
      badgeBg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
      cardBorder: 'border-indigo-500/30 dark:border-indigo-500/30',
      btnBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/25',
      userPlaceholder: 'student01',
      passPlaceholder: 'stdpass01',
      highlights: [
        'Live Google Meet & recorded video lectures',
        'Download PDF notes for all 10 Board Curriculums',
        'Online homework submission & teacher feedback',
        'Subject-wise scorecards and class ranks'
      ]
    },
    parent: {
      name: 'Parent Oversight Portal',
      subtitle: 'Real-Time Academic & Fee Monitor',
      badge: 'Parent Desk',
      icon: Users,
      gradientHeader: 'from-purple-600 via-fuchsia-700 to-purple-900',
      badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
      cardBorder: 'border-purple-500/30 dark:border-purple-500/30',
      btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25',
      userPlaceholder: 'parent_01',
      passPlaceholder: 'prnpass01',
      highlights: [
        'Daily child attendance logs & absent notifications',
        'Exam results, marks breakdowns & progress charts',
        'Online fee invoice payment via UPI / Cards',
        'Direct WhatsApp connect with teacher Dinesh_A'
      ]
    }
  };

  const currentConfig = portalConfig[role];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-4">
      
      {/* Top Banner & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs tracking-wider uppercase shadow-sm">
          <KeyRound className="w-3.5 h-3.5" /> SSR Tuition Official Portal Gateway
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Select Portal & Authenticate
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Dedicated login portals for Students, Parents, and Teacher. Supported across CBSE, ICSE, TG & AP State Boards, and 6 additional State & National curricula.
        </p>
      </div>

      {/* 3 Main Portal Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['student', 'parent', 'teacher'] as const).map(pRole => {
          const conf = portalConfig[pRole];
          const IconComp = conf.icon;
          const isSelected = role === pRole;

          return (
            <button
              key={pRole}
              type="button"
              onClick={() => { setRole(pRole); setError(null); }}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative flex flex-col justify-between space-y-4 ${
                isSelected
                  ? `bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-xl ring-4 ring-indigo-500/10 scale-[1.02]`
                  : `bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl text-white bg-gradient-to-r ${conf.gradientHeader} shadow-md`}>
                  <IconComp className="w-6 h-6" />
                </div>
                {isSelected ? (
                  <span className="text-[11px] font-extrabold px-2.5 py-1 bg-indigo-600 text-white rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Selection
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                    Select <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${conf.badgeBg}`}>
                  {conf.badge}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2">
                  {conf.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {conf.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Login Card Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Left Side: Login Form (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl text-white bg-gradient-to-r ${currentConfig.gradientHeader} shadow-md`}>
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Login to {currentConfig.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your credentials (as stored in credentials.txt)
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Username (8-10 Characters) *
              </label>
              <div className="relative">
                <User className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={`e.g. ${currentConfig.userPlaceholder}`}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Standard format: 8–10 characters (e.g. <code className="font-mono text-indigo-600 dark:text-indigo-400">{currentConfig.userPlaceholder}</code>)
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Password (8-10 Characters) *
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={12}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={`e.g. ${currentConfig.passPlaceholder}`}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Standard format: 8–10 characters (e.g. <code className="font-mono text-indigo-600 dark:text-indigo-400">{currentConfig.passPlaceholder}</code>)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50 ${currentConfig.btnBg}`}
            >
              {loading ? 'Authenticating Credentials...' : `Login to ${currentConfig.name}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Account Creation Banner */}
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Don't have a portal account yet?
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Apply for online admission to generate student and parent credentials automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={openAdmission}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-colors shrink-0 shadow-md shadow-indigo-600/20"
            >
              Register Account / Apply
            </button>
          </div>

        </div>

        {/* Right Side: Features & Plain Text Helper (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full inline-block">
              Portal Features
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              What you get in {currentConfig.name}:
            </h3>

            <div className="space-y-3">
              {currentConfig.highlights.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Plain Text File Access & Quick Fill Helper */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <span>credentials.txt File Storage</span>
              </div>
              <a
                href="/credentials.txt"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-xl transition-all shadow-sm flex items-center gap-1"
              >
                Open Plain Text File
              </a>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-indigo-500" /> Sample Accounts Quick Fill
              </span>
              <button
                type="button"
                onClick={() => setShowPlainCreds(!showPlainCreds)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {showPlainCreds ? 'Hide Sample Accounts' : 'View Sample Accounts'}
              </button>
            </div>

            {showPlainCreds && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2 animate-fade-in">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click any account to auto-fill the form:
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('Dinesh_A', 'Dinesh@1', 'teacher')}
                    className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-left hover:border-amber-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-amber-900 dark:text-amber-300 text-xs">Teacher: Dinesh_A</div>
                      <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">Dinesh_A / Dinesh@1</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-2 py-0.5 rounded">Fill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('student01', 'stdpass01', 'student')}
                    className="w-full p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 text-left hover:border-indigo-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-indigo-900 dark:text-indigo-300 text-xs">Student: student01</div>
                      <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">student01 / stdpass01</div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-200/50 dark:bg-indigo-900/50 px-2 py-0.5 rounded">Fill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('parent_01', 'prnpass01', 'parent')}
                    className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 text-left hover:border-purple-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-purple-900 dark:text-purple-300 text-xs">Parent: parent_01</div>
                      <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">parent_01 / prnpass01</div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-200/50 dark:bg-purple-900/50 px-2 py-0.5 rounded">Fill</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

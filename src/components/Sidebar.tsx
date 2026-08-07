import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Video,
  Award,
  CreditCard,
  UserCheck,
  KeyRound,
  Image,
  Calendar,
  ClipboardList,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  role: 'teacher' | 'student' | 'parent';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  userName?: string;
  userAvatar?: string;
  onLogout: () => void;
}

const teacherMenu = [
  { id: 't_dashboard', label: 'Dashboard', icon: GraduationCap },
  { id: 't_approvals', label: 'Application Approvals', icon: CheckCircle2 },
  { id: 't_enquiries', label: 'Public Enquiries', icon: MessageSquare },
  { id: 't_demos', label: 'Demo Requests', icon: Sparkles },
  { id: 't_students', label: 'Students', icon: Users },
  { id: 't_parents', label: 'Parents', icon: Users },
  { id: 't_credentials', label: 'Credentials & Reset', icon: KeyRound },
  { id: 't_batches', label: 'Batches', icon: BookOpen },
  { id: 't_attendance', label: 'Attendance', icon: UserCheck },
  { id: 't_homework', label: 'Homework', icon: FileText },
  { id: 't_materials', label: 'Materials', icon: BookOpen },
  { id: 't_online_classes', label: 'Meet Classes', icon: Video },
  { id: 't_tests', label: 'Tests & Marks', icon: Award },
  { id: 't_fees', label: 'Fee Management', icon: CreditCard },
  { id: 't_gallery', label: 'Gallery Admin', icon: Image },
];

const studentMenu = [
  { id: 's_dashboard', label: 'Dashboard', icon: GraduationCap },
  { id: 's_attendance', label: 'Attendance', icon: UserCheck },
  { id: 's_homework', label: 'Homework', icon: FileText },
  { id: 's_materials', label: 'Study Materials', icon: BookOpen },
  { id: 's_classes', label: 'Live & Recorded', icon: Video },
  { id: 's_results', label: 'Results', icon: Award },
  { id: 's_fees', label: 'Pay Fees', icon: CreditCard },
];

const parentMenu = [
  { id: 'p_dashboard', label: 'Dashboard', icon: GraduationCap },
  { id: 'p_attendance', label: 'Child Attendance', icon: UserCheck },
  { id: 'p_homework', label: 'Homework Track', icon: FileText },
  { id: 'p_results', label: 'Results & Progress', icon: Award },
  { id: 'p_fees', label: 'Fee Details & Pay', icon: CreditCard },
  { id: 'p_schedule', label: 'Class Schedule', icon: Calendar },
];

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  userName,
  userAvatar,
  onLogout
}) => {
  const menuItems =
    role === 'teacher' ? teacherMenu :
    role === 'student' ? studentMenu :
    parentMenu;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen z-40 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-xl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-900 dark:text-white truncate">SSR TUITION</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Classes 1-10</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-300' : ''}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {!collapsed && userName && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <img
              src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 capitalize">{role}</p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
};
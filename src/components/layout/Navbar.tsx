import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { AvatarPickerModal } from '../common/AvatarPickerModal';
import {
  GraduationCap,
  Bell,
  Sun,
  SunMedium,
  Moon,
  MoonStar,
  Monitor,
  Laptop,
  Check,
  LogOut,
  UserCheck,
  PhoneCall,
  Calendar,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  LogIn,
  ShieldAlert,
  BookOpen,
  Award,
  Video,
  Users,
  CreditCard,
  Image,
  FileText,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openFreeDemo: () => void;
  openAdmission: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openFreeDemo,
  openAdmission
}) => {
  const { user, role, switchRole, logout, updateUser } = useAuth();
  const { themeMode, setThemeMode, resolvedTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  // Auto-close mobile menu after 3 seconds
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen && showThemeMenu) {
      setShowThemeMenu(false);
    }
  }, [mobileMenuOpen]);

  // Auto-close notifications dropdown after 3 seconds
  useEffect(() => {
    if (!showNotifications) return;
    const timer = setTimeout(() => {
      setShowNotifications(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showNotifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.theme-dropdown-container')) {
        setShowThemeMenu(false);
      }
      if (!target.closest('.notification-dropdown-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const handleScrollCheck = () => {
    if (!navScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollPercent((scrollLeft / maxScroll) * 100);
      setShowLeftScroll(scrollLeft > 10);
      setShowRightScroll(scrollLeft < maxScroll - 10);
    } else {
      setScrollPercent(0);
      setShowLeftScroll(false);
      setShowRightScroll(false);
    }
  };

  useEffect(() => {
    handleScrollCheck();
    const navEl = navScrollRef.current;
    if (navEl) {
      navEl.addEventListener('scroll', handleScrollCheck);
      window.addEventListener('resize', handleScrollCheck);
    }
    return () => {
      if (navEl) navEl.removeEventListener('scroll', handleScrollCheck);
      window.removeEventListener('resize', handleScrollCheck);
    };
  }, [activeTab, role]);

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navScrollRef.current) return;
    const amount = direction === 'left' ? -220 : 220;
    navScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publicNavItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'about', label: 'About SSR Sir', icon: Users },
    { id: 'courses', label: 'Courses & Classes', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'testimonials', label: 'Reviews', icon: Award },
    { id: 'contact', label: 'Contact Us', icon: PhoneCall }
  ];

  const teacherNavItems = [
    { id: 't_dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 't_students', label: 'Students', icon: Users },
    { id: 't_parents', label: 'Parents', icon: Users },
    { id: 't_credentials', label: 'Credentials & Reset', icon: KeyRound },
    { id: 't_batches', label: 'Batches', icon: BookOpen },
    { id: 't_attendance', label: 'Attendance', icon: UserCheck },
    { id: 't_homework', label: 'Homework', icon: FileText },
    { id: 't_materials', label: 'Materials', icon: BookOpen },
    { id: 't_online_classes', label: 'Meet Classes', icon: Video },
    { id: 't_tests', label: 'Tests & Marks', icon: Award },
    { id: 't_fees', label: 'Fee Mgmt', icon: CreditCard },
    { id: 't_gallery', label: 'Gallery Admin', icon: Image }
  ];

  const studentNavItems = [
    { id: 's_dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 's_attendance', label: 'Attendance', icon: UserCheck },
    { id: 's_homework', label: 'Homework', icon: FileText },
    { id: 's_materials', label: 'Study Materials', icon: BookOpen },
    { id: 's_classes', label: 'Live & Recorded', icon: Video },
    { id: 's_results', label: 'Results', icon: Award },
    { id: 's_fees', label: 'Pay Fees', icon: CreditCard }
  ];

  const parentNavItems = [
    { id: 'p_dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'p_attendance', label: 'Child Attendance', icon: UserCheck },
    { id: 'p_homework', label: 'Homework Track', icon: FileText },
    { id: 'p_results', label: 'Results & Progress', icon: Award },
    { id: 'p_fees', label: 'Fee Details & Pay', icon: CreditCard },
    { id: 'p_schedule', label: 'Class Schedule', icon: Calendar }
  ];

  const currentNavItems = user
    ? role === 'teacher'
      ? teacherNavItems
      : role === 'student'
      ? studentNavItems
      : role === 'parent'
      ? parentNavItems
      : publicNavItems
    : role === 'guest'
    ? publicNavItems
    : [];

  const handlePortalSwitch = (targetRole: UserRole | 'guest', targetTab: string) => {
    if (user && user.role === targetRole) {
      switchRole(targetRole);
      handleTabChange(targetTab);
    } else {
      if (user) {
        logout(); // Force immediate logout when switching to a different portal
      }
      switchRole(targetRole);
      if (targetRole === 'teacher') handleTabChange('teacher_login');
      else if (targetRole === 'parent') handleTabChange('parent_login');
      else if (targetRole === 'student') handleTabChange('student_login');
      else handleTabChange('home');
    }
  };

  const handleDismissNotification = (id: string) => {
    // Optimistic removal so item exits immediately with smooth slide & blur animation
    setNotifications(prev => prev.filter(n => n.id !== id));
    fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(err => console.error(err));
  };

  const handleAvatarSave = (avatarUrl: string) => {
    if (user) {
      updateUser({ ...user, avatar: avatarUrl });
    }
  };

  const handleClearAllNotifications = () => {
    // Optimistic clear so all items exit fluidly
    setNotifications([]);
    fetch('/api/notifications/clear-all', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(err => console.error(err));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 transition-colors shadow-sm w-full max-w-full overflow-x-clip">
      
      {/* Role Switcher Top Bar (Clean & Compact) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-4 relative border-b border-slate-800 backdrop-blur-md w-full max-w-full min-w-0">
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="flex items-center gap-3 min-w-0 whitespace-nowrap text-center">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shrink-0">
              SSR Portal Hub
            </span>
            <span className="text-slate-300 text-[11px] truncate max-w-full">
              Switch role to test portals or view public site:
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 scrollbar-none max-w-full min-w-0 justify-end">
          <button
            onClick={() => handlePortalSwitch('guest', 'home')}
            className={`rounded-lg transition-all whitespace-nowrap ${
              role === 'guest'
                ? 'px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black bg-indigo-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/40'
                : 'px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            Public Site
          </button>
          <button
            onClick={() => handlePortalSwitch('teacher', 't_dashboard')}
            className={`rounded-lg transition-all whitespace-nowrap ${
              role === 'teacher'
                ? 'px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 border border-amber-300'
                : 'px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            Teacher Control
          </button>
          <button
            onClick={() => handlePortalSwitch('student', 's_dashboard')}
            className={`rounded-lg transition-all whitespace-nowrap ${
              role === 'student'
                ? 'px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 border border-emerald-300'
                : 'px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            Student Portal
          </button>
          <button
            onClick={() => handlePortalSwitch('parent', 'p_dashboard')}
            className={`rounded-lg transition-all whitespace-nowrap ${
              role === 'parent'
                ? 'px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-black bg-purple-500 text-white shadow-md shadow-purple-500/30 border border-purple-300'
                : 'px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20'
            }`}
          >
            Parent Portal
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        <div className="grid grid-cols-3 items-center h-16 gap-2 sm:gap-4 min-w-0">
          <div />
          {/* Center Branding */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 shrink min-w-0 overflow-hidden">
            <div
              onClick={() => setActiveTab(role === 'guest' ? 'home' : `${role.charAt(0)}_dashboard`)}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-white/30 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0 overflow-hidden text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                    SSR TUITION
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 rounded-md hidden xs:inline-block shrink-0">
                    Classes 1-10
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block truncate">
                  Single Teacher Excellence • Samba Siva Reddy Annem
                </p>
              </div>
            </div>
          </div>

          {/* Action Controls: Notifications, Theme Mode Toggle, Login/Logout, Hamburger */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {role === 'guest' && (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={openFreeDemo}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-300 hover:bg-amber-200 dark:text-amber-300 dark:bg-amber-500/20 dark:border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Free Demo
                </button>
                <button
                  onClick={openAdmission}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 shadow-md transition-all"
                >
                  Apply Admission
                </button>
              </div>
            )}

            {/* Notifications Dropdown */}
            {role !== 'guest' && user && (
              <div className="relative notification-dropdown-container">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 sm:p-2.5 rounded-2xl text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all relative active:scale-95"
                  title="View alerts & notifications"
                >
                  <motion.div
                    animate={
                      notifications.length > 0
                        ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                        : { rotate: 0 }
                    }
                    transition={{
                      repeat: notifications.length > 0 ? Infinity : 0,
                      repeatDelay: 3.5,
                      duration: 1.2,
                      ease: 'easeInOut'
                    }}
                  >
                    <Bell className={`w-4 h-4 ${notifications.length > 0 ? 'text-amber-500 dark:text-amber-400' : ''}`} />
                  </motion.div>
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
                      className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm shadow-rose-500/50"
                    />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-3 z-50 overflow-hidden"
                    >
                      <div className="px-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                            Alerts & Notifications
                          </h4>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                            {notifications.length} Active
                          </span>
                        </div>
                        {notifications.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearAllNotifications}
                            className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                          >
                            Clear All
                          </motion.button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 scrollbar-none">
                        <AnimatePresence mode="popLayout">
                          {notifications.length === 0 ? (
                            <motion.div
                              key="empty-notif"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2"
                            >
                              <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                                <Bell className="w-5 h-5" />
                              </div>
                              <p className="font-semibold">No active notifications at the moment.</p>
                            </motion.div>
                          ) : (
                            notifications.map(n => (
                              <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, x: -25, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{
                                  opacity: 0,
                                  x: 70,
                                  scale: 0.85,
                                  filter: 'blur(4px)',
                                  transition: { duration: 0.25, ease: 'easeOut' }
                                }}
                                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                                className="p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-start justify-between gap-3 group relative overflow-hidden"
                              >
                                <div className="space-y-1 pr-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{n.title}</p>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5">{n.message}</p>
                                  <span className="text-[10px] text-slate-400 pl-3.5 block font-medium">{n.createdAt}</span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.25, rotate: 90, color: '#ef4444' }}
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => handleDismissNotification(n.id)}
                                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                                  title="Dismiss notification"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Theme Mode Selector Icon (Present in Every Portal on Mobile, Tablet & Desktop) */}
            <div className="relative theme-dropdown-container">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                  themeMode === 'light'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                    : themeMode === 'dark'
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20'
                }`}
                title={`Theme Mode: ${themeMode.toUpperCase()} (Resolved: ${resolvedTheme})`}
              >
                <AnimatePresence mode="wait">
                  {themeMode === 'light' && (
                    <motion.div
                      key="light-icon"
                      initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="flex items-center gap-1.5"
                    >
                      <SunMedium className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 hidden xl:inline">Light</span>
                    </motion.div>
                  )}
                  {themeMode === 'dark' && (
                    <motion.div
                      key="dark-icon"
                      initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0.5, rotate: -90, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="flex items-center gap-1.5"
                    >
                      <MoonStar className="w-4 h-4 text-indigo-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 hidden xl:inline">Dark</span>
                    </motion.div>
                  )}
                  {themeMode === 'system' && (
                    <motion.div
                      key="system-icon"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="flex items-center gap-1.5 relative"
                    >
                      <Laptop className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-300 hidden xl:inline">System</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse absolute -top-0.5 -right-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showThemeMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-white/10 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Appearance Mode
                      </p>
                    </div>

                    <button
                      onClick={() => { setThemeMode('light'); setShowThemeMenu(false); }}
                      className={`w-full px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-all duration-200 ${
                        themeMode === 'light'
                          ? 'text-amber-700 dark:text-amber-300 bg-amber-500/15 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                          <SunMedium className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold">Light Mode</div>
                          <div className="text-[9px] text-amber-600/70 dark:text-amber-400/70">Bright & Clean</div>
                        </div>
                      </div>
                      {themeMode === 'light' && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    </button>

                    <button
                      onClick={() => { setThemeMode('dark'); setShowThemeMenu(false); }}
                      className={`w-full px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-all duration-200 ${
                        themeMode === 'dark'
                          ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                          <MoonStar className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold">Dark Mode</div>
                          <div className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70">Deep Twilight</div>
                        </div>
                      </div>
                      {themeMode === 'dark' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>

                    <button
                      onClick={() => { setThemeMode('system'); setShowThemeMenu(false); }}
                      className={`w-full px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-all duration-200 ${
                        themeMode === 'system'
                          ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold">System Default</div>
                          <div className="text-[9px] text-cyan-600/70 dark:text-cyan-400/70">Auto OS Sync</div>
                        </div>
                      </div>
                      {themeMode === 'system' && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile / Logout or Login Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAvatarModalOpen(true)}
                    className="flex items-center gap-2"
                    title="Edit profile avatar"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500 shadow-sm"
                    />
                    <span className="sr-only">Edit avatar</span>
                  </button>
                  <div className="hidden md:block text-left max-w-[12rem] md:max-w-[18rem] truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">{user.name}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-300 font-extrabold capitalize truncate">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xs shadow-md shadow-rose-600/20 border border-rose-400/40 flex items-center gap-1 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline uppercase text-[10px]">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabChange('portal_login')}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> <span className="hidden xs:inline">Portal</span> Login
              </button>
            )}

            {/* Avatar picker modal */}
            {user && (
              <AvatarPickerModal
                isOpen={avatarModalOpen}
                onClose={() => setAvatarModalOpen(false)}
                currentAvatar={user.avatar}
                onSave={handleAvatarSave}
              />
            )}

            {/* Hamburger Mobile/Tablet Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors active:scale-95"
              title="Toggle Portal Menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {role === 'guest' && (
        <div className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800/80 px-2 sm:px-4 py-1.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* Scrollable Horizontal Navigation Container with Interactive Arrow Buttons */}
        <div className="relative max-w-7xl mx-auto flex items-center min-w-0 w-full">
          
          {/* Scroll Left Button - Only in Mobile/Tablet View */}
          {showLeftScroll && (
            <button
              onClick={() => scrollNav('left')}
              className="lg:hidden absolute left-0 z-20 p-1.5 rounded-r-xl bg-indigo-600/90 text-white shadow-lg backdrop-blur-md hover:bg-indigo-500 transition-all active:scale-95 shrink-0"
              title="Scroll Menu Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Left Fade Gradient - Only in Mobile/Tablet View */}
          {showLeftScroll && (
            <div className="lg:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          )}

          {/* Nav Links Strip */}
          <nav
            ref={navScrollRef}
            className="w-full min-w-0 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none scroll-smooth px-1"
          >
            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-indigo-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Fade Gradient - Only in Mobile/Tablet View */}
          {showRightScroll && (
            <div className="lg:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          )}

          {/* Scroll Right Button - Only in Mobile/Tablet View */}
          {showRightScroll && (
            <button
              onClick={() => scrollNav('right')}
              className="lg:hidden absolute right-0 z-20 p-1.5 rounded-l-xl bg-indigo-600/90 text-white shadow-lg backdrop-blur-md hover:bg-indigo-500 transition-all active:scale-95 animate-pulse"
              title="Scroll Menu Right to see more modules"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Glowing Progress Bar Line */}
        <div className="w-full h-0.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 transition-all duration-150"
            style={{ width: `${Math.max(15, scrollPercent)}%` }}
          />
        </div>
      </div>
      )}

      {/* MOBILE & TABLET DRAWER MENU (Cleanly Contains All Portals and All Menu Items) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-3 py-3 space-y-3 shadow-2xl overflow-hidden max-w-full min-w-0 origin-top"
          >
            {/* Mobile Portal Selection Header */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
            >
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Select Active Portal:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { handlePortalSwitch('guest', 'home'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all text-center ${
                    role === 'guest'
                      ? 'bg-indigo-600 text-white shadow font-black scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold'
                  }`}
                >
                  Public Site
                </button>
                <button
                  onClick={() => { handlePortalSwitch('teacher', 't_dashboard'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all text-center ${
                    role === 'teacher'
                      ? 'bg-amber-500 text-slate-950 shadow font-black scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold'
                  }`}
                >
                  Teacher Control
                </button>
                <button
                  onClick={() => { handlePortalSwitch('student', 's_dashboard'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all text-center ${
                    role === 'student'
                      ? 'bg-emerald-500 text-slate-950 shadow font-black scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold'
                  }`}
                >
                  Student Portal
                </button>
                <button
                  onClick={() => { handlePortalSwitch('parent', 'p_dashboard'); setMobileMenuOpen(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-extrabold transition-all text-center ${
                    role === 'parent'
                      ? 'bg-purple-500 text-white shadow font-black scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold'
                  }`}
                >
                  Parent Portal
                </button>
              </div>
            </motion.div>

            {/* All Portal Menu Items */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 block mb-1">
                {role.toUpperCase()} Menu Modules ({currentNavItems.length}):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {currentNavItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 + idx * 0.025 }}
                      onClick={() => {
                        handleTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                          : 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-indigo-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & CTAs */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
              {role === 'guest' && (
                <>
                  <button
                    onClick={() => { openFreeDemo(); setMobileMenuOpen(false); }}
                    className="w-full py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Book Free Demo Class
                  </button>
                  <button
                    onClick={() => { openAdmission(); setMobileMenuOpen(false); }}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-extrabold shadow flex items-center justify-center gap-1.5"
                  >
                    Apply Online Admission
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

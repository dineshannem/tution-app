import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { PublicFooter } from './components/public/PublicFooter';
import { Toast } from './components/common/Toast';
import { Sidebar } from './components/Sidebar';
import { FreeDemoModal } from './components/public/FreeDemoModal';
import { OnlineAdmissionModal } from './components/public/OnlineAdmissionModal';

// Public pages
import { PublicHome } from './components/public/PublicHome';
import { PublicAbout } from './components/public/PublicAbout';
import { PublicCourses } from './components/public/PublicCourses';
import { PublicSubjects } from './components/public/PublicSubjects';
import { PublicFaculty } from './components/public/PublicFaculty';
import { PublicGallery } from './components/public/PublicGallery';
import { PublicTestimonials } from './components/public/PublicTestimonials';
import { PublicContact } from './components/public/PublicContact';
import { PortalLoginPage } from './components/public/PortalLoginPage';

// Teacher panel components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherApprovals } from './components/teacher/TeacherApprovals';
import { TeacherEnquiries } from './components/teacher/TeacherEnquiries';
import { TeacherDemoDetails } from './components/teacher/TeacherDemoDetails';
import { StudentManagement } from './components/teacher/StudentManagement';
import { ParentManagement } from './components/teacher/ParentManagement';
import { BatchManagement } from './components/teacher/BatchManagement';
import { AttendanceModule } from './components/teacher/AttendanceModule';
import { HomeworkModule } from './components/teacher/HomeworkModule';
import { StudyMaterialModule } from './components/teacher/StudyMaterialModule';
import { OnlineClassModule } from './components/teacher/OnlineClassModule';
import { TestResultModule } from './components/teacher/TestResultModule';
import { FeeManagement } from './components/teacher/FeeManagement';
import { GalleryAdmin } from './components/teacher/GalleryAdmin';
import { CredentialsManagement } from './components/teacher/CredentialsManagement';
import { TeacherHistory } from './components/teacher/TeacherHistory';

// Student panel components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentHomework } from './components/student/StudentHomework';
import { StudentClasses } from './components/student/StudentClasses';
import { StudentMaterials } from './components/student/StudentMaterials';
import { StudentResults } from './components/student/StudentResults';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentFees } from './components/student/StudentFees';

// Parent panel components
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentAttendance } from './components/parent/ParentAttendance';
import { ParentFees } from './components/parent/ParentFees';
import { ParentChildProgress } from './components/parent/ParentChildProgress';
import { ParentHomework } from './components/parent/ParentHomework';
import { ParentSchedule } from './components/parent/ParentSchedule';

export default function App() {
  const { user, role, logout } = useAuth();
  const { scrollYProgress } = useScroll();
  const scrollScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('ssr_active_tab') || 'home';
    const restoredRole = (localStorage.getItem('ssr_role') || 'guest') as string;

    if (saved.startsWith('t_') && restoredRole !== 'teacher') return 't_dashboard';
    if (saved.startsWith('s_') && restoredRole !== 'student') return 's_dashboard';
    if (saved.startsWith('p_') && restoredRole !== 'parent') return 'p_dashboard';

    return saved;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const isPortalView = !!user && role !== 'guest';

  useEffect(() => {
    localStorage.setItem('ssr_active_tab', activeTab);
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (!user && activeTab.startsWith('t_')) {
      setActiveTab('teacher_login');
    }
    if (!user && activeTab.startsWith('s_')) {
      setActiveTab('student_login');
    }
    if (!user && activeTab.startsWith('p_')) {
      setActiveTab('parent_login');
    }
  }, [user, activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const openFreeDemo = () => setIsDemoModalOpen(true);
  const openAdmission = () => setIsAdmissionModalOpen(true);

  // Render Public Content
  const renderPublicContent = () => {
    switch (activeTab) {
      case 'about':
        return <PublicAbout openFreeDemo={openFreeDemo} openAdmission={openAdmission} />;
      case 'courses':
        return <PublicCourses openFreeDemo={openFreeDemo} openAdmission={openAdmission} />;
      case 'subjects':
        return <PublicSubjects openFreeDemo={openFreeDemo} openAdmission={openAdmission} />;
      case 'faculty':
        return <PublicFaculty openFreeDemo={openFreeDemo} />;
      case 'gallery':
        return <PublicGallery />;
      case 'testimonials':
      case 'reviews':
        return <PublicTestimonials />;
      case 'contact':
        return <PublicContact onSuccessToast={showToast} />;
      case 'portal_login':
        return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="student" />;
      case 'teacher_login':
        return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="teacher" />;
      case 'student_login':
        return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="student" />;
      case 'parent_login':
        return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="parent" />;
      case 'home':
      default:
        return <PublicHome setActiveTab={setActiveTab} openFreeDemo={openFreeDemo} openAdmission={openAdmission} onSuccessToast={showToast} />;
    }
  };

  // Render Teacher Portal Content
  const renderTeacherContent = () => {
    switch (activeTab) {
      case 't_students':
        return <StudentManagement onSuccessToast={showToast} />;
      case 't_parents':
        return <ParentManagement onSuccessToast={showToast} />;
      case 't_credentials':
        return <CredentialsManagement onSuccessToast={showToast} />;
      case 't_batches':
        return <BatchManagement onSuccessToast={showToast} />;
      case 't_attendance':
        return <AttendanceModule onSuccessToast={showToast} />;
      case 't_homework':
        return <HomeworkModule onSuccessToast={showToast} />;
      case 't_materials':
        return <StudyMaterialModule onSuccessToast={showToast} />;
      case 't_online_classes':
        return <OnlineClassModule onSuccessToast={showToast} />;
      case 't_tests':
        return <TestResultModule onSuccessToast={showToast} />;
      case 't_fees':
        return <FeeManagement onSuccessToast={showToast} />;
      case 't_payment_history':
        return <TeacherHistory title="Payment History" endpoint="/api/fees" />;
      case 't_approval_history':
        return <TeacherHistory title="Application Approval History" endpoint="/api/admission-requests" />;
      case 't_demo_history':
        return <TeacherHistory title="Free Demo History" endpoint="/api/demo-requests" />;
      case 't_enquiry_history':
        return <TeacherHistory title="Public Enquiry History" endpoint="/api/enquiries" />;
      case 't_gallery':
        return <GalleryAdmin onSuccessToast={showToast} />;
      case 't_approvals':
        return <TeacherApprovals />;
      case 't_enquiries':
        return <TeacherEnquiries />;
      case 't_demos':
        return <TeacherDemoDetails />;
      case 't_dashboard':
      default:
        return <TeacherDashboard setActiveTab={setActiveTab} />;
    }
  };

  // Render Student Portal Content
  const renderStudentContent = () => {
    switch (activeTab) {
      case 's_attendance':
        return <StudentAttendance />;
      case 's_homework':
        return <StudentHomework onSuccessToast={showToast} />;
      case 's_classes':
        return <StudentClasses />;
      case 's_materials':
        return <StudentMaterials />;
      case 's_results':
        return <StudentResults />;
      case 's_fees':
        return <StudentFees onSuccessToast={showToast} />;
      case 's_dashboard':
      default:
        return <StudentDashboard setActiveTab={setActiveTab} onSuccessToast={showToast} />;
    }
  };

  // Render Parent Portal Content
  const renderParentContent = () => {
    switch (activeTab) {
      case 'p_attendance':
        return <ParentAttendance />;
      case 'p_homework':
        return <ParentHomework />;
      case 'p_fees':
        return <ParentFees onSuccessToast={showToast} />;
      case 'p_results':
      case 'p_progress':
        return <ParentChildProgress />;
      case 'p_schedule':
        return <ParentSchedule />;
      case 'p_dashboard':
      default:
        return <ParentDashboard setActiveTab={setActiveTab} openPayModal={() => setActiveTab('p_fees')} onSuccessToast={showToast} />;
    }
  };

  const renderActiveView = () => {
    // If requesting login page
    if (activeTab === 'portal_login' || activeTab === 'student_login') {
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="student" />;
    }
    if (activeTab === 'teacher_login') {
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="teacher" />;
    }
    if (activeTab === 'parent_login') {
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="parent" />;
    }

    // Protected routes requiring authentication
    if (activeTab.startsWith('t_')) {
      if (user && user.role === 'teacher') return renderTeacherContent();
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="teacher" />;
    }

    if (activeTab.startsWith('s_')) {
      if (user && user.role === 'student') return renderStudentContent();
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="student" />;
    }

    if (activeTab.startsWith('p_')) {
      if (user && user.role === 'parent') return renderParentContent();
      return <PortalLoginPage setActiveTab={setActiveTab} onSuccessToast={showToast} openAdmission={openAdmission} initialRole="parent" />;
    }

    return renderPublicContent();
  };

  const contentPaddingClass = isPortalView
    ? sidebarCollapsed
      ? 'lg:pl-20'
      : 'lg:pl-[260px]'
    : '';

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Scroll Progress Bar - Updated to Teal theme */}
      <motion.div
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 shadow-sm"
        style={{ scaleX: scrollScale }}
      />

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} openFreeDemo={openFreeDemo} openAdmission={openAdmission} />

      <div ref={contentScrollRef} className={"portal-main flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative " + contentPaddingClass}>
        {/* Dynamic Main View with lightweight motion transitions */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {!isPortalView && (
          <PublicFooter setActiveTab={setActiveTab} openFreeDemo={openFreeDemo} openAdmission={openAdmission} />
        )}
      </div>

      {/* Global Modals */}
      <FreeDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSuccessToast={(msg) => showToast(msg)}
      />

      <OnlineAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        onSuccessToast={(msg) => showToast(msg)}
      />

      {isPortalView && (
        <Sidebar
          role={user?.role as 'teacher' | 'student' | 'parent'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          userName={user?.name}
          userAvatar={user?.avatar}
          onLogout={logout}
        />
      )}
    </div>
  );
}
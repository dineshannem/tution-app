import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => window.innerWidth < 768);

  const isPortalView = !!user && role !== 'guest';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

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
      ? 'pl-20 md:pl-20 lg:pl-20'
      : 'pl-[260px] md:pl-[260px] lg:pl-[260px]'
    : '';

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 origin-left z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} openFreeDemo={openFreeDemo} openAdmission={openAdmission} />

      <div className={"flex-1 min-h-screen relative " + contentPaddingClass}>
        {/* Dynamic Main View with Spring Motion Page Transitions */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
              mass: 0.8
            }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
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

      {/* Footer */}
      <PublicFooter setActiveTab={setActiveTab} openFreeDemo={openFreeDemo} openAdmission={openAdmission} />
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

import React from 'react';
import { Award, GraduationCap, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition } from '../PageTransition'; // adjust path
import { staggerContainer, listItem } from '../../lib/animations'; // adjust path

//  Do NOT copy PublicHomeProps here

const AboutPage = () => {   // or CoursesPage, FacultyPage, etc.
  return (
    <PageTransition>
      <div className="space-y-10 p-6">

        {/* Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold">About SSR Sir</h1>
        </motion.div>

        {/* Cards / Grid Animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Your existing cards here */}
          <motion.div variants={listItem} whileHover={{ y: -6 }}>
            {/* card content */}
          </motion.div>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default AboutPage;

interface PublicFacultyProps {
  openFreeDemo: () => void;
}

export const PublicFaculty: React.FC<PublicFacultyProps> = ({ openFreeDemo }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
          Owner & Head Teacher
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Meet Samba Siva Reddy Annem (SSR Sir)</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The single dedicated teacher behind every student's academic transformation in SSR Tuition.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
            alt="SSR Sir"
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
            15+ Years Experience
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Samba Siva Reddy Annem (SSR Sir)</h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
              M.Sc. Mathematics & Physics | Founder & Single Teacher, SSR Tuition
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            "I believe that every student has potential if guided with clarity, patience, and absolute honesty. In my tuition center, no child is hidden in a crowd. I teach every subject personally, ensuring concept mastery in both Telugu and English."
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Teaching Strengths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Special Telugu & English Explanation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Step-by-Step Maths Proofs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Physics Numericals & Ray Diagrams</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Daily Homework Evaluation</span>
              </div>
            </div>
          </div>

          <button
            onClick={openFreeDemo}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Book Free Trial Class with SSR Sir
          </button>
        </div>
      </div>
    </div>
  );
};

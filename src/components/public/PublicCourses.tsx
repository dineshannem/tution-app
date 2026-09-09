import React from 'react';
import { BookOpen, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition } from '../PageTransition'; // adjust path
import { staggerContainer, listItem } from '../../lib/animations'; // adjust path


interface PublicCoursesProps {
  openFreeDemo: () => void;
  openAdmission: () => void;
}


export const PublicCourses: React.FC<PublicCoursesProps> = ({ openFreeDemo, openAdmission }) => {
  const courses = [
    {
      class: "Class 10 Board Master Batch",
      board: "CBSE & State Board",
      subjects: ["Mathematics", "Science (Physics, Chem, Bio)", "Social Science", "English", "Telugu / Hindi"],
      fee: "₹2,500 / month",
      timing: "Mon - Sat (05:00 PM - 07:00 PM)",
      features: ["10 Board Mock Papers", "Special Telugu/English Care", "Daily Homework Checking"]
    },
    {
      class: "Class 9 Foundation Batch",
      board: "CBSE & State Board",
      subjects: ["Mathematics", "Science", "English", "Social Science"],
      fee: "₹2,200 / month",
      timing: "Mon - Fri (04:00 PM - 05:30 PM)",
      features: ["Strong Algebra Base", "Weekly Tests", "Doubt Solving Sessions"]
    },
    {
      class: "Class 8 Secondary Batch",
      board: "CBSE & State Board",
      subjects: ["Mathematics", "Science", "English", "Telugu"],
      fee: "₹1,800 / month",
      timing: "Mon, Wed, Fri (06:00 PM - 07:30 PM)",
      features: ["Concept Clarity", "Small Batch (Max 12)", "Parent WhatsApp Updates"]
    },
    {
      class: "Classes 6 - 7 Primary Foundation",
      board: "CBSE & State Board",
      subjects: ["Maths, Science, English, Telugu, Computer Science"],
      fee: "₹1,500 / month",
      timing: "Tue, Thu, Sat (04:00 PM - 05:30 PM)",
      features: ["Handwriting & Speed", "Basics Care", "Fun Worksheets"]
    },
    {
      class: "Classes 1 - 5 Junior Learners",
      board: "CBSE & State Board",
      subjects: ["All General Subjects + Telugu Reading/Writing"],
      fee: "₹1,200 / month",
      timing: "Mon - Fri (03:30 PM - 05:00 PM)",
      features: ["Patient Guidance", "Small Batch", "Daily Reading Care"]
    }
  ];

  return (
    <PageTransition>
      <div className="public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
          Academic Offerings
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Courses & Batches (Classes 1–10)</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Comprehensive curriculum with bilingual Telugu & English explanation covering all major National and State Boards in India.
        </p>

        {/* All 10 Boards Showcase Pill Grid */}
        <motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="pt-2 flex flex-wrap justify-center gap-2"
>
          {[
            'CBSE', 'ICSE', 'TG State Board (SSC)', 'AP State Board (SSC)',
            'Karnataka SSLC', 'Maharashtra SSC', 'Tamil Nadu Board',
            'IGCSE / Cambridge', 'IB World', 'NIOS'
          ].map((board) => (
            <motion.span
      key={board}
      variants={listItem}
      whileHover={{ scale: 1.08, y: -2 }}
      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800/60 shadow-sm cursor-default"
    >✓ {board}
    </motion.span>
          ))}
        </motion.div>

      </motion.div>

      <motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
        {courses.map((c, idx) => (
          <motion.div
  key={idx}
  variants={listItem}
  whileHover={{ y: -4, scale: 1.01 }}
  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-5 flex flex-col justify-between"
>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 rounded-lg">
                  {c.board}
                </span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">{c.fee}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{c.class}</h3>
              <p className="text-xs text-slate-500 font-medium">{c.timing}</p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Subjects Included:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {c.subjects.map((s, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-1.5">
                {c.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.97 }}
    onClick={openFreeDemo}
    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
  >
    Free Demo
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.97 }}
    onClick={openAdmission}
    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
  >
    Apply Admission
  </motion.button>
</div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </PageTransition>
  );
};

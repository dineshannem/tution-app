import React from 'react';
import { Award, BookOpen, Users, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { PageTransition } from '../PageTransition'; // adjust path
import { staggerContainer, listItem } from '../../lib/animations'; // adjust path

interface PublicAboutProps {
  openFreeDemo: () => void;
  openAdmission: () => void;
}

export const PublicAbout: React.FC<PublicAboutProps> = ({ openFreeDemo, openAdmission }) => {
  return (
    <PageTransition>
      <div className="public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 h-96">
            <img
              src="https://img.magnific.com/premium-photo/smiling-handsome-indian-male-teacher_928503-3479.jpg?semt=ais_hybrid&w=740&q=80"
              alt="SSR Sir"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-xl font-extrabold text-sm space-y-0.5">
            <div>Samba Siva Reddy Annem (SSR Sir)</div>
            <div className="text-xs text-slate-900 font-semibold">M.Sc Mathematics & Physics</div>
            <div className="text-[11px] text-slate-800">15+ Years Board Coaching</div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
            About SSR Tuition
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Single-Teacher Dedication for Lasting Educational Excellence
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Founded by Samba Siva Reddy Annem (SSR Sir), SSR Tuition was established with a singular mission: to eliminate the confusion caused by frequent teacher changes and large, impersonal coaching institutes.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            As the sole teacher and academic director, SSR Sir personally conducts every batch for Classes 1 through 10. This ensures seamless continuity in teaching methodology, deep knowledge of every student's learning profile, and absolute accountability to parents.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
  <motion.div
    whileHover={{ y: -4 }}
    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
  >
    <div className="text-2xl font-black text-amber-500">1,500+</div>
    <div className="text-xs text-slate-500">Students Guided</div>
  </motion.div>
  <motion.div
    whileHover={{ y: -4 }}
    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
  >
    <div className="text-2xl font-black text-blue-500">98.4%</div>
    <div className="text-xs text-slate-500">Board Distinction Score</div>
  </motion.div>
</div>
        </div>
      </div>
        </motion.div>

      {/* Core Principles */}
      <div className="space-y-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">The SSR Tuition Pillars</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Our core commitments to parents and students in Hyderabad.</p>
        </div>

        <motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
>
  {[
    { icon: Users, title: 'Small Batch Culture', desc: 'Strict limit of 15 students per batch ensuring every doubt is resolved live in class.', color: 'amber' },
    { icon: BookOpen, title: 'Bilingual Explanation', desc: 'Complex mathematical proofs and scientific laws explained clearly in Telugu and English.', color: 'blue' },
    { icon: Award, title: 'Continuous Parent Updates', desc: 'Weekly progress reports, attendance alerts, and transparent fee management.', color: 'emerald' }
  ].map((item, i) => {
    const Icon = item.icon;
    return (
      <motion.div
        key={i}
        variants={listItem}
        whileHover={{ y: -4 }}
        className="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
      >
        <Icon className={`w-8 h-8 text-${item.color}-600 dark:text-${item.color}-400`} />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
      </motion.div>
    );
  })}
</motion.div>
      </div>
    </div>
    </PageTransition>
  );
};

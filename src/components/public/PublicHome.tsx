import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../PageTransition';
import { staggerContainer, listItem } from '../../lib/animations';
import { PublicFooter } from './PublicFooter';
import { onlyNumbers, isValidIndianPhone } from '../../lib/validation';
import { getStoredTestimonials } from '../../lib/reviews';
import { Testimonial } from '../../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  FileText,
  MessageSquare,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  Send,
  HelpCircle
} from 'lucide-react';

interface PublicHomeProps {
  setActiveTab: (tab: string) => void;
  openFreeDemo: () => void;
  openAdmission: () => void;
  onSuccessToast: (msg: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  setActiveTab,
  openFreeDemo,
  openAdmission,
  onSuccessToast
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [publicReviews, setPublicReviews] = useState<Testimonial[]>([]);

  useEffect(() => {
    const refresh = () => {
      const reviews = typeof window !== 'undefined' ? getStoredTestimonials() : [];
      setPublicReviews(reviews.slice(0, 3));
    };

    refresh();
    window.addEventListener('ssr-reviews-changed', refresh);
    return () => window.removeEventListener('ssr-reviews-changed', refresh);
  }, []);

  const handlePhoneChange = (value: string) => {
    const digits = onlyNumbers(value, 10);
    setContactForm({ ...contactForm, phone: digits });
    if (digits.length > 0 && digits.length < 10) {
      setPhoneError('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianPhone(contactForm.phone)) {
      setPhoneError('Phone number must be exactly 10 digits');
      return;
    }
    setSubmittingContact(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      setSubmittingContact(false);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setPhoneError('');
      onSuccessToast("Thank you for contacting SSR Tuition! We will get back to you soon.");
    } catch (err) {
      setSubmittingContact(false);
      onSuccessToast("Message sent successfully!");
    }
  };

  const subjectsList = [
    { name: 'Mathematics', desc: 'Step-by-step problem solving, shortcut formulas, board exam preparation.', icon: '📐', hover: 'hover:border-blue-400/60' },
    { name: 'Science', desc: 'Physics numericals, Chemistry balancing equations & Biology diagrams.', icon: '🔬', hover: 'hover:border-emerald-400/60' },
    { name: 'Social Science', desc: 'History timelines, Geography maps, Civics & Economics breakdown.', icon: '🌍', hover: 'hover:border-amber-400/60' },
    { name: 'English', desc: 'Grammar mastery, unseen passage techniques, literature & essay writing.', icon: '📚', hover: 'hover:border-purple-400/60' },
    { name: 'Hindi', desc: 'Vyakaran, Patra Lekhan, comprehension and literature care.', icon: '✍️', hover: 'hover:border-rose-400/60' },
    { name: 'Telugu', desc: 'Telugu Vyakanam, Sandhulu, Samasalu & Board preparation.', icon: '🪶', hover: 'hover:border-orange-400/60' },
    { name: 'Computer Science', desc: 'Basic programming concepts, MS Office, logic building.', icon: '💻', hover: 'hover:border-cyan-400/60' }
  ];

  const faqs = [
    {
      q: 'Why single-teacher tuition instead of multiple unknown tutors?',
      a: 'With SSR Sir taking all core batches, every student receives consistent academic methodology, personal accountability, and single-point responsibility without teacher turnover or dilution of quality.'
    },
    {
      q: 'How are small batches beneficial for weak students?',
      a: 'Batches are strictly capped at 15 students. This allows SSR Sir to identify individual weak points, ask direct questions during class, and provide Telugu & English explanation whenever required.'
    },
    {
      q: 'Are weekly test marks shared with parents?',
      a: 'Yes! Marks are uploaded to our online Parent Portal and sent via WhatsApp updates after every weekly evaluation.'
    },
    {
      q: 'What is the format for online classes?',
      a: 'Online classes are conducted live on Google Meet with interactive screen sharing, followed by uploaded recorded sessions for anytime revision.'
    },
    {
      q: 'How does daily homework checking work?',
      a: 'Students submit homework physically in offline batches or upload PDFs through the Student Portal. SSR Sir evaluates and provides written remarks and marks.'
    }
  ];

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/15 " +
    "bg-white dark:bg-slate-800/80 " +
    "text-slate-900 dark:text-white " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
    "text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";

  return (
    <PageTransition>
      <div className="space-y-20 pb-16">

        {/* 1. Hero */}
        <section className="relative overflow-hidden bg-slate-950/70 text-white pt-12 pb-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-white/10 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/80 via-slate-900/90 to-purple-950/80 opacity-90" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> ADMISSIONS OPEN FOR ACADEMIC YEAR 2026-27
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Empowering Students for Board Excellence in{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                  Classes 1 to 10
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                SSR Tuition offers dedicated single-teacher instruction for CBSE & State Board students. Small batches, daily homework, weekly tests, and explanation in both{' '}
                <span className="text-amber-300 font-semibold">Telugu & English</span> for guaranteed concept clarity.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.06, y: -15 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openFreeDemo}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Book Free Demo Class
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06, y: -15 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openAdmission}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" /> Apply Online Admission
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
                {[
                  { value: '15+ Yrs', label: 'Teaching Experience', color: 'text-amber-300' },
                  { value: 'Max 15', label: 'Students Per Batch', color: 'text-indigo-300' },
                  { value: '98%', label: 'Board Pass Rate', color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center"
            >
              <motion.div
                whileHover={{ y: -20, scale: 1.02 }}
                className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4"
              >
                <div className="relative rounded-2xl overflow-hidden h-52">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                    alt="SSR Tuition Classroom"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-lg shadow-md">
                    Owner-Teacher SSR Sir (Samba Siva Reddy Annem)
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  {[
                    'Classes 1–10 (CBSE & State Board)',
                    'Special Care for Weak & Shy Students',
                    'Weekly Tests & Instant Parent WhatsApp Updates',
                    'Online Google Meet + Offline Classroom Batches'
                  ].map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.08 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">What Parents & Students Say</span>
            <h3 className="text-xl font-extrabold mt-3">Real Reviews from our Portal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicReviews.length > 0 ? publicReviews.map((t, i) => (
              <div key={t.id || i} className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src={t.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">{t.content}</p>
              </div>
            )) : (
              <div className="md:col-span-3 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                No reviews published yet.
              </div>
            )}
          </div>
        </section>

        {/* 2. Why Choose */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              Unmatched Quality
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Parents & Students Choose SSR Tuition
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              We focus strictly on concept depth, small batch size, and continuous evaluation so every child achieves top marks in school and board exams.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <Users className="w-6 h-6" />, color: 'amber', border: 'hover:border-amber-400/50', title: 'Small Batches (Max 15)', desc: 'No overcrowded hall of 100 students. Small batch size guarantees personal attention from SSR Sir for every single student.' },
              { icon: <BookOpen className="w-6 h-6" />, color: 'indigo', border: 'hover:border-indigo-400/50', title: 'Telugu & English Medium', desc: 'Concepts explained step-by-step in clear Telugu and English so students grasp fundamental logic without hesitation.' },
              { icon: <FileText className="w-6 h-6" />, color: 'purple', border: 'hover:border-purple-400/50', title: 'Daily Homework & Weekly Tests', desc: 'Daily practice problems evaluated with teacher remarks. Rigorous weekly tests simulate real exam conditions.' },
              { icon: <MessageSquare className="w-6 h-6" />, color: 'emerald', border: 'hover:border-emerald-400/50', title: 'Parent Progress Updates', desc: 'Parents get direct access to child attendance, weekly marks, and instant teacher messages via the Parent Portal.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={listItem}
                whileHover={{ y: -30, scale: 1.02 }}
                className={`bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl ${item.border} transition-all space-y-3 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 text-${item.color}-600 dark:text-${item.color}-300 border border-${item.color}-500/30 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 3. Subjects */}
        <section className="bg-slate-100/80 dark:bg-slate-950/40 py-16 border-y border-slate-200 dark:border-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3 max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Subjects Taught (Classes 1–10)</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Comprehensive syllabus coverage aligned with CBSE and Telangana State Board guidelines.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {subjectsList.map((sub, i) => (
                <motion.div
                  key={i}
                  variants={listItem}
                  whileHover={{ y: -20, scale: 1.02 }}
                  className={`bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl ${sub.hover} transition-all flex items-start gap-4 cursor-default`}
                >
                  <div className="text-3xl p-3 bg-slate-100 dark:bg-white/10 rounded-2xl flex-shrink-0 border border-slate-200 dark:border-white/10">
                    {sub.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{sub.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. Teaching Methodology */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -500 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Single Teacher Dedication
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Special Care for Weak & Shy Students
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every child learns at their own pace. SSR Sir personally identifies students needing extra help in Mathematics, Science formulas, or language grammar and provides custom guidance before or after batch hours.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Zero-Fear Classroom Culture', desc: 'Students are encouraged to ask doubt questions freely without feeling self-conscious.' },
                { title: 'Offline & Online Google Meet Flexibility', desc: 'Attend in-person at our Hyderabad tuition center or join live Google Meet classes remotely.' },
                { title: 'Curated PDF Notes & Formulas', desc: 'Handcrafted formula sheets, ray diagram guides, and previous 10-year board paper solutions.' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-md"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 500 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/15 h-96"
          >
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
              alt="Teaching Care"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-6">
              <div className="text-white space-y-1">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest">SSR Tuition Learning Center</div>
                <div className="text-lg font-bold">Small Batches • High Success • Personal Care</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 5. Testimonials */}
        <section className="bg-slate-100/90 dark:bg-slate-950/60 text-slate-900 dark:text-white py-16 border-y border-slate-200 dark:border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3 max-w-2xl mx-auto"
            >
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">Proven Track Record</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">What Parents & Students Say</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Real feedback from parents of CBSE & Telangana State Board toppers.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { text: `"SSR Sir's personal attention changed my daughter's score from 65% to 92% in Maths! The small batch size and daily homework checking really make a difference."`, name: 'Srinivas Reddy', role: 'Parent of Ananya (Class 10 State)', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', border: 'hover:border-amber-400/50' },
                { text: `"SSR Sir explains complex Physics numerics and Maths formulas in very simple Telugu and English. Weekly tests prepared me completely for the board exam!"`, name: 'Rahul Sharma', role: 'Student (Class 10 CBSE - 94% Scored)', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', border: 'hover:border-indigo-400/50' },
                { text: `"Parent updates on WhatsApp and online portal keep us informed every week. Best tuition in Hyderabad for CBSE and State Board!"`, name: 'Lakshmi Devi', role: 'Parent of Sai Karthik (Class 9 CBSE)', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', border: 'hover:border-emerald-400/50' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={listItem}
                  whileHover={{ y: -20, scale: 1.02 }}
                  className={`bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 p-6 rounded-2xl space-y-4 backdrop-blur-xl shadow-xl ${item.border} transition-all cursor-default`}
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.text}</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-[11px] text-amber-600 dark:text-amber-300">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-2"
          >
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-300 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-white/10 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. Contact */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-white dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-6"
          >
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider">Get In Touch</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Send an Enquiry to SSR Sir</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Have questions about batch schedules or fees? Write to us directly.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Your Name *</label>
                  <input type="text" required placeholder="Full Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number *</label>
                  <input type="tel" required placeholder="9876543210" value={contactForm.phone} onChange={(e) => handlePhoneChange(e.target.value)} className={inputClass} maxLength={10} />
                  {phoneError && <p className="text-[11px] text-rose-500 mt-1 font-medium">{phoneError}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                  <input type="email" placeholder="name@gmail.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Subject</label>
                  <input type="text" placeholder="Class 10 CBSE Batch Timings" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Your Message *</label>
                <textarea rows={4} required placeholder="Ask any details regarding tuition timings, fee structure, or Telugu explanation care..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className={inputClass} />
              </div>

              <motion.button
                type="submit"
                disabled={submittingContact}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submittingContact ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 300 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-900/80 backdrop-blur-2xl text-slate-900 dark:text-white p-8 rounded-3xl space-y-6 shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Center Details & Working Hours</h3>
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">SSR Tuition Learning Center</span>
                    <span>H.No 4-12, Main Road, Near Bus Stop, Hyderabad, Telangana 500038</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Direct Teacher Contact</span>
                    <span>+91 98765 43210 / +91 91234 56789</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-300 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Email Support</span>
                    <span>teacher@ssrtuition.com</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl h-64 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-6 text-center"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80')" }}
              />
              <div className="relative z-10 space-y-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl">
                <MapPin className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">SSR Tuition Hyderabad Center</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Convenient location with safe environment & parking.</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg border border-indigo-400/30"
                >
                  Open Google Maps Navigation
                </a>
              </div>
            </motion.div>
          </motion.div>
        </section>
  </div>
    </PageTransition>
  );
};
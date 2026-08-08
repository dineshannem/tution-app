import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, CheckCircle2, Calculator, Atom, FlaskConical, Dna, FileText, Languages, Globe, Tv } from 'lucide-react';
import { PageTransition } from '../PageTransition'; // adjust path
import { staggerContainer, listItem } from '../../lib/animations'; // adjust path


interface PublicSubjectsProps {
  openFreeDemo: () => void;
  openAdmission: () => void;
}

export const PublicSubjects: React.FC<PublicSubjectsProps> = ({ openFreeDemo, openAdmission }) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');

  const subjectsList = [
    {
      id: 'maths',
      name: 'Mathematics',
      icon: Calculator,
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
      classes: 'Classes 1 – 10 (CBSE, ICSE & State Boards)',
      description: 'Comprehensive math program building crystal-clear fundamentals from basic arithmetic to advanced Class 10 Board quadratic equations and trigonometry.',
      topics: [
        'Quadratic Equations & Polynomials',
        'Trigonometry & Real Applications',
        'Linear Equations & Arithmetic Progressions',
        'Geometry, Triangles & Coordinate Systems',
        'Surface Areas, Volumes & Statistics'
      ],
      highlights: 'Step-by-step written board proofs, daily practice worksheets, and bilingual Telugu/English guidance by Samba Siva Reddy Annem (SSR Sir).'
    },
    {
      id: 'physics',
      name: 'Physics (Science)',
      icon: Atom,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
      classes: 'Classes 6 – 10 (CBSE & State Boards)',
      description: 'Conceptual and numerical physics with visual ray diagrams, practical real-world demonstrations, and formula derivation.',
      topics: [
        'Light: Reflection & Refraction (Ray Diagrams)',
        'Electricity & Electric Current Effects',
        'Magnetic Effects & Motors',
        'Motion, Force & Laws of Physics',
        'Work, Energy & Gravitation'
      ],
      highlights: 'Dedicated numerical problem sessions and ray diagram masterclasses by SSR Sir.'
    },
    {
      id: 'chemistry',
      name: 'Chemistry (Science)',
      icon: FlaskConical,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300',
      classes: 'Classes 6 – 10 (CBSE & State Boards)',
      description: 'Master chemical equations, periodic tables, and molecular reactions with intuitive visualization and simple memory techniques.',
      topics: [
        'Chemical Reactions & Equation Balancing',
        'Acids, Bases & Salts',
        'Metals & Non-Metals Metallurgy',
        'Carbon & its Compounds',
        'Periodic Classification of Elements'
      ],
      highlights: 'Equation balancing shortcuts and board exam question banks.'
    },
    {
      id: 'biology',
      name: 'Biology (Science)',
      icon: Dna,
      color: 'from-green-500 to-emerald-600',
      badgeBg: 'bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300',
      classes: 'Classes 6 – 10 (CBSE & State Boards)',
      description: 'Detailed anatomical diagrams, life processes, genetics, and ecological systems taught with neat labeled sketch practice.',
      topics: [
        'Life Processes (Nutrition, Respiration, Transport)',
        'Control & Coordination in Organisms',
        'How Organisms Reproduce',
        'Heredity & Evolution',
        'Our Environment & Ecosystems'
      ],
      highlights: 'Diagram drawing practice and high-yield board keywords.'
    },
    {
      id: 'english',
      name: 'English Grammar & Composition',
      icon: FileText,
      color: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300',
      classes: 'Classes 1 – 10',
      description: 'Flawless grammar rules, reading comprehension, letter writing, and essay mastery designed for school top marks.',
      topics: [
        'Tenses, Active/Passive & Direct/Indirect Speech',
        'Formal & Informal Letter / Email Writing',
        'Analytical Paragraphs & Essays',
        'Reading Comprehension Strategies',
        'Vocabulary Building & Phrasal Verbs'
      ],
      highlights: 'Personalized corrections on student essays and grammar worksheets.'
    },
    {
      id: 'telugu',
      name: 'Telugu Language & Vyakaranam',
      icon: Languages,
      color: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
      classes: 'Classes 1 – 10 (TG & AP State Boards + CBSE Third Lang)',
      description: 'Special care for Telugu reading, handwriting, grammar (Vyakaranam), and poem explanation (Padyalu).',
      topics: [
        'Sandhulu, Samasalu & Chandassu',
        'Padyala Bhaavam & Poem Analysis',
        'Telugu Letter & Essay Writing (Rachanalu)',
        'Reading Speed & Handwriting Care',
        'Telugu Spoken Clarity'
      ],
      highlights: 'Patient line-by-line reading practice for students needing extra language care.'
    },
    {
      id: 'social',
      name: 'Social Science (History, Geo, Civics)',
      icon: Globe,
      color: 'from-amber-600 to-yellow-600',
      badgeBg: 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300',
      classes: 'Classes 6 – 10',
      description: 'Timeline memorization, map work, democratic concepts, and economic principles explained engagingly.',
      topics: [
        'Indian History & Freedom Movement',
        'Map Pointing Skills (India & World)',
        'Geography & Natural Resources',
        'Civics & Political Institutions',
        'Economics & Development'
      ],
      highlights: 'Map point practice sheets and high-yield historical timeline charts.'
    },
    {
      id: 'computer',
      name: 'Computer Science & Foundation',
      icon: Tv,
      color: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300',
      classes: 'Classes 1 – 8',
      description: 'Computer basics, digital literacy, logic building, and introductory programming concepts for young learners.',
      topics: [
        'Computer Fundamentals & Hardware',
        'Algorithms & Flowchart Logic',
        'Scratch & Block Programming',
        'MS Office & Document Formatting',
        'Cyber Safety & Digital Awareness'
      ],
      highlights: 'Interactive problem-solving and foundational digital skills.'
    }
  ];

  const classFilters = ['All', 'Class 10 Board', 'Class 9', 'Class 8', 'Classes 6 - 7', 'Classes 1 - 5'];

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 max-w-3xl mx-auto"
        >
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5 shadow-sm">
          <BookOpen className="w-3.5 h-3.5" /> Core Curriculum & Academic Subjects
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Academic Subjects Taught by SSR Sir
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive subject coaching for Classes 1 through 10 (CBSE, ICSE & State Boards). Single-teacher excellence by <span className="font-bold text-slate-900 dark:text-white">Samba Siva Reddy Annem (SSR Sir)</span> with bilingual Telugu & English explanation.
        </p>
    </motion.div>
        {/* Filter Pills */}
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="pt-3 flex flex-wrap justify-center gap-2"
>
  {classFilters.map(cf => (
    <motion.button
      key={cf}
      variants={listItem}
      whileHover={{ y: -20, scale: 1.16 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => setSelectedClass(cf)}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
        selectedClass === cf
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {cf}
    </motion.button>
  ))}
</motion.div>

      {/* Grid of Subjects */}
     <motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid grid-cols-1 md:grid-cols-2 gap-8"
>
        {subjectsList.map((subject, idx) => {
          const IconComponent = subject.icon;
          return (
            <motion.div
  key={subject.id}
  variants={listItem}
  whileHover={{ y: -30 }}
  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all space-y-6 flex flex-col justify-between"
>
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${subject.color} flex items-center justify-center text-white shadow-md`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {subject.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${subject.badgeBg}`}>
                        {subject.classes}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {subject.description}
                </p>

                {/* Key Syllabus Topics */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                    Core Topics & Board Modules:
                  </h4>
                  <div className="space-y-1.5">
                    {subject.topics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SSR Sir Guidance Highlight Box */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" /> SSR Sir's Personal Care:
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {subject.highlights}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.97 }}
    onClick={openFreeDemo}
    className="flex-1 py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow"
  >
    Book Demo Class
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.97 }}
    onClick={openAdmission}
    className="flex-1 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow"
  >
    Apply Admission
  </motion.button>
</div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </PageTransition>
  );
};

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface PublicHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export const PublicHeader = ({ title, subtitle, badge = 'SSR Tuition' }: PublicHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-4 max-w-3xl mx-auto"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5 shadow-sm cursor-default"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {badge}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
      >
        {title}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};
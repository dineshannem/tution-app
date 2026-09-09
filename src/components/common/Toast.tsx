import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const bgColors = {
    success: 'bg-emerald-600 text-white border-emerald-500/50 shadow-emerald-600/30',
    error: 'bg-rose-600 text-white border-rose-500/50 shadow-rose-600/30',
    info: 'bg-indigo-600 text-white border-indigo-500/50 shadow-indigo-600/30'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClose}
        className={`fixed bottom-16 left-1/2 -translate-x-1/2 sm:right-6 sm:left-auto sm:translate-x-0 sm:bottom-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border ${bgColors[type]} backdrop-blur-md max-w-[min(100vw-2rem,22rem)] cursor-pointer`}
      >
        {icons[type]}
        <p className="text-xs sm:text-sm font-bold tracking-tight">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:opacity-80 transition-opacity rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

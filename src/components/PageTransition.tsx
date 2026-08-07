import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = '' }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
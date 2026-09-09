import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Testimonial } from '../../types';
import { Star } from 'lucide-react';
import { PageTransition } from '../PageTransition';
import { staggerContainer, listItem } from '../../lib/animations';
import { getStoredTestimonials } from '../../lib/reviews';

export const PublicTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const mergeReviews = (serverReviews: Testimonial[], localReviews: Testimonial[]) => {
      const uniqueReviews = [...localReviews, ...serverReviews].reduce<Testimonial[]>((acc, review) => {
        if (!acc.some(item => item.id === review.id)) acc.push(review);
        return acc;
      }, []);
      return uniqueReviews;
    };

    const refresh = () => {
      const local = getStoredTestimonials();
      fetch('/api/testimonials')
        .then(r => r.json())
        .then(data => setTestimonials(mergeReviews(data, local)))
        .catch(() => setTestimonials(local));
    };

    refresh();
    window.addEventListener('ssr-reviews-changed', refresh);
    return () => window.removeEventListener('ssr-reviews-changed', refresh);
  }, []);

  return (
    <PageTransition>
      <div className="public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
            Parent & Student Reviews
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Stories of Success & Growth
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Discover how single-teacher care and small batches helped hundreds of students reach 90%+ scores in CBSE & State Board.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {testimonials.length} published reviews from current portal contributors and our default testimonials.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={listItem}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={t.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {t.batch || t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </PageTransition>
  );
};
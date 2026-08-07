import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import { Star, MessageSquare } from 'lucide-react';

export const PublicTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60">
          Parent & Student Reviews
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Stories of Success & Growth</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Discover how single-teacher care and small batches helped hundreds of students reach 90%+ scores in CBSE & State Board.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div
            key={t.id}
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
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{t.batch || t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

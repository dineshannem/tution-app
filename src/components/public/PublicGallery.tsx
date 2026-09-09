import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../../types';
import { Maximize2, X, Sparkles, Image as ImageIcon, Download } from 'lucide-react';
import { PageTransition } from '../PageTransition';
import { staggerContainer, listItem } from '../../lib/animations';

export const PublicGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const fetchGallery = () => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const categories = ['All', 'Classroom', 'Events', 'Toppers', 'Facilities'];

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <PageTransition>
      <div className="public-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
        <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/60 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Campus Tour
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          SSR Tuition Photo Gallery
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Click any photo below for a full-screen high-definition popup view. Realtime syncs with teacher gallery uploads.
        </p>
      </motion.div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              filter === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveItem(item)}
            className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col hover:-translate-y-1"
          >
            <div className="relative h-60 overflow-hidden bg-slate-900">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-400/30">
                {item.category}
              </span>

              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 bg-white/90 text-slate-950 text-xs font-extrabold rounded-2xl shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Maximize2 className="w-4 h-4 text-indigo-600" /> Click to Pop Up Photo
                </span>
              </div>
            </div>
            <div className="p-5 space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              {item.caption && <p className="text-xs text-slate-500 leading-relaxed">{item.caption}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Lightbox Modal Popup */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-slate-950/80 hover:bg-rose-600 text-white rounded-full transition-all border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-2/3 bg-black flex items-center justify-center max-h-[70vh]">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              <div className="md:w-1/3 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider inline-block">
                    {activeItem.category}
                  </span>
                  <h2 className="text-2xl font-black text-white">{activeItem.title}</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeItem.caption || 'Captured at SSR Tuition Classes small batch classroom sessions.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">SSR Tuition Gallery</span>
                  <a
                    href={activeItem.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
                  >
                    <Download className="w-4 h-4" /> Open Original
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </PageTransition>
  );
};

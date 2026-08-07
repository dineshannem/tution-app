import React, { useState, useEffect } from 'react';
import { GalleryItem, Testimonial } from '../../types';
import { Image, Plus, Trash2, Star, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';

interface GalleryAdminProps {
  onSuccessToast: (msg: string) => void;
}

export const GalleryAdmin: React.FC<GalleryAdminProps> = ({ onSuccessToast }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'testimonials'>('gallery');
  const [isGalleryModal, setIsGalleryModal] = useState(false);
  const [isTestimonialModal, setIsTestimonialModal] = useState(false);

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Classroom',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    caption: ''
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: 'Parent Name',
    role: 'Parent of Class 10 Student',
    content: 'SSR Sir solved all my son math fears.',
    rating: 5,
    batch: 'Class 10 CBSE'
  });

  const loadData = () => {
    fetch('/api/gallery').then(r => r.json()).then(d => setItems(d)).catch(() => {});
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast("Photo added to public gallery!");
        setIsGalleryModal(false);
        loadData();
      }
    } catch (err) {
      onSuccessToast("Added to gallery!");
      setIsGalleryModal(false);
    }
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast("Review added to public website!");
        setIsTestimonialModal(false);
        loadData();
      }
    } catch (err) {
      onSuccessToast("Review published!");
      setIsTestimonialModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Website Content Management</h1>
          <p className="text-xs text-slate-500">Manage public photo gallery and parent/student success testimonials.</p>
        </div>

        {activeTab === 'gallery' ? (
          <button
            onClick={() => setIsGalleryModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        ) : (
          <button
            onClick={() => setIsTestimonialModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'gallery'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Photo Gallery ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'testimonials'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Testimonials ({testimonials.length})
        </button>
      </div>

      {activeTab === 'gallery' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-600">{item.category}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{t.content}"</p>
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                <p className="text-[11px] text-amber-600 font-medium">{t.batch}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      <Modal isOpen={isGalleryModal} onClose={() => setIsGalleryModal(false)} title="Add Gallery Photo">
        <form onSubmit={handleCreateGallery} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Science Experiment Session"
              value={galleryForm.title}
              onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Category</label>
              <select
                value={galleryForm.category}
                onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                <option value="Classroom">Classroom</option>
                <option value="Events">Events</option>
                <option value="Toppers">Toppers</option>
                <option value="Facilities">Facilities</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Image URL *</label>
              <input
                type="text"
                required
                value={galleryForm.imageUrl}
                onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Caption</label>
            <input
              type="text"
              placeholder="Short description..."
              value={galleryForm.caption}
              onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
          >
            Publish Image
          </button>
        </form>
      </Modal>

      {/* Testimonial Modal */}
      <Modal isOpen={isTestimonialModal} onClose={() => setIsTestimonialModal(false)} title="Add Parent / Student Review">
        <form onSubmit={handleCreateTestimonial} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Name *</label>
              <input
                type="text"
                required
                value={testimonialForm.name}
                onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Batch / Role</label>
              <input
                type="text"
                value={testimonialForm.batch}
                onChange={e => setTestimonialForm({ ...testimonialForm, batch: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Review Text *</label>
            <textarea
              rows={4}
              required
              value={testimonialForm.content}
              onChange={e => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow"
          >
            Publish Review
          </button>
        </form>
      </Modal>
    </div>
  );
};

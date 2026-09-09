import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Testimonial } from '../../types';
import { addTestimonial, getStoredTestimonials, updateTestimonial, deleteTestimonial } from '../../lib/reviews';
import { Star, Edit2, Trash2, Plus } from 'lucide-react';

export const ReviewsEditor: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setReviews(getStoredTestimonials());
  }, []);

  const refresh = () => setReviews(getStoredTestimonials());
  const visibleReviews = user?.role === 'teacher' ? reviews : reviews.filter(r => (r.id || '').startsWith(user?.id || ''));

  const handleSave = () => {
    if (!user) return;
    if (!content.trim()) return;
    if (editingId) {
      updateTestimonial(editingId, { content: content.trim(), rating, avatar: user.avatar, name: user.name });
      setEditingId(null);
      setContent('');
      setRating(5);
      refresh();
      return;
    }
    const t: Testimonial = {
      id: `${user.id}_${Date.now()}`,
      name: user.name,
      role: user.role === 'student' ? 'Student' : 'Parent',
      content: content.trim(),
      rating,
      avatar: user.avatar,
      batch: user.class || ''
    };
    addTestimonial(t);
    setContent('');
    setRating(5);
    refresh();
  };

  const handleEdit = (r: Testimonial) => {
    setEditingId(r.id);
    setContent(r.content);
    setRating(r.rating || 5);
  };

  const handleDelete = (id: string) => {
    deleteTestimonial(id);
    refresh();
  };

  if (!user) return null;

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-black text-slate-900 dark:text-white">Your Reviews</h4>
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-indigo-700 dark:text-indigo-300">
          {visibleReviews.length} entries
        </span>
      </div>

      <div className="space-y-3">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your review here..." className="h-24 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none ring-0 transition focus:border-indigo-400 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className={`rounded p-1 transition-transform hover:scale-110 ${rating >= n ? 'text-amber-400' : 'text-slate-400'}`} title={`${n} stars`}>
                <Star className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {editingId && <button onClick={() => { setEditingId(null); setContent(''); setRating(5); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-white/10 dark:text-slate-200">Cancel</button>}
            <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/20 transition-transform hover:-translate-y-0.5"><Plus className="h-4 w-4" /> {editingId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {visibleReviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
            You haven't added any reviews yet.
          </div>
        )}
        {visibleReviews.map(r => (
          <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <img src={r.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} className="h-9 w-9 rounded-full object-cover" alt={r.name} />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">{r.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.role} {r.batch ? `• ${r.batch}` : ''}</div>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{r.content}</p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.rating || 5)].map((_, i) => (<Star key={i} className="h-3 w-3" />))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(r)} className="text-indigo-600 dark:text-indigo-400" aria-label="Edit review"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(r.id)} className="text-rose-600" aria-label="Delete review"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

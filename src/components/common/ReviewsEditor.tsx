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
    <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
      <h4 className="text-sm font-bold">Your Reviews</h4>

      <div className="space-y-2">
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your review here..." className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-sm outline-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className={`p-1 rounded ${rating>=n? 'text-amber-400':'text-slate-400'}`} title={`${n} stars`}>
                <Star className="w-4 h-4" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {editingId && <button onClick={() => { setEditingId(null); setContent(''); setRating(5); }} className="text-xs px-3 py-1.5 rounded-lg border">Cancel</button>}
            <button onClick={handleSave} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs flex items-center gap-2"><Plus className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
        {reviews.filter(r => (r.id || '').startsWith(user.id)).length === 0 && (
          <p className="text-xs text-slate-500">You haven't added any reviews yet.</p>
        )}
        {reviews.filter(r => (r.id || '').startsWith(user.id)).map(r => (
          <div key={r.id} className="py-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src={r.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold">{r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.role} {r.batch ? `• ${r.batch}` : ''}</div>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{r.content}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.rating||5)].map((_,i)=>(<Star key={i} className="w-3 h-3"/>))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(r)} className="text-xs text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(r.id)} className="text-xs text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

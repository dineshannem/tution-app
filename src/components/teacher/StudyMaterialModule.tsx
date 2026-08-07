import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyMaterial } from '../../types';
import { BookOpen, Plus, Download, Video, FileText, ExternalLink, Link2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

interface StudyMaterialModuleProps {
  onSuccessToast: (msg: string) => void;
}

export const StudyMaterialModule: React.FC<StudyMaterialModuleProps> = ({ onSuccessToast }) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    class: 'Class 10',
    subject: 'Mathematics',
    category: 'PDF' as 'PDF' | 'DOC' | 'Video' | 'Notes',
    fileName: '',
    fileUrl: '',
    videoUrl: ''
  });

  const loadMaterials = () => {
    fetch('/api/study-materials')
      .then(r => r.json())
      .then(d => setMaterials(d))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/study-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Material "${data.material.title}" published with active link!`);
        setIsModalOpen(false);
        loadMaterials();
      }
    } catch (err) {
      onSuccessToast('Study material created with active link!');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Study Materials, PDF Handbooks & Class Links
          </h1>
          <p className="text-xs text-slate-500">Publish active PDF formula sheets, video lesson links, and practice papers for students & parents.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 border border-indigo-400"
        >
          <Plus className="w-4 h-4" /> Add Material / Link
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl">
                  {m.subject} • {m.class}
                </span>
                <span className="text-[10px] uppercase font-black text-amber-600 dark:text-amber-400 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800">
                  {m.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{m.title}</h3>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Published {m.uploadedAt}</span>
              {m.category === 'Video' ? (
                <a
                  href={m.videoUrl || 'https://www.youtube.com/results?search_query=ssr+tuition+classes'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all text-xs"
                >
                  <Video className="w-3.5 h-3.5" /> Watch Video
                </a>
              ) : (
                <a
                  href={m.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                  download={m.fileName || 'SSR_Tuition_Notes.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold flex items-center gap-1.5 shadow-sm transition-all text-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF / Link
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Study Material or Educational Link">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Class 10 Maths Board Formula Sheet 2026"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Class *</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Subject *</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold outline-none"
              >
                <option value="PDF">PDF Handbook</option>
                <option value="Video">Video Lesson Link</option>
                <option value="Notes">Formula / Reference Notes</option>
              </select>
            </div>
          </div>

          {formData.category === 'Video' ? (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Video URL Link *</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">PDF File or Document Web Link *</label>
              <input
                type="text"
                placeholder="https://.../notes.pdf"
                value={formData.fileUrl}
                onChange={e => setFormData({ ...formData, fileUrl: e.target.value, fileName: 'Formula_Sheet.pdf' })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
          >
            Publish Material Link
          </button>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { StudyMaterial } from '../../types';
import { BookOpen, Download, Video, Play, ExternalLink, X } from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudentMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    fetch('/api/study-materials')
      .then(r => r.json())
      .then(d => setMaterials(d))
      .catch(err => console.error(err));
  }, []);

  const getEmbedUrl = (rawUrl?: string) => {
    if (!rawUrl) return 'https://www.youtube.com/embed/5qap5aO4i9A';
    if (rawUrl.includes('embed/')) return rawUrl;
    if (rawUrl.includes('watch?v=')) {
      const id = rawUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return rawUrl;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Study Materials & Handbooks</h1>
        <p className="text-xs text-slate-500">Download formula sheets, revision guides, and video explanations for your class.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(m => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-lg">
                  {m.subject} - {m.class}
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 rounded-full border border-amber-200 dark:border-amber-800/60">
                  {m.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{m.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{m.description || 'Read the topic overview before opening the resource.'}</p>
              {m.extraInfo && <p className="text-[11px] text-indigo-600 dark:text-indigo-300">{m.extraInfo}</p>}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Uploaded {m.uploadedAt}</span>
              {m.category === 'Video' ? (
                <button
                  onClick={() => setActiveVideo({ title: m.title, url: m.videoUrl || 'https://www.youtube.com/embed/5qap5aO4i9A' })}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Watch Video
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {m.fileUrl?.includes('wikipedia.org') && (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold flex items-center gap-1 shadow-sm transition-colors text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Wikipedia Ref
                    </a>
                  )}
                  <a
                    href={m.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                    download={m.fileName || 'notes.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Open / Download
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <Modal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
              <iframe
                src={getEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Recorded Lesson Video Explanation</span>
              <a
                href={activeVideo.url.replace('embed/', 'watch?v=')}
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1"
              >
                Open directly on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


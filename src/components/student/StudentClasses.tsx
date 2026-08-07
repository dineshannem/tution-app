import React, { useState, useEffect } from 'react';
import { OnlineClass } from '../../types';
import { Video, Calendar, Clock, PlayCircle, ExternalLink } from 'lucide-react';
import { Modal } from '../common/Modal';

export const StudentClasses: React.FC = () => {
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [activeRecording, setActiveRecording] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    fetch('/api/online-classes')
      .then(r => r.json())
      .then(d => setClasses(d))
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
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Live Online Classes (Google Meet)</h1>
        <p className="text-xs text-slate-500">Join live interactive sessions with SSR Sir and watch recorded video lessons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-lg">
                  {c.subject} ({c.class})
                </span>
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                  c.status === 'upcoming' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {c.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.title}</h3>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{c.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{c.startTime} - {c.endTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={c.meetLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Video className="w-4 h-4" /> Open Google Meet Link
              </a>

              {c.recordedVideoUrl && (
                <button
                  onClick={() => setActiveRecording({ title: c.title, url: c.recordedVideoUrl || 'https://www.youtube.com/embed/5qap5aO4i9A' })}
                  className="w-full py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <PlayCircle className="w-3.5 h-3.5 text-rose-500" /> Watch Recording
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recording Player Modal */}
      {activeRecording && (
        <Modal
          isOpen={!!activeRecording}
          onClose={() => setActiveRecording(null)}
          title={activeRecording.title}
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl">
              <iframe
                src={getEmbedUrl(activeRecording.url)}
                title={activeRecording.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Recorded Session Video</span>
              <a
                href={activeRecording.url.replace('embed/', 'watch?v=')}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
              >
                Watch on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


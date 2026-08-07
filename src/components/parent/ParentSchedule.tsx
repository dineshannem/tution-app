import React, { useState, useEffect } from 'react';
import { OnlineClass, Batch } from '../../types';
import { Calendar, Clock, Video, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';

export const ParentSchedule: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([]);

  useEffect(() => {
    fetch('/api/batches')
      .then(r => r.json())
      .then(d => setBatches(d))
      .catch(err => console.error(err));

    fetch('/api/online-classes')
      .then(r => r.json())
      .then(d => setOnlineClasses(d))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Child's Class Schedule & Batch Timetable
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Weekly timetable, class timings, and Google Meet online class schedules for Class 10 CBSE & State Board.
        </p>
      </div>

      {/* Batch Timetable Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Assigned Batch Timetable</h3>
              <p className="text-xs text-slate-500">Regular Tuition Timings (Class 10 CBSE)</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">Monday, Wednesday, Friday</span>
                <span className="text-slate-500">Mathematics & Physics Deep Concepts</span>
              </div>
              <span className="font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                05:00 PM - 07:00 PM
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">Tuesday, Thursday, Saturday</span>
                <span className="text-slate-500">Chemistry, Biology & Social Science</span>
              </div>
              <span className="font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                05:00 PM - 07:00 PM
              </span>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-amber-900 dark:text-amber-200 block">Sunday Special Test & Doubt Clearing</span>
                <span className="text-amber-700 dark:text-amber-400">Weekly board model test evaluation</span>
              </div>
              <span className="font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-1 rounded-lg">
                09:00 AM - 11:30 AM
              </span>
            </div>
          </div>
        </div>

        {/* Live Google Meet Classes */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Upcoming Live Google Meet Sessions</h3>
              <p className="text-xs text-slate-500">Interactive live sessions taught personally by SSR Sir</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {onlineClasses.map(oc => (
              <div key={oc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {oc.subject} • {oc.class}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {oc.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">{oc.title}</h4>
                <div className="flex items-center justify-between text-slate-500 pt-1">
                  <span>Date: {oc.date} ({oc.startTime} - {oc.endTime})</span>
                  <a
                    href={oc.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline flex items-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Meet
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

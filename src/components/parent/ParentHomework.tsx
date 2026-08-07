import React, { useState, useEffect } from 'react';
import { Homework, HomeworkSubmission } from '../../types';
import { FileText, CheckCircle2, Clock, Download, Award, AlertCircle } from 'lucide-react';

export const ParentHomework: React.FC = () => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  useEffect(() => {
    fetch('/api/homework')
      .then(r => r.json())
      .then(d => setHomeworkList(d))
      .catch(err => console.error(err));

    fetch('/api/homework-submissions')
      .then(r => r.json())
      .then(d => setSubmissions(d))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Child's Homework & Practice Worksheets Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor homework assigned by SSR Sir, submission compliance, scores obtained, and teacher remarks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworkList.map(hw => {
          const sub = submissions.find(s => s.homeworkId === hw.id);

          return (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg">
                    {hw.subject} • {hw.class}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{hw.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hw.description}</p>

                {hw.fileName && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{hw.fileName}</span>
                    <a href={hw.fileUrl} download={hw.fileName} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {sub ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Submitted on Time
                      </span>
                      {sub.status === 'graded' ? (
                        <span className="font-black text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                          Marks: {sub.marks} / 20
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Under Teacher Review</span>
                      )}
                    </div>
                    {sub.remarks && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                        SSR Sir Remark: "{sub.remarks}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Pending Submission (Due {hw.dueDate})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

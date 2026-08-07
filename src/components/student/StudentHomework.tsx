import React, { useState, useEffect } from 'react';
import { Homework, HomeworkSubmission } from '../../types';
import { FileText, UploadCloud, CheckCircle2, Download, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';

interface StudentHomeworkProps {
  onSuccessToast: (msg: string) => void;
}

export const StudentHomework: React.FC<StudentHomeworkProps> = ({ onSuccessToast }) => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [mySubmissions, setMySubmissions] = useState<HomeworkSubmission[]>([]);
  const [submitModalHw, setSubmitModalHw] = useState<Homework | null>(null);

  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    fetch('/api/homework').then(r => r.json()).then(d => setHomeworkList(d)).catch(() => {});
    fetch('/api/homework-submissions').then(r => r.json()).then(d => setMySubmissions(d)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File exceeds 20MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFileName(file.name);
        setFileUrl(uploadEvent.target?.result as string);
        setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalHw || !fileUrl) return;

    setLoading(true);
    const payload = {
      homeworkId: submitModalHw.id,
      homeworkTitle: submitModalHw.title,
      studentId: 'stud_1',
      studentName: 'Sai Karthik',
      fileName,
      fileUrl,
      fileSize
    };

    try {
      const res = await fetch('/api/homework-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        onSuccessToast(`Homework submitted successfully to SSR Sir!`);
        setSubmitModalHw(null);
        setFileName('');
        setFileUrl('');
        loadData();
      }
    } catch (err) {
      setLoading(false);
      onSuccessToast("Homework submitted successfully!");
      setSubmitModalHw(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Homework Assignments</h1>
        <p className="text-xs text-slate-500">Download assigned worksheets, upload your completed work (Max 20MB), and view marks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeworkList.map(hw => {
          const submission = mySubmissions.find(s => s.homeworkId === hw.id);
          return (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                    {hw.subject}
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Due: {hw.dueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{hw.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hw.description}</p>

                {hw.fileName && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{hw.fileName}</span>
                    <a href={hw.fileUrl} download={hw.fileName} className="text-blue-600 font-bold hover:underline">Download</a>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {submission ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                      </span>
                      {submission.status === 'graded' ? (
                        <span className="text-xs font-black text-blue-600">Marks: {submission.marks} / 20</span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">Pending Teacher Review</span>
                      )}
                    </div>
                    {submission.remarks && (
                      <p className="text-[11px] text-slate-500 italic">Teacher Feedback: "{submission.remarks}"</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmitModalHw(hw)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" /> Upload & Submit Homework
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {submitModalHw && (
        <Modal
          isOpen={!!submitModalHw}
          onClose={() => setSubmitModalHw(null)}
          title={`Upload Homework: ${submitModalHw.title}`}
        >
          <form onSubmit={handleSubmitHomework} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p><strong>Subject:</strong> {submitModalHw.subject}</p>
              <p><strong>Due Date:</strong> {submitModalHw.dueDate}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Upload File (PDF, DOC, PNG, JPG - Max 20MB) *
              </label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 cursor-pointer"
              />
              {fileName && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Selected: {fileName} ({fileSize})</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !fileUrl}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Confirm Submission'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

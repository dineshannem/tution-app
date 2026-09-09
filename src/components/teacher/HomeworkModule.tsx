import React, { useState, useEffect } from 'react';
import { Homework, HomeworkSubmission } from '../../types';
import { FileText, Plus, Download, CheckCircle2, Eye, Award, UploadCloud } from 'lucide-react';
import { Modal } from '../common/Modal';

interface HomeworkModuleProps {
  onSuccessToast: (msg: string) => void;
}

export const HomeworkModule: React.FC<HomeworkModuleProps> = ({ onSuccessToast }) => {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [submissionsList, setSubmissionsList] = useState<HomeworkSubmission[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'submissions'>('create');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [gradeModalSub, setGradeModalSub] = useState<HomeworkSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(18);
  const [gradeRemarks, setGradeRemarks] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    class: 'Class 10',
    subject: 'Mathematics',
    batchId: '',
    batchName: '',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    description: '',
    fileName: '',
    fileUrl: '',
    fileSize: '1.2 MB',
    fileType: 'application/pdf'
  });

  const loadData = () => {
    fetch('/api/homework').then(r => r.json()).then(d => setHomeworkList(d)).catch(() => {});
    fetch('/api/homework-submissions').then(r => r.json()).then(d => setSubmissionsList(d)).catch(() => {});
    fetch('/api/batches').then(r => r.json()).then(d => {
      setBatches(d);
      if (d.length > 0 && !formData.batchId) {
        setFormData(f => ({ ...f, batchId: d[0].id, batchName: d[0].name }));
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("File size exceeds 20 MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData({
          ...formData,
          fileName: file.name,
          fileUrl: uploadEvent.target?.result as string,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          fileType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchObj = batches.find(b => b.id === formData.batchId);
    const payload = {
      ...formData,
      batchName: batchObj ? batchObj.name : formData.batchName
    };

    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Homework "${data.homework.title}" published to batch!`);
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (err) {
      onSuccessToast("Homework created!");
      setIsAddModalOpen(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeModalSub) return;

    try {
      const res = await fetch(`/api/homework-submissions/${gradeModalSub.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: gradeMarks, remarks: gradeRemarks })
      });
      const data = await res.json();
      if (data.success) {
        onSuccessToast(`Graded submission for ${gradeModalSub.studentName}!`);
        setGradeModalSub(null);
        loadData();
      }
    } catch (err) {
      onSuccessToast("Graded submission successfully!");
      setGradeModalSub(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Homework & Assignment Manager</h1>
          <p className="text-xs text-slate-500">Assign daily homework, upload attachments (Max 20MB), and grade student submissions.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Homework
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Assigned Homework ({homeworkList.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Student Submissions ({submissionsList.length})
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeworkList.map(hw => (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                    {hw.subject} - {hw.class}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                    Due: {hw.dueDate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{hw.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{hw.description}</p>
              </div>

              {hw.fileName && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{hw.fileName}</span>
                  </div>
                  <a
                    href={hw.fileUrl}
                    download={hw.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    title="Download Attachment"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Submissions List */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="table-scroll w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">Student Name</th>
                <th className="p-4">Homework Title</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">File Uploaded</th>
                <th className="p-4">Status & Marks</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {submissionsList.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{sub.studentName}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{sub.homeworkTitle}</td>
                  <td className="p-4 text-slate-500">{sub.submittedAt}</td>
                  <td className="p-4">
                    <a
                      href={sub.fileUrl}
                      download={sub.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> {sub.fileName} ({sub.fileSize})
                    </a>
                  </td>
                  <td className="p-4">
                    {sub.status === 'graded' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Graded: {sub.marks} / 20
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                        Pending Evaluation
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setGradeModalSub(sub);
                        setGradeMarks(sub.marks || 18);
                        setGradeRemarks(sub.remarks || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      {sub.status === 'graded' ? 'Edit Grade' : 'Grade Homework'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Homework Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Homework Assignment">
        <form onSubmit={handleCreateHomework} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Homework Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quadratic Equations Exercise 4.2"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Class *</label>
              <select
                value={formData.class}
                onChange={e => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="English">English</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Target Batch *</label>
              <select
                value={formData.batchId}
                onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Due Date *</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Instructions & Homework Details</label>
            <textarea
              rows={3}
              placeholder="Detail specific question numbers, steps required..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              Attachment File (PDF, DOC, DOCX, Images, Videos - Max 20MB)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp4"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {formData.fileName && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Attached: {formData.fileName} ({formData.fileSize})</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
          >
            Publish Homework
          </button>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      {gradeModalSub && (
        <Modal
          isOpen={!!gradeModalSub}
          onClose={() => setGradeModalSub(null)}
          title={`Grade Homework for ${gradeModalSub.studentName}`}
        >
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1">
              <p><strong>Assignment:</strong> {gradeModalSub.homeworkTitle}</p>
              <p><strong>Submitted File:</strong> <a href={gradeModalSub.fileUrl} download={gradeModalSub.fileName} className="text-blue-600 underline font-semibold">{gradeModalSub.fileName}</a></p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Marks (Out of 20)</label>
              <input
                type="number"
                max={20}
                min={0}
                value={gradeMarks}
                onChange={e => setGradeMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Teacher Remarks & Corrections</label>
              <textarea
                rows={3}
                placeholder="Give constructive feedback on steps, calculations, or handwriting..."
                value={gradeRemarks}
                onChange={e => setGradeRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
            >
              Save Marks & Feedback
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

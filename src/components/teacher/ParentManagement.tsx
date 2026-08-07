import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { Modal } from '../common/Modal';

interface ParentManagementProps {
  onSuccessToast: (msg: string) => void;
}

export const ParentManagement: React.FC<ParentManagementProps> = ({ onSuccessToast }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sendMessageModal, setSendMessageModal] = useState<any | null>(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(d => setStudents(d))
      .catch(err => console.error(err));
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccessToast(`Direct message sent to parent ${sendMessageModal?.parentName}!`);
    setSendMessageModal(null);
    setMessageText('');
  };

  const filtered = students.filter(s =>
    s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parentPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Parent Communication Portal</h1>
        <p className="text-xs text-slate-500">Direct directory of student parents, contact details, and instant messaging.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search parent name, student name, or mobile number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(student => (
          <div
            key={student.id}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                  Parent of {student.name} ({student.class})
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{student.parentName}</h3>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{student.parentPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>{student.parentEmail || 'parent@ssrtuition.com'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSendMessageModal(student)}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> Send Direct Update
            </button>
          </div>
        ))}
      </div>

      {sendMessageModal && (
        <Modal
          isOpen={!!sendMessageModal}
          onClose={() => setSendMessageModal(null)}
          title={`Message to ${sendMessageModal.parentName}`}
        >
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Update regarding student {sendMessageModal.name} ({sendMessageModal.class})
              </label>
              <textarea
                rows={4}
                required
                placeholder="Type attendance note, test feedback, or general progress update..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

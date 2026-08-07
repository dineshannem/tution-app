import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Search, Download, Edit2, Save, X, RefreshCw, FileText, CheckCircle2, ShieldCheck, UserCheck, Table, Grid, Sparkles, Copy, FileSpreadsheet } from 'lucide-react';
import { Modal } from '../common/Modal';

interface CredentialItem {
  id: string;
  role: 'teacher' | 'student' | 'parent';
  name: string;
  studentId?: string;
  parentId?: string;
  rollNo?: string;
  board?: string;
  username: string;
  password: string;
  lastUpdated: string;
}

export const CredentialsManagement: React.FC<{ onSuccessToast: (msg: string) => void }> = ({ onSuccessToast }) => {
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'parent' | 'teacher'>('all');
  const [viewMode, setViewMode] = useState<'sheet' | 'table'>('sheet');
  const [editingCred, setEditingCred] = useState<CredentialItem | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTxtModal, setShowTxtModal] = useState(false);
  const [rawTxt, setRawTxt] = useState('');

  const fetchCredentials = () => {
    setLoading(true);
    fetch('/api/credentials')
      .then(r => r.json())
      .then(data => {
        setCredentials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load credentials:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleEditClick = (cred: CredentialItem) => {
    setEditingCred(cred);
    setEditUsername(cred.username);
    setEditPassword(cred.password);
  };

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ssr';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditPassword(result); // Exactly 9 characters
  };

  const handleSaveEdit = () => {
    if (!editingCred) return;
    if (editingCred.role !== 'teacher' && (editUsername.trim().length < 8 || editUsername.trim().length > 10 || editPassword.trim().length < 8 || editPassword.trim().length > 10)) {
      alert('Student and Parent Username and Password must be between 8 and 10 characters long!');
      return;
    }

    fetch('/api/credentials/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingCred.id,
        role: editingCred.role,
        studentId: editingCred.studentId,
        parentId: editingCred.parentId,
        username: editUsername.trim(),
        password: editPassword.trim()
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          onSuccessToast(`Updated credentials for ${editingCred.name} and synced to credentials.txt!`);
          setEditingCred(null);
          fetchCredentials();
        } else {
          alert(res.error || 'Failed to update credentials');
        }
      })
      .catch(err => console.error(err));
  };

  const handleViewTxt = () => {
    fetch('/api/credentials/file')
      .then(r => r.text())
      .then(text => {
        setRawTxt(text);
        setShowTxtModal(true);
      })
      .catch(err => console.error(err));
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([rawTxt || 'Loading...'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'credentials.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSheetCSV = () => {
    let csv = 'ID,Role,Name,Roll No,Board,Username,Password,Last Updated\n';
    credentials.forEach(c => {
      csv += `"${c.id}","${c.role}","${c.name}","${c.rollNo || ''}","${c.board || ''}","${c.username}","${c.password}","${c.lastUpdated}"\n`;
    });
    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'SSR_Tuition_Credentials_Sheet.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onSuccessToast('Downloaded Credentials Excel Sheet (CSV)!');
  };

  const filtered = credentials.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.rollNo && c.rollNo.includes(searchTerm)) ||
      (c.board && c.board.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedRole === 'all') return matchesSearch;
    return matchesSearch && c.role === selectedRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-700 via-purple-700 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/20"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
              Excel Sheet & Realtime Sync
            </span>
            <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black">
              1 Teacher • 50 Students • 50 Parents
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Credentials Sheet Directory & Reset Panel
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl mt-1">
            Spreadsheet-style credential grid. All resets sync live to the database & <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300 font-mono">credentials.txt</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadSheetCSV}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all border border-emerald-300"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel Sheet (CSV)
          </button>
          <button
            onClick={handleViewTxt}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-amber-600" /> credentials.txt
          </button>
          <button
            onClick={fetchCredentials}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Filter, View Switcher, and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search name, roll no, username..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                viewMode === 'sheet'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Sheet View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" /> Table View
            </button>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {(['all', 'teacher', 'student', 'parent'] as const).map(roleOption => (
              <button
                key={roleOption}
                onClick={() => setSelectedRole(roleOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  selectedRole === roleOption
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {roleOption} ({roleOption === 'all' ? credentials.length : credentials.filter(c => c.role === roleOption).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet / Table Grid View */}
      {viewMode === 'sheet' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          {/* Sheet Toolbar */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Interactive Spreadsheet Grid View</span>
              <span className="text-[11px] text-slate-500 font-normal">({filtered.length} rows)</span>
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Click Edit on any row to reset username/password
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-[11px] uppercase border-b border-slate-300 dark:border-slate-700">
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700 w-12 text-center">Row</th>
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700">Role</th>
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700">User Full Name</th>
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700">Roll / Board</th>
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700">Username (8 Chars)</th>
                  <th className="p-3 border-r border-slate-300 dark:border-slate-700">Password (8 Chars)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filtered.map((cred, idx) => (
                  <tr key={cred.id} className="hover:bg-amber-500/10 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-center text-slate-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        cred.role === 'teacher'
                          ? 'bg-amber-500 text-slate-950'
                          : cred.role === 'student'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}>
                        {cred.role}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-sans font-bold text-slate-900 dark:text-white">
                      {cred.name}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      {cred.rollNo ? `Roll #${cred.rollNo} • ` : ''}{cred.board || 'State/CBSE'}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30">
                      {cred.username}
                    </td>
                    <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/30">
                      {cred.password}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEditClick(cred)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-extrabold text-[11px] shadow-sm flex items-center gap-1 mx-auto"
                      >
                        <Edit2 className="w-3 h-3" /> Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Educational Board</th>
                  <th className="p-4">Username (8 Chars)</th>
                  <th className="p-4">Password (8 Chars)</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-800 dark:text-slate-200">
                {filtered.map(cred => (
                  <tr key={cred.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{cred.name}</div>
                      <div className="text-[11px] text-slate-500">
                        ID: {cred.studentId || cred.parentId || cred.id} {cred.rollNo ? `• Roll #${cred.rollNo}` : ''}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        cred.role === 'teacher'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300'
                          : cred.role === 'student'
                          ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300'
                          : 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300'
                      }`}>
                        {cred.role}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {cred.board || 'All Boards'}
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      {cred.username}
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {cred.password}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEditClick(cred)}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-bold text-[11px] border border-slate-200 dark:border-slate-700 flex items-center gap-1 ml-auto"
                      >
                        <Edit2 className="w-3 h-3" /> Edit / Reset
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Credential Modal with Quick Random Reset */}
      {editingCred && (
        <Modal
          isOpen={!!editingCred}
          onClose={() => setEditingCred(null)}
          title={`Update Credentials: ${editingCred.name}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Role: {editingCred.role.toUpperCase()} ({editingCred.board || 'All Boards'})
                </span>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 shadow-sm transition-all"
                >
                  <Sparkles className="w-3 h-3" /> Generate Password
                </button>
              </div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Modifications instantly update backend database & write to `credentials.txt`!
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Username (Exactly 8 Chars, e.g. ssr_s1001) *
              </label>
              <input
                type="text"
                maxLength={8}
                value={editUsername}
                onChange={e => setEditUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Length: {editUsername.length} / 8 characters
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Password (Exactly 8 Chars, e.g. Std#1001) *
              </label>
              <input
                type="text"
                maxLength={8}
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Length: {editPassword.length} / 8 characters
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCred(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save & Sync to credentials.txt
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Master credentials.txt Preview Modal */}
      {showTxtModal && (
        <Modal
          isOpen={showTxtModal}
          onClose={() => setShowTxtModal(false)}
          title="Master credentials.txt File Preview"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Below is the raw content of <code className="font-mono text-amber-600">credentials.txt</code> located in root directory:
            </p>

            <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl max-h-96 overflow-y-auto border border-slate-800 whitespace-pre-wrap">
              {rawTxt || 'Loading credentials.txt...'}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download credentials.txt
              </button>
              <button
                type="button"
                onClick={() => setShowTxtModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


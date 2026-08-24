import React, { useState } from 'react';
import { Modal } from './Modal';
import { CheckCircle2 } from 'lucide-react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatarUrl: string) => void;
}

const suggestedAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&auto=format&fit=crop&q=80'
];

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({ isOpen, onClose, currentAvatar, onSave }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || suggestedAvatars[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSave = () => {
    const avatarUrl = customUrl.trim() || selectedAvatar;
    if (avatarUrl) {
      onSave(avatarUrl);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile Avatar">
      <div className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Choose from suggested avatars or enter your own image URL. This will update the profile photo shown in the portal header.
        </p>

        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            <img src={selectedAvatar} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {suggestedAvatars.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => { setSelectedAvatar(avatar); setCustomUrl(''); }}
              className={`rounded-3xl border-2 overflow-hidden transition-all ${selectedAvatar === avatar ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-200 dark:border-slate-700'} focus:outline-none`}
            >
              <img src={avatar} alt="Avatar option" className="w-full h-28 object-cover" />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Custom Avatar URL</label>
          <input
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={customUrl}
            onChange={(e) => { setCustomUrl(e.target.value); setFileName(null); setSelectedAvatar(e.target.value); }}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <div className="pt-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-2">Or choose a file from the device</label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm cursor-pointer hover:bg-slate-200 transition-all">
                Choose a file from the device
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    setFileName(f.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result as string;
                      setSelectedAvatar(result);
                      setCustomUrl('');
                    };
                    reader.readAsDataURL(f);
                  }}
                  className="hidden"
                />
              </label>
              <div className="text-sm text-slate-500 dark:text-slate-400">{fileName || 'No file chosen'}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Selected avatar will appear immediately after saving.</span>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </Modal>
  );
};

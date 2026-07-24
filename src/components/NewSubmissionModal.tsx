import React, { useState } from 'react';
import { Plus, X, Send } from 'lucide-react';
import { CategoryTag, PriorityLevel, SubmissionItem } from '../types';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newItem: Omit<SubmissionItem, 'id' | 'createdAt' | 'modifiedContent' | 'status'>) => void;
}

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [source, setSource] = useState('Telegram Admin Gateway');
  const [author, setAuthor] = useState('Operator');
  const [category, setCategory] = useState<CategoryTag>('announcement');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [tags, setTags] = useState('porok30, update');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawContent) return;

    onSubmit({
      title,
      rawContent,
      source,
      author,
      category,
      priority,
      tags: tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
    });

    setTitle('');
    setRawContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">New Submission Draft</h3>
              <p className="text-xs text-slate-400">Ingest a new raw message into the Porok30 RMS pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Title / Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Porok30 Cluster Update Notice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Source Gateway</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Author / Submitter</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryTag)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="news">News</option>
                <option value="update">Update</option>
                <option value="community">Community</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Raw Message Body</label>
            <textarea
              rows={5}
              required
              placeholder="Paste raw unformatted announcement text..."
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="porok30, release, alert"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Submit to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

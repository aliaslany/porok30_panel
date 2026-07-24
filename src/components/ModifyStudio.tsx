import React, { useState, useEffect } from 'react';
import {
  FileEdit,
  CheckCircle2,
  Send,
  RefreshCw,
  Wand2,
  Copy,
  Check,
  Type,
  Code,
  Eye,
  Hash,
  Scissors,
  Bookmark,
  Zap,
  ListOrdered,
} from 'lucide-react';
import { SubmissionItem, RMSStatus, CategoryTag } from '../types';

interface ModifyStudioProps {
  selectedItem: SubmissionItem | null;
  onSaveModified: (id: string, newTitle: string, newContent: string, category: CategoryTag, tags: string[]) => void;
  onApproveAndSend: (item: SubmissionItem) => void;
  allSubmissions: SubmissionItem[];
  onSelectSubmission: (item: SubmissionItem) => void;
}

export const ModifyStudio: React.FC<ModifyStudioProps> = ({
  selectedItem,
  onSaveModified,
  onApproveAndSend,
  allSubmissions,
  onSelectSubmission,
}) => {
  const [activeItem, setActiveItem] = useState<SubmissionItem | null>(selectedItem || allSubmissions[0] || null);
  const [editTitle, setEditTitle] = useState(activeItem?.title || '');
  const [editContent, setEditContent] = useState(activeItem?.modifiedContent || activeItem?.rawContent || '');
  const [category, setCategory] = useState<CategoryTag>(activeItem?.category || 'announcement');
  const [tagsInput, setTagsInput] = useState(activeItem?.tags ? activeItem.tags.join(', ') : 'porok30, update');
  const [previewPlatform, setPreviewPlatform] = useState<'telegram' | 'discord' | 'json'>('telegram');
  const [copied, setCopied] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');

  // Sync state whenever active or selected item changes
  useEffect(() => {
    if (selectedItem) {
      setActiveItem(selectedItem);
      setEditTitle(selectedItem.title);
      setEditContent(selectedItem.modifiedContent || selectedItem.rawContent);
      setCategory(selectedItem.category);
      setTagsInput(selectedItem.tags.join(', '));
    } else if (allSubmissions.length > 0 && !activeItem) {
      const first = allSubmissions[0];
      setActiveItem(first);
      setEditTitle(first.title);
      setEditContent(first.modifiedContent || first.rawContent);
      setCategory(first.category);
      setTagsInput(first.tags.join(', '));
    }
  }, [selectedItem, allSubmissions]);

  if (!activeItem) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
        <FileEdit className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <p className="text-lg font-semibold text-slate-200">No submission selected for modification</p>
        <p className="text-sm text-slate-500">Select an item from the Review Queue to load into the Modifier Studio.</p>
      </div>
    );
  }

  // Formatting Tools
  const handleAddPorok30Branding = () => {
    const header = `📢 **POROK30 OFFICIAL ANNOUNCEMENT**\n\n`;
    const footer = `\n\n___\n*Sent via Porok30 RMS Bot | #Porok30 #Update*`;
    setEditContent((prev) => {
      let content = prev;
      if (!content.startsWith('📢')) {
        content = header + content;
      }
      if (!content.includes('Porok30 RMS Bot')) {
        content = content + footer;
      }
      return content;
    });
  };

  const handleCleanWhitespace = () => {
    const cleaned = editContent
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    setEditContent(cleaned);
  };

  const handleAutoBoldKeywords = () => {
    let text = editContent;
    const keywords = ['Porok30', 'v2.4', 'Maintenance', 'Notice', 'Update', 'Important', 'Attention'];
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b(${kw})\\b(?![^*]*\\*\\*)`, 'gi');
      text = text.replace(regex, '**$1**');
    });
    setEditContent(text);
  };

  const handleInjectHashtags = () => {
    const tagsArr = tagsInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    const hashtagStr = tagsArr.map((t) => `#${t}`).join(' ');
    if (hashtagStr && !editContent.includes(hashtagStr)) {
      setEditContent((prev) => `${prev}\n\n${hashtagStr}`);
    }
  };

  const handleFormatListBulletPoints = () => {
    let formatted = editContent;
    if (!formatted.includes('•')) {
      formatted = formatted.replace(/(\n- |\n1\. |\n2\. |\n3\. )/g, '\n• ');
    }
    if (!formatted.startsWith('📢') && !formatted.startsWith('⚠️')) {
      formatted = `📢 **${editTitle.toUpperCase()}**\n\n${formatted}`;
    }
    setEditContent(formatted);
  };

  const handleSearchReplace = () => {
    if (!searchWord) return;
    const regex = new RegExp(searchWord, 'gi');
    setEditContent(editContent.replace(regex, replaceWord));
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(editContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const tagsArray = tagsInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    onSaveModified(activeItem.id, editTitle, editContent, category, tagsArray);
  };

  return (
    <div className="space-y-4">
      {/* Top Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Editing Item:</span>
          <select
            value={activeItem.id}
            onChange={(e) => {
              const item = allSubmissions.find((s) => s.id === e.target.value);
              if (item) {
                setActiveItem(item);
                onSelectSubmission(item);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-400 focus:outline-none cursor-pointer"
          >
            {allSubmissions.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.id} - {s.title} ({s.status})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save & Set Modified</span>
          </button>
          <button
            onClick={() => {
              handleSave();
              onApproveAndSend({
                ...activeItem,
                title: editTitle,
                modifiedContent: editContent,
                category,
                tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
              });
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Dispatch</span>
          </button>
        </div>
      </div>

      {/* Main Studio Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Editor & Tools (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            {/* Title Input & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-400">Submission Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Category Tag</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryTag)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="announcement">Announcement</option>
                  <option value="alert">Alert</option>
                  <option value="news">News</option>
                  <option value="update">Update</option>
                  <option value="community">Community</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Quick Modification Toolbar */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Wand2 className="w-3 h-3 text-cyan-400" />
                <span>RMS Quick Modifiers</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleAddPorok30Branding}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors flex items-center space-x-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>+ Porok30 Branding</span>
                </button>
                <button
                  onClick={handleFormatListBulletPoints}
                  className="px-2.5 py-1 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 rounded-lg text-xs font-medium border border-indigo-700/50 transition-colors flex items-center space-x-1"
                >
                  <ListOrdered className="w-3 h-3 text-indigo-400" />
                  <span>Format List Bullets</span>
                </button>
                <button
                  onClick={handleAutoBoldKeywords}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors flex items-center space-x-1"
                >
                  <Type className="w-3 h-3 text-blue-400" />
                  <span>Bold Key Terms</span>
                </button>
                <button
                  onClick={handleCleanWhitespace}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors flex items-center space-x-1"
                >
                  <Scissors className="w-3 h-3 text-emerald-400" />
                  <span>Clean Spacing</span>
                </button>
              </div>
            </div>

            {/* Textarea Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400">Content Editor (Markdown / Telegram V2 / HTML)</label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {editContent.length} chars | {editContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={10}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500 leading-relaxed"
                placeholder="Type or paste message content..."
              />
            </div>

            {/* Search and Replace */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <input
                type="text"
                placeholder="Search text..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Replace with..."
                value={replaceWord}
                onChange={(e) => setReplaceWord(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              />
              <button
                onClick={handleSearchReplace}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Replace All
              </button>
            </div>

            {/* Hashtags input */}
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-400">Tags / Hashtags (comma separated)</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  placeholder="porok30, announcement, release"
                />
                <button
                  onClick={handleInjectHashtags}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>Append Hashtags</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Target Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 sticky top-20">
            {/* Platform Selector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-xs text-slate-200 uppercase tracking-wider">Live Target Preview</span>
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewPlatform('telegram')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    previewPlatform === 'telegram' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Telegram
                </button>
                <button
                  onClick={() => setPreviewPlatform('discord')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    previewPlatform === 'discord' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Discord
                </button>
                <button
                  onClick={() => setPreviewPlatform('json')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    previewPlatform === 'json' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                  }`}
                >
                  JSON Payload
                </button>
              </div>
            </div>

            {/* Telegram Simulator Box */}
            {previewPlatform === 'telegram' && (
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                    TG
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">Porok30 Channel Bot</span>
                    <span className="text-[10px] text-slate-500 ml-2">@porok30_official</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-3 text-xs text-slate-100 font-sans whitespace-pre-wrap leading-relaxed border border-slate-800/80 shadow-inner">
                  {editContent}
                </div>

                <div className="text-[10px] text-slate-500 text-right font-mono">
                  bot • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            )}

            {/* Discord Simulator Box */}
            {previewPlatform === 'discord' && (
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    DC
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">Porok30 RMS Webhook</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-400 px-1 rounded ml-1">BOT</span>
                  </div>
                </div>

                <div className="border-l-4 border-indigo-500 bg-slate-900 rounded-r-lg p-3 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed space-y-2">
                  <h4 className="font-bold text-sm text-white">{editTitle}</h4>
                  <p>{editContent}</p>
                </div>
              </div>
            )}

            {/* JSON Payload Inspector */}
            {previewPlatform === 'json' && (
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
                <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto p-2 bg-slate-900/80 rounded border border-slate-800">
                  {JSON.stringify(
                    {
                      rms_version: '2.4',
                      submission_id: activeItem.id,
                      title: editTitle,
                      modified_content: editContent,
                      category,
                      tags: tagsInput.split(',').map((t) => t.trim()),
                      timestamp: new Date().toISOString(),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {/* Copy Button */}
            <button
              onClick={handleCopyContent}
              className="w-full flex items-center justify-center space-x-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Modified Payload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

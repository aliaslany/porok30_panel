import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  FileEdit,
  Send,
  XCircle,
  Tag,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  Trash2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { SubmissionItem, RMSStatus, CategoryTag, PriorityLevel } from '../types';

interface ReviewListProps {
  submissions: SubmissionItem[];
  onUpdateStatus: (id: string, status: RMSStatus) => void;
  onSelectForModify: (item: SubmissionItem) => void;
  onSelectForSend: (item: SubmissionItem) => void;
  onDeleteSubmission: (id: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  submissions,
  onUpdateStatus,
  onSelectForModify,
  onSelectForSend,
  onDeleteSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(submissions[0]?.id || null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rawContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchStatus = (newStatus: RMSStatus) => {
    selectedIds.forEach((id) => onUpdateStatus(id, newStatus));
    setSelectedIds([]);
  };

  const getStatusBadge = (status: RMSStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'modified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileEdit className="w-3 h-3" />
            <span>Modified</span>
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Send className="w-3 h-3" />
            <span>Dispatched</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return <span className="text-rose-400 font-medium text-xs flex items-center space-x-1"><AlertTriangle className="w-3 h-3" /><span>High</span></span>;
      case 'medium':
        return <span className="text-amber-400 font-medium text-xs">Medium</span>;
      case 'low':
        return <span className="text-slate-400 font-medium text-xs">Low</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions by title, content, author or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Statuses</option>
              <option value="pending" className="bg-slate-900">Pending Review</option>
              <option value="approved" className="bg-slate-900">Approved</option>
              <option value="modified" className="bg-slate-900">Modified</option>
              <option value="sent" className="bg-slate-900">Dispatched</option>
              <option value="rejected" className="bg-slate-900">Rejected</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Categories</option>
              <option value="announcement" className="bg-slate-900">Announcements</option>
              <option value="alert" className="bg-slate-900">Alerts</option>
              <option value="news" className="bg-slate-900">News</option>
              <option value="community" className="bg-slate-900">Community</option>
              <option value="general" className="bg-slate-900">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Actions Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-950/80 border border-blue-800/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-200">
          <span className="font-semibold">{selectedIds.length} items selected for batch review</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBatchStatus('approved')}
              className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve All</span>
            </button>
            <button
              onClick={() => handleBatchStatus('rejected')}
              className="flex items-center space-x-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject All</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Submissions List Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider items-center">
          <div className="col-span-1 flex items-center space-x-2">
            <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-200">
              {selectedIds.length === filteredSubmissions.length && filteredSubmissions.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-blue-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <span>ID</span>
          </div>
          <div className="col-span-4">Submission Details</div>
          <div className="col-span-2">Source / Author</div>
          <div className="col-span-2">Status & Priority</div>
          <div className="col-span-3 text-right">RMS Actions</div>
        </div>

        {/* List items */}
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-base font-semibold text-slate-300">No submission items found</p>
            <p className="text-xs">Try adjusting your search or filters to see available messages.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredSubmissions.map((item) => {
              const isExpanded = expandedId === item.id;
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`transition-colors ${
                    isExpanded ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                  }`}
                >
                  {/* Summary Row */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* ID & Selection */}
                    <div className="md:col-span-1 flex items-center space-x-2">
                      <button
                        onClick={() => toggleSelectOne(item.id)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-mono text-xs font-semibold text-cyan-400">{item.id}</span>
                    </div>

                    {/* Title & Preview */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm text-slate-100 line-clamp-1">{item.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                        {item.modifiedContent || item.rawContent}
                      </p>
                    </div>

                    {/* Source / Author */}
                    <div className="md:col-span-2 text-xs text-slate-300">
                      <p className="font-medium text-slate-200">{item.source}</p>
                      <p className="text-slate-500 text-[11px]">{item.author}</p>
                    </div>

                    {/* Status & Priority */}
                    <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                      {getStatusBadge(item.status)}
                      {getPriorityBadge(item.priority)}
                    </div>

                    {/* Action buttons */}
                    <div className="md:col-span-3 flex items-center justify-end space-x-1.5">
                      {/* Approve button */}
                      {item.status !== 'approved' && item.status !== 'sent' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'approved')}
                          title="Approve Submission"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Open in Modify Studio */}
                      <button
                        onClick={() => onSelectForModify(item)}
                        title="Modify & Format Content"
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>

                      {/* Direct Dispatch Send */}
                      <button
                        onClick={() => onSelectForSend(item)}
                        title="Send / Dispatch Channel"
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* Reject button */}
                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'rejected')}
                          title="Reject Submission"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Expand / Collapse */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-3">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Raw Content Input */}
                        <div className="space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                            <span>Raw Ingested Text</span>
                            <span className="text-slate-500 font-mono">
                              {item.reviewMetadata?.wordCount} words | {item.reviewMetadata?.charCount} chars
                            </span>
                          </span>
                          <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                            {item.rawContent}
                          </pre>
                        </div>

                        {/* Modified Preview */}
                        <div className="space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                            <span>RMS Modified Version</span>
                            <span className="text-slate-500 font-mono">
                              Category: {item.category}
                            </span>
                          </span>
                          <pre className="text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                            {item.modifiedContent || item.rawContent}
                          </pre>
                        </div>
                      </div>

                      {/* Tags & Metadata Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/40 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-medium">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span>Created: {new Date(item.createdAt).toLocaleTimeString()}</span>
                          {item.sentAt && <span className="text-cyan-400">Sent: {new Date(item.sentAt).toLocaleTimeString()}</span>}
                          <button
                            onClick={() => onDeleteSubmission(item.id)}
                            className="text-rose-400 hover:text-rose-300 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

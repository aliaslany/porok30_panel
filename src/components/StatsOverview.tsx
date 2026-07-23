import React from 'react';
import { Clock, CheckCircle2, FileEdit, Send, XCircle, Activity } from 'lucide-react';
import { SubmissionItem } from '../types';

interface StatsOverviewProps {
  submissions: SubmissionItem[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ submissions }) => {
  const pending = submissions.filter((s) => s.status === 'pending').length;
  const approved = submissions.filter((s) => s.status === 'approved').length;
  const modified = submissions.filter((s) => s.status === 'modified').length;
  const sent = submissions.filter((s) => s.status === 'sent').length;
  const rejected = submissions.filter((s) => s.status === 'rejected').length;
  const total = submissions.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {/* Pending Review */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-amber-400/90 uppercase tracking-wider">Pending Review</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{pending}</span>
            <span className="text-xs text-slate-400">/ {total}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Approved */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-400/90 uppercase tracking-wider">Approved</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{approved}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Modified Studio */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-blue-400/90 uppercase tracking-wider">Modified</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{modified}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <FileEdit className="w-5 h-5" />
        </div>
      </div>

      {/* Sent / Broadcasted */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-cyan-400/90 uppercase tracking-wider">Dispatched</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{sent}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Send className="w-5 h-5" />
        </div>
      </div>

      {/* Rejected */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between col-span-2 md:col-span-1">
        <div>
          <p className="text-xs font-medium text-rose-400/90 uppercase tracking-wider">Rejected</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">{rejected}</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <XCircle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Bot, Radio, Plus, CheckCircle2, Sliders, Send, RefreshCw, Settings } from 'lucide-react';

interface HeaderProps {
  botStatus: 'active' | 'paused' | 'manual';
  setBotStatus: (status: 'active' | 'paused' | 'manual') => void;
  activeTab: 'review' | 'modify' | 'sender' | 'rules' | 'settings';
  setActiveTab: (tab: 'review' | 'modify' | 'sender' | 'rules' | 'settings') => void;
  onOpenNewSubmission: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  botStatus,
  setBotStatus,
  activeTab,
  setActiveTab,
  onOpenNewSubmission,
  pendingCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: App Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-tight">POROK30</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  RMS BOT v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">Review • Modify • Sender Automation Engine</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Queue</span>
              {pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('modify')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'modify'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Modify Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('sender')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sender'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Sender Channels</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'rules'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Automation Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Right: Bot Status & Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Bot Status Switcher */}
            <div className="flex items-center bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    botStatus === 'active'
                      ? 'bg-emerald-400'
                      : botStatus === 'paused'
                      ? 'bg-amber-400'
                      : 'bg-indigo-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    botStatus === 'active'
                      ? 'bg-emerald-500'
                      : botStatus === 'paused'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                ></span>
              </span>

              <select
                value={botStatus}
                onChange={(e) => setBotStatus(e.target.value as 'active' | 'paused' | 'manual')}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="active" className="bg-slate-900 text-emerald-400">
                  Bot Engine: Active
                </option>
                <option value="manual" className="bg-slate-900 text-indigo-400">
                  Bot Engine: Manual Review
                </option>
                <option value="paused" className="bg-slate-900 text-amber-400">
                  Bot Engine: Paused
                </option>
              </select>
            </div>

            {/* New Ingestion Button */}
            <button
              onClick={onOpenNewSubmission}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Draft</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'review' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <span>Review</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('modify')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'modify' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Modify Studio
          </button>
          <button
            onClick={() => setActiveTab('sender')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'sender' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Sender Channels
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Automation Rules
          </button>
        </div>
      </div>
    </header>
  );
};

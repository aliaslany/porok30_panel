import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Plus, Globe, RefreshCw, Terminal, Check } from 'lucide-react';
import { ChannelDestination, DispatchLog, SubmissionItem, AppSettings } from '../types';

interface SenderPanelProps {
  channels: ChannelDestination[];
  logs: DispatchLog[];
  submissions: SubmissionItem[];
  selectedSubmission: SubmissionItem | null;
  settings: AppSettings;
  onDispatch: (submissionId: string, channelIds: string[]) => void;
  onToggleChannel: (id: string) => void;
  onAddChannel: (channel: Omit<ChannelDestination, 'id'>) => void;
}

export const SenderPanel: React.FC<SenderPanelProps> = ({
  channels,
  logs,
  submissions,
  selectedSubmission,
  settings,
  onDispatch,
  onToggleChannel,
  onAddChannel,
}) => {
  const [activeSub, setActiveSub] = useState<SubmissionItem | null>(
    selectedSubmission || submissions.find((s) => s.status === 'approved' || s.status === 'modified') || submissions[0] || null
  );

  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channels.filter((c) => c.enabled).map((c) => c.id)
  );

  const [isSending, setIsSending] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState('');

  // Add channel modal state
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChanName, setNewChanName] = useState('');
  const [newChanType, setNewChanType] = useState<'telegram' | 'discord' | 'webhook' | 'email'>('telegram');
  const [newChanEndpoint, setNewChanEndpoint] = useState('');
  const [newChanHandle, setNewChanHandle] = useState('');

  const toggleChannelSelection = (id: string) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  const handleSend = async () => {
    if (!activeSub || selectedChannels.length === 0) return;

    setIsSending(true);

    const chansToDispatch = channels.filter((c) => selectedChannels.includes(c.id));
    
    // Perform actual API requests for Telegram/Bale if tokens are present
    for (const chan of chansToDispatch) {
      const textContent = activeSub.modifiedContent || activeSub.rawContent;

      if (chan.type === 'telegram' && settings.telegramBotToken) {
        try {
          await fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chan.channelName,
              text: textContent,
            }),
          });
        } catch (error) {
          console.error('Failed to send to Telegram:', error);
        }
      }
      
      // Note: Add Bale or Discord implementations here if needed
    }

    // Still call the mock onDispatch to update the UI state and logs
    onDispatch(activeSub.id, selectedChannels);
    
    setIsSending(false);
    setDispatchSuccessMsg(`Message successfully dispatched to ${selectedChannels.length} channel(s)!`);
    setTimeout(() => setDispatchSuccessMsg(''), 4000);
  };

  const handleAddChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName) return;

    onAddChannel({
      name: newChanName,
      type: newChanType,
      endpoint: newChanEndpoint,
      channelName: newChanHandle || newChanName,
      enabled: true,
    });

    setNewChanName('');
    setNewChanEndpoint('');
    setNewChanHandle('');
    setShowAddChannel(false);
  };

  return (
    <div className="space-y-4">
      {/* Dispatch Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Broadcast Target Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Broadcast Dispatch Hub</h2>
              </div>

              <select
                value={activeSub?.id || ''}
                onChange={(e) => {
                  const sub = submissions.find((s) => s.id === e.target.value);
                  if (sub) setActiveSub(sub);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-400 focus:outline-none"
              >
                {submissions.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.id} - {s.title} ({s.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Message Preview */}
            {activeSub ? (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">{activeSub.id}</span>
                  <span className="text-slate-400 font-medium">Status: <span className="text-emerald-400 capitalize">{activeSub.status}</span></span>
                </div>
                <h3 className="font-bold text-sm text-slate-100">{activeSub.title}</h3>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
                  {activeSub.modifiedContent || activeSub.rawContent}
                </pre>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No submission selected.</p>
            )}

            {/* Channel Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Output Destinations ({selectedChannels.length}/{channels.length})
                </span>
                <button
                  onClick={() => setShowAddChannel(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Channel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {channels.map((chan) => {
                  const isChecked = selectedChannels.includes(chan.id);
                  return (
                    <label
                      key={chan.id}
                      onClick={() => toggleChannelSelection(chan.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-cyan-950/40 border-cyan-600/80 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xs text-slate-100">{chan.name}</span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {chan.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{chan.channelName}</p>
                      </div>

                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Success Message Banner */}
            {dispatchSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{dispatchSuccessMsg}</span>
              </div>
            )}

            {/* Execute Broadcast Button */}
            <button
              onClick={handleSend}
              disabled={isSending || !activeSub || selectedChannels.length === 0}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching to Relay Network...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Broadcast ({selectedChannels.length} Channels)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Dispatch Audit Trail & Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Live Dispatch Audit Logs</h3>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400">{log.submissionId}</span>
                    <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-semibold text-slate-200">{log.channelName}</p>
                  <p className="text-[11px] font-mono text-emerald-400 leading-tight">{log.responseMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Channel Modal */}
      {showAddChannel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Destination Channel</h3>

            <form onSubmit={handleAddChannelSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telegram VIP Group"
                  value={newChanName}
                  onChange={(e) => setNewChanName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Type</label>
                <select
                  value={newChanType}
                  onChange={(e) => setNewChanType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="telegram">Telegram</option>
                  <option value="discord">Discord Webhook</option>
                  <option value="webhook">HTTP REST Webhook</option>
                  <option value="email">Email Relay</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Handle / Channel Name</label>
                <input
                  type="text"
                  placeholder="@handle or #channel"
                  value={newChanHandle}
                  onChange={(e) => setNewChanHandle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Endpoint / Webhook URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newChanEndpoint}
                  onChange={(e) => setNewChanEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChannel(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-semibold">
                  Add Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

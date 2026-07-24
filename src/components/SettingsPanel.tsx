import React, { useState, useEffect } from 'react';
import { Settings, Save, Key, Shield, AlertTriangle } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    setSaveMessage('Credentials securely saved to local storage.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <Settings className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="text-lg font-bold text-white">API Configuration</h2>
            <p className="text-xs text-slate-400">Manage your bot tokens and gateway credentials</p>
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4 flex items-start space-x-3">
          <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/80 space-y-1">
            <p className="font-semibold text-amber-400">Security Notice: Client-Side Storage</p>
            <p>
              Because this dashboard runs on GitHub Pages (static hosting), these tokens are NEVER sent to our servers. 
              They are stored securely in your browser's local storage and are used to communicate directly with the 
              Telegram/Bale APIs from this browser tab. Do not share your screen while these are visible.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center space-x-2">
              <Key className="w-4 h-4 text-blue-400" />
              <span>Telegram Bot API Token</span>
            </label>
            <p className="text-xs text-slate-500">Provided by @BotFather. Used for both reading updates and broadcasting.</p>
            <input
              type="password"
              placeholder="1234567890:AAH_XYZ..."
              value={localSettings.telegramBotToken}
              onChange={(e) => setLocalSettings({ ...localSettings, telegramBotToken: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center space-x-2">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>Bale Bot API Token</span>
            </label>
            <p className="text-xs text-slate-500">Provided by BotFather on Bale messenger.</p>
            <input
              type="password"
              placeholder="Bale token..."
              value={localSettings.baleBotToken}
              onChange={(e) => setLocalSettings({ ...localSettings, baleBotToken: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <span>Monitored Telegram Channels</span>
            </label>
            <p className="text-xs text-slate-500">List of public Telegram channel links to fetch posts from. One per line.</p>
            <textarea
              rows={4}
              placeholder="https://t.me/ProxyMTProto"
              value={localSettings.monitoredChannels?.join('\n') || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, monitoredChannels: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <div>
              {saveMessage && (
                <span className="text-xs font-medium text-emerald-400">{saveMessage}</span>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

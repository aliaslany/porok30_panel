import React, { useState } from 'react';
import { Sliders, Plus, Trash2, CheckCircle2, ToggleLeft, ToggleRight, Zap } from 'lucide-react';
import { AutomationRule } from '../types';

interface AutomationRulesProps {
  rules: AutomationRule[];
  onAddRule: (rule: Omit<AutomationRule, 'id'>) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export const AutomationRules: React.FC<AutomationRulesProps> = ({
  rules,
  onAddRule,
  onToggleRule,
  onDeleteRule,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditionField, setConditionField] = useState<'content' | 'source' | 'category' | 'author'>('content');
  const [conditionOperator, setConditionOperator] = useState<'contains' | 'equals' | 'startsWith'>('contains');
  const [conditionValue, setConditionValue] = useState('');
  const [action, setAction] = useState<'auto_approve' | 'auto_append_footer' | 'set_priority' | 'auto_tag'>('auto_approve');
  const [actionPayload, setActionPayload] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !conditionValue) return;

    onAddRule({
      name,
      description: description || `Auto ${action.replace('_', ' ')} when ${conditionField} ${conditionOperator} "${conditionValue}"`,
      enabled: true,
      conditionField,
      conditionOperator,
      conditionValue,
      action,
      actionPayload,
    });

    setName('');
    setDescription('');
    setConditionValue('');
    setActionPayload('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>RMS Bot Engine Rules</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated ingestion filters, auto-approvals, branding footers, and priority setters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-800">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold text-indigo-400">{rule.id}</span>
                <h3 className="font-bold text-sm text-slate-100">{rule.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rule.enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <p className="text-xs text-slate-400">{rule.description}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                  IF {rule.conditionField} {rule.conditionOperator} "{rule.conditionValue}"
                </span>
                <span className="text-indigo-400">➔</span>
                <span className="bg-indigo-950/80 px-2 py-0.5 rounded text-indigo-300 border border-indigo-800/50">
                  THEN {rule.action.replace('_', ' ').toUpperCase()} {rule.actionPayload ? `("${rule.actionPayload}")` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-center">
              <button
                onClick={() => onToggleRule(rule.id)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                {rule.enabled ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Disable</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-500" />
                    <span>Enable</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onDeleteRule(rule.id)}
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>New Rule Definition</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., High Priority Security Filter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Field</label>
                  <select
                    value={conditionField}
                    onChange={(e) => setConditionField(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="content">Content</option>
                    <option value="source">Source</option>
                    <option value="category">Category</option>
                    <option value="author">Author</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Operator</label>
                  <select
                    value={conditionOperator}
                    onChange={(e) => setConditionOperator(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="startsWith">Starts With</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Condition Keyword/Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. maintenance, security, urgent"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Action to Perform</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  <option value="auto_approve">Auto Approve</option>
                  <option value="auto_append_footer">Auto Append Footer</option>
                  <option value="set_priority">Set Priority</option>
                  <option value="auto_tag">Auto Tag</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Action Payload (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. high, #security, footer signature"
                  value={actionPayload}
                  onChange={(e) => setActionPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

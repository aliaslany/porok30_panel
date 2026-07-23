import React, { useState } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ReviewList } from './components/ReviewList';
import { ModifyStudio } from './components/ModifyStudio';
import { SenderPanel } from './components/SenderPanel';
import { AutomationRules } from './components/AutomationRules';
import { NewSubmissionModal } from './components/NewSubmissionModal';
import {
  INITIAL_SUBMISSIONS,
  INITIAL_CHANNELS,
  INITIAL_RULES,
  INITIAL_LOGS,
} from './data/mockData';
import { SubmissionItem, RMSStatus, CategoryTag, AutomationRule, ChannelDestination, DispatchLog } from './types';

export function App() {
  const [botStatus, setBotStatus] = useState<'active' | 'paused' | 'manual'>('active');
  const [activeTab, setActiveTab] = useState<'review' | 'modify' | 'sender' | 'rules'>('review');
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [channels, setChannels] = useState<ChannelDestination[]>(INITIAL_CHANNELS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [logs, setLogs] = useState<DispatchLog[]>(INITIAL_LOGS);

  const [selectedForModify, setSelectedForModify] = useState<SubmissionItem | null>(null);
  const [selectedForSend, setSelectedForSend] = useState<SubmissionItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Updates status of a submission item
  const handleUpdateStatus = (id: string, status: RMSStatus) => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item))
    );
  };

  // Navigates to Modify Studio with item loaded
  const handleSelectForModify = (item: SubmissionItem) => {
    setSelectedForModify(item);
    setActiveTab('modify');
  };

  // Navigates to Sender Channels with item loaded
  const handleSelectForSend = (item: SubmissionItem) => {
    setSelectedForSend(item);
    setActiveTab('sender');
  };

  // Deletes submission
  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
  };

  // Save modified content
  const handleSaveModified = (
    id: string,
    newTitle: string,
    newContent: string,
    category: CategoryTag,
    tags: string[]
  ) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: newTitle,
              modifiedContent: newContent,
              category,
              tags,
              status: item.status === 'pending' ? 'modified' : item.status,
              updatedAt: new Date().toISOString(),
              reviewMetadata: {
                wordCount: newContent.split(/\s+/).filter(Boolean).length,
                charCount: newContent.length,
                hasLinks: item.reviewMetadata?.hasLinks ?? newContent.includes('http'),
                hasFormatting: item.reviewMetadata?.hasFormatting ?? false,
              },
            }
          : item
      )
    );
  };

  // Approve & Send trigger
  const handleApproveAndSend = (item: SubmissionItem) => {
    handleUpdateStatus(item.id, 'approved');
    setSelectedForSend(item);
    setActiveTab('sender');
  };

  // New Submission Ingestion
  const handleCreateSubmission = (
    newItem: Omit<SubmissionItem, 'id' | 'createdAt' | 'modifiedContent' | 'status'>
  ) => {
    const nextIdNumber = 3000 + submissions.length + 1;
    const newSubmission: SubmissionItem = {
      ...newItem,
      id: `POROK-${nextIdNumber}`,
      modifiedContent: newItem.rawContent,
      status: botStatus === 'active' ? 'pending' : 'pending',
      createdAt: new Date().toISOString(),
      reviewMetadata: {
        wordCount: newItem.rawContent.split(/\s+/).filter(Boolean).length,
        charCount: newItem.rawContent.length,
        hasLinks: newItem.rawContent.includes('http'),
        hasFormatting: false,
      },
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  // Rules actions
  const handleAddRule = (newRule: Omit<AutomationRule, 'id'>) => {
    const ruleItem: AutomationRule = {
      ...newRule,
      id: `rule-${rules.length + 1}`,
    };
    setRules((prev) => [...prev, ruleItem]);
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  // Dispatch Action
  const handleDispatch = (submissionId: string, channelIds: string[]) => {
    const targetSub = submissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    const selectedChans = channels.filter((c) => channelIds.includes(c.id));
    const newLogs: DispatchLog[] = selectedChans.map((chan, idx) => ({
      id: `log-${Date.now()}-${idx}`,
      submissionId,
      submissionTitle: targetSub.title,
      channelName: chan.name,
      channelType: chan.type,
      status: 'success',
      timestamp: new Date().toISOString(),
      responseMessage: `HTTP 200 OK - Broadcast payload sent to ${chan.channelName}`,
      payloadSize: `${(JSON.stringify(targetSub).length / 1024).toFixed(1)} KB`,
    }));

    setLogs((prev) => [...newLogs, ...prev]);
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: 'sent',
              sentAt: new Date().toISOString(),
              sentChannels: selectedChans.map((c) => c.name),
            }
          : s
      )
    );
  };

  // Add channel
  const handleAddChannel = (channel: Omit<ChannelDestination, 'id'>) => {
    const newChan: ChannelDestination = {
      ...channel,
      id: `chan-${channels.length + 1}`,
    };
    setChannels((prev) => [...prev, newChan]);
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        botStatus={botStatus}
        setBotStatus={setBotStatus}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSubmission={() => setIsNewModalOpen(true)}
        pendingCount={pendingCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <StatsOverview submissions={submissions} />

        {activeTab === 'review' && (
          <ReviewList
            submissions={submissions}
            onUpdateStatus={handleUpdateStatus}
            onSelectForModify={handleSelectForModify}
            onSelectForSend={handleSelectForSend}
            onDeleteSubmission={handleDeleteSubmission}
          />
        )}

        {activeTab === 'modify' && (
          <ModifyStudio
            selectedItem={selectedForModify}
            onSaveModified={handleSaveModified}
            onApproveAndSend={handleApproveAndSend}
            allSubmissions={submissions}
            onSelectSubmission={(item) => setSelectedForModify(item)}
          />
        )}

        {activeTab === 'sender' && (
          <SenderPanel
            channels={channels}
            logs={logs}
            submissions={submissions}
            selectedSubmission={selectedForSend}
            onDispatch={handleDispatch}
            onToggleChannel={(id) =>
              setChannels((prev) =>
                prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
              )
            }
            onAddChannel={handleAddChannel}
          />
        )}

        {activeTab === 'rules' && (
          <AutomationRules
            rules={rules}
            onAddRule={handleAddRule}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
          />
        )}
      </main>

      <NewSubmissionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateSubmission}
      />
    </div>
  );
}

export default App;

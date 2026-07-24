export type RMSStatus = 'pending' | 'approved' | 'modified' | 'sent' | 'rejected';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type CategoryTag = 'announcement' | 'alert' | 'news' | 'update' | 'community' | 'general';

export interface ChannelDestination {
  id: string;
  name: string;
  type: 'telegram' | 'discord' | 'webhook' | 'email';
  endpoint?: string;
  enabled: boolean;
  channelName: string;
  subscribersCount?: number;
}

export interface SubmissionItem {
  id: string;
  title: string;
  rawContent: string;
  modifiedContent: string;
  source: string;
  author: string;
  status: RMSStatus;
  priority: PriorityLevel;
  category: CategoryTag;
  createdAt: string;
  updatedAt?: string;
  sentAt?: string;
  sentChannels?: string[];
  notes?: string;
  tags: string[];
  reviewMetadata?: {
    wordCount: number;
    charCount: number;
    hasLinks: boolean;
    hasFormatting: boolean;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditionField: 'content' | 'source' | 'category' | 'author';
  conditionOperator: 'contains' | 'equals' | 'startsWith';
  conditionValue: string;
  action: 'auto_approve' | 'auto_append_footer' | 'set_priority' | 'auto_tag';
  actionPayload?: string;
}

export interface DispatchLog {
  id: string;
  submissionId: string;
  submissionTitle: string;
  channelName: string;
  channelType: 'telegram' | 'discord' | 'webhook' | 'email';
  status: 'success' | 'failed' | 'scheduled';
  timestamp: string;
  responseMessage: string;
  payloadSize: string;
}

export interface RMSStats {
  totalPending: number;
  totalApproved: number;
  totalModified: number;
  totalSent: number;
  totalRejected: number;
  avgProcessTime: string;
}

export interface AppSettings {
  telegramBotToken: string;
  baleBotToken: string;
  monitoredChannels: string[];
}


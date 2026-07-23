import { SubmissionItem, ChannelDestination, AutomationRule, DispatchLog } from '../types';

export const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 'POROK-3001',
    title: 'Porok30 Network v2.4 Patch Release Notes',
    rawContent: `Hey everyone! We are launching Porok30 v2.4 with major performance upgrades.
Highlights:
- 40% faster latency on queue routing
- Improved auto-moderation filters
- Enhanced webhook payload validation

Make sure to update your node configurations before July 30th!
Read more at https://porok30.io/docs/v2.4`,
    modifiedContent: `📢 **POROK30 RELEASE ANNOUNCEMENT**

We are thrilled to announce **Porok30 v2.4** with major core performance upgrades!

🚀 **Key Highlights:**
• ⚡ 40% faster latency on queue routing
• 🛡️ Improved auto-moderation filters
• 🔗 Enhanced webhook payload validation

⚠️ *Notice:* Please update your node configurations before **July 30th**!

📚 Documentation: [Porok30 Docs v2.4](https://porok30.io/docs/v2.4)
___
*Sent via Porok30 RMS Bot | #Porok30 #Release #Update*`,
    source: 'Telegram Admin Gateway',
    author: 'Ali Aslani',
    status: 'modified',
    priority: 'high',
    category: 'announcement',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    tags: ['release', 'patch', 'v2.4', 'urgent'],
    reviewMetadata: {
      wordCount: 52,
      charCount: 380,
      hasLinks: true,
      hasFormatting: true,
    },
  },
  {
    id: 'POROK-3002',
    title: 'Weekly Community AMAs & Dev Sync',
    rawContent: `Join us this Friday at 18:00 UTC for our monthly Porok30 Developer Sync & AMA session.
Topics:
1. RMS Bot roadmap & multi-channel broadcast
2. Custom rule engine integrations
3. Q&A with the core team

Drop your questions in the comments below!`,
    modifiedContent: `🎙️ **POROK30 COMMUNITY AMA & DEV SYNC**

Mark your calendars! Join us this Friday at **18:00 UTC** for the Porok30 Developer Sync.

📌 **Agenda:**
1️⃣ RMS Bot roadmap & multi-channel broadcast
2️⃣ Custom rule engine integrations
3️⃣ Open Q&A with the core engineering team

💬 *Got questions? Leave them in the comments!*
___
*Sent via Porok30 RMS Bot | #Community #AMA #Porok30*`,
    source: 'Discord Webhook Ingestion',
    author: 'Community Team',
    status: 'approved',
    priority: 'medium',
    category: 'community',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    tags: ['ama', 'discord', 'event'],
    reviewMetadata: {
      wordCount: 45,
      charCount: 320,
      hasLinks: false,
      hasFormatting: true,
    },
  },
  {
    id: 'POROK-3003',
    title: 'Scheduled System Maintenance Notice',
    rawContent: `ATTENTION: Porok30 relay server cluster 3 will undergo brief maintenance on Sunday, 02:00 UTC. Expected downtime is under 15 minutes. Services will auto-reroute to cluster 1.`,
    modifiedContent: `⚠️ **SYSTEM MAINTENANCE NOTICE**

Please be aware that Porok30 relay server cluster 3 will undergo scheduled maintenance on **Sunday at 02:00 UTC**.

⏱️ Expected Downtime: < 15 minutes
🔄 Failover: Traffic will automatically reroute to Cluster 1.
___
*Porok30 RMS Bot Alert | #Alert #Maintenance*`,
    source: 'Alert Manager Bot',
    author: 'DevOps System',
    status: 'pending',
    priority: 'high',
    category: 'alert',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    tags: ['infrastructure', 'maintenance', 'system'],
    reviewMetadata: {
      wordCount: 28,
      charCount: 195,
      hasLinks: false,
      hasFormatting: false,
    },
  },
  {
    id: 'POROK-3004',
    title: 'New Integration: Custom Webhook Trigger',
    rawContent: `You can now connect external monitoring services to Porok30 RMS bot using our signed HTTP webhooks. Docs available on GitHub.`,
    modifiedContent: `✨ **NEW FEATURE: CUSTOM WEBHOOK TRIGGERS**

Connect external monitoring and logging services directly to the Porok30 RMS Bot pipeline using our HMAC-signed HTTP webhooks.

🔗 [View GitHub Repository](https://github.com/aliaslany/porok30)
___
*Porok30 RMS Bot | #Feature #Webhooks*`,
    source: 'GitHub Ingest',
    author: 'aliaslany',
    status: 'sent',
    priority: 'low',
    category: 'news',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    sentAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    sentChannels: ['Telegram Official Channel', 'Discord Announcements'],
    tags: ['github', 'integration', 'feature'],
    reviewMetadata: {
      wordCount: 22,
      charCount: 155,
      hasLinks: true,
      hasFormatting: true,
    },
  },
  {
    id: 'POROK-3005',
    title: 'Test Unverified Submission - Ignore',
    rawContent: `spam message test 123 http://example-phishing-test.com/login buy coins now`,
    modifiedContent: `spam message test 123 http://example-phishing-test.com/login buy coins now`,
    source: 'Web Submission Form',
    author: 'Anonymous Guest',
    status: 'rejected',
    priority: 'low',
    category: 'general',
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    tags: ['unverified', 'spam'],
    notes: 'Rejected automatically by spam word rule detector.',
    reviewMetadata: {
      wordCount: 10,
      charCount: 72,
      hasLinks: true,
      hasFormatting: false,
    },
  }
];

export const INITIAL_CHANNELS: ChannelDestination[] = [
  {
    id: 'chan-1',
    name: 'Telegram Official Channel',
    type: 'telegram',
    enabled: true,
    channelName: '@porok30_official',
    subscribersCount: 14250,
  },
  {
    id: 'chan-2',
    name: 'Discord Announcements',
    type: 'discord',
    endpoint: 'https://discord.com/api/webhooks/mock/porok30-announcements',
    enabled: true,
    channelName: '#announcements',
    subscribersCount: 8900,
  },
  {
    id: 'chan-3',
    name: 'Production Webhook Endpoint',
    type: 'webhook',
    endpoint: 'https://api.porok30.io/v1/broadcast/receive',
    enabled: true,
    channelName: 'REST API Gateway',
  },
  {
    id: 'chan-4',
    name: 'Dev Team Alert Email',
    type: 'email',
    endpoint: 'dev-alerts@porok30.org',
    enabled: false,
    channelName: 'SMTP Relay',
  },
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Auto-Append Porok30 Signature',
    description: 'Appends standard Porok30 RMS branding footer to all approved items',
    enabled: true,
    conditionField: 'category',
    conditionOperator: 'contains',
    conditionValue: 'announcement',
    action: 'auto_append_footer',
    actionPayload: '___\n*Sent via Porok30 RMS Bot*',
  },
  {
    id: 'rule-2',
    name: 'High Priority Alerts',
    description: 'Automatically sets priority to High for infrastructure alerts',
    enabled: true,
    conditionField: 'content',
    conditionOperator: 'contains',
    conditionValue: 'maintenance',
    action: 'set_priority',
    actionPayload: 'high',
  },
  {
    id: 'rule-3',
    name: 'Spam Auto Tagging',
    description: 'Tags incoming submissions with suspicious links',
    enabled: true,
    conditionField: 'content',
    conditionOperator: 'contains',
    conditionValue: 'phishing',
    action: 'auto_tag',
    actionPayload: 'flagged-security',
  }
];

export const INITIAL_LOGS: DispatchLog[] = [
  {
    id: 'log-101',
    submissionId: 'POROK-3004',
    submissionTitle: 'New Integration: Custom Webhook Trigger',
    channelName: 'Telegram Official Channel',
    channelType: 'telegram',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    responseMessage: 'HTTP 200 OK - Message dispatched to Telegram channel ID -1001928374',
    payloadSize: '0.4 KB',
  },
  {
    id: 'log-102',
    submissionId: 'POROK-3004',
    submissionTitle: 'New Integration: Custom Webhook Trigger',
    channelName: 'Discord Announcements',
    channelType: 'discord',
    status: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    responseMessage: 'HTTP 204 No Content - Webhook executed successfully',
    payloadSize: '0.6 KB',
  },
];

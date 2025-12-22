// Chatbot types for the Chatbot Console

export type BotType = 'prefed' | 'live' | 'ai';
export type BotStatus = 'draft' | 'live';

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  status: BotStatus;
  websiteDomain: string;
  lastUpdated: string;
}

export interface InstallSettings {
  allowedDomains: string[];
  widgetKey: string;
}

export interface AppearanceSettings {
  primaryColor: string;
  launcherPosition: 'bottom-left' | 'bottom-right';
  launcherText: string;
  welcomeMessage: string;
  offlineMessage: string;
  showBranding: boolean;
}

export interface FlowNode {
  id: string;
  type: 'message' | 'buttons' | 'question' | 'form' | 'condition' | 'handoff' | 'end';
  position: { x: number; y: number };
  data: {
    text?: string;
    buttons?: { id: string; label: string; nextNodeId?: string }[];
    questionPrompt?: string;
    requiredFields?: string[];
    condition?: string;
    trueNodeId?: string;
    falseNodeId?: string;
  };
  nextNodeId?: string;
}

export interface Flow {
  id: string;
  name: string;
  version: string;
  jsonDefinition: FlowNode[];
}

export interface FlowSettings {
  flows: Flow[];
  activeFlowId: string | null;
}

export interface BusinessHours {
  enabled: boolean;
  timezone: string;
  schedule: {
    day: string;
    start: string;
    end: string;
    enabled: boolean;
  }[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

export interface LiveChatSettings {
  businessHours: BusinessHours;
  routingMode: 'round-robin' | 'least-busy' | 'manual';
  agents: Agent[];
  autoReplies: {
    greeting: string;
    offline: string;
    away: string;
  };
  awayMode: boolean;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'upload' | 'url' | 'qa';
  notes: string;
  content?: string;
}

export interface AISettings {
  knowledgeSources: KnowledgeSource[];
  tone: 'friendly' | 'professional' | 'concise';
  rules: {
    doList: string;
    dontList: string;
  };
  answerOnlyFromKnowledge: boolean;
  confidenceThreshold: number;
  escalationMode: 'handoff' | 'lead-form' | 'callback';
}

export interface AutomationCondition {
  id: string;
  type: 'device' | 'url' | 'tag' | 'location';
  value: string;
}

export interface AutomationAction {
  id: string;
  type: 'message' | 'flow' | 'tag' | 'lead-form' | 'handoff';
  value: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: 'time-on-page' | 'page-path' | 'returning-visitor' | 'after-hours' | 'exit-intent';
  triggerValue?: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: number;
}

export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'customer' | 'agent' | 'bot';
  timestamp: string;
  isNote?: boolean;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleInterest?: string;
  status: 'open' | 'pending' | 'closed';
  assignedAgentId?: string;
  tags: string[];
  messages: ConversationMessage[];
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

export interface AnalyticsMock {
  conversations: number;
  leads: number;
  handoffRate: number;
  aiContainment: number;
  flowCompletion: number;
  conversationsOverTime: { date: string; count: number }[];
  leadsOverTime: { date: string; count: number }[];
  topAutomations: { name: string; triggerCount: number }[];
  topFlows: { name: string; completionRate: number }[];
}

export interface BotConfiguration {
  bot: Bot;
  installSettings: InstallSettings;
  appearanceSettings: AppearanceSettings;
  flowSettings: FlowSettings;
  liveChatSettings: LiveChatSettings;
  aiSettings: AISettings;
  automationRules: AutomationRule[];
  analyticsMock: AnalyticsMock;
  conversations: Conversation[];
}

export type ChatbotTab = 'overview' | 'install' | 'appearance' | 'prefed' | 'livechat' | 'aibot' | 'automations' | 'analytics';

import { BotConfiguration } from '@/types/chatbot';

const generateId = () => Math.random().toString(36).substring(2, 11);

export const createDefaultBotConfiguration = (
  id: string,
  name: string,
  type: 'prefed' | 'live' | 'ai',
  domain: string
): BotConfiguration => ({
  bot: {
    id,
    name,
    type,
    status: 'draft',
    websiteDomain: domain,
    lastUpdated: new Date().toISOString(),
  },
  installSettings: {
    allowedDomains: [domain],
    widgetKey: `wk_${generateId()}`,
  },
  appearanceSettings: {
    primaryColor: '#2dd4bf',
    launcherPosition: 'bottom-right',
    launcherText: 'Chat with us',
    welcomeMessage: 'Hi there! 👋 How can we help you today?',
    offlineMessage: "We're currently offline. Leave us a message and we'll get back to you!",
    showBranding: true,
  },
  flowSettings: {
    flows: [
      {
        id: 'flow_1',
        name: 'Welcome Flow',
        version: 'v1',
        jsonDefinition: [
          {
            id: 'node_1',
            type: 'message',
            position: { x: 100, y: 100 },
            data: { text: 'Welcome to our dealership! How can I help you today?' },
            nextNodeId: 'node_2',
          },
          {
            id: 'node_2',
            type: 'buttons',
            position: { x: 100, y: 200 },
            data: {
              text: 'Please select an option:',
              buttons: [
                { id: 'btn_1', label: 'Browse Inventory', nextNodeId: 'node_3' },
                { id: 'btn_2', label: 'Schedule Test Drive', nextNodeId: 'node_4' },
                { id: 'btn_3', label: 'Speak to Agent', nextNodeId: 'node_5' },
              ],
            },
          },
          {
            id: 'node_3',
            type: 'message',
            position: { x: 50, y: 300 },
            data: { text: 'Great! You can browse our inventory at /inventory' },
            nextNodeId: 'node_6',
          },
          {
            id: 'node_4',
            type: 'form',
            position: { x: 200, y: 300 },
            data: {
              text: 'Please provide your details to schedule a test drive:',
              requiredFields: ['name', 'email', 'phone', 'preferredDate'],
            },
            nextNodeId: 'node_6',
          },
          {
            id: 'node_5',
            type: 'handoff',
            position: { x: 350, y: 300 },
            data: { text: 'Connecting you to a live agent...' },
          },
          {
            id: 'node_6',
            type: 'end',
            position: { x: 150, y: 400 },
            data: { text: 'Thank you for visiting!' },
          },
        ],
      },
    ],
    activeFlowId: 'flow_1',
  },
  liveChatSettings: {
    businessHours: {
      enabled: true,
      timezone: 'America/New_York',
      schedule: [
        { day: 'Monday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Tuesday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Wednesday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Thursday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Friday', start: '09:00', end: '18:00', enabled: true },
        { day: 'Saturday', start: '10:00', end: '16:00', enabled: true },
        { day: 'Sunday', start: '00:00', end: '00:00', enabled: false },
      ],
    },
    routingMode: 'round-robin',
    agents: [
      { id: 'agent_1', name: 'Sarah Johnson', email: 'sarah@dealer.com', status: 'online' },
      { id: 'agent_2', name: 'Mike Chen', email: 'mike@dealer.com', status: 'online' },
      { id: 'agent_3', name: 'Emily Davis', email: 'emily@dealer.com', status: 'away' },
    ],
    autoReplies: {
      greeting: "Hi! Thanks for reaching out. An agent will be with you shortly.",
      offline: "We're currently offline. Please leave your message and we'll respond as soon as possible.",
      away: "All agents are currently busy. We'll be with you in a moment.",
    },
    awayMode: false,
  },
  aiSettings: {
    knowledgeSources: [
      { id: 'ks_1', name: 'Product Catalog', type: 'url', notes: 'Main inventory page' },
      { id: 'ks_2', name: 'FAQ Document', type: 'upload', notes: 'Common questions PDF' },
      { id: 'ks_3', name: 'Pricing Q&A', type: 'qa', notes: 'Manual pricing questions', content: 'Q: What is the price range?\nA: Our vehicles range from $20,000 to $80,000.' },
    ],
    tone: 'friendly',
    rules: {
      doList: 'Be helpful and professional\nProvide accurate vehicle information\nOffer to schedule test drives\nCollect lead information when appropriate',
      dontList: "Don't make up prices or specifications\nDon't commit to deals without manager approval\nDon't share competitor information\nDon't discuss internal processes",
    },
    answerOnlyFromKnowledge: false,
    confidenceThreshold: 70,
    escalationMode: 'handoff',
  },
  automationRules: [
    {
      id: 'rule_1',
      name: 'Welcome returning visitors',
      enabled: true,
      trigger: 'returning-visitor',
      conditions: [],
      actions: [
        { id: 'action_1', type: 'message', value: 'Welcome back! Looking for something specific today?' },
      ],
      priority: 1,
    },
    {
      id: 'rule_2',
      name: 'Exit intent on inventory',
      enabled: true,
      trigger: 'exit-intent',
      conditions: [
        { id: 'cond_1', type: 'url', value: '/inventory' },
      ],
      actions: [
        { id: 'action_2', type: 'lead-form', value: 'Get notified about price drops!' },
      ],
      priority: 2,
    },
    {
      id: 'rule_3',
      name: 'After hours lead capture',
      enabled: true,
      trigger: 'after-hours',
      conditions: [],
      actions: [
        { id: 'action_3', type: 'message', value: "We're currently closed, but leave your info and we'll reach out first thing!" },
        { id: 'action_4', type: 'lead-form', value: 'Contact form' },
      ],
      priority: 3,
    },
  ],
  analyticsMock: {
    conversations: 1247,
    leads: 389,
    handoffRate: 23,
    aiContainment: 77,
    flowCompletion: 68,
    conversationsOverTime: [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 52 },
      { date: '2024-01-03', count: 38 },
      { date: '2024-01-04', count: 67 },
      { date: '2024-01-05', count: 71 },
      { date: '2024-01-06', count: 43 },
      { date: '2024-01-07', count: 29 },
    ],
    leadsOverTime: [
      { date: '2024-01-01', count: 12 },
      { date: '2024-01-02', count: 18 },
      { date: '2024-01-03', count: 9 },
      { date: '2024-01-04', count: 24 },
      { date: '2024-01-05', count: 21 },
      { date: '2024-01-06', count: 15 },
      { date: '2024-01-07', count: 8 },
    ],
    topAutomations: [
      { name: 'Welcome returning visitors', triggerCount: 234 },
      { name: 'Exit intent on inventory', triggerCount: 156 },
      { name: 'After hours lead capture', triggerCount: 89 },
    ],
    topFlows: [
      { name: 'Welcome Flow', completionRate: 78 },
      { name: 'Test Drive Booking', completionRate: 65 },
      { name: 'Service Inquiry', completionRate: 82 },
    ],
  },
  conversations: [
    {
      id: 'conv_1',
      customerName: 'John Smith',
      customerEmail: 'john@email.com',
      customerPhone: '(555) 123-4567',
      vehicleInterest: '2024 Honda Accord',
      status: 'open',
      assignedAgentId: 'agent_1',
      tags: ['hot-lead', 'test-drive'],
      unreadCount: 2,
      lastMessage: "I'm interested in the Honda Accord",
      lastMessageTime: new Date().toISOString(),
      messages: [
        { id: 'msg_1', content: 'Hi, I saw the 2024 Honda Accord on your website', sender: 'customer', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 'msg_2', content: "Great choice! The Accord is one of our best sellers. What would you like to know?", sender: 'agent', timestamp: new Date(Date.now() - 3500000).toISOString() },
        { id: 'msg_3', content: "I'm interested in the Honda Accord. Is it available for a test drive?", sender: 'customer', timestamp: new Date(Date.now() - 3400000).toISOString() },
      ],
    },
    {
      id: 'conv_2',
      customerName: 'Emily Brown',
      customerEmail: 'emily@email.com',
      customerPhone: '(555) 987-6543',
      vehicleInterest: '2024 Toyota Camry',
      status: 'pending',
      assignedAgentId: 'agent_2',
      tags: ['financing'],
      unreadCount: 0,
      lastMessage: 'What financing options do you have?',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        { id: 'msg_4', content: 'What financing options do you have?', sender: 'customer', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 'msg_5', content: 'Customer is asking about 0% APR offers', sender: 'agent', timestamp: new Date(Date.now() - 7100000).toISOString(), isNote: true },
      ],
    },
    {
      id: 'conv_3',
      customerName: 'Michael Lee',
      customerEmail: 'michael@email.com',
      customerPhone: '(555) 456-7890',
      status: 'closed',
      tags: ['completed-sale'],
      unreadCount: 0,
      lastMessage: 'Thank you for your purchase!',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        { id: 'msg_6', content: 'Thank you for your purchase!', sender: 'agent', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ],
    },
  ],
});

export const initialMockBots: BotConfiguration[] = [
  createDefaultBotConfiguration('bot_1', 'Main Website Bot', 'ai', 'www.dealership.com'),
  createDefaultBotConfiguration('bot_2', 'Inventory Bot', 'prefed', 'inventory.dealership.com'),
  createDefaultBotConfiguration('bot_3', 'Support Chat', 'live', 'support.dealership.com'),
];

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BotConfiguration, ChatbotTab, Bot, Flow, AutomationRule, Conversation, ConversationMessage } from '@/types/chatbot';
import { initialMockBots, createDefaultBotConfiguration } from '@/data/chatbotMockData';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useChatbotState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bots, setBots] = useState<BotConfiguration[]>(initialMockBots);
  const [snapshots, setSnapshots] = useState<Record<string, Partial<BotConfiguration>>>({});
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>({});

  // Get selected bot and tab from URL
  const selectedBotId = searchParams.get('bot') || bots[0]?.bot.id;
  const selectedTab = (searchParams.get('tab') as ChatbotTab) || 'overview';

  const selectedBot = bots.find(b => b.bot.id === selectedBotId) || bots[0];

  // Update URL when selection changes
  const setSelectedBotId = useCallback((id: string) => {
    setSearchParams(prev => {
      prev.set('bot', id);
      return prev;
    });
  }, [setSearchParams]);

  const setSelectedTab = useCallback((tab: ChatbotTab) => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    });
  }, [setSearchParams]);

  // Mark changes as unsaved
  const markUnsaved = useCallback((botId: string) => {
    setUnsavedChanges(prev => ({ ...prev, [botId]: true }));
  }, []);

  // Save snapshot for reset functionality
  const saveSnapshot = useCallback((botId: string) => {
    const bot = bots.find(b => b.bot.id === botId);
    if (bot) {
      setSnapshots(prev => ({ ...prev, [botId]: JSON.parse(JSON.stringify(bot)) }));
      setUnsavedChanges(prev => ({ ...prev, [botId]: false }));
    }
  }, [bots]);

  // Reset to last saved snapshot
  const resetChanges = useCallback((botId: string) => {
    const snapshot = snapshots[botId];
    if (snapshot) {
      setBots(prev => prev.map(b => 
        b.bot.id === botId ? { ...b, ...snapshot } as BotConfiguration : b
      ));
      setUnsavedChanges(prev => ({ ...prev, [botId]: false }));
      toast.success('Changes reset to last saved state');
    }
  }, [snapshots]);

  // Bot CRUD operations
  const createBot = useCallback((name: string, type: Bot['type'], domain: string) => {
    const id = `bot_${generateId()}`;
    const newBot = createDefaultBotConfiguration(id, name, type, domain);
    setBots(prev => [...prev, newBot]);
    setSelectedBotId(id);
    toast.success(`Bot "${name}" created successfully`);
    return id;
  }, [setSelectedBotId]);

  const duplicateBot = useCallback((botId: string) => {
    const original = bots.find(b => b.bot.id === botId);
    if (original) {
      const id = `bot_${generateId()}`;
      const duplicated: BotConfiguration = {
        ...JSON.parse(JSON.stringify(original)),
        bot: {
          ...original.bot,
          id,
          name: `${original.bot.name} (Copy)`,
          status: 'draft',
          lastUpdated: new Date().toISOString(),
        },
        installSettings: {
          ...original.installSettings,
          widgetKey: `wk_${generateId()}`,
        },
      };
      setBots(prev => [...prev, duplicated]);
      setSelectedBotId(id);
      toast.success('Bot duplicated successfully');
    }
  }, [bots, setSelectedBotId]);

  const deleteBot = useCallback((botId: string) => {
    setBots(prev => {
      const remaining = prev.filter(b => b.bot.id !== botId);
      if (selectedBotId === botId && remaining.length > 0) {
        setSelectedBotId(remaining[0].bot.id);
      }
      return remaining;
    });
    toast.success('Bot deleted successfully');
  }, [selectedBotId, setSelectedBotId]);

  const updateBot = useCallback((botId: string, updates: Partial<Bot>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, bot: { ...b.bot, ...updates, lastUpdated: new Date().toISOString() } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  // Settings update functions
  const updateInstallSettings = useCallback((botId: string, updates: Partial<BotConfiguration['installSettings']>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, installSettings: { ...b.installSettings, ...updates } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  const updateAppearanceSettings = useCallback((botId: string, updates: Partial<BotConfiguration['appearanceSettings']>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, appearanceSettings: { ...b.appearanceSettings, ...updates } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  const updateFlowSettings = useCallback((botId: string, updates: Partial<BotConfiguration['flowSettings']>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, flowSettings: { ...b.flowSettings, ...updates } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  const updateLiveChatSettings = useCallback((botId: string, updates: Partial<BotConfiguration['liveChatSettings']>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, liveChatSettings: { ...b.liveChatSettings, ...updates } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  const updateAISettings = useCallback((botId: string, updates: Partial<BotConfiguration['aiSettings']>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, aiSettings: { ...b.aiSettings, ...updates } }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  const updateAutomationRules = useCallback((botId: string, rules: AutomationRule[]) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, automationRules: rules }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  // Flow operations
  const createFlow = useCallback((botId: string, name: string) => {
    const flowId = `flow_${generateId()}`;
    const newFlow: Flow = {
      id: flowId,
      name,
      version: 'v1',
      jsonDefinition: [
        {
          id: 'node_start',
          type: 'message',
          position: { x: 100, y: 100 },
          data: { text: 'Welcome!' },
          nextNodeId: 'node_end',
        },
        {
          id: 'node_end',
          type: 'end',
          position: { x: 100, y: 200 },
          data: { text: 'Thank you!' },
        },
      ],
    };
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { ...b, flowSettings: { ...b.flowSettings, flows: [...b.flowSettings.flows, newFlow] } }
        : b
    ));
    markUnsaved(botId);
    toast.success('Flow created successfully');
    return flowId;
  }, [markUnsaved]);

  const duplicateFlow = useCallback((botId: string, flowId: string) => {
    const bot = bots.find(b => b.bot.id === botId);
    const flow = bot?.flowSettings.flows.find(f => f.id === flowId);
    if (flow) {
      const newFlowId = `flow_${generateId()}`;
      const duplicated: Flow = {
        ...JSON.parse(JSON.stringify(flow)),
        id: newFlowId,
        name: `${flow.name} (Copy)`,
      };
      setBots(prev => prev.map(b => 
        b.bot.id === botId 
          ? { ...b, flowSettings: { ...b.flowSettings, flows: [...b.flowSettings.flows, duplicated] } }
          : b
      ));
      markUnsaved(botId);
      toast.success('Flow duplicated successfully');
    }
  }, [bots, markUnsaved]);

  const deleteFlow = useCallback((botId: string, flowId: string) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { 
            ...b, 
            flowSettings: { 
              ...b.flowSettings, 
              flows: b.flowSettings.flows.filter(f => f.id !== flowId),
              activeFlowId: b.flowSettings.activeFlowId === flowId ? null : b.flowSettings.activeFlowId,
            } 
          }
        : b
    ));
    markUnsaved(botId);
    toast.success('Flow deleted successfully');
  }, [markUnsaved]);

  const updateFlow = useCallback((botId: string, flowId: string, updates: Partial<Flow>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { 
            ...b, 
            flowSettings: { 
              ...b.flowSettings, 
              flows: b.flowSettings.flows.map(f => 
                f.id === flowId ? { ...f, ...updates } : f
              ),
            } 
          }
        : b
    ));
    markUnsaved(botId);
  }, [markUnsaved]);

  // Conversation operations
  const updateConversation = useCallback((botId: string, convId: string, updates: Partial<Conversation>) => {
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { 
            ...b, 
            conversations: b.conversations.map(c => 
              c.id === convId ? { ...c, ...updates } : c
            ),
          }
        : b
    ));
  }, []);

  const addMessage = useCallback((botId: string, convId: string, message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const newMessage: ConversationMessage = {
      ...message,
      id: `msg_${generateId()}`,
      timestamp: new Date().toISOString(),
    };
    setBots(prev => prev.map(b => 
      b.bot.id === botId 
        ? { 
            ...b, 
            conversations: b.conversations.map(c => 
              c.id === convId 
                ? { 
                    ...c, 
                    messages: [...c.messages, newMessage],
                    lastMessage: message.content,
                    lastMessageTime: newMessage.timestamp,
                  } 
                : c
            ),
          }
        : b
    ));
  }, []);

  // Import/Export
  const exportBotConfiguration = useCallback((botId: string) => {
    const bot = bots.find(b => b.bot.id === botId);
    if (bot) {
      const data = JSON.stringify(bot, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bot.bot.name.replace(/\s+/g, '_')}_config.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Configuration exported successfully');
    }
  }, [bots]);

  const importBotConfiguration = useCallback((jsonString: string) => {
    try {
      const config = JSON.parse(jsonString) as BotConfiguration;
      config.bot.id = `bot_${generateId()}`;
      config.installSettings.widgetKey = `wk_${generateId()}`;
      config.bot.lastUpdated = new Date().toISOString();
      setBots(prev => [...prev, config]);
      setSelectedBotId(config.bot.id);
      toast.success('Configuration imported successfully');
    } catch (e) {
      toast.error('Invalid configuration file');
    }
  }, [setSelectedBotId]);

  const exportFlow = useCallback((botId: string, flowId: string) => {
    const bot = bots.find(b => b.bot.id === botId);
    const flow = bot?.flowSettings.flows.find(f => f.id === flowId);
    if (flow) {
      const data = JSON.stringify(flow, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${flow.name.replace(/\s+/g, '_')}_flow.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Flow exported successfully');
    }
  }, [bots]);

  const importFlow = useCallback((botId: string, jsonString: string) => {
    try {
      const flow = JSON.parse(jsonString) as Flow;
      flow.id = `flow_${generateId()}`;
      setBots(prev => prev.map(b => 
        b.bot.id === botId 
          ? { ...b, flowSettings: { ...b.flowSettings, flows: [...b.flowSettings.flows, flow] } }
          : b
      ));
      markUnsaved(botId);
      toast.success('Flow imported successfully');
    } catch (e) {
      toast.error('Invalid flow file');
    }
  }, [markUnsaved]);

  const regenerateWidgetKey = useCallback((botId: string) => {
    const newKey = `wk_${generateId()}`;
    updateInstallSettings(botId, { widgetKey: newKey });
    toast.success('Widget key regenerated');
  }, [updateInstallSettings]);

  return {
    bots,
    selectedBot,
    selectedBotId,
    selectedTab,
    unsavedChanges,
    setSelectedBotId,
    setSelectedTab,
    createBot,
    duplicateBot,
    deleteBot,
    updateBot,
    updateInstallSettings,
    updateAppearanceSettings,
    updateFlowSettings,
    updateLiveChatSettings,
    updateAISettings,
    updateAutomationRules,
    createFlow,
    duplicateFlow,
    deleteFlow,
    updateFlow,
    updateConversation,
    addMessage,
    exportBotConfiguration,
    importBotConfiguration,
    exportFlow,
    importFlow,
    regenerateWidgetKey,
    saveSnapshot,
    resetChanges,
    markUnsaved,
  };
};

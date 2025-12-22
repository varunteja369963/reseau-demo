import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { ChatbotTab } from '@/types/chatbot';
import { useChatbotState } from '@/hooks/useChatbotState';
import { OverviewTab } from './tabs/OverviewTab';
import { InstallTab } from './tabs/InstallTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { PrefedFlowTab } from './tabs/PrefedFlowTab';
import { LiveChatTab } from './tabs/LiveChatTab';
import { AIBotTab } from './tabs/AIBotTab';
import { AutomationsTab } from './tabs/AutomationsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';

interface ChatbotTabsProps {
  chatbotState: ReturnType<typeof useChatbotState>;
  previewState: 'online' | 'offline' | 'conversation';
  setPreviewState: (state: 'online' | 'offline' | 'conversation') => void;
}

const tabs: { id: ChatbotTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'prefed', label: 'Pre-fed Flow' },
  { id: 'livechat', label: 'Live Chat' },
  { id: 'aibot', label: 'AI Bot' },
  { id: 'automations', label: 'Automations' },
  { id: 'analytics', label: 'Analytics' },
];

export const ChatbotTabs = ({ chatbotState, previewState, setPreviewState }: ChatbotTabsProps) => {
  const { selectedBot, selectedTab, setSelectedTab, unsavedChanges, resetChanges } = chatbotState;
  const hasUnsaved = unsavedChanges[selectedBot?.bot.id || ''];

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(v) => setSelectedTab(v as ChatbotTab)}
      className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
    >
      {/* Tab Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between flex-shrink-0 gap-2">
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <TabsList className="bg-muted/50 p-1 h-auto inline-flex gap-1 w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-1.5 text-sm whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {hasUnsaved && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hidden sm:inline-flex">
              Unsaved
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetChanges(selectedBot?.bot.id || '')}
              className="h-8"
            >
              <RotateCcw className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <TabsContent value="overview" className="m-0 h-full overflow-auto">
          <OverviewTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="install" className="m-0 h-full overflow-auto">
          <InstallTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="appearance" className="m-0 h-full overflow-auto">
          <AppearanceTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="prefed" className="m-0 h-full overflow-auto">
          <PrefedFlowTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="livechat" className="m-0 h-full overflow-auto">
          <LiveChatTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="aibot" className="m-0 h-full overflow-auto">
          <AIBotTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="automations" className="m-0 h-full overflow-auto">
          <AutomationsTab chatbotState={chatbotState} />
        </TabsContent>
        <TabsContent value="analytics" className="m-0 h-full overflow-auto">
          <AnalyticsTab chatbotState={chatbotState} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
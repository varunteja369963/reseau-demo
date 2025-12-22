import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatbotTopNav } from '@/components/chatbot/ChatbotTopNav';
import { ChatbotSidebar } from '@/components/chatbot/ChatbotSidebar';
import { ChatbotTabs } from '@/components/chatbot/ChatbotTabs';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
import { ChatbotGlobalAnalytics } from '@/components/chatbot/ChatbotGlobalAnalytics';
import { ChatbotGlobalSettings } from '@/components/chatbot/ChatbotGlobalSettings';
import { useChatbotState } from '@/hooks/useChatbotState';

const Chatbot = () => {
  const chatbotState = useChatbotState();
  const [previewState, setPreviewState] = useState<'online' | 'offline' | 'conversation'>('online');
  const [activeTab, setActiveTab] = useState('console');

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 lg:ml-24 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <ChatbotTopNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {activeTab === 'console' && (
            <>
              {/* Left Sidebar - Bot List */}
              <div className="w-72 flex-shrink-0 h-full overflow-hidden">
                <ChatbotSidebar 
                  bots={chatbotState.bots}
                  selectedBotId={chatbotState.selectedBotId}
                  onSelectBot={chatbotState.setSelectedBotId}
                  onCreateBot={chatbotState.createBot}
                  onImportConfig={chatbotState.importBotConfiguration}
                />
              </div>
              
              {/* Main Content - Tabs */}
              <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden border-x border-border">
                {chatbotState.selectedBot && (
                  <ChatbotTabs
                    chatbotState={chatbotState}
                    previewState={previewState}
                    setPreviewState={setPreviewState}
                  />
                )}
              </div>
              
              {/* Right Panel - Live Preview */}
              <div className="w-80 xl:w-96 flex-shrink-0 h-full overflow-hidden bg-muted/30">
                {chatbotState.selectedBot && (
                  <ChatbotPreview
                    bot={chatbotState.selectedBot}
                    previewState={previewState}
                    setPreviewState={setPreviewState}
                  />
                )}
              </div>
            </>
          )}
          
          {activeTab === 'analytics' && (
            <div className="flex-1 overflow-auto">
              <ChatbotGlobalAnalytics bots={chatbotState.bots} />
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-auto">
              <ChatbotGlobalSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
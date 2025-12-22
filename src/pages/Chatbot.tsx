import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatbotTopNav } from '@/components/chatbot/ChatbotTopNav';
import { ChatbotSidebar } from '@/components/chatbot/ChatbotSidebar';
import { ChatbotTabs } from '@/components/chatbot/ChatbotTabs';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
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
        <div className="flex-1 flex h-full overflow-hidden">
          {activeTab === 'console' && (
            <>
              {/* Left Sidebar - Bot List */}
              <ChatbotSidebar 
                bots={chatbotState.bots}
                selectedBotId={chatbotState.selectedBotId}
                onSelectBot={chatbotState.setSelectedBotId}
                onCreateBot={chatbotState.createBot}
                onImportConfig={chatbotState.importBotConfiguration}
              />
              
              {/* Main Content - Tabs */}
              <div className="flex-1 flex flex-col h-full overflow-hidden border-x border-border">
                {chatbotState.selectedBot && (
                  <ChatbotTabs
                    chatbotState={chatbotState}
                    previewState={previewState}
                    setPreviewState={setPreviewState}
                  />
                )}
              </div>
              
              {/* Right Panel - Live Preview */}
              <div className="w-80 xl:w-96 h-full overflow-hidden bg-muted/30">
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
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Chatbot Analytics</h1>
                <p className="text-muted-foreground">Global analytics dashboard coming soon...</p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Chatbot Settings</h1>
                <p className="text-muted-foreground">Global chatbot settings coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
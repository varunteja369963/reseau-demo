import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatbotSidebar } from '@/components/chatbot/ChatbotSidebar';
import { ChatbotTabs } from '@/components/chatbot/ChatbotTabs';
import { ChatbotPreview } from '@/components/chatbot/ChatbotPreview';
import { useChatbotState } from '@/hooks/useChatbotState';

const Chatbot = () => {
  const chatbotState = useChatbotState();
  const [previewState, setPreviewState] = useState<'online' | 'offline' | 'conversation'>('online');

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 lg:ml-24 flex h-screen overflow-hidden">
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
      </div>
    </div>
  );
};

export default Chatbot;

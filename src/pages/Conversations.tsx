import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ConversationsTopNav } from "@/components/conversations/ConversationsTopNav";
import { ConversationsList } from "@/components/conversations/ConversationsList";
import { ConversationDetail } from "@/components/conversations/ConversationDetail";
import { MyConversations } from "@/components/conversations/MyConversations";
import { ConversationsSettings } from "@/components/conversations/ConversationsSettings";

type ConversationsView = 
  | "conversations" 
  | "my-conversations" 
  | "settings";

const Conversations = () => {
  const [activeView, setActiveView] = useState<ConversationsView>("conversations");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeView) {
      case "conversations":
        return (
          <div className="flex flex-1 min-h-0">
            <ConversationsList 
              onSelectConversation={setSelectedConversationId}
              selectedId={selectedConversationId}
            />
            {selectedConversationId && (
              <ConversationDetail 
                conversationId={selectedConversationId}
                onClose={() => setSelectedConversationId(null)}
              />
            )}
          </div>
        );
      case "my-conversations":
        return <MyConversations />;
      case "settings":
        return <ConversationsSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 lg:ml-24 flex flex-col h-screen overflow-hidden">
        <ConversationsTopNav activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Conversations;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowDown } from "lucide-react";
import { ConversationThread } from "./ConversationThread";
import { ConversationDetailPanel } from "./ConversationDetailPanel";

interface ConversationDetailProps {
  conversationId: string;
  onClose: () => void;
}

export const ConversationDetail = ({ conversationId, onClose }: ConversationDetailProps) => {
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  // Demo conversation data
  const conversation = {
    id: conversationId,
    friendlyName: "Support Request #1234",
    status: "open" as const,
    serviceSid: "IS1234567890abcdef",
    conversationSid: "CH1234567890abcdef",
    createdAt: "2024-01-15T10:30:00Z",
    lastActivity: "2024-01-15T14:25:00Z",
    tags: ["support", "urgent"],
    assignedTo: "John Doe",
  };

  return (
    <div className="flex-1 flex min-w-0">
      {/* Center: Thread */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        {/* Thread header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-teal-500/5 to-teal-600/5 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{conversation.friendlyName}</h2>
            <p className="text-sm text-muted-foreground">
              {conversation.status === "open" ? "Open" : "Closed"} • Last activity{" "}
              {new Date(conversation.lastActivity).toLocaleString()}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-teal-500/10 hover:text-teal-600" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Thread content */}
        <div className="flex-1 overflow-hidden relative">
          <ConversationThread conversationId={conversationId} />
          
          {/* Jump to latest button */}
          {showJumpToLatest && (
            <Button
              size="sm"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl"
              onClick={() => setShowJumpToLatest(false)}
            >
              <ArrowDown className="h-4 w-4" />
              Jump to latest
            </Button>
          )}
        </div>
      </div>

      {/* Right: Detail Panel */}
      <ConversationDetailPanel conversation={conversation} />
    </div>
  );
};

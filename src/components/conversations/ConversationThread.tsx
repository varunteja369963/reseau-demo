import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Paperclip,
  FileText,
  ChevronDown,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "inbound" | "outbound" | "system";
  content: string;
  timestamp: string;
  status?: "queued" | "sent" | "delivered" | "failed";
  sender?: string;
}

const demoMessages: Message[] = [
  {
    id: "1",
    type: "system",
    content: "Conversation started",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    type: "inbound",
    content: "Hi, I need help with my order #12345",
    timestamp: "10:31 AM",
    sender: "+1 234 567 8900",
  },
  {
    id: "3",
    type: "outbound",
    content: "Hello! I'd be happy to help you with your order. Let me look that up for you.",
    timestamp: "10:32 AM",
    status: "delivered",
  },
  {
    id: "4",
    type: "system",
    content: "John Doe joined the conversation",
    timestamp: "10:33 AM",
  },
  {
    id: "5",
    type: "inbound",
    content: "The tracking shows it's been stuck in transit for 5 days now.",
    timestamp: "10:35 AM",
    sender: "+1 234 567 8900",
  },
  {
    id: "6",
    type: "outbound",
    content: "I can see that. Let me contact the carrier and get an update for you. I'll get back to you within the hour.",
    timestamp: "10:36 AM",
    status: "delivered",
  },
  {
    id: "7",
    type: "inbound",
    content: "Thanks for your help!",
    timestamp: "10:40 AM",
    sender: "+1 234 567 8900",
  },
];

interface ConversationThreadProps {
  conversationId: string;
}

export const ConversationThread = ({ conversationId }: ConversationThreadProps) => {
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("SMS");
  const isConversationClosed = false;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case "failed":
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      // Send message logic
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {demoMessages.map((msg, index) => {
          // Check for date separators
          const showDateSeparator =
            index === 0 ||
            demoMessages[index - 1].timestamp.split(" ")[0] !==
              msg.timestamp.split(" ")[0];

          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">Today</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}

              {msg.type === "system" ? (
                <div className="flex justify-center">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex",
                    msg.type === "outbound" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2",
                      msg.type === "outbound"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.sender && (
                      <p className="text-xs opacity-70 mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                      {msg.type === "outbound" && getStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Composer */}
      {isConversationClosed ? (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              This conversation is closed
            </span>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reopen
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center gap-2 mt-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <FileText className="h-4 w-4" />
                      Templates
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Welcome Template</DropdownMenuItem>
                    <DropdownMenuItem>Follow-up Template</DropdownMenuItem>
                    <DropdownMenuItem>Closing Template</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Send as: {selectedChannel}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedChannel("SMS")}>
                      SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedChannel("WhatsApp")}>
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedChannel("Chat")}>
                      Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

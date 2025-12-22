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
        return <CheckCheck className="h-3 w-3 text-[hsl(var(--teal))]" />;
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
    <div className="flex flex-col h-full bg-gradient-to-b from-muted/20 to-background">
      {/* Messages - flex-col-reverse for auto-scroll to bottom */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
        <div className="space-y-3">
          {demoMessages.map((msg, index) => {
            // Check for date separators
            const showDateSeparator =
              index === 0 ||
              demoMessages[index - 1].timestamp.split(" ")[0] !==
                msg.timestamp.split(" ")[0];

            return (
              <div key={msg.id} className="animate-fade-in">
                {showDateSeparator && (
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-xs text-muted-foreground bg-card px-4 py-1.5 rounded-full shadow-soft border border-border/50 font-medium">Today</span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>
                )}

                {msg.type === "system" ? (
                  <div className="flex justify-center my-2">
                    <span className="text-xs text-muted-foreground bg-muted/70 px-4 py-1.5 rounded-full">
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
                        "max-w-[70%] rounded-2xl px-4 py-3 shadow-soft",
                        msg.type === "outbound"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border rounded-bl-md"
                      )}
                    >
                      {msg.sender && (
                        <p className={cn(
                          "text-xs mb-1.5 font-medium",
                          msg.type === "outbound" ? "opacity-80" : "text-[hsl(var(--blue))]"
                        )}>{msg.sender}</p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-2">
                        <span className={cn(
                          "text-[10px]",
                          msg.type === "outbound" ? "opacity-70" : "text-muted-foreground"
                        )}>{msg.timestamp}</span>
                        {msg.type === "outbound" && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Composer */}
      {isConversationClosed ? (
        <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              This conversation is closed
            </span>
            <Button variant="outline" size="sm" className="gap-2 rounded-xl hover:bg-muted">
              <RefreshCw className="h-4 w-4" />
              Reopen
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] resize-none rounded-xl bg-background border border-border/50 focus-visible:ring-ring shadow-soft"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center gap-1 mt-2">
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      <FileText className="h-4 w-4" />
                      Templates
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl bg-card border-border shadow-soft">
                    <DropdownMenuItem className="rounded-lg">Welcome Template</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">Follow-up Template</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">Closing Template</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                      Send as: <span className="text-foreground font-medium">{selectedChannel}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl bg-card border-border shadow-soft">
                    <DropdownMenuItem onClick={() => setSelectedChannel("SMS")} className="rounded-lg">
                      SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedChannel("WhatsApp")} className="rounded-lg">
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedChannel("Chat")} className="rounded-lg">
                      Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Button 
              onClick={handleSend} 
              disabled={!message.trim()}
              size="icon"
              className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-soft disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

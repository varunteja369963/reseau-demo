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
  RefreshCw,
} from "lucide-react";
import { useConversations } from "@/context/ConversationsProvider";

interface ConversationThreadProps {
  conversationSid: string;
}

export const ConversationThread = ({
  conversationSid,
}: ConversationThreadProps) => {
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("SMS");
  const { client } = useConversations();
  const isConversationClosed = false;

  const handleSend = async () => {
    const body = message?.trim();
    if (!body) return;
    try {
      if (!client || !conversationSid)
        throw new Error("No client or conversationSid");
      const conv =
        (await (client as any).getConversationBySid?.(conversationSid)) ||
        (await (client as any).getConversation?.(conversationSid));
      if (!conv) throw new Error("Conversation not found");

      // Try common sendMessage signatures
      if (typeof (conv as any).sendMessage === "function") {
        // Some SDKs accept string or an object
        try {
          await (conv as any).sendMessage(body);
        } catch (err) {
          await (conv as any).sendMessage({ body });
        }
      } else if (typeof (conv as any).send === "function") {
        await (conv as any).send(body);
      } else if (typeof (client as any).sendMessage === "function") {
        await (client as any).sendMessage(conversationSid, body);
      } else {
        throw new Error("No send API available on conversation client");
      }

      setMessage("");
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
      {isConversationClosed ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            This conversation is closed
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4" />
            Reopen
          </Button>
        </div>
      ) : (
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
                  void handleSend();
                }
              }}
            />
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="h-4 w-4" />
                Attach
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    Templates
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl bg-card border-border shadow-soft">
                  <DropdownMenuItem className="rounded-lg">
                    Welcome Template
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    Follow-up Template
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    Closing Template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    Send as:{" "}
                    <span className="text-foreground font-medium">
                      {selectedChannel}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl bg-card border-border shadow-soft">
                  <DropdownMenuItem
                    onClick={() => setSelectedChannel("SMS")}
                    className="rounded-lg"
                  >
                    SMS
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedChannel("WhatsApp")}
                    className="rounded-lg"
                  >
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedChannel("Chat")}
                    className="rounded-lg"
                  >
                    Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Button
            onClick={() => void handleSend()}
            disabled={!message.trim()}
            size="icon"
            className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-soft disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

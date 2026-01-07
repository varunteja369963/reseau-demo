import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowDown } from "lucide-react";
import { ConversationThread } from "./ConversationThread";
import { ConversationDetailPanel } from "./ConversationDetailPanel";
import { useConversations } from "@/context/ConversationsProvider";

interface ConversationDetailProps {
  conversationId: string;
  onClose: () => void;
}

export const ConversationDetail = ({
  conversationId,
  onClose,
}: ConversationDetailProps) => {
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const { client, conversations } = useConversations();
  const conversation = conversations.find(
    (c) => c.conversationSid === conversationId || c.id === conversationId
  );

  const conversationWithId = conversation
    ? { ...conversation, id: conversation.id || conversation.conversationSid }
    : null;

  interface MessageItem {
    id?: string | number;
    body?: string | null;
    author?: string | null;
    timestamp?: string | null;
  }

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let convRef: any = null;
    let onMessageAdded: ((msg: any) => void) | null = null;

    async function loadMessages() {
      if (!client || !conversationId) return;
      setLoadingMessages(true);
      setMessagesError(null);
      try {
        // SDKs differ: try both getter names
        const conv =
          (await (client as any).getConversationBySid?.(conversationId)) ||
          (await (client as any).getConversation?.(conversationId));
        convRef = conv;

        if (!conv) {
          if (mounted) setMessages([]);
          return;
        }

        const paginator = await (conv as any).getMessages();
        const items = paginator?.items ?? [];
        const mapped = items.map((msg: any) => ({
          id: msg.sid ?? msg.index,
          body: msg.body ?? msg.attributes?.text ?? null,
          author: msg.author ?? null,
          timestamp: msg.dateCreated ?? null,
        }));
        if (mounted) setMessages(mapped);

        // Subscribe to real-time new messages
        onMessageAdded = (message: any) => {
          const newId = message?.sid ?? message?.index;
          setMessages((prev) => {
            if (prev.some((m) => String(m.id) === String(newId))) return prev;
            const newMsg = {
              id: newId,
              body: message?.body ?? message?.attributes?.text ?? null,
              author: message?.author ?? null,
              timestamp: message?.dateCreated ?? null,
            };
            return [...prev, newMsg];
          });
        };

        try {
          if (convRef?.on && onMessageAdded) {
            convRef.on("messageAdded", onMessageAdded);
          }
        } catch (subErr) {
          // ignore subscription errors
        }
      } catch (e: any) {
        if (mounted) setMessagesError(e?.message ?? String(e));
      } finally {
        if (mounted) setLoadingMessages(false);
      }
    }

    loadMessages();

    return () => {
      mounted = false;
      try {
        if (convRef && onMessageAdded && typeof convRef.off === "function") {
          convRef.off("messageAdded", onMessageAdded);
        } else if (convRef && typeof convRef.off === "function") {
          // fallback: remove all listeners for messageAdded if specific handler unavailable
          convRef.off("messageAdded");
        }
      } catch (err) {
        // ignore cleanup errors
      }
    };
  }, [client, conversationId]);

  if (!conversationWithId) {
    return (
      <div className="flex-1 flex items-center justify-center min-w-0">
        <div className="text-muted-foreground text-sm">
          Loading conversation…
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-w-0">
      {/* Center: Thread */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        {/* Thread header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              {conversationWithId.friendlyName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {conversationWithId.status === "open" ? "Open" : "Closed"} • Last
              activity{" "}
              {conversationWithId.lastActivity
                ? new Date(conversationWithId.lastActivity).toLocaleString()
                : "—"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Thread content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">
                  Loading messages...
                </div>
              </div>
            ) : messagesError ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-destructive">
                  Error: {messagesError}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">No messages</div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={String(msg.id)} className="animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 max-w-[70%] rounded-2xl px-4 py-3 shadow-soft bg-card border border-border">
                        {msg.author && (
                          <p className="text-xs mb-1.5 font-medium text-[hsl(var(--blue))]">
                            {String(msg.author)}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">
                          {String(msg.body ?? "—")}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 mt-2">
                          <span className="text-[10px] text-muted-foreground">
                            {String(msg.timestamp ?? "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Jump to latest button */}
          {showJumpToLatest && (
            <Button
              size="sm"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl"
              onClick={() => setShowJumpToLatest(false)}
            >
              <ArrowDown className="h-4 w-4" />
              Jump to latest
            </Button>
          )}
        </div>

        {/* Composer (separate component) */}
        <ConversationThread conversationSid={conversationId} />
      </div>

      {/* Right: Detail Panel */}
      <ConversationDetailPanel
        conversationSid={
          conversationWithId.conversationSid || conversationWithId.id
        }
      />
    </div>
  );
};

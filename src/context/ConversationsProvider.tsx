import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { ConversationsClientType } from "@/integrations/twilio/client";
import { useConversationClient } from "@/hooks/useConversationClient";
const STATIC_IDENTITY = import.meta.env.VITE_STATIC_IDENTITY ?? "guest-user";

// Define ConversationListItem type
export interface ConversationListItem {
  conversationSid: string;
  friendlyName: string;
  status?: string;
  serviceSid?: string;
  createdAt?: string;
  lastActivity?: string;
  tags?: string[];
  assignedTo?: string;
  [key: string]: any;
}

interface ConversationsContextValue {
  client: ConversationsClientType | null;
  loading: boolean;
  error: string | null;
  conversations: ConversationListItem[];
  setConversations: React.Dispatch<
    React.SetStateAction<ConversationListItem[]>
  >;
  updateConversationFriendlyName: (
    conversationSid: string,
    friendlyName: string
  ) => void;
  renameConversation: (
    conversationSid: string,
    friendlyName: string
  ) => Promise<void>;
}

const ConversationsContext = createContext<
  ConversationsContextValue | undefined
>(undefined);

interface ConversationsProviderProps {
  children: ReactNode;
  identity?: string;
}

export const ConversationsProvider = ({
  children,
  identity,
}: ConversationsProviderProps) => {
  const { client, loading, error } = useConversationClient(
    identity ?? STATIC_IDENTITY
  );

  // Shared state for conversation metadata
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );

  // Keep a last-known-good copy so transient empty arrays during async
  // updates don't cause consumers to lose their view.
  const lastStableConversationsRef = useRef<ConversationListItem[] | null>(
    null
  );

  // Update ref whenever we have a non-empty conversations array
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      lastStableConversationsRef.current = conversations;
    }
  }, [conversations]);

  // Expose a stable conversations array to consumers. If the current
  // `conversations` is temporarily empty (e.g. during an async mutation),
  // fall back to the last stable copy.
  const stableConversations: ConversationListItem[] =
    conversations && conversations.length > 0
      ? conversations
      : lastStableConversationsRef.current ?? conversations;

  // Helper to update friendlyName for a conversation
  const updateConversationFriendlyName = (
    conversationSid: string,
    friendlyName: string
  ) => {
    setConversations((prev) =>
      prev.map((c) =>
        (c.conversationSid || c.id) === conversationSid
          ? { ...c, friendlyName }
          : c
      )
    );
  };

  // Rename a conversation using Twilio Conversations SDK and update context state
  const renameConversation = async (
    conversationSid: string,
    friendlyName: string
  ): Promise<void> => {
    // Call backend API to perform the rename; do not use Twilio SDK here.
    const payload = {
      conversation_sid: conversationSid,
      friendly_name: friendlyName,
    };

    const res = await fetch("http://localhost:8000/conversations/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        if (body && body.error) msg = String(body.error);
      } catch (e) {
        // ignore JSON parse errors
      }
      console.error("ConversationsProvider.renameConversation failed", {
        conversationSid,
        friendlyName,
        status: res.status,
        statusText: res.statusText,
      });
      throw new Error(`Failed to rename conversation: ${msg}`);
    }

    // Only update local state after successful backend response
    setConversations((prev) =>
      prev.map((c) =>
        (c.conversationSid || c.id) === conversationSid
          ? { ...c, friendlyName }
          : c
      )
    );
  };

  const value: ConversationsContextValue = {
    client,
    loading,
    error,
    // Provide stableConversations to consumers instead of the raw array
    conversations: stableConversations,
    setConversations,
    updateConversationFriendlyName,
    renameConversation,
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export function useConversations(): ConversationsContextValue {
  const ctx = useContext(ConversationsContext);
  if (!ctx)
    throw new Error(
      "useConversations must be used within a ConversationsProvider"
    );
  return ctx;
}

export default ConversationsProvider;

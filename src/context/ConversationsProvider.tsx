import React, { createContext, useContext, ReactNode } from "react";
import { ConversationsClientType } from "@/integrations/twilio/client";
import { useConversationClient } from "@/hooks/useConversationClient";
const STATIC_IDENTITY = import.meta.env.VITE_STATIC_IDENTITY ?? "guest-user";
interface ConversationsContextValue {
  client: ConversationsClientType | null;
  loading: boolean;
  error: string | null;
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

  const value: ConversationsContextValue = { client, loading, error };

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

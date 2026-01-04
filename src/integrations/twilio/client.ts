import type {
  Client as _ConversationsClientType,
  Conversation as TwilioConversationSDK,
  Message as TwilioMessageSDK,
  Paginator as TwilioPaginator,
} from "@twilio/conversations";

// Re-export the Conversations client type for consumers
export type ConversationsClientType = _ConversationsClientType;

let client: ConversationsClientType | null = null;
let currentIdentity: string | null = null;

export type TwilioConversation = TwilioConversationSDK;
export type TwilioMessage = TwilioMessageSDK;

async function fetchToken(identity?: string): Promise<string> {
  const base = (import.meta.env.VITE_API_BASE_URL as string) || "";
  const qs = `identity=${encodeURIComponent(identity ?? "")}`;
  const url = base ? `${base.replace(/\/$/, "")}/token?${qs}` : `/token?${qs}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch token: ${res.status} ${res.statusText} ${text}`);
  }

  const body = await res.json().catch(() => null);
  if (!body || typeof body.token !== "string") {
    throw new Error("Invalid token response from backend");
  }

  return body.token;
}

async function createClientWithToken(token: string): Promise<ConversationsClientType> {
  // dynamic import to avoid build-time errors if package not installed yet
  const mod = await import("@twilio/conversations");
  const ConversationsClient = (mod as any).Client;
  if (!ConversationsClient || typeof ConversationsClient.create !== "function") {
    throw new Error("@twilio/conversations Client not available");
  }

  const c: ConversationsClientType = await ConversationsClient.create(token);
  return c;
}

/**
 * Initialize the Conversations client for a given identity.
 * Fetches a token from backend `/token?identity=...` and creates the client.
 */
export async function initClient(identity?: string): Promise<void> {
  // save identity for potential re-init on token refresh
  currentIdentity = identity ?? null;

  // shutdown existing client if present
  try {
    if (client && typeof (client as any).shutdown === "function") {
      await (client as any).shutdown();
    }
  } catch (e) {
    // ignore shutdown errors
  }

  const token = await fetchToken(identity);
  client = await createClientWithToken(token);
}

export function getClient(): ConversationsClientType {
  if (!client) throw new Error("Conversations client is not initialized. Call initClient() first.");
  return client;
}

async function withClientRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    // attempt a single re-init (token may have expired) and retry once
    try {
      await initClient(currentIdentity ?? undefined);
      return await fn();
    } catch (err2) {
      throw err2;
    }
  }
}

/**
 * Return subscribed conversations (first page).
 * Note: returns the SDK Conversation objects (not mapped to UI shapes).
 */
export async function listSubscribedConversations(): Promise<TwilioConversation[]> {
  return withClientRetry(async () => {
    const c = getClient();
    // getSubscribedConversations returns a Paginator
    const paginator: TwilioPaginator<TwilioConversation> = await (c as any).getSubscribedConversations();
    return paginator.items ?? [];
  });
}

export async function getConversationBySid(sid: string): Promise<TwilioConversation> {
  return withClientRetry(async () => {
    const c = getClient();
    const conv: TwilioConversation = await (c as any).getConversationBySid(sid);
    return conv;
  });
}

export async function getMessages(conversationSid: string): Promise<TwilioMessage[]> {
  return withClientRetry(async () => {
    const conv = await getConversationBySid(conversationSid);
    // conversation.getMessages() returns a Paginator
    const paginator: TwilioPaginator<TwilioMessage> = await (conv as any).getMessages();
    return paginator.items ?? [];
  });
}

export default {
  initClient,
  getClient,
  listSubscribedConversations,
  getConversationBySid,
  getMessages,
};

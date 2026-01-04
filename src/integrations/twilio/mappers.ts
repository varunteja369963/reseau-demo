// Twilio -> UI mapping types and functions (TypeScript)

// Minimal Twilio API shapes (adjust as needed for your backend)
export interface TwilioParticipant {
  sid?: string;
  identity?: string | null; // e.g. "user_123" or "+123456789"
  attributes?: Record<string, any>;
  messagingBinding?: {
    type?: string; // e.g. "sms", "whatsapp", "chat"
    address?: string;
  };
}

export interface TwilioConversation {
  sid: string;
  friendlyName?: string;
  uniqueName?: string;
  state?: 'active' | 'closed' | string;
  attributes?: Record<string, any>; // optional JSON metadata (may include assignedTo, unreadCount, lastMessage, etc.)
  dateUpdated?: string;
  dateCreated?: string;
  participants?: TwilioParticipant[];
  // optional helper fields the backend might attach:
  lastMessage?: string;
  lastMessageDateCreated?: string;
}

export interface TwilioMessage {
  sid?: string;
  index?: number;
  author?: string; // identity of sender (e.g. "+1234", "agent:1", "system")
  body?: string;
  dateCreated?: string;
  attributes?: Record<string, any>;
  status?: string; // optional delivery status
}


// UI data shapes used by the components
export interface ConversationListItem {
  id: string;
  friendlyName: string;
  participantCount: number;
  channels: string[]; // e.g. ["SMS","WhatsApp","Chat"]
  unreadCount: number;
  assignedTo: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null; // ISO timestamp
  lastMessageRelative?: string; // human-friendly label (optional)
  status: 'open' | 'closed';
}

export interface MyConversationItem {
  id: string;
  friendlyName: string;
  unreadCount: number;
  lastMessage: string | null;
  lastMessageTime: string | null; // ISO timestamp
  lastMessageRelative?: string;
  status: 'open' | 'closed';
  channels: string[];
}

export type ThreadMessageType = 'inbound' | 'outbound' | 'system';
export interface ThreadMessage {
  id: string;
  type: ThreadMessageType;
  content: string;
  timestamp: string; // ISO
  timestampLabel?: string; // optional human label e.g. "10:32 AM" or "2 min ago"
  status?: string; // queued|sent|delivered|failed (if available)
  sender?: string | null; // original author identity
}


// Helpers
function formatRelativeTime(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return undefined;
  const now = Date.now();
  const diff = Math.round((now - then) / 1000); // seconds

  if (diff < 60) return `${diff} sec${diff === 1 ? '' : 's'} ago`;
  const mins = Math.round(diff / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function deduceChannelsFromParticipants(parts?: TwilioParticipant[]): string[] {
  if (!parts || parts.length === 0) return ['Chat'];
  const set = new Set<string>();
  for (const p of parts) {
    const mb = p.messagingBinding;
    const attrs = p.attributes || {};
    if (mb?.type) {
      const t = mb.type.toLowerCase();
      if (t.includes('sms')) set.add('SMS');
      else if (t.includes('whatsapp')) set.add('WhatsApp');
      else set.add(capitalize(t));
    } else if (typeof attrs.channel === 'string') {
      set.add(capitalize(attrs.channel));
    } else if (p.identity && /^\+?\d/.test(p.identity)) {
      set.add('SMS');
    } else {
      set.add('Chat');
    }
  }
  return Array.from(set);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}


// Mapping functions

// Map a TwilioConversation -> ConversationListItem
export function mapTwilioConversationToListItem(
  conv: TwilioConversation
): ConversationListItem {
  const id = conv.sid;
  const friendlyName = conv.friendlyName ?? conv.uniqueName ?? id;
  const participantCount = conv.participants?.length ?? 0;
  const channels = deduceChannelsFromParticipants(conv.participants);
  const assignedTo = conv.attributes?.assignedTo ?? null;
  const unreadCount = typeof conv.attributes?.unreadCount === 'number' ? conv.attributes.unreadCount : 0;

  // prefer explicit fields if backend attached them
  const lastMessage = conv.lastMessage ?? conv.attributes?.lastMessage ?? null;
  const lastMessageTime = conv.lastMessageDateCreated ?? conv.attributes?.lastMessageDateCreated ?? conv.dateUpdated ?? null;
  const status = conv.state === 'closed' ? 'closed' : 'open';

  return {
    id,
    friendlyName,
    participantCount,
    channels,
    unreadCount,
    assignedTo,
    lastMessage,
    lastMessageTime,
    lastMessageRelative: formatRelativeTime(lastMessageTime),
    status,
  };
}

// Map a TwilioConversation -> MyConversationItem (for "My Conversations" list)
export function mapTwilioConversationToMyConversation(
  conv: TwilioConversation
): MyConversationItem {
  const list = mapTwilioConversationToListItem(conv);
  return {
    id: list.id,
    friendlyName: list.friendlyName,
    unreadCount: list.unreadCount,
    lastMessage: list.lastMessage,
    lastMessageTime: list.lastMessageTime,
    lastMessageRelative: list.lastMessageRelative,
    status: list.status,
    channels: list.channels,
  };
}

// Map a single TwilioMessage -> ThreadMessage
// `currentUserId` is used to determine inbound vs outbound (pass your agent/user id)
export function mapTwilioMessageToThreadMessage(
  msg: TwilioMessage,
  options?: { currentUserId?: string | null }
): ThreadMessage {
  const id = msg.sid ?? (typeof msg.index === 'number' ? String(msg.index) : `${Date.now()}-${Math.random()}`);
  const content = msg.body ?? (msg.attributes && (msg.attributes.text ?? JSON.stringify(msg.attributes))) ?? '';
  const timestamp = msg.dateCreated ?? new Date().toISOString();
  const sender = msg.author ?? null;

  let type: ThreadMessageType = 'inbound';
  const author = (msg.author || '').toLowerCase();
  if (!author) {
    type = 'system';
  } else if (options?.currentUserId && author === options.currentUserId.toLowerCase()) {
    type = 'outbound';
  } else if (author === 'system' || author === 'twilio' || author === 'system:notification') {
    type = 'system';
  } else {
    // heuristic: if author looks like an agent id (contains 'agent' or 'user' prefix), treat as outbound for that agent
    if (options?.currentUserId && author.includes(options.currentUserId.toLowerCase())) {
      type = 'outbound';
    } else {
      type = 'inbound';
    }
  }

  return {
    id,
    type,
    content,
    timestamp,
    timestampLabel: formatRelativeTime(timestamp),
    status: msg.status,
    sender,
  };
}

// Map arrays
export function mapTwilioConversationsToListItems(convs: TwilioConversation[]): ConversationListItem[] {
  return convs.map(mapTwilioConversationToListItem);
}

export function mapTwilioMessagesToThreadMessages(
  msgs: TwilioMessage[],
  opts?: { currentUserId?: string | null }
): ThreadMessage[] {
  // assume messages are in chronological order from Twilio; UI often wants chronological too
  return msgs.map((m) => mapTwilioMessageToThreadMessage(m, opts));
}
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  MessageSquare,
  Phone,
  User,
  Users,
  Download,
  Trash2,
  UserPlus,
  X,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  friendlyName: string;
  participantCount: number;
  channels: string[];
  unreadCount: number;
  assignedTo: string | null;
  lastMessage: string;
  lastMessageTime: string;
  status: "open" | "closed";
}

const demoConversations: Conversation[] = [
  {
    id: "conv-1",
    friendlyName: "Support Request #1234",
    participantCount: 2,
    channels: ["SMS"],
    unreadCount: 3,
    assignedTo: "John Doe",
    lastMessage: "Thanks for your help!",
    lastMessageTime: "2 min ago",
    status: "open",
  },
  {
    id: "conv-2",
    friendlyName: "Order Inquiry #5678",
    participantCount: 3,
    channels: ["WhatsApp", "SMS"],
    unreadCount: 0,
    assignedTo: null,
    lastMessage: "When will my order arrive?",
    lastMessageTime: "15 min ago",
    status: "open",
  },
  {
    id: "conv-3",
    friendlyName: "Sales Lead - Acme Corp",
    participantCount: 4,
    channels: ["Chat"],
    unreadCount: 1,
    assignedTo: "Jane Smith",
    lastMessage: "Let's schedule a demo for next week",
    lastMessageTime: "1 hour ago",
    status: "open",
  },
  {
    id: "conv-4",
    friendlyName: "Technical Support",
    participantCount: 2,
    channels: ["SMS", "WhatsApp", "Chat"],
    unreadCount: 0,
    assignedTo: "Support Team",
    lastMessage: "Issue resolved. Closing ticket.",
    lastMessageTime: "2 hours ago",
    status: "closed",
  },
  {
    id: "conv-5",
    friendlyName: "Billing Question",
    participantCount: 2,
    channels: ["SMS"],
    unreadCount: 5,
    assignedTo: null,
    lastMessage: "I have a question about my invoice",
    lastMessageTime: "3 hours ago",
    status: "open",
  },
];

interface ConversationsListProps {
  onSelectConversation: (id: string | null) => void;
  selectedId: string | null;
}

export const ConversationsList = ({ onSelectConversation, selectedId }: ConversationsListProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === demoConversations.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(demoConversations.map((c) => c.id));
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "SMS":
        return <MessageSquare className="h-3 w-3" />;
      case "WhatsApp":
        return <Phone className="h-3 w-3" />;
      case "Chat":
        return <Users className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  if (demoConversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Start a new conversation or inbound messages can auto-create conversations when enabled.
        </p>
        <Button>Create Conversation</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md border-r border-border flex flex-col bg-card rounded-l-3xl shadow-soft">
      {/* Bulk actions bar */}
      {selectedItems.length > 0 && (
        <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2 rounded-tl-3xl">
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} selected
          </span>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl border-0 bg-card shadow-soft">
            <UserPlus className="h-3 w-3" />
            Assign
          </Button>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl border-0 bg-card shadow-soft">
            <X className="h-3 w-3" />
            Close
          </Button>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl border-0 bg-card shadow-soft">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      )}

      {/* Header */}
      <div className={`p-3 border-b border-border flex items-center gap-2 ${selectedItems.length === 0 ? 'rounded-tl-3xl' : ''}`}>
        <Checkbox
          checked={selectedItems.length === demoConversations.length}
          onCheckedChange={toggleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {demoConversations.length} conversations
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {demoConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "p-4 border-b border-border cursor-pointer hover:bg-muted/30 transition-smooth",
              selectedId === conversation.id && "bg-muted/50"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedItems.includes(conversation.id)}
                onCheckedChange={() => toggleSelect(conversation.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {conversation.friendlyName}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {conversation.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {conversation.participantCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {conversation.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-5 gap-1 rounded-lg bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"
                      >
                        {getChannelIcon(channel)}
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground truncate mb-2">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] rounded-lg ${
                        conversation.status === "open" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {conversation.status === "open" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <X className="h-3 w-3 mr-1" />
                      )}
                      {conversation.status}
                    </Badge>
                    {conversation.unreadCount > 0 && (
                      <Badge className="text-[10px] rounded-lg gradient-red text-white border-0">
                        {conversation.unreadCount} unread
                      </Badge>
                    )}
                  </div>
                  {conversation.assignedTo && (
                    <span className="text-xs text-muted-foreground">
                      {conversation.assignedTo}
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Assign</DropdownMenuItem>
                  <DropdownMenuItem>
                    {conversation.status === "open" ? "Close" : "Reopen"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Export transcript</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

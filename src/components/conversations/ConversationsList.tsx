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

  const getChannelStyles = (channel: string) => {
    switch (channel) {
      case "SMS":
        return {
          icon: <MessageSquare className="h-3 w-3" />,
          className: "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30"
        };
      case "WhatsApp":
        return {
          icon: <Phone className="h-3 w-3" />,
          className: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
        };
      case "Chat":
        return {
          icon: <Users className="h-3 w-3" />,
          className: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
        };
      default:
        return {
          icon: <MessageSquare className="h-3 w-3" />,
          className: "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30"
        };
    }
  };

  if (demoConversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--teal))]/10 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-[hsl(var(--teal))]" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Start a new conversation or inbound messages can auto-create conversations when enabled.
        </p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-soft">
          Create Conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md border-r border-border flex flex-col bg-card rounded-l-3xl shadow-soft h-full overflow-hidden">
      {/* Bulk actions bar */}
      {selectedItems.length > 0 && (
        <div className="p-3 border-b border-border bg-[hsl(var(--blue))]/5 flex items-center gap-2 rounded-tl-3xl">
          <span className="text-sm text-[hsl(var(--blue))] font-medium">
            {selectedItems.length} selected
          </span>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl bg-card shadow-soft hover:bg-muted">
            <UserPlus className="h-3 w-3" />
            Assign
          </Button>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl bg-card shadow-soft hover:bg-muted">
            <X className="h-3 w-3" />
            Close
          </Button>
          <Button variant="outline" size="sm" className="gap-1 rounded-xl bg-card shadow-soft hover:bg-muted">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      )}

      {/* Header */}
      <div className={`p-3 border-b border-border flex items-center gap-2 bg-muted/30 ${selectedItems.length === 0 ? 'rounded-tl-3xl' : ''}`}>
        <Checkbox
          checked={selectedItems.length === demoConversations.length}
          onCheckedChange={toggleSelectAll}
          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
              "p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-smooth",
              selectedId === conversation.id && "bg-[hsl(var(--blue))]/5 border-l-2 border-l-[hsl(var(--blue))]"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedItems.includes(conversation.id)}
                onCheckedChange={() => toggleSelect(conversation.id)}
                onClick={(e) => e.stopPropagation()}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
                  <div className="flex items-center gap-1.5">
                    {conversation.channels.map((channel) => {
                      const styles = getChannelStyles(channel);
                      return (
                        <Badge
                          key={channel}
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 h-5 gap-1 rounded-full border font-semibold shadow-sm",
                            styles.className
                          )}
                        >
                          {styles.icon}
                          {channel}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground truncate mb-2">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] rounded-lg border-0 ${
                        conversation.status === "open" 
                          ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]" 
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
                      <Badge className="text-[10px] rounded-lg bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))] border-0">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl bg-card border-border shadow-soft">
                  <DropdownMenuItem className="rounded-lg">View</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">Assign</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    {conversation.status === "open" ? "Close" : "Reopen"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">Export transcript</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive rounded-lg hover:bg-destructive/10">
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

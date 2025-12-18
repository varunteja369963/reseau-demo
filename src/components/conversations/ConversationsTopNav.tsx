import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  MessagesSquare,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { NewConversationModal } from "./NewConversationModal";

type ConversationsView = 
  | "conversations" 
  | "my-conversations" 
  | "settings";

interface ConversationsTopNavProps {
  activeView: ConversationsView;
  onViewChange: (view: ConversationsView) => void;
}

export const ConversationsTopNav = ({ activeView, onViewChange }: ConversationsTopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const navItems = [
    { id: "conversations" as const, label: "All Conversations", icon: MessagesSquare },
    { id: "my-conversations" as const, label: "My Conversations", icon: User },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <>
      <div className="border-b border-border bg-card">
        {/* Top row with title and main actions */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Conversations</h1>
          <Button onClick={() => setShowNewModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
        </div>

        {/* Navigation tabs */}
        <div className="px-6 flex items-center gap-1 border-b border-border">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === item.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Search and filters row */}
        {activeView !== "settings" && (
          <div className="px-6 py-3 flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations, participants, messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Status: {statusFilter === "all" ? "All" : statusFilter === "open" ? "Open" : "Closed"}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("open")}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Unread toggle */}
            <Button
              variant={unreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setUnreadOnly(!unreadOnly)}
            >
              Unread only
            </Button>

            {/* Channel filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Channel: {channelFilter === "all" ? "All" : channelFilter}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setChannelFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChannelFilter("SMS")}>SMS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChannelFilter("WhatsApp")}>WhatsApp</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChannelFilter("Chat")}>Chat</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChannelFilter("Multi-channel")}>Multi-channel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More filters */}
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-3 w-3" />
              More Filters
            </Button>
          </div>
        )}
      </div>

      <NewConversationModal open={showNewModal} onOpenChange={setShowNewModal} />
    </>
  );
};

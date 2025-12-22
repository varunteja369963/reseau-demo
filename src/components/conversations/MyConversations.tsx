import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  MessageSquare,
  CheckCheck,
  Eye,
  Download,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MyConversation {
  id: string;
  friendlyName: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: "open" | "closed";
  channels: string[];
}

const demoMyConversations: MyConversation[] = [
  {
    id: "conv-1",
    friendlyName: "Support Request #1234",
    unreadCount: 3,
    lastMessage: "Thanks for your help!",
    lastMessageTime: "2 min ago",
    status: "open",
    channels: ["SMS"],
  },
  {
    id: "conv-3",
    friendlyName: "Sales Lead - Acme Corp",
    unreadCount: 1,
    lastMessage: "Let's schedule a demo for next week",
    lastMessageTime: "1 hour ago",
    status: "open",
    channels: ["Chat"],
  },
  {
    id: "conv-5",
    friendlyName: "Follow-up - Product Demo",
    unreadCount: 0,
    lastMessage: "I'll send over the pricing",
    lastMessageTime: "Yesterday",
    status: "open",
    channels: ["WhatsApp", "SMS"],
  },
];

export const MyConversations = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filteredConversations = unreadOnly
    ? demoMyConversations.filter((c) => c.unreadCount > 0)
    : demoMyConversations;

  const totalUnread = demoMyConversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">My Conversations</h2>
          <p className="text-muted-foreground">
            Conversations assigned to you • {totalUnread} unread
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="unread-only"
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-teal-600"
            />
            <Label htmlFor="unread-only">Unread only</Label>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl border-0 bg-card shadow-soft hover:bg-teal-500/10 hover:text-teal-600">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-2xl flex items-start gap-3 border border-teal-500/20">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0">
          <Info className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm text-foreground">
            Unread count may cap at a maximum value for display purposes.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Mark conversations as read to clear the count.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border-0 rounded-3xl bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead>Conversation</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Unread</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500/20 to-teal-600/20 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-6 w-6 text-teal-600" />
                  </div>
                  <p className="text-muted-foreground">
                    {unreadOnly
                      ? "No unread conversations"
                      : "No conversations assigned to you"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredConversations.map((conversation) => (
                <TableRow key={conversation.id} className="hover:bg-teal-500/5">
                  <TableCell>
                    <div>
                      <p className="font-medium">{conversation.friendlyName}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {conversation.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-[10px] rounded-lg border-teal-500/30 text-teal-600 bg-teal-500/10">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {conversation.unreadCount > 0 ? (
                      <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 rounded-lg">
                        {conversation.unreadCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {conversation.lastMessageTime}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`rounded-lg border-0 ${
                        conversation.status === "open" 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {conversation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-lg hover:bg-teal-500/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl bg-card border-border shadow-soft">
                        <DropdownMenuItem className="gap-2 rounded-lg hover:bg-teal-500/10 hover:text-teal-600">
                          <Eye className="h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg hover:bg-teal-500/10 hover:text-teal-600">
                          <CheckCheck className="h-4 w-4" />
                          Mark as read
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-lg hover:bg-teal-500/10 hover:text-teal-600">
                          <Download className="h-4 w-4" />
                          Export transcript
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

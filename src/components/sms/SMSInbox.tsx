import { useState } from "react";
import {
  Search,
  Send,
  User,
  Phone,
  Tag,
  ListTree,
  MoreHorizontal,
  Check,
  X,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SMSComplianceBanner } from "./shared/SMSComplianceBanner";

const conversations = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 555-0123",
    lastMessage: "Yes, I'd like to confirm my appointment",
    time: "2 min ago",
    unread: true,
    status: "subscribed",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 555-0456",
    lastMessage: "What time does the sale end?",
    time: "15 min ago",
    unread: true,
    status: "subscribed",
  },
  {
    id: "3",
    name: "Mike Wilson",
    phone: "+1 555-0789",
    lastMessage: "STOP",
    time: "32 min ago",
    unread: false,
    status: "unsubscribed",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+1 555-0321",
    lastMessage: "Can I reschedule to next week?",
    time: "1 hr ago",
    unread: false,
    status: "subscribed",
  },
  {
    id: "5",
    name: "Chris Brown",
    phone: "+1 555-0654",
    lastMessage: "Thanks for the info!",
    time: "2 hr ago",
    unread: false,
    status: "subscribed",
  },
];

const messages = [
  {
    id: "1",
    type: "outbound",
    content: "Hi John! This is a reminder about your appointment tomorrow at 2 PM. Reply YES to confirm or call us to reschedule.",
    time: "Yesterday 3:00 PM",
    status: "delivered",
  },
  {
    id: "2",
    type: "inbound",
    content: "Yes, I'd like to confirm my appointment",
    time: "2 min ago",
  },
];

const statusColors: Record<string, string> = {
  subscribed: "bg-teal-500/10 text-teal-600",
  unsubscribed: "bg-red-500/10 text-red-500",
  suppressed: "bg-amber-500/10 text-amber-600",
};

export function SMSInbox() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone.includes(searchQuery);
    const matchesFilter = filterValue === "all" || 
      (filterValue === "unread" && conv.unread) ||
      (filterValue === "assigned" && true);
    return matchesSearch && matchesFilter;
  });

  const canSend = selectedConversation.status === "subscribed";

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
          <p className="text-muted-foreground">Two-way SMS conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Conversation List */}
        <div className="col-span-3 rounded-3xl flex flex-col bg-card shadow-soft border-0">
          <div className="p-3 border-b border-border/30 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-0 bg-muted/30"
              />
            </div>
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="rounded-xl border-0 bg-muted/30">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Conversations</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="assigned">Assigned to me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="flex-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 border-b border-border/20 cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation.id === conv.id ? "bg-teal-500/5 border-l-2 border-l-teal-500" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-0">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 text-teal-600">
                      {conv.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium text-sm truncate ${conv.unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {conv.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{conv.phone}</p>
                    <p className={`text-sm truncate ${conv.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 rounded-full bg-teal-500 shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Conversation Thread */}
        <div className="col-span-6 rounded-3xl flex flex-col bg-card shadow-soft border-0">
          {/* Thread Header */}
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-0">
                <AvatarFallback className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 text-teal-600">
                  {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{selectedConversation.name}</p>
                <p className="text-sm text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`${statusColors[selectedConversation.status]} rounded-lg`}>
                {selectedConversation.status}
              </Badge>
              <Select defaultValue="unassigned">
                <SelectTrigger className="w-[150px] rounded-xl border-0 bg-muted/30">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="me">Assign to me</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="rounded-xl border-0 bg-muted/30">
                Mark Resolved
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "outbound" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-3 ${
                      message.type === "outbound"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                        : "bg-muted/50"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-2 mt-1 ${
                      message.type === "outbound" ? "justify-end" : ""
                    }`}>
                      <span className={`text-xs ${
                        message.type === "outbound" ? "text-white/70" : "text-muted-foreground"
                      }`}>
                        {message.time}
                      </span>
                      {message.type === "outbound" && message.status && (
                        <Check className="h-3 w-3 text-white/70" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="p-4 border-t border-border/30">
            {!canSend && (
              <div className="mb-3 p-3 bg-red-500/10 border-0 rounded-xl">
                <p className="text-sm text-red-500">
                  Messaging blocked: contact has opted out
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                placeholder={canSend ? "Type your message..." : "Cannot send to opted-out contact"}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px] resize-none rounded-xl border-0 bg-muted/30"
                disabled={!canSend}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!canSend} className="rounded-xl border-0 bg-muted/30">
                      Insert Template
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl">
                    <DropdownMenuItem>Appointment Confirmation</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule Options</DropdownMenuItem>
                    <DropdownMenuItem>Thank You</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-muted-foreground">
                  {newMessage.length}/160 characters
                </span>
              </div>
              <Button disabled={!canSend || !newMessage.trim()} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Panel */}
        <div className="col-span-3 rounded-3xl overflow-hidden bg-card shadow-soft border-0">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">Contact Info</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem>View Full Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Suppress Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-4 space-y-6">
              {/* Contact Summary */}
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3 border-0">
                  <AvatarFallback className="text-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20 text-teal-600">
                    {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-foreground">{selectedConversation.name}</p>
                <Badge variant="secondary" className={`mt-1 ${statusColors[selectedConversation.status]} rounded-lg`}>
                  {selectedConversation.status}
                </Badge>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-teal-500" />
                  </div>
                  <span className="text-sm">{selectedConversation.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-sm">john.smith@email.com</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="rounded-lg bg-amber-500/10 text-amber-600 border-0">VIP</Badge>
                  <Badge variant="outline" className="rounded-lg bg-teal-500/10 text-teal-600 border-0">Customer</Badge>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-teal-500 hover:text-teal-600">
                    + Add
                  </Button>
                </div>
              </div>

              {/* Lists */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListTree className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Lists</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="rounded-lg bg-purple-500/10 text-purple-600 border-0">Newsletter</Badge>
                  <Badge variant="secondary" className="rounded-lg bg-purple-500/10 text-purple-600 border-0">Promotions</Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-0 bg-muted/30" size="sm">
                  <Tag className="h-4 w-4" />
                  Add Tag
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-0 bg-red-500/10 text-red-500 hover:bg-red-500/20" size="sm">
                  <X className="h-4 w-4" />
                  Suppress Contact
                </Button>
              </div>

              {/* Add Note */}
              <div>
                <p className="text-sm font-medium mb-2 text-foreground">Add Note</p>
                <Textarea placeholder="Type a note..." className="min-h-[80px] rounded-xl border-0 bg-muted/30" />
                <Button size="sm" className="mt-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">Save Note</Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
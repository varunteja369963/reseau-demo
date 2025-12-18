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
  subscribed: "bg-green-500/10 text-green-500",
  unsubscribed: "bg-red-500/10 text-red-500",
  suppressed: "bg-orange-500/10 text-orange-500",
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
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-muted-foreground">Two-way SMS conversations</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 h-full">
        {/* Conversation List */}
        <div className="col-span-3 border rounded-lg flex flex-col">
          <div className="p-3 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation.id === conv.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {conv.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-medium text-sm truncate ${conv.unread ? "" : "text-muted-foreground"}`}>
                        {conv.name}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{conv.phone}</p>
                    <p className={`text-sm truncate ${conv.unread ? "font-medium" : "text-muted-foreground"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Conversation Thread */}
        <div className="col-span-6 border rounded-lg flex flex-col">
          {/* Thread Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedConversation.name}</p>
                <p className="text-sm text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={statusColors[selectedConversation.status]}>
                {selectedConversation.status}
              </Badge>
              <Select defaultValue="unassigned">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="me">Assign to me</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
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
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.type === "outbound"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-2 mt-1 ${
                      message.type === "outbound" ? "justify-end" : ""
                    }`}>
                      <span className={`text-xs ${
                        message.type === "outbound" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {message.time}
                      </span>
                      {message.type === "outbound" && message.status && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="p-4 border-t">
            {!canSend && (
              <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  Messaging blocked: contact has opted out
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                placeholder={canSend ? "Type your message..." : "Cannot send to opted-out contact"}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={!canSend}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!canSend}>
                      Insert Template
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Appointment Confirmation</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule Options</DropdownMenuItem>
                    <DropdownMenuItem>Thank You</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-muted-foreground">
                  {newMessage.length}/160 characters
                </span>
              </div>
              <Button disabled={!canSend || !newMessage.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Panel */}
        <div className="col-span-3 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <p className="font-medium">Contact Info</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarFallback className="text-lg">
                    {selectedConversation.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{selectedConversation.name}</p>
                <Badge variant="secondary" className={`mt-1 ${statusColors[selectedConversation.status]}`}>
                  {selectedConversation.status}
                </Badge>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedConversation.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">john.smith@email.com</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">VIP</Badge>
                  <Badge variant="outline">Customer</Badge>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    + Add
                  </Button>
                </div>
              </div>

              {/* Lists */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ListTree className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Lists</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Newsletter</Badge>
                  <Badge variant="secondary">Promotions</Badge>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Tag className="h-4 w-4" />
                  Add Tag
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive" size="sm">
                  <X className="h-4 w-4" />
                  Suppress Contact
                </Button>
              </div>

              {/* Add Note */}
              <div>
                <p className="text-sm font-medium mb-2">Add Note</p>
                <Textarea placeholder="Type a note..." className="min-h-[80px]" />
                <Button size="sm" className="mt-2">Save Note</Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

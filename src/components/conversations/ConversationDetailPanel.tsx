import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Plus,
  Trash2,
  UserPlus,
  Copy,
  Send,
  ExternalLink,
  Info,
  Clock,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  friendlyName: string;
  status: "open" | "closed";
  serviceSid: string;
  conversationSid: string;
  createdAt: string;
  lastActivity: string;
  tags: string[];
  assignedTo: string;
}

interface ConversationDetailPanelProps {
  conversation: Conversation;
}

// Demo participants
const demoParticipants = [
  {
    id: "p1",
    displayName: "John Customer",
    type: "address",
    address: "+1 234 567 8900",
    role: "Member",
    joinedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "p2",
    displayName: "Jane Agent",
    type: "identity",
    identity: "jane.agent@company.com",
    role: "Admin",
    joinedAt: "2024-01-15T10:33:00Z",
  },
];

// Demo attributes
const demoAttributes = [
  { key: "caseId", value: "CASE-12345" },
  { key: "orderId", value: "ORD-67890" },
  { key: "priority", value: "high" },
];

// Demo webhooks
const demoWebhooks = [
  {
    id: "w1",
    url: "https://api.example.com/webhook",
    enabled: true,
    events: ["onMessageAdded", "onParticipantAdded"],
    type: "post-action",
  },
];

// Demo activity
const demoActivity = [
  {
    id: "a1",
    type: "status_change",
    description: "Conversation opened",
    timestamp: "2024-01-15T10:30:00Z",
    user: "System",
  },
  {
    id: "a2",
    type: "participant_join",
    description: "John Customer joined",
    timestamp: "2024-01-15T10:30:00Z",
    user: "System",
  },
  {
    id: "a3",
    type: "assignment",
    description: "Assigned to Jane Agent",
    timestamp: "2024-01-15T10:33:00Z",
    user: "Admin",
  },
];

// Demo notes
const demoNotes = [
  {
    id: "n1",
    content: "Customer seems frustrated, handle with care",
    author: "Jane Agent",
    timestamp: "2024-01-15T10:35:00Z",
  },
  {
    id: "n2",
    content: "Escalated to shipping team",
    author: "John Doe",
    timestamp: "2024-01-15T11:00:00Z",
  },
];

export const ConversationDetailPanel = ({ conversation }: ConversationDetailPanelProps) => {
  const { toast } = useToast();
  const [friendlyName, setFriendlyName] = useState(conversation.friendlyName);
  const [tags, setTags] = useState(conversation.tags);
  const [newTag, setNewTag] = useState("");
  const [assignedTo, setAssignedTo] = useState(conversation.assignedTo);
  const [attributes, setAttributes] = useState(demoAttributes);
  const [autoClose, setAutoClose] = useState(false);
  const [autoCloseDuration, setAutoCloseDuration] = useState("24h");
  const [newNote, setNewNote] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-auto p-0 bg-transparent overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="participants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Participants
          </TabsTrigger>
          <TabsTrigger value="attributes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Attributes
          </TabsTrigger>
          <TabsTrigger value="states" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            States
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Activity
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:text-teal-600">
            Notes
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4 space-y-4 m-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Friendly Name</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent className="rounded-xl">
                    <p className="max-w-xs">
                      Avoid putting personal data in Friendly Name. Use an internal reference instead.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                className="rounded-xl bg-muted/30"
              />
            </div>

            <div className="space-y-2">
              <Label>Unique IDs</Label>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Service SID</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs">{conversation.serviceSid.slice(0, 12)}...</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-lg hover:bg-teal-500/10 hover:text-teal-600"
                      onClick={() => copyToClipboard(conversation.serviceSid, "Service SID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Conversation SID</span>
                  <div className="flex items-center gap-1">
                    <code className="text-xs">{conversation.conversationSid.slice(0, 12)}...</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-lg hover:bg-teal-500/10 hover:text-teal-600"
                      onClick={() => copyToClipboard(conversation.conversationSid, "Conversation SID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={conversation.status}>
                <SelectTrigger className="rounded-xl bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="open" className="rounded-lg">Open</SelectItem>
                  <SelectItem value="closed" className="rounded-lg">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dates</Label>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">
                  Created: {new Date(conversation.createdAt).toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  Last activity: {new Date(conversation.lastActivity).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 rounded-lg bg-teal-500/10 text-teal-600 border-0">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:bg-teal-500/20 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 rounded-xl bg-muted/30"
                />
                <Button size="sm" onClick={addTag} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignment</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="rounded-xl bg-muted/30">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unassigned" className="rounded-lg">Unassigned</SelectItem>
                  <SelectItem value="John Doe" className="rounded-lg">John Doe</SelectItem>
                  <SelectItem value="Jane Smith" className="rounded-lg">Jane Smith</SelectItem>
                  <SelectItem value="Support Team" className="rounded-lg">Support Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="rounded-xl bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="low" className="rounded-lg">Low</SelectItem>
                  <SelectItem value="normal" className="rounded-lg">Normal</SelectItem>
                  <SelectItem value="high" className="rounded-lg">High</SelectItem>
                  <SelectItem value="urgent" className="rounded-lg">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="p-4 space-y-4 m-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Participants ({demoParticipants.length})</h4>
              <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                    <UserPlus className="h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Participant</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Add by</Label>
                      <Select defaultValue="address">
                        <SelectTrigger className="rounded-xl bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="identity" className="rounded-lg">Identity (Chat user)</SelectItem>
                          <SelectItem value="address" className="rounded-lg">Address (Phone/WhatsApp)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number / Identity</Label>
                      <Input placeholder="+1 234 567 8900" className="rounded-xl bg-muted/30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Display Name (optional)</Label>
                      <Input placeholder="John Doe" className="rounded-xl bg-muted/30" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can create a conversation with up to 10 participants at once.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddParticipant(false)} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddParticipant(false)} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                      Add Participant
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {demoParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-3 border border-teal-500/20 rounded-xl space-y-2 bg-teal-500/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{participant.displayName}</span>
                    <Badge variant="secondary" className="text-[10px] rounded-lg bg-teal-500/10 text-teal-600 border-0">
                      {participant.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] rounded-lg border-teal-500/30 text-teal-600">
                      {participant.type === "identity" ? "Identity" : "Address"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {participant.type === "identity"
                        ? participant.identity
                        : participant.address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(participant.joinedAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-teal-500/10 hover:text-teal-600">
                        <Send className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive rounded-lg hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes" className="p-4 space-y-4 m-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Metadata</h4>
              <Button size="sm" className="gap-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>

            <div className="space-y-2">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={attr.key}
                    onChange={(e) => {
                      const newAttrs = [...attributes];
                      newAttrs[index].key = e.target.value;
                      setAttributes(newAttrs);
                    }}
                    placeholder="Key"
                    className="flex-1 rounded-xl bg-muted/30"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => {
                      const newAttrs = [...attributes];
                      newAttrs[index].value = e.target.value;
                      setAttributes(newAttrs);
                    }}
                    placeholder="Value"
                    className="flex-1 rounded-xl bg-muted/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive rounded-lg hover:bg-destructive/10"
                    onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                Reset Changes
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">Save</Button>
            </div>
          </TabsContent>

          {/* States & Timers Tab */}
          <TabsContent value="states" className="p-4 space-y-4 m-0">
            <div className="space-y-2">
              <Label>Status Controls</Label>
              <Select defaultValue={conversation.status}>
                <SelectTrigger className="rounded-xl bg-muted/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="open" className="rounded-lg">Open</SelectItem>
                  <SelectItem value="closed" className="rounded-lg">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-close after inactivity</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically close conversation after period of inactivity
                  </p>
                </div>
                <Switch 
                  checked={autoClose} 
                  onCheckedChange={setAutoClose}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500 data-[state=checked]:to-teal-600"
                />
              </div>

              {autoClose && (
                <Select value={autoCloseDuration} onValueChange={setAutoCloseDuration}>
                  <SelectTrigger className="rounded-xl bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="1h" className="rounded-lg">1 hour</SelectItem>
                    <SelectItem value="24h" className="rounded-lg">24 hours</SelectItem>
                    <SelectItem value="7d" className="rounded-lg">7 days</SelectItem>
                    <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-xl border border-teal-500/20">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-teal-600 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Timers help manage lifecycle and reduce inactive threads. This helps keep users focused on active conversations.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="p-4 space-y-4 m-0">
            <div className="p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/10 rounded-xl border border-teal-500/20 mb-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-teal-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Configure service-level webhooks in Settings → Service.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Each conversation can have up to 5 conversation-scoped webhooks.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="font-medium">Conversation Webhooks</h4>
              <Button size="sm" className="gap-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {demoWebhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="p-3 border border-teal-500/20 rounded-xl space-y-2 bg-teal-500/5"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xs truncate max-w-[200px]">{webhook.url}</code>
                    <Badge variant={webhook.enabled ? "default" : "secondary"} className={`rounded-lg ${webhook.enabled ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0" : ""}`}>
                      {webhook.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-[10px] rounded-lg border-teal-500/30 text-teal-600">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] rounded-lg bg-teal-500/10 text-teal-600 border-0">
                      {webhook.type}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-teal-500/10 hover:text-teal-600">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive rounded-lg hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Event Types</Label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  "onConversationAdded",
                  "onConversationUpdated",
                  "onMessageAdded",
                  "onParticipantAdded",
                  "onParticipantRemoved",
                  "onParticipantUpdated",
                ].map((event) => (
                  <div key={event} className="flex items-center gap-2">
                    <input type="checkbox" id={event} className="rounded accent-teal-500" />
                    <label htmlFor={event}>{event}</label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="p-4 space-y-4 m-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Activity Feed</h4>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px] rounded-xl bg-muted/30">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">All</SelectItem>
                  <SelectItem value="status" className="rounded-lg">Status</SelectItem>
                  <SelectItem value="assignment" className="rounded-lg">Assignment</SelectItem>
                  <SelectItem value="participant" className="rounded-lg">Participant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {demoActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 border-l-2 border-teal-500"
                >
                  <Clock className="h-4 w-4 text-teal-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {activity.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="p-4 space-y-4 m-0">
            <h4 className="font-medium">Internal Notes</h4>

            <div className="space-y-3">
              {demoNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20 rounded-xl"
                >
                  <p className="text-sm">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-teal-600">{note.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add an internal note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px] rounded-xl bg-muted/30"
              />
              <Button size="sm" disabled={!newNote.trim()} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl disabled:opacity-50">
                Add Note
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

import { useState } from "react";
import {
  Building2,
  Users,
  Server,
  Phone,
  Webhook,
  Bell,
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teamMembers = [
  { id: "1", name: "John Admin", email: "john@company.com", role: "Owner", status: "active" },
  { id: "2", name: "Jane Manager", email: "jane@company.com", role: "Admin", status: "active" },
  { id: "3", name: "Bob Marketer", email: "bob@company.com", role: "Marketer", status: "active" },
  { id: "4", name: "Alice Support", email: "alice@company.com", role: "Support", status: "active" },
  { id: "5", name: "Charlie Analyst", email: "charlie@company.com", role: "Analyst", status: "pending" },
];

const senderIds = [
  { id: "1", number: "+1 555-0100", name: "Marketing", type: "Long Code", status: "active" },
  { id: "2", number: "+1 555-0200", name: "Alerts", type: "Long Code", status: "active" },
  { id: "3", number: "12345", name: "Short Code", type: "Short Code", status: "active" },
];

const apiKeys = [
  { id: "1", name: "Production API Key", key: "sk_live_xxxxx...xxxxx", created: "2024-01-01", lastUsed: "2024-01-16" },
  { id: "2", name: "Test API Key", key: "sk_test_xxxxx...xxxxx", created: "2024-01-05", lastUsed: "2024-01-15" },
];

const webhooks = [
  { id: "1", url: "https://api.example.com/sms/webhook", events: ["message.sent", "message.delivered"], status: "active" },
  { id: "2", url: "https://api.example.com/optout/webhook", events: ["contact.opted_out"], status: "active" },
];

const roleColors: Record<string, string> = {
  Owner: "bg-purple-500/10 text-purple-500",
  Admin: "bg-blue-500/10 text-blue-500",
  Marketer: "bg-green-500/10 text-green-500",
  Support: "bg-orange-500/10 text-orange-500",
  Analyst: "bg-gray-500/10 text-gray-500",
};

export function SMSSettings() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [addSenderOpen, setAddSenderOpen] = useState(false);
  const [createPoolOpen, setCreatePoolOpen] = useState(false);
  const [addApiKeyOpen, setAddApiKeyOpen] = useState(false);
  const [addWebhookOpen, setAddWebhookOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your SMS platform settings</p>
      </div>

      <Tabs defaultValue="organization">
        <TabsList className="rounded-xl">
          <TabsTrigger value="organization" className="gap-2 rounded-xl">
            <Building2 className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 rounded-xl">
            <Users className="h-4 w-4" />
            Team & Roles
          </TabsTrigger>
          <TabsTrigger value="provider" className="gap-2 rounded-xl">
            <Server className="h-4 w-4" />
            SMS Provider
          </TabsTrigger>
          <TabsTrigger value="senders" className="gap-2 rounded-xl">
            <Phone className="h-4 w-4" />
            Sender IDs
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2 rounded-xl">
            <Webhook className="h-4 w-4" />
            API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-xl">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="Reseau SMS" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Legal Name</Label>
                  <Input defaultValue="Reseau Inc." className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Textarea defaultValue="123 Main St, Suite 100, San Francisco, CA 94105" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input type="email" defaultValue="support@reseau.com" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input defaultValue="+1 800-555-0100" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="America/Los_Angeles">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 mt-4">
          <div className="flex items-center justify-end">
            <Button onClick={() => setInviteDialogOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={member.role} disabled={member.role === "Owner"}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Owner" disabled>Owner</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Marketer">Marketer</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Analyst">Analyst</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={member.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provider" className="space-y-4 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle>SMS Provider</CardTitle>
              <CardDescription>Connect your SMS provider account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {["Twilio", "Telnyx", "Plivo", "Custom"].map((provider) => (
                  <Card
                    key={provider}
                    className={`cursor-pointer hover:border-primary transition-colors ${provider === "Twilio" ? "border-primary" : ""}`}
                  >
                    <CardContent className="p-4 text-center">
                      <Server className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">{provider}</p>
                      {provider === "Twilio" && (
                        <Badge variant="secondary" className="mt-2 bg-green-500/10 text-green-500">
                          Connected
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Twilio Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account SID</Label>
                    <Input defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Auth Token</Label>
                    <Input type="password" defaultValue="••••••••••••••••" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Test Connection
                    </Button>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="senders" className="space-y-4 mt-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setCreatePoolOpen(true)} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Create Sending Pool
            </Button>
            <Button onClick={() => setAddSenderOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
              <Plus className="h-4 w-4" />
              Add Sender
            </Button>
          </div>
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {senderIds.map((sender) => (
                    <TableRow key={sender.id}>
                      <TableCell className="font-mono">{sender.number}</TableCell>
                      <TableCell>{sender.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sender.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          {sender.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for programmatic access</CardDescription>
              </div>
              <Button onClick={() => setAddApiKeyOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
                <Plus className="h-4 w-4" />
                Create Key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono">
                        <div className="flex items-center gap-2">
                          {showApiKey === key.id ? key.key : "••••••••••••••••"}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                          >
                            {showApiKey === key.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{key.created}</TableCell>
                      <TableCell className="text-muted-foreground">{key.lastUsed}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Receive real-time event notifications</CardDescription>
              </div>
              <Button onClick={() => setAddWebhookOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
                <Plus className="h-4 w-4" />
                Add Webhook
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-mono text-sm max-w-xs truncate">
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          {webhook.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Campaign completed", desc: "Get notified when a campaign finishes sending" },
                { label: "High opt-out rate", desc: "Alert when opt-out rate exceeds threshold" },
                { label: "Delivery failures", desc: "Get notified of delivery issues" },
                { label: "New inbox messages", desc: "Alert on new inbound messages" },
                { label: "Team assignments", desc: "Notify when conversations are assigned to you" },
                { label: "Weekly summary", desc: "Receive weekly performance report" },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{pref.label}</p>
                    <p className="text-sm text-muted-foreground">{pref.desc}</p>
                  </div>
                  <Switch defaultChecked={i < 4} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="colleague@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Marketer">Marketer</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInviteDialogOpen(false)}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Sender Dialog */}
      <Dialog open={addSenderOpen} onOpenChange={setAddSenderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sender ID</DialogTitle>
            <DialogDescription>
              Add a new phone number for sending messages
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+1 555 123 4567" />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input placeholder="e.g., Marketing" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long Code</SelectItem>
                  <SelectItem value="short">Short Code</SelectItem>
                  <SelectItem value="tollfree">Toll-Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSenderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddSenderOpen(false)}>
              Add Sender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Pool Dialog */}
      <Dialog open={createPoolOpen} onOpenChange={setCreatePoolOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sending Pool</DialogTitle>
            <DialogDescription>
              Group multiple sender IDs for load balancing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pool Name</Label>
              <Input placeholder="e.g., Marketing Pool" />
            </div>
            <div className="space-y-2">
              <Label>Select Sender IDs</Label>
              <div className="space-y-2">
                {senderIds.map((sender) => (
                  <div key={sender.id} className="flex items-center gap-2">
                    <input type="checkbox" id={sender.id} />
                    <label htmlFor={sender.id} className="text-sm">
                      {sender.number} ({sender.name})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePoolOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreatePoolOpen(false)}>
              Create Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add API Key Dialog */}
      <Dialog open={addApiKeyOpen} onOpenChange={setAddApiKeyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input placeholder="e.g., Production Key" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddApiKeyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddApiKeyOpen(false)}>
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={addWebhookOpen} onOpenChange={setAddWebhookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>
              Configure a webhook endpoint to receive events
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input placeholder="https://api.example.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="space-y-2">
                {["message.sent", "message.delivered", "message.failed", "contact.opted_in", "contact.opted_out", "campaign.completed"].map((event) => (
                  <div key={event} className="flex items-center gap-2">
                    <input type="checkbox" id={event} />
                    <label htmlFor={event} className="text-sm font-mono">{event}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWebhookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddWebhookOpen(false)}>
              Add Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Settings,
  Users,
  Webhook,
  Database,
  MoreHorizontal,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  ExternalLink,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const demoServices = [
  {
    id: "svc-1",
    name: "Default Service",
    environment: "Production",
    isDefault: true,
    webhooksConfigured: true,
    createdAt: "2024-01-01",
  },
  {
    id: "svc-2",
    name: "Development",
    environment: "Development",
    isDefault: false,
    webhooksConfigured: false,
    createdAt: "2024-01-10",
  },
];

const demoTeamMembers = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
  },
  {
    id: "u2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
  },
  {
    id: "u3",
    name: "Bob Agent",
    email: "bob@example.com",
    role: "Agent",
  },
];

export const ConversationsSettings = () => {
  const { toast } = useToast();
  const [showSecret, setShowSecret] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const signingSecret = "whsec_1234567890abcdef";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold">Conversations Settings</h2>
        <p className="text-muted-foreground">
          Manage services, team access, webhooks, and data retention
        </p>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-1.5 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <TabsTrigger value="services" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <Users className="h-4 w-4" />
            Team & Roles
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="retention" className="gap-2 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200">
            <Database className="h-4 w-4" />
            Data Retention
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle>Conversation Services</CardTitle>
                    <CardDescription>
                      Services are top-level containers for conversations and can be configured with webhooks
                    </CardDescription>
                  </div>
                </div>
                <Button className="gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 rounded-full shadow-md">
                  <Plus className="h-4 w-4" />
                  New Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Service Name</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Webhooks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          {service.isDefault && (
                            <Badge variant="secondary" className="rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30 shadow-sm">Default</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            service.environment === "Production"
                              ? "default"
                              : "outline"
                          }
                          className={`rounded-full shadow-sm ${service.environment === "Production" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0" : "border-border"}`}
                        >
                          {service.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.webhooksConfigured ? (
                          <Badge variant="secondary" className="gap-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
                            <Webhook className="h-3 w-3" />
                            Configured
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Not configured</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {service.createdAt}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedService(service.id)}
                          className="rounded-lg hover:bg-muted"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Service Detail Modal */}
          <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
            <DialogContent className="max-w-2xl rounded-2xl">
              <DialogHeader>
                <DialogTitle>Service Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input defaultValue="Default Service" className="rounded-xl bg-muted/30" />
                </div>

                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger className="rounded-xl bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="development" className="rounded-lg">Development</SelectItem>
                      <SelectItem value="staging" className="rounded-lg">Staging</SelectItem>
                      <SelectItem value="production" className="rounded-lg">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Service-Level Webhooks</Label>
                  <div className="p-4 border border-border rounded-xl bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">https://api.example.com/conversations</span>
                      <Badge className="rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">Active</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px] rounded-lg border-border">onConversationAdded</Badge>
                      <Badge variant="outline" className="text-[10px] rounded-lg border-border">onMessageAdded</Badge>
                      <Badge variant="outline" className="text-[10px] rounded-lg border-border">onParticipantAdded</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 rounded-xl hover:bg-muted">
                    <Plus className="h-4 w-4" />
                    Add Webhook
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Event Subscriptions</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      "onConversationAdded",
                      "onConversationUpdated",
                      "onConversationRemoved",
                      "onMessageAdded",
                      "onMessageUpdated",
                      "onMessageRemoved",
                      "onParticipantAdded",
                      "onParticipantUpdated",
                      "onParticipantRemoved",
                    ].map((event) => (
                      <div key={event} className="flex items-center gap-2">
                        <input type="checkbox" id={event} defaultChecked className="rounded" />
                        <label htmlFor={event}>{event}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="gap-2 rounded-xl hover:bg-muted">
                  <Send className="h-4 w-4" />
                  Test Webhook
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedService(null)} className="rounded-xl">
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white border-0 rounded-full shadow-md">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Team & Roles Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage who has access to conversations
                    </CardDescription>
                  </div>
                </div>
                <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-full shadow-md">
                      <Plus className="h-4 w-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input placeholder="colleague@example.com" className="rounded-xl bg-muted/30" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select defaultValue="agent">
                          <SelectTrigger className="rounded-xl bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                            <SelectItem value="agent" className="rounded-lg">Agent</SelectItem>
                            <SelectItem value="readonly" className="rounded-lg">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteModal(false)} className="rounded-xl">
                        Cancel
                      </Button>
                      <Button onClick={() => setShowInviteModal(false)} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-full shadow-md">
                        Send Invite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoTeamMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-[120px] rounded-xl bg-muted/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="owner" className="rounded-lg">Owner</SelectItem>
                            <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                            <SelectItem value="agent" className="rounded-lg">Agent</SelectItem>
                            <SelectItem value="readonly" className="rounded-lg">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="icon" className="text-destructive rounded-lg hover:bg-destructive/10">
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

          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Overview of what each role can do</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Permission</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Read Only</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { perm: "View conversations", owner: true, admin: true, agent: true, readonly: true },
                    { perm: "Reply to conversations", owner: true, admin: true, agent: true, readonly: false },
                    { perm: "Add notes", owner: true, admin: true, agent: true, readonly: false },
                    { perm: "Assign conversations", owner: true, admin: true, agent: false, readonly: false },
                    { perm: "Manage services", owner: true, admin: true, agent: false, readonly: false },
                    { perm: "Configure webhooks", owner: true, admin: true, agent: false, readonly: false },
                    { perm: "Manage team", owner: true, admin: false, agent: false, readonly: false },
                    { perm: "Export data", owner: true, admin: true, agent: false, readonly: true },
                  ].map((row) => (
                    <TableRow key={row.perm} className="hover:bg-muted/50">
                      <TableCell>{row.perm}</TableCell>
                      <TableCell className={row.owner ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>{row.owner ? "✓" : "—"}</TableCell>
                      <TableCell className={row.admin ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>{row.admin ? "✓" : "—"}</TableCell>
                      <TableCell className={row.agent ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>{row.agent ? "✓" : "—"}</TableCell>
                      <TableCell className={row.readonly ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-muted-foreground"}>{row.readonly ? "✓" : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <Webhook className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle>Webhook Endpoint</CardTitle>
                  <CardDescription>
                    Your inbound webhook endpoint base URL
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value="https://api.reseau.app/webhooks/conversations"
                    readOnly
                    className="font-mono text-sm rounded-xl bg-muted/30"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      copyToClipboard(
                        "https://api.reseau.app/webhooks/conversations",
                        "Endpoint URL"
                      )
                    }
                    className="rounded-xl hover:bg-muted"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Signing Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={showSecret ? signingSecret : "••••••••••••••••"}
                    readOnly
                    className="font-mono text-sm rounded-xl bg-muted/30"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
                    className="rounded-xl hover:bg-muted"
                  >
                    {showSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(signingSecret, "Signing secret")}
                    className="rounded-xl hover:bg-muted"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10 hover:text-rose-600 hover:border-rose-500/30">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook payloads
                </p>
              </div>

              <Button variant="outline" className="gap-2 rounded-xl hover:bg-muted">
                <ExternalLink className="h-4 w-4" />
                View Webhook Delivery Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                  <Database className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <CardTitle>Data Retention Policies</CardTitle>
                  <CardDescription>
                    Configure how long conversation data is stored
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Conversations</Label>
                <Select defaultValue="forever">
                  <SelectTrigger className="rounded-xl bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
                    <SelectItem value="90d" className="rounded-lg">90 days</SelectItem>
                    <SelectItem value="1y" className="rounded-lg">1 year</SelectItem>
                    <SelectItem value="forever" className="rounded-lg">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Messages</Label>
                <Select defaultValue="forever">
                  <SelectTrigger className="rounded-xl bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
                    <SelectItem value="90d" className="rounded-lg">90 days</SelectItem>
                    <SelectItem value="1y" className="rounded-lg">1 year</SelectItem>
                    <SelectItem value="forever" className="rounded-lg">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Media Attachments</Label>
                <Select defaultValue="90d">
                  <SelectTrigger className="rounded-xl bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
                    <SelectItem value="90d" className="rounded-lg">90 days</SelectItem>
                    <SelectItem value="1y" className="rounded-lg">1 year</SelectItem>
                    <SelectItem value="forever" className="rounded-lg">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audit Logs</Label>
                <Select defaultValue="1y">
                  <SelectTrigger className="rounded-xl bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
                    <SelectItem value="90d" className="rounded-lg">90 days</SelectItem>
                    <SelectItem value="1y" className="rounded-lg">1 year</SelectItem>
                    <SelectItem value="forever" className="rounded-lg">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 rounded-full shadow-md">Save Retention Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

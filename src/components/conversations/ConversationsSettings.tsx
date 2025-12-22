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
        <TabsList className="rounded-xl">
          <TabsTrigger value="services" className="gap-2 rounded-xl">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2 rounded-xl">
            <Users className="h-4 w-4" />
            Team & Roles
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2 rounded-xl">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="retention" className="gap-2 rounded-xl">
            <Database className="h-4 w-4" />
            Data Retention
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversation Services</CardTitle>
                  <CardDescription>
                    Services are top-level containers for conversations and can be configured with webhooks
                  </CardDescription>
                </div>
                <Button className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
                  <Plus className="h-4 w-4" />
                  New Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Webhooks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          {service.isDefault && (
                            <Badge variant="secondary">Default</Badge>
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
                        >
                          {service.environment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {service.webhooksConfigured ? (
                          <Badge variant="secondary" className="gap-1">
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Service Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input defaultValue="Default Service" />
                </div>

                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Service-Level Webhooks</Label>
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">https://api.example.com/conversations</span>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-[10px]">onConversationAdded</Badge>
                      <Badge variant="outline" className="text-[10px]">onMessageAdded</Badge>
                      <Badge variant="outline" className="text-[10px]">onParticipantAdded</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
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

                <Button variant="outline" className="gap-2">
                  <Send className="h-4 w-4" />
                  Test Webhook
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedService(null)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Team & Roles Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage who has access to conversations
                  </CardDescription>
                </div>
                <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input placeholder="colleague@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select defaultValue="agent">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="readonly">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowInviteModal(false)}>
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
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoTeamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Select defaultValue={member.role.toLowerCase()}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                            <SelectItem value="readonly">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
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

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Overview of what each role can do</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableRow key={row.perm}>
                      <TableCell>{row.perm}</TableCell>
                      <TableCell>{row.owner ? "✓" : "—"}</TableCell>
                      <TableCell>{row.admin ? "✓" : "—"}</TableCell>
                      <TableCell>{row.agent ? "✓" : "—"}</TableCell>
                      <TableCell>{row.readonly ? "✓" : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoint</CardTitle>
              <CardDescription>
                Your inbound webhook endpoint base URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value="https://api.reseau.app/webhooks/conversations"
                    readOnly
                    className="font-mono text-sm"
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
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
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
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this secret to verify webhook payloads
                </p>
              </div>

              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Webhook Delivery Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>
                Configure how long conversation data is stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Conversations</Label>
                <Select defaultValue="forever">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Messages</Label>
                <Select defaultValue="forever">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Media Attachments</Label>
                <Select defaultValue="90d">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audit Logs</Label>
                <Select defaultValue="1y">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save Retention Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

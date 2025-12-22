import { useState } from "react";
import {
  Building2,
  Users,
  Webhook,
  Database,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teamMembers = [
  { id: "1", name: "John Admin", email: "john@company.com", role: "Owner", status: "active" },
  { id: "2", name: "Jane Manager", email: "jane@company.com", role: "Admin", status: "active" },
  { id: "3", name: "Bob Agent", email: "bob@company.com", role: "Agent", status: "active" },
  { id: "4", name: "Alice Viewer", email: "alice@company.com", role: "ReadOnly", status: "active" },
];

const roleColors: Record<string, string> = {
  Owner: "bg-purple-500/10 text-purple-500",
  Admin: "bg-blue-500/10 text-blue-500",
  Agent: "bg-green-500/10 text-green-500",
  ReadOnly: "bg-muted text-muted-foreground",
};

export function CallsSettings() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [showSigningSecret, setShowSigningSecret] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage workspace and team settings</p>
      </div>

      <Tabs defaultValue="workspace">
        <TabsList className="rounded-xl">
          <TabsTrigger value="workspace" className="gap-2 rounded-xl">
            <Building2 className="h-4 w-4" />
            Workspace
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

        <TabsContent value="workspace" className="space-y-4 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>Basic workspace configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Workspace Name</Label>
                <Input defaultValue="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Country</Label>
                  <Select defaultValue="US">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="America/Los_Angeles">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                            <SelectItem value="Agent">Agent</SelectItem>
                            <SelectItem value="ReadOnly">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
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

          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle className="text-base">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div className="font-medium">Permission</div>
                <div className="text-center">Owner</div>
                <div className="text-center">Admin</div>
                <div className="text-center">Agent</div>
                <div className="text-center">ReadOnly</div>

                <div>View calls & recordings</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>

                <div>Use Dialer</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-muted-foreground">-</div>

                <div>Manage numbers & flows</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>

                <div>Manage compliance</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>

                <div>Manage team</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>

                <div>Rotate credentials</div>
                <div className="text-center text-green-500">✓</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>
                <div className="text-center text-muted-foreground">-</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500/20 to-teal-600/20 flex items-center justify-center">
                  <Webhook className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <CardTitle>Webhook Endpoint</CardTitle>
                  <CardDescription>Your inbound webhook base URL</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Base URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="https://hooks.reseau.app/v1/workspace/abc123"
                    className="font-mono rounded-xl bg-muted/30"
                  />
                  <Button variant="outline" size="icon" className="rounded-xl hover:bg-teal-500/10 hover:text-teal-600 hover:border-teal-500/30">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Signing Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showSigningSecret ? "text" : "password"}
                    readOnly
                    value="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="font-mono rounded-xl bg-muted/30"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSigningSecret(!showSigningSecret)}
                    className="rounded-xl hover:bg-teal-500/10 hover:text-teal-600 hover:border-teal-500/30"
                  >
                    {showSigningSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl hover:bg-teal-500/10 hover:text-teal-600 hover:border-teal-500/30">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="gap-2 rounded-xl hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/30">
                <RefreshCw className="h-4 w-4" />
                Rotate Secret
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4 mt-4">
          <Card className="rounded-3xl shadow-soft border-0 bg-card">
            <CardHeader>
              <CardTitle>Data Retention Policies</CardTitle>
              <CardDescription>Configure how long data is retained</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Call Logs</Label>
                <Select defaultValue="365">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recordings</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transcripts</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">Save Changes</Button>
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
              Send an invitation to join your workspace
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
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="ReadOnly">Read Only</SelectItem>
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
    </div>
  );
}

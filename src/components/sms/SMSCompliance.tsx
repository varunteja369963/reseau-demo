import { useState } from "react";
import {
  Shield,
  Search,
  Download,
  Plus,
  Trash2,
  Clock,
  Hash,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
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
import { Separator } from "@/components/ui/separator";

const consentLogs = [
  { id: "1", time: "2024-01-16 10:30 AM", contact: "John Smith", phone: "+1 555-0123", event: "opt-in", source: "Website signup" },
  { id: "2", time: "2024-01-16 10:15 AM", contact: "Mike Wilson", phone: "+1 555-0789", event: "opt-out", source: "STOP keyword" },
  { id: "3", time: "2024-01-16 9:45 AM", contact: "Sarah Johnson", phone: "+1 555-0456", event: "help", source: "HELP keyword" },
  { id: "4", time: "2024-01-16 9:30 AM", contact: "Emily Davis", phone: "+1 555-0321", event: "opt-in", source: "Import" },
  { id: "5", time: "2024-01-16 9:00 AM", contact: "Chris Brown", phone: "+1 555-0654", event: "start", source: "START keyword" },
];

const suppressionList = [
  { id: "1", phone: "+1 555-0789", reason: "User opt-out", addedDate: "2024-01-16", source: "STOP keyword" },
  { id: "2", phone: "+1 555-0999", reason: "Bounced", addedDate: "2024-01-15", source: "System" },
  { id: "3", phone: "+1 555-0888", reason: "Complaint", addedDate: "2024-01-14", source: "Carrier" },
  { id: "4", phone: "+1 555-0777", reason: "Manual suppression", addedDate: "2024-01-12", source: "Admin" },
];

const keywords = [
  { keyword: "STOP", action: "Opt-out", response: "You have been unsubscribed. Reply START to re-subscribe.", scope: "Organization" },
  { keyword: "UNSUBSCRIBE", action: "Opt-out", response: "You have been unsubscribed. Reply START to re-subscribe.", scope: "Organization" },
  { keyword: "HELP", action: "Help", response: "For support, contact us at support@example.com or call 1-800-XXX-XXXX", scope: "Organization" },
  { keyword: "START", action: "Opt-in", response: "Welcome back! You are now subscribed to our messages.", scope: "Organization" },
  { keyword: "YES", action: "Custom", response: "Thank you for confirming!", scope: "Campaign" },
];

const auditLog = [
  { id: "1", who: "John Admin", action: "Updated quiet hours", entity: "Sending Rules", time: "2024-01-16 10:00 AM" },
  { id: "2", who: "Jane Manager", action: "Added suppression", entity: "+1 555-0777", time: "2024-01-15 3:00 PM" },
  { id: "3", who: "System", action: "Auto opt-out", entity: "+1 555-0789", time: "2024-01-16 10:15 AM" },
  { id: "4", who: "John Admin", action: "Modified keyword", entity: "HELP response", time: "2024-01-14 2:00 PM" },
];

const eventColors: Record<string, string> = {
  "opt-in": "bg-green-500/10 text-green-500",
  "opt-out": "bg-red-500/10 text-red-500",
  "help": "bg-blue-500/10 text-blue-500",
  "start": "bg-green-500/10 text-green-500",
};

export function SMSCompliance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [addSuppressionOpen, setAddSuppressionOpen] = useState(false);
  const [addKeywordOpen, setAddKeywordOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Center</h1>
          <p className="text-muted-foreground">Manage consent, keywords, and sending rules</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0.4%</p>
                <p className="text-sm text-muted-foreground">Opt-out rate (7d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Blocked by compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm text-muted-foreground">Quiet hours (9PM-8AM)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Active</p>
                <p className="text-sm text-muted-foreground">Frequency cap (3/day)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="consent">
        <TabsList>
          <TabsTrigger value="consent">Consent Logs</TabsTrigger>
          <TabsTrigger value="suppression">Suppression List</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Settings</TabsTrigger>
          <TabsTrigger value="rules">Sending Rules</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone or contact..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground">{log.time}</TableCell>
                      <TableCell className="font-medium">{log.contact}</TableCell>
                      <TableCell>{log.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={eventColors[log.event]}>
                          {log.event}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.source}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppression" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by phone..." className="pl-9" />
            </div>
            <Button onClick={() => setAddSuppressionOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add to Suppression
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Added Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppressionList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.phone}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell className="text-muted-foreground">{item.addedDate}</TableCell>
                      <TableCell className="text-muted-foreground">{item.source}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4 mt-4">
          <div className="flex items-center justify-end">
            <Button onClick={() => setAddKeywordOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Keyword
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Response Template</TableHead>
                    <TableHead>Scope</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keywords.map((kw, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono font-medium">{kw.keyword}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{kw.action}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {kw.response}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{kw.scope}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quiet Hours
                </CardTitle>
                <CardDescription>
                  Messages won't be sent during these hours in recipient's local time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Quiet Hours</Label>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select defaultValue="21:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select defaultValue="08:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                            {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Frequency Caps
                </CardTitle>
                <CardDescription>
                  Limit how often contacts receive messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Frequency Caps</Label>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max per Day</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max per Week</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Default Footer Text
                </CardTitle>
                <CardDescription>
                  This text is automatically appended to all messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  defaultValue="Reply STOP to unsubscribe. HELP for help."
                  className="min-h-[100px]"
                />
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Who</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.who}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-muted-foreground">{log.entity}</TableCell>
                      <TableCell className="text-muted-foreground">{log.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Suppression Dialog */}
      <Dialog open={addSuppressionOpen} onOpenChange={setAddSuppressionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Suppression List</DialogTitle>
            <DialogDescription>
              Add a phone number to prevent messaging
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+1 555 123 4567" />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-request">User request</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="bounce">Bounced</SelectItem>
                  <SelectItem value="manual">Manual suppression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSuppressionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddSuppressionOpen(false)}>
              Add to Suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Keyword Dialog */}
      <Dialog open={addKeywordOpen} onOpenChange={setAddKeywordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Keyword</DialogTitle>
            <DialogDescription>
              Configure a keyword response
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Keyword</Label>
              <Input placeholder="e.g., INFO" />
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opt-out">Opt-out</SelectItem>
                  <SelectItem value="opt-in">Opt-in (re-subscribe)</SelectItem>
                  <SelectItem value="help">Help response</SelectItem>
                  <SelectItem value="custom">Custom response</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Response Template</Label>
              <Textarea placeholder="Auto-reply message..." />
            </div>
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="org">Organization-wide</SelectItem>
                  <SelectItem value="sender">Specific sender</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddKeywordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddKeywordOpen(false)}>
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Edit,
  Trash2,
  Workflow,
  Clock,
  Users,
  CheckCircle2,
  Zap,
  MessageSquare,
  Tag,
  ListTree,
  GitBranch,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const automations = [
  {
    id: "1",
    name: "Welcome Series",
    status: "active",
    trigger: "Contact joins list",
    activeRuns: 234,
    completed: 1250,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Re-engagement Campaign",
    status: "active",
    trigger: "No activity in 30 days",
    activeRuns: 89,
    completed: 456,
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Appointment Reminder",
    status: "paused",
    trigger: "Date-based trigger",
    activeRuns: 0,
    completed: 2100,
    lastUpdated: "2024-01-12",
  },
  {
    id: "4",
    name: "Keyword Response - HELP",
    status: "active",
    trigger: "Inbound message contains keyword",
    activeRuns: 12,
    completed: 890,
    lastUpdated: "2024-01-10",
  },
  {
    id: "5",
    name: "Order Confirmation",
    status: "draft",
    trigger: "Webhook event",
    activeRuns: 0,
    completed: 0,
    lastUpdated: "2024-01-16",
  },
];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-teal-500/10 text-teal-600",
  paused: "bg-amber-500/10 text-amber-600",
};

const nodeTypes = [
  { id: "trigger-list", label: "Contact joins list", icon: ListTree, category: "trigger" },
  { id: "trigger-optin", label: "Contact opted-in", icon: CheckCircle2, category: "trigger" },
  { id: "trigger-click", label: "Link clicked", icon: Zap, category: "trigger" },
  { id: "trigger-keyword", label: "Inbound message keyword", icon: MessageSquare, category: "trigger" },
  { id: "trigger-webhook", label: "Webhook event", icon: Workflow, category: "trigger" },
  { id: "trigger-date", label: "Date-based trigger", icon: Clock, category: "trigger" },
  { id: "action-sms", label: "Send SMS", icon: MessageSquare, category: "action" },
  { id: "action-wait", label: "Wait", icon: Clock, category: "action" },
  { id: "action-ifelse", label: "If/Else", icon: GitBranch, category: "action" },
  { id: "action-tag", label: "Add/Remove tag", icon: Tag, category: "action" },
  { id: "action-list", label: "Add/Remove from list", icon: ListTree, category: "action" },
];

export function SMSAutomations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const filteredAutomations = automations.filter((automation) =>
    automation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automations</h1>
          <p className="text-muted-foreground">Create automated SMS journeys and workflows</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
          <Plus className="h-4 w-4" />
          New Automation
        </Button>
      </div>

      {/* Search */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search automations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl border-0 bg-muted/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Automations Table */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead className="text-right">Active Runs</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAutomations.map((automation) => (
                <TableRow key={automation.id} className="border-b border-border/30">
                  <TableCell className="font-medium">{automation.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors[automation.status]} rounded-lg`}>
                      {automation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{automation.trigger}</TableCell>
                  <TableCell className="text-right">{automation.activeRuns}</TableCell>
                  <TableCell className="text-right">{automation.completed.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{automation.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setBuilderOpen(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {automation.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Disable
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Enable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
            <DialogDescription>
              Set up a new automated workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Enter automation name" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe what this automation does" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="list">Contact joins list</SelectItem>
                  <SelectItem value="optin">Contact opted-in</SelectItem>
                  <SelectItem value="click">Link clicked</SelectItem>
                  <SelectItem value="keyword">Inbound message keyword</SelectItem>
                  <SelectItem value="webhook">Webhook event</SelectItem>
                  <SelectItem value="date">Date-based trigger</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={() => { setCreateDialogOpen(false); setBuilderOpen(true); }} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">
              Create & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flow Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-5xl h-[80vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Automation Builder</DialogTitle>
            <DialogDescription>
              Design your automation flow
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 gap-4 h-full min-h-0">
            {/* Node Palette */}
            <div className="w-64 border-0 bg-muted/30 rounded-2xl p-4 overflow-y-auto">
              <p className="font-medium mb-3 text-foreground">Triggers</p>
              <div className="space-y-2 mb-4">
                {nodeTypes.filter(n => n.category === "trigger").map((node) => {
                  const Icon = node.icon;
                  return (
                    <Card 
                      key={node.id} 
                      className="cursor-pointer hover:border-teal-500 transition-colors rounded-xl border-0 bg-card shadow-soft"
                      draggable
                    >
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-teal-500" />
                        </div>
                        <span className="text-sm">{node.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <p className="font-medium mb-3 text-foreground">Actions</p>
              <div className="space-y-2">
                {nodeTypes.filter(n => n.category === "action").map((node) => {
                  const Icon = node.icon;
                  return (
                    <Card 
                      key={node.id} 
                      className="cursor-pointer hover:border-purple-500 transition-colors rounded-xl border-0 bg-card shadow-soft"
                      draggable
                    >
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="text-sm">{node.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 border-0 rounded-2xl bg-muted/30 p-4 overflow-auto">
              <div className="flex flex-col items-center gap-4 min-h-full">
                {/* Start Node */}
                <Card className="w-48 border-teal-500/50 rounded-xl shadow-soft bg-card">
                  <CardContent className="p-4 text-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center mx-auto mb-2">
                      <Zap className="h-5 w-5 text-teal-500" />
                    </div>
                    <p className="font-medium">Trigger</p>
                    <p className="text-xs text-muted-foreground">Contact joins list</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-gradient-to-b from-teal-500/50 to-purple-500/50" />
                
                {/* Action Node */}
                <Card className="w-48 rounded-xl shadow-soft border-0 bg-card">
                  <CardContent className="p-4 text-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="font-medium">Wait</p>
                    <p className="text-xs text-muted-foreground">1 hour</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-gradient-to-b from-purple-500/50 to-teal-500/50" />
                
                {/* SMS Node */}
                <Card className="w-48 rounded-xl shadow-soft border-0 bg-card">
                  <CardContent className="p-4 text-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                    </div>
                    <p className="font-medium">Send SMS</p>
                    <p className="text-xs text-muted-foreground">Welcome message</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-border" />
                
                {/* Add Node Button */}
                <Button variant="outline" size="sm" className="rounded-full border-dashed border-2 hover:border-teal-500 hover:text-teal-500">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Config Panel */}
            <div className="w-72 border-0 bg-muted/30 rounded-2xl p-4 overflow-y-auto">
              <p className="font-medium mb-4 text-foreground">Node Configuration</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl border-0 bg-card">
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="welcome">Welcome Template</SelectItem>
                      <SelectItem value="promo">Promo Template</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sender</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl border-0 bg-card">
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="+15550100">+1 555-0100</SelectItem>
                      <SelectItem value="+15550200">+1 555-0200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Card className="bg-amber-500/10 border-0 rounded-xl">
                  <CardContent className="p-3">
                    <p className="text-xs text-amber-600">
                      <strong>Note:</strong> Messages will be blocked if contact has opted out.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl">Test with Contact</Button>
            <Button variant="outline" className="rounded-xl">View Runs</Button>
            <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl">Save & Enable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
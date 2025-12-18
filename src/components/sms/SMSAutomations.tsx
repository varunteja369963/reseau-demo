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
  active: "bg-green-500/10 text-green-500",
  paused: "bg-orange-500/10 text-orange-500",
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
          <h1 className="text-2xl font-bold">Automations</h1>
          <p className="text-muted-foreground">Create automated SMS journeys and workflows</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Automation
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search automations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Automations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={automation.id}>
                  <TableCell className="font-medium">{automation.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[automation.status]}>
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
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
            <DialogDescription>
              Set up a new automated workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="Enter automation name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe what this automation does" />
            </div>
            <div className="space-y-2">
              <Label>Trigger Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
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
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setCreateDialogOpen(false); setBuilderOpen(true); }}>
              Create & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flow Builder Dialog */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Automation Builder</DialogTitle>
            <DialogDescription>
              Design your automation flow
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-1 gap-4 h-full min-h-0">
            {/* Node Palette */}
            <div className="w-64 border rounded-lg p-4 overflow-y-auto">
              <p className="font-medium mb-3">Triggers</p>
              <div className="space-y-2 mb-4">
                {nodeTypes.filter(n => n.category === "trigger").map((node) => {
                  const Icon = node.icon;
                  return (
                    <Card 
                      key={node.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      draggable
                    >
                      <CardContent className="p-3 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm">{node.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <p className="font-medium mb-3">Actions</p>
              <div className="space-y-2">
                {nodeTypes.filter(n => n.category === "action").map((node) => {
                  const Icon = node.icon;
                  return (
                    <Card 
                      key={node.id} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      draggable
                    >
                      <CardContent className="p-3 flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{node.label}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 border rounded-lg bg-muted/30 p-4 overflow-auto">
              <div className="flex flex-col items-center gap-4 min-h-full">
                {/* Start Node */}
                <Card className="w-48 border-primary">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Trigger</p>
                    <p className="text-xs text-muted-foreground">Contact joins list</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-border" />
                
                {/* Action Node */}
                <Card className="w-48">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Wait</p>
                    <p className="text-xs text-muted-foreground">1 hour</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-border" />
                
                {/* SMS Node */}
                <Card className="w-48">
                  <CardContent className="p-4 text-center">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Send SMS</p>
                    <p className="text-xs text-muted-foreground">Welcome message</p>
                  </CardContent>
                </Card>
                
                <div className="h-8 w-0.5 bg-border" />
                
                {/* Add Node Button */}
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Config Panel */}
            <div className="w-72 border rounded-lg p-4 overflow-y-auto">
              <p className="font-medium mb-4">Node Configuration</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Template</SelectItem>
                      <SelectItem value="promo">Promo Template</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+15550100">+1 555-0100</SelectItem>
                      <SelectItem value="+15550200">+1 555-0200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> Messages will be blocked if contact has opted out.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Test with Contact</Button>
            <Button variant="outline">View Runs</Button>
            <Button>Save & Enable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

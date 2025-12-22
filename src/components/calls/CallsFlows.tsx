import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  GitBranch,
  PhoneForwarded,
  Voicemail,
  Clock,
  Users,
  Phone,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const callFlows = [
  { id: "1", name: "Main IVR", type: "ivr", active: true, numbersAssigned: 3, lastPublished: "2024-01-15 10:00 AM" },
  { id: "2", name: "Support Line", type: "forwarding", active: true, numbersAssigned: 2, lastPublished: "2024-01-14 3:00 PM" },
  { id: "3", name: "Sales", type: "queue", active: true, numbersAssigned: 1, lastPublished: "2024-01-12 9:00 AM" },
  { id: "4", name: "After Hours", type: "office-hours", active: true, numbersAssigned: 5, lastPublished: "2024-01-10 5:00 PM" },
  { id: "5", name: "Voicemail Box", type: "voicemail", active: false, numbersAssigned: 0, lastPublished: null },
];

const typeIcons: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  forwarding: { icon: PhoneForwarded, label: "Forwarding", color: "bg-blue-500/10 text-blue-500" },
  ivr: { icon: GitBranch, label: "IVR", color: "bg-purple-500/10 text-purple-500" },
  voicemail: { icon: Voicemail, label: "Voicemail", color: "bg-green-500/10 text-green-500" },
  "office-hours": { icon: Clock, label: "Office Hours", color: "bg-orange-500/10 text-orange-500" },
  queue: { icon: Users, label: "Queue", color: "bg-cyan-500/10 text-cyan-500" },
};

const templates = [
  { id: "forwarding", name: "Forwarding", description: "Forward calls to one or more destinations", icon: PhoneForwarded },
  { id: "ivr", name: "IVR Menu", description: "Interactive voice menu with options", icon: GitBranch },
  { id: "voicemail", name: "Voicemail", description: "Record voicemail messages", icon: Voicemail },
  { id: "office-hours", name: "Office Hours", description: "Route based on business hours", icon: Clock },
  { id: "queue", name: "Simple Queue", description: "Hold callers in a queue", icon: Users },
];

export function CallsFlows() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const filteredFlows = callFlows.filter((flow) =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Call Flows</h1>
          <p className="text-muted-foreground">Create and manage inbound call routing</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
          <Plus className="h-4 w-4" />
          Create Flow
        </Button>
      </div>

      {/* Search */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Flows Table */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Numbers Assigned</TableHead>
                <TableHead>Last Published</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlows.map((flow) => {
                const TypeIcon = typeIcons[flow.type]?.icon || GitBranch;
                return (
                  <TableRow key={flow.id}>
                    <TableCell className="font-medium">{flow.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={typeIcons[flow.type]?.color}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeIcons[flow.type]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={flow.active} />
                    </TableCell>
                    <TableCell className="text-right">{flow.numbersAssigned}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {flow.lastPublished || "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditorOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="h-4 w-4 mr-2" />
                            Publish
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Flow Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Call Flow</DialogTitle>
            <DialogDescription>
              Choose a template to get started
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className={`cursor-pointer hover:border-primary transition-colors ${
                    selectedTemplate === template.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedTemplate}
              onClick={() => {
                setCreateDialogOpen(false);
                setEditorOpen(true);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flow Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Edit Call Flow</DialogTitle>
            <DialogDescription>Configure your call flow settings</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="settings" className="flex-1">
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="routing">Routing</TabsTrigger>
              <TabsTrigger value="fallback">Fallback</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Flow Name</Label>
                <Input defaultValue="Main IVR" />
              </div>
              <div className="space-y-2">
                <Label>Greeting</Label>
                <div className="space-y-2">
                  <Select defaultValue="tts">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tts">Text-to-Speech</SelectItem>
                      <SelectItem value="audio">Audio URL</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Enter greeting message..." defaultValue="Welcome to our company. Press 1 for sales, 2 for support, or 0 to speak with an operator." />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="routing" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Label>Menu Options</Label>
                {[
                  { digit: "1", action: "Forward", target: "+1 555-0100" },
                  { digit: "2", action: "Forward", target: "+1 555-0200" },
                  { digit: "0", action: "Forward", target: "+1 555-0300" },
                ].map((option, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="space-y-1">
                          <Label className="text-xs">Digit</Label>
                          <Input value={option.digit} className="w-16" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Action</Label>
                          <Select defaultValue={option.action.toLowerCase()}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="forward">Forward</SelectItem>
                              <SelectItem value="voicemail">Voicemail</SelectItem>
                              <SelectItem value="repeat">Repeat Menu</SelectItem>
                              <SelectItem value="hangup">Hang Up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-xs">Target</Label>
                          <Input defaultValue={option.target} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="fallback" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Invalid Input Retries</Label>
                <Input type="number" defaultValue="3" className="w-24" />
              </div>
              <div className="space-y-2">
                <Label>Fallback Action</Label>
                <Select defaultValue="voicemail">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voicemail">Send to Voicemail</SelectItem>
                    <SelectItem value="hangup">Hang Up</SelectItem>
                    <SelectItem value="forward">Forward to Backup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This flow is assigned to 3 numbers but has unpublished changes.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

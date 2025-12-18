import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Archive,
  Eye,
  Edit,
  Calendar,
  Users,
  Send,
  MousePointerClick,
  CheckCircle2,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SMSComplianceBanner } from "./shared/SMSComplianceBanner";

const campaigns = [
  {
    id: "1",
    name: "Summer Sale Announcement",
    type: "broadcast",
    status: "completed",
    audience: "All Subscribers",
    scheduled: "2024-01-15 10:00 AM",
    sender: "+1 555-0100",
    sent: 5420,
    delivered: 5380,
    clicks: 420,
    optouts: 3,
  },
  {
    id: "2",
    name: "Flash Deal Alert",
    type: "broadcast",
    status: "sending",
    audience: "VIP Customers",
    scheduled: "2024-01-16 2:00 PM",
    sender: "+1 555-0100",
    sent: 3200,
    delivered: 3150,
    clicks: 280,
    optouts: 2,
  },
  {
    id: "3",
    name: "New Product Launch",
    type: "scheduled",
    status: "scheduled",
    audience: "Product Interest",
    scheduled: "2024-01-18 9:00 AM",
    sender: "Marketing Pool",
    sent: 0,
    delivered: 0,
    clicks: 0,
    optouts: 0,
  },
  {
    id: "4",
    name: "Weekly Newsletter",
    type: "recurring",
    status: "completed",
    audience: "Newsletter List",
    scheduled: "2024-01-14 8:00 AM",
    sender: "+1 555-0100",
    sent: 8900,
    delivered: 8750,
    clicks: 534,
    optouts: 8,
  },
  {
    id: "5",
    name: "Appointment Reminder",
    type: "broadcast",
    status: "draft",
    audience: "Appointments Today",
    scheduled: "-",
    sender: "-",
    sent: 0,
    delivered: 0,
    clicks: 0,
    optouts: 0,
  },
  {
    id: "6",
    name: "A/B Test: Promo Copy",
    type: "ab-test",
    status: "paused",
    audience: "Test Segment",
    scheduled: "2024-01-17 11:00 AM",
    sender: "+1 555-0100",
    sent: 1000,
    delivered: 980,
    clicks: 85,
    optouts: 1,
  },
];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/10 text-blue-500",
  sending: "bg-yellow-500/10 text-yellow-500",
  paused: "bg-orange-500/10 text-orange-500",
  completed: "bg-green-500/10 text-green-500",
  failed: "bg-destructive/10 text-destructive",
};

const typeLabels: Record<string, string> = {
  broadcast: "Broadcast",
  scheduled: "Scheduled",
  recurring: "Recurring",
  "ab-test": "A/B Test",
  resend: "Resend",
};

export function SMSCampaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your SMS campaigns</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <SMSComplianceBanner />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sending">Sending</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="broadcast">Broadcast</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
                <SelectItem value="ab-test">A/B Test</SelectItem>
                <SelectItem value="resend">Resend</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Opt-outs</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{typeLabels[campaign.type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.audience}</TableCell>
                  <TableCell className="text-muted-foreground">{campaign.scheduled}</TableCell>
                  <TableCell className="text-muted-foreground">{campaign.sender}</TableCell>
                  <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{campaign.delivered.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{campaign.clicks}</TableCell>
                  <TableCell className="text-right">{campaign.optouts}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        {campaign.status === "draft" && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {(campaign.status === "sending" || campaign.status === "scheduled") && (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        {campaign.status === "paused" && (
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
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

      {/* Create Campaign Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Step {wizardStep} of 6: {wizardStep === 1 ? "Campaign Basics" : wizardStep === 2 ? "Audience" : wizardStep === 3 ? "Message" : wizardStep === 4 ? "Sender" : wizardStep === 5 ? "Schedule" : "Review"}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 py-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= wizardStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {wizardStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input placeholder="Enter campaign name" />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "broadcast", label: "Broadcast", desc: "Send immediately to all recipients" },
                    { value: "scheduled", label: "Scheduled", desc: "Send at a specific date/time" },
                    { value: "recurring", label: "Recurring", desc: "Send on a repeating schedule" },
                    { value: "ab-test", label: "A/B Test", desc: "Test different message variants" },
                  ].map((type) => (
                    <Card key={type.value} className="cursor-pointer hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-muted-foreground">{type.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose lists or segments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers</SelectItem>
                    <SelectItem value="vip">VIP Customers</SelectItem>
                    <SelectItem value="newsletter">Newsletter List</SelectItem>
                    <SelectItem value="product">Product Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exclusions</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="suppress" defaultChecked />
                    <label htmlFor="suppress" className="text-sm">Exclude suppression list</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="unsubscribed" defaultChecked disabled />
                    <label htmlFor="unsubscribed" className="text-sm text-muted-foreground">Exclude unsubscribed (always on)</label>
                  </div>
                </div>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Estimated Recipients</p>
                    <p className="text-2xl font-bold">5,420</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    View Sample
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Message Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or write custom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Write Custom Message</SelectItem>
                    <SelectItem value="promo">Promotional Template</SelectItem>
                    <SelectItem value="reminder">Reminder Template</SelectItem>
                    <SelectItem value="alert">Alert Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Message Body</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Insert Merge Tag</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>{"{{first_name}}"}</DropdownMenuItem>
                      <DropdownMenuItem>{"{{last_name}}"}</DropdownMenuItem>
                      <DropdownMenuItem>{"{{company_name}}"}</DropdownMenuItem>
                      <DropdownMenuItem>{"{{custom.field}}"}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea 
                  placeholder="Type your message here..."
                  className="min-h-[150px]"
                  defaultValue="Hi {{first_name}}! Don't miss our summer sale - up to 50% off everything! Shop now: https://shop.example.com/sale"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Characters: 125/160 • 1 segment</span>
                  <Badge variant="outline">GSM-7</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="tracking" defaultChecked />
                <label htmlFor="tracking" className="text-sm">Enable link tracking</label>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Compliance Footer (auto-added):</p>
                  <p className="text-sm">Reply STOP to unsubscribe. HELP for help.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Sender Mode</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="cursor-pointer hover:border-primary transition-colors border-primary">
                    <CardContent className="p-4">
                      <p className="font-medium">Single Sender</p>
                      <p className="text-sm text-muted-foreground">Use one phone number</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <p className="font-medium">Sending Pool</p>
                      <p className="text-sm text-muted-foreground">Distribute across numbers</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Sender ID</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+15550100">+1 555-0100 (Marketing)</SelectItem>
                    <SelectItem value="+15550200">+1 555-0200 (Alerts)</SelectItem>
                    <SelectItem value="pool">Marketing Pool (5 numbers)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Send Time</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 text-center">
                      <Send className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Send Now</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors border-primary">
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Schedule</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">Recurring</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-500">Quiet Hours Active</p>
                    <p className="text-sm text-muted-foreground">Messages won't be sent between 9 PM - 8 AM recipient local time.</p>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                <Label>Throttling</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Max messages per minute</Label>
                    <Input type="number" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Spread sends over (minutes)</Label>
                    <Input type="number" placeholder="60" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Audience</p>
                    <p className="font-medium">5,420 recipients</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Sender</p>
                    <p className="font-medium">+1 555-0100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Schedule</p>
                    <p className="font-medium">Jan 18, 2024 9:00 AM</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Message Preview</p>
                    <p className="font-medium text-sm truncate">Hi John! Don't miss our...</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <Label>Compliance Checklist</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="confirm1" />
                    <label htmlFor="confirm1" className="text-sm">I confirm recipients have opted in to receive messages</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="confirm2" />
                    <label htmlFor="confirm2" className="text-sm">Message includes opt-out language</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="confirm3" />
                    <label htmlFor="confirm3" className="text-sm">Quiet hours will be respected</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            {wizardStep > 1 && (
              <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)}>
                Back
              </Button>
            )}
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Save Draft
            </Button>
            {wizardStep < 6 ? (
              <Button onClick={() => setWizardStep(wizardStep + 1)}>
                Continue
              </Button>
            ) : (
              <Button>
                Launch Campaign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

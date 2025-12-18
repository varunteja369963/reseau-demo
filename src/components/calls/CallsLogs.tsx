import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  FileAudio,
  FileText,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Calendar,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const callLogs = [
  {
    id: "CA001",
    date: "2024-01-16 10:30 AM",
    direction: "inbound",
    from: "+1 555-9999",
    to: "+1 555-0100",
    number: "+1 555-0100",
    flow: "Main IVR",
    status: "completed",
    duration: "3:45",
    cost: "$0.0085",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "CA002",
    date: "2024-01-16 10:15 AM",
    direction: "outbound",
    from: "+1 555-0100",
    to: "+1 555-1234",
    number: "+1 555-0100",
    flow: null,
    status: "completed",
    duration: "1:23",
    cost: "$0.0140",
    hasRecording: true,
    hasTranscript: false,
  },
  {
    id: "CA003",
    date: "2024-01-16 9:50 AM",
    direction: "inbound",
    from: "+1 555-8888",
    to: "+1 555-0200",
    number: "+1 555-0200",
    flow: "Support Line",
    status: "missed",
    duration: "-",
    cost: "$0.00",
    hasRecording: false,
    hasTranscript: false,
  },
  {
    id: "CA004",
    date: "2024-01-16 9:30 AM",
    direction: "inbound",
    from: "+1 555-7777",
    to: "+1 555-0100",
    number: "+1 555-0100",
    flow: "Main IVR",
    status: "voicemail",
    duration: "0:45",
    cost: "$0.0085",
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: "CA005",
    date: "2024-01-16 9:00 AM",
    direction: "outbound",
    from: "+1 555-0200",
    to: "+1 555-4321",
    number: "+1 555-0200",
    flow: null,
    status: "failed",
    duration: "-",
    cost: "$0.00",
    hasRecording: false,
    hasTranscript: false,
  },
];

const directionIcons: Record<string, { icon: React.ElementType; color: string }> = {
  inbound: { icon: PhoneIncoming, color: "text-green-500" },
  outbound: { icon: PhoneOutgoing, color: "text-blue-500" },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: "bg-green-500/10 text-green-500", label: "Completed" },
  missed: { color: "bg-red-500/10 text-red-500", label: "Missed" },
  voicemail: { color: "bg-yellow-500/10 text-yellow-500", label: "Voicemail" },
  failed: { color: "bg-destructive/10 text-destructive", label: "Failed" },
  "in-progress": { color: "bg-blue-500/10 text-blue-500", label: "In Progress" },
};

export function CallsLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<typeof callLogs[0] | null>(null);

  const filteredLogs = callLogs.filter((call) => {
    const matchesSearch =
      call.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.from.includes(searchQuery) ||
      call.to.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || call.status === statusFilter;
    const matchesDirection = directionFilter === "all" || call.direction === directionFilter;
    return matchesSearch && matchesStatus && matchesDirection;
  });

  const openDetail = (call: typeof callLogs[0]) => {
    setSelectedCall(call);
    setDetailSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Calls</h1>
        <p className="text-muted-foreground">View call history and details</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calls Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((call) => {
                const DirIcon = directionIcons[call.direction]?.icon || Phone;
                return (
                  <TableRow key={call.id}>
                    <TableCell className="text-muted-foreground">{call.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DirIcon className={`h-4 w-4 ${directionIcons[call.direction]?.color}`} />
                        <span className="capitalize">{call.direction}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{call.from}</TableCell>
                    <TableCell className="font-mono">{call.to}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusConfig[call.status]?.color}>
                        {statusConfig[call.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell className="text-muted-foreground">{call.cost}</TableCell>
                    <TableCell>
                      {call.hasRecording && (
                        <Badge variant="outline" className="gap-1">
                          <FileAudio className="h-3 w-3" />
                          Yes
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetail(call)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {call.hasRecording && (
                            <DropdownMenuItem>
                              <FileAudio className="h-4 w-4 mr-2" />
                              Open Recording
                            </DropdownMenuItem>
                          )}
                          {call.hasTranscript && (
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Transcript
                            </DropdownMenuItem>
                          )}
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

      {/* Call Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Call Details</SheetTitle>
            <SheetDescription>SID: {selectedCall?.id}</SheetDescription>
          </SheetHeader>
          {selectedCall && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="recording" className="flex-1">Recording</TabsTrigger>
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="secondary" className={statusConfig[selectedCall.status]?.color}>
                      {statusConfig[selectedCall.status]?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedCall.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-mono">{selectedCall.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-mono">{selectedCall.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{selectedCall.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p>{selectedCall.cost}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Timeline</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Call initiated - {selectedCall.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Ringing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Completed - Duration: {selectedCall.duration}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="recording" className="mt-4">
                {selectedCall.hasRecording ? (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileAudio className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Recording</p>
                              <p className="text-sm text-muted-foreground">{selectedCall.duration}</p>
                            </div>
                          </div>
                          <Button variant="outline">Play</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileAudio className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recording available</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="transcript" className="mt-4">
                {selectedCall.hasTranscript ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        Ready
                      </Badge>
                      <Button variant="outline" size="sm">
                        Copy Transcript
                      </Button>
                    </div>
                    <ScrollArea className="h-[300px] border rounded-lg p-4">
                      <p className="text-sm">
                        [00:00] Welcome to our company. Press 1 for sales, 2 for support.<br /><br />
                        [00:05] *Caller pressed 1*<br /><br />
                        [00:07] Please hold while we connect you to our sales team.<br /><br />
                        [00:15] Sales Agent: Hello, how can I help you today?<br /><br />
                        [00:18] Caller: Hi, I'm interested in learning more about your services...
                      </p>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No transcript available</p>
                    <Button variant="outline">Generate Transcript</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

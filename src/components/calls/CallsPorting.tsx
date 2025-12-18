import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Upload,
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const portingRequests = [
  {
    id: "PORT001",
    numbers: ["+1 555-1111"],
    carrier: "AT&T",
    status: "pending",
    updated: "2024-01-16",
    businessName: "Acme Corp",
  },
  {
    id: "PORT002",
    numbers: ["+1 555-2222", "+1 555-2223"],
    carrier: "Verizon",
    status: "submitted",
    updated: "2024-01-15",
    businessName: "Acme Corp",
  },
  {
    id: "PORT003",
    numbers: ["+1 555-3333"],
    carrier: "T-Mobile",
    status: "approved",
    updated: "2024-01-14",
    businessName: "Acme Corp",
  },
  {
    id: "PORT004",
    numbers: ["+1 555-4444"],
    carrier: "Sprint",
    status: "completed",
    updated: "2024-01-10",
    businessName: "Acme Corp",
  },
  {
    id: "PORT005",
    numbers: ["+1 555-5555"],
    carrier: "AT&T",
    status: "rejected",
    updated: "2024-01-08",
    businessName: "Acme Corp",
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  draft: { color: "bg-muted text-muted-foreground", icon: FileText, label: "Draft" },
  submitted: { color: "bg-blue-500/10 text-blue-500", icon: Clock, label: "Submitted" },
  pending: { color: "bg-yellow-500/10 text-yellow-500", icon: AlertCircle, label: "Pending" },
  approved: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2, label: "Approved" },
  rejected: { color: "bg-red-500/10 text-red-500", icon: XCircle, label: "Rejected" },
  completed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2, label: "Completed" },
};

export function CallsPorting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof portingRequests[0] | null>(null);

  const filteredRequests = portingRequests.filter((req) =>
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.numbers.some((n) => n.includes(searchQuery)) ||
    req.carrier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetail = (request: typeof portingRequests[0]) => {
    setSelectedRequest(request);
    setDetailSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Porting</h1>
          <p className="text-muted-foreground">Track port-in requests</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Port Request
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Phone Number(s)</TableHead>
                <TableHead>Current Carrier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono">{request.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {request.numbers.map((num) => (
                          <span key={num} className="block font-mono text-sm">
                            {num}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{request.carrier}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusConfig[request.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[request.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{request.updated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDetail(request)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {request.status === "draft" && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Add Notes
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

      {/* Create Port Request Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Porting Request</DialogTitle>
            <DialogDescription>
              Request to port phone numbers to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number(s)</Label>
              <Textarea placeholder="Enter phone numbers, one per line" className="min-h-[100px] font-mono" />
              <p className="text-xs text-muted-foreground">
                Enter multiple numbers separated by new lines
              </p>
            </div>
            <div className="space-y-2">
              <Label>Business/Legal Name</Label>
              <Input placeholder="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label>Current Carrier</Label>
              <Input placeholder="e.g., AT&T, Verizon" />
            </div>
            <div className="space-y-2">
              <Label>Letter of Authorization (LOA)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Upload signed LOA document
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Select File
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes or special instructions..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Port Request Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Porting Request Details</SheetTitle>
            <SheetDescription>ID: {selectedRequest?.id}</SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className={statusConfig[selectedRequest.status].color}>
                  {statusConfig[selectedRequest.status].label}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Numbers</p>
                  <div className="mt-1 space-y-1">
                    {selectedRequest.numbers.map((num) => (
                      <p key={num} className="font-mono">{num}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Carrier</p>
                  <p className="font-medium">{selectedRequest.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Name</p>
                  <p className="font-medium">{selectedRequest.businessName}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <p className="font-medium mb-3">Timeline</p>
                <div className="space-y-3">
                  {[
                    { status: "Request created", date: "Jan 8, 2024 10:00 AM", done: true },
                    { status: "Documents uploaded", date: "Jan 8, 2024 10:30 AM", done: true },
                    { status: "Submitted to carrier", date: "Jan 9, 2024 9:00 AM", done: true },
                    { status: "Carrier processing", date: "Jan 10, 2024 2:00 PM", done: selectedRequest.status !== "submitted" },
                    { status: "Port completed", date: selectedRequest.status === "completed" ? "Jan 14, 2024 8:00 AM" : "Pending", done: selectedRequest.status === "completed" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${event.done ? "bg-primary" : "bg-muted"}`} />
                      <div>
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <p className="font-medium mb-3">Documents</p>
                <Card>
                  <CardContent className="p-3 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">LOA_signed.pdf</p>
                      <p className="text-xs text-muted-foreground">Uploaded Jan 8, 2024</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              <div>
                <p className="font-medium mb-3">Notes</p>
                <ScrollArea className="h-[150px] border rounded-lg p-3">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Jan 10, 2024 - System</p>
                      <p>Carrier confirmed receipt of porting request.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Jan 9, 2024 - John Admin</p>
                      <p>Submitted request to carrier. Expected completion: 5-7 business days.</p>
                    </div>
                  </div>
                </ScrollArea>
                <div className="mt-3">
                  <Textarea placeholder="Add a note..." className="min-h-[60px]" />
                  <Button size="sm" className="mt-2">Add Note</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

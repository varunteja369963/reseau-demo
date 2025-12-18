import { useState } from "react";
import {
  Search,
  Calendar,
  Eye,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const auditLogs = [
  {
    id: "1",
    timestamp: "2024-01-16 10:30 AM",
    user: "John Admin",
    action: "Updated Voice URL",
    entityType: "Phone Number",
    entityId: "+1 555-0100",
    before: { voice_url: "https://old-webhook.com/voice" },
    after: { voice_url: "https://new-webhook.com/voice" },
  },
  {
    id: "2",
    timestamp: "2024-01-16 10:00 AM",
    user: "Jane Manager",
    action: "Published flow",
    entityType: "Call Flow",
    entityId: "Main IVR",
    before: null,
    after: { status: "published", version: 3 },
  },
  {
    id: "3",
    timestamp: "2024-01-15 4:00 PM",
    user: "John Admin",
    action: "Released number",
    entityType: "Phone Number",
    entityId: "+1 555-9999",
    before: { number: "+1 555-9999", status: "active" },
    after: null,
  },
  {
    id: "4",
    timestamp: "2024-01-15 3:30 PM",
    user: "System",
    action: "Provisioned number",
    entityType: "Phone Number",
    entityId: "+1 555-0300",
    before: null,
    after: { number: "+1 555-0300", status: "active" },
  },
  {
    id: "5",
    timestamp: "2024-01-15 2:00 PM",
    user: "Jane Manager",
    action: "Created flow",
    entityType: "Call Flow",
    entityId: "Support Line",
    before: null,
    after: { name: "Support Line", type: "forwarding" },
  },
  {
    id: "6",
    timestamp: "2024-01-14 11:00 AM",
    user: "John Admin",
    action: "Rotated credentials",
    entityType: "Twilio Connection",
    entityId: "Primary",
    before: { last_rotated: "2024-01-01" },
    after: { last_rotated: "2024-01-14" },
  },
  {
    id: "7",
    timestamp: "2024-01-14 10:00 AM",
    user: "John Admin",
    action: "Invited member",
    entityType: "Team",
    entityId: "bob@company.com",
    before: null,
    after: { email: "bob@company.com", role: "Agent" },
  },
];

const actionColors: Record<string, string> = {
  "Updated Voice URL": "bg-blue-500/10 text-blue-500",
  "Published flow": "bg-green-500/10 text-green-500",
  "Released number": "bg-red-500/10 text-red-500",
  "Provisioned number": "bg-green-500/10 text-green-500",
  "Created flow": "bg-green-500/10 text-green-500",
  "Rotated credentials": "bg-yellow-500/10 text-yellow-500",
  "Invited member": "bg-purple-500/10 text-purple-500",
};

export function CallsAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [diffSheetOpen, setDiffSheetOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = userFilter === "all" || log.user === userFilter;
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity = entityFilter === "all" || log.entityType === entityFilter;
    return matchesSearch && matchesUser && matchesAction && matchesEntity;
  });

  const openDiff = (log: typeof auditLogs[0]) => {
    setSelectedLog(log);
    setDiffSheetOpen(true);
  };

  const uniqueUsers = [...new Set(auditLogs.map((l) => l.user))];
  const uniqueActions = [...new Set(auditLogs.map((l) => l.action))];
  const uniqueEntities = [...new Set(auditLogs.map((l) => l.entityType))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Track all changes made in your workspace</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {uniqueEntities.map((entity) => (
                  <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={actionColors[log.action] || ""}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDiff(log)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View diff
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diff Sheet */}
      <Sheet open={diffSheetOpen} onOpenChange={setDiffSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Change Details</SheetTitle>
            <SheetDescription>
              {selectedLog?.action} by {selectedLog?.user}
            </SheetDescription>
          </SheetHeader>
          {selectedLog && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entity Type</p>
                  <p className="font-medium">{selectedLog.entityType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entity ID</p>
                  <p className="font-mono">{selectedLog.entityId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2 text-red-500">Before</p>
                  <ScrollArea className="h-[150px] border rounded-lg">
                    <pre className="p-4 text-sm">
                      {selectedLog.before
                        ? JSON.stringify(selectedLog.before, null, 2)
                        : "null (new entity)"}
                    </pre>
                  </ScrollArea>
                </div>
                <div>
                  <p className="font-medium mb-2 text-green-500">After</p>
                  <ScrollArea className="h-[150px] border rounded-lg">
                    <pre className="p-4 text-sm">
                      {selectedLog.after
                        ? JSON.stringify(selectedLog.after, null, 2)
                        : "null (deleted)"}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

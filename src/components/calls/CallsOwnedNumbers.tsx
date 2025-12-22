import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Copy,
  Settings,
  Trash2,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { CallsTab } from "@/pages/Calls";

interface CallsOwnedNumbersProps {
  onNavigate: (tab: CallsTab) => void;
}

const phoneNumbers = [
  {
    id: "1",
    number: "+15550100",
    country: "US",
    type: "Local",
    capabilities: ["voice", "sms", "mms"],
    callFlow: "Main IVR",
    voiceStatus: "valid",
    messagingStatus: "valid",
    complianceStatus: "ok",
  },
  {
    id: "2",
    number: "+15550200",
    country: "US",
    type: "Toll-Free",
    capabilities: ["voice", "sms"],
    callFlow: "Support Line",
    voiceStatus: "valid",
    messagingStatus: "missing",
    complianceStatus: "ok",
  },
  {
    id: "3",
    number: "+447700900123",
    country: "UK",
    type: "Mobile",
    capabilities: ["voice", "sms", "mms"],
    callFlow: null,
    voiceStatus: "error",
    messagingStatus: "valid",
    complianceStatus: "needs_docs",
  },
  {
    id: "4",
    number: "+15550300",
    country: "US",
    type: "Local",
    capabilities: ["voice"],
    callFlow: "Forwarding",
    voiceStatus: "valid",
    messagingStatus: "valid",
    complianceStatus: "risk",
  },
];

const callFlows = ["Main IVR", "Support Line", "Sales", "Forwarding", "Voicemail", "Office Hours"];

const statusIcons: Record<string, { icon: React.ElementType; color: string }> = {
  valid: { icon: CheckCircle2, color: "text-green-500" },
  ok: { icon: CheckCircle2, color: "text-green-500" },
  missing: { icon: AlertCircle, color: "text-yellow-500" },
  needs_docs: { icon: AlertCircle, color: "text-yellow-500" },
  error: { icon: XCircle, color: "text-red-500" },
  risk: { icon: XCircle, color: "text-red-500" },
};

const capabilityIcons: Record<string, { icon: React.ElementType; label: string }> = {
  voice: { icon: Phone, label: "Voice" },
  sms: { icon: MessageSquare, label: "SMS" },
  mms: { icon: Mail, label: "MMS" },
  fax: { icon: FileText, label: "Fax" },
};

export function CallsOwnedNumbers({ onNavigate }: CallsOwnedNumbersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [releaseNumber, setReleaseNumber] = useState<string | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  const filteredNumbers = phoneNumbers.filter((num) => {
    const matchesSearch = num.number.includes(searchQuery);
    const matchesCountry = countryFilter === "all" || num.country === countryFilter;
    const matchesType = typeFilter === "all" || num.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesCountry && matchesType;
  });

  const toggleNumber = (id: string) => {
    setSelectedNumbers((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedNumbers.length === filteredNumbers.length) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers(filteredNumbers.map((n) => n.id));
    }
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith("+1")) {
      return phone.replace(/(\+1)(\d{3})(\d{4})/, "$1 ($2) $3");
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Phone Numbers</h1>
          <p className="text-muted-foreground">Manage your owned phone numbers</p>
        </div>
        <Button onClick={() => onNavigate("buy")} className="gradient-teal text-white border-0 rounded-xl">Buy a Number</Button>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-0 bg-muted/30"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[150px] rounded-xl border-0 bg-muted/30">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] rounded-xl border-0 bg-muted/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="toll-free">Toll-Free</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedNumbers.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedNumbers.length} selected
              </span>
              <Button variant="outline" size="sm">
                Assign Call Flow
              </Button>
              <Button variant="outline" size="sm">
                Update URLs
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Numbers Table */}
      {filteredNumbers.length > 0 ? (
        <Card className="rounded-3xl shadow-soft border-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-muted">
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedNumbers.length === filteredNumbers.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capabilities</TableHead>
                  <TableHead>Call Flow</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Messaging</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNumbers.map((num) => {
                  const VoiceIcon = statusIcons[num.voiceStatus].icon;
                  const MsgIcon = statusIcons[num.messagingStatus].icon;
                  const CompIcon = statusIcons[num.complianceStatus].icon;
                  return (
                    <TableRow key={num.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedNumbers.includes(num.id)}
                          onCheckedChange={() => toggleNumber(num.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{formatPhone(num.number)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{num.country}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{num.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {num.capabilities.map((cap) => {
                            const CapIcon = capabilityIcons[cap]?.icon;
                            return CapIcon ? (
                              <Badge key={cap} variant="secondary" className="px-1">
                                <CapIcon className="h-3 w-3" />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={num.callFlow || ""}>
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue placeholder="Assign flow" />
                          </SelectTrigger>
                          <SelectContent>
                            {callFlows.map((flow) => (
                              <SelectItem key={flow} value={flow}>
                                {flow}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <VoiceIcon className={`h-4 w-4 ${statusIcons[num.voiceStatus].color}`} />
                      </TableCell>
                      <TableCell>
                        <MsgIcon className={`h-4 w-4 ${statusIcons[num.messagingStatus].color}`} />
                      </TableCell>
                      <TableCell>
                        <CompIcon className={`h-4 w-4 ${statusIcons[num.complianceStatus].color}`} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setReleaseNumber(num.number);
                                setReleaseDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Release
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
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Phone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No numbers yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by purchasing your first phone number
            </p>
            <Button onClick={() => onNavigate("buy")}>Buy your first number</Button>
          </CardContent>
        </Card>
      )}

      {/* Release Number Dialog */}
      <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Phone Number</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type the phone number to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">
                You are about to release: <strong>{releaseNumber}</strong>
              </p>
            </div>
            <div className="space-y-2">
              <Label>Type the number to confirm</Label>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={releaseNumber || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmInput !== releaseNumber}
              onClick={() => {
                setReleaseDialogOpen(false);
                setConfirmInput("");
              }}
            >
              Release Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

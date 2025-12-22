import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Upload,
  Download,
  Tag,
  ListTree,
  Trash2,
  Edit,
  Eye,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  MousePointerClick,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const contacts = [
  {
    id: "1",
    name: "John Smith",
    phone: "+15550123456",
    email: "john.smith@email.com",
    status: "subscribed",
    tags: ["VIP", "Customer"],
    lists: ["Newsletter", "Promotions"],
    country: "US",
    lastMessage: "2024-01-15",
    lastActivity: "Clicked link",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+15550456789",
    email: "sarah.j@email.com",
    status: "subscribed",
    tags: ["Lead"],
    lists: ["Newsletter"],
    country: "US",
    lastMessage: "2024-01-14",
    lastActivity: "Replied",
  },
  {
    id: "3",
    name: "Mike Wilson",
    phone: "+15550789123",
    email: "mike.w@email.com",
    status: "unsubscribed",
    tags: [],
    lists: [],
    country: "CA",
    lastMessage: "2024-01-12",
    lastActivity: "Opted out",
  },
  {
    id: "4",
    name: "Emily Davis",
    phone: "+15550321654",
    email: "emily.d@email.com",
    status: "subscribed",
    tags: ["Customer", "Premium"],
    lists: ["Promotions", "Updates"],
    country: "UK",
    lastMessage: "2024-01-16",
    lastActivity: "Delivered",
  },
  {
    id: "5",
    name: "Chris Brown",
    phone: "+15550654987",
    email: "chris.b@email.com",
    status: "suppressed",
    tags: [],
    lists: [],
    country: "US",
    lastMessage: "2024-01-10",
    lastActivity: "Bounced",
  },
];

const statusColors: Record<string, string> = {
  subscribed: "bg-green-500/10 text-green-500",
  unsubscribed: "bg-red-500/10 text-red-500",
  suppressed: "bg-orange-500/10 text-orange-500",
  unknown: "bg-muted text-muted-foreground",
};

const statusIcons: Record<string, React.ElementType> = {
  subscribed: CheckCircle2,
  unsubscribed: XCircle,
  suppressed: AlertCircle,
};

export function SMSContacts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Manage your SMS contact database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)} className="gap-2 rounded-xl border-0 bg-card shadow-soft">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl border-0 bg-card shadow-soft">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2 gradient-teal text-white border-0 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-0 bg-muted/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl border-0 bg-muted/30">
                <SelectValue placeholder="Consent Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="subscribed">Subscribed</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                <SelectItem value="suppressed">Suppressed</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl border-0 bg-muted/30">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Tag className="h-4 w-4 mr-2" />
                  Filter by Tags
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListTree className="h-4 w-4 mr-2" />
                  Filter by Lists
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  Filter by Country
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  Engaged in last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MousePointerClick className="h-4 w-4 mr-2" />
                  Clicked link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Replied
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedContacts.length} selected
              </span>
              <Button variant="outline" size="sm" className="gap-1">
                <Tag className="h-3 w-3" />
                Add Tag
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Tag className="h-3 w-3" />
                Remove Tag
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <ListTree className="h-3 w-3" />
                Add to List
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Suppress
              </Button>
              <Button variant="outline" size="sm" className="gap-1 text-destructive">
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => {
                const StatusIcon = statusIcons[contact.status] || CheckCircle2;
                return (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatPhone(contact.phone)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`gap-1 ${statusColors[contact.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contact.lastMessage}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.lastActivity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedContact(contact); setDetailSheetOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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

      {/* Add Contact Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your database
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Smith" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input placeholder="+1 555 123 4567" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Country</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="CST">Central Time</SelectItem>
                    <SelectItem value="MST">Mountain Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input placeholder="Enter tags separated by commas" />
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="font-medium mb-2">Consent</p>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label>Consent Status</Label>
                    <Select defaultValue="subscribed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subscribed">Subscribed</SelectItem>
                        <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Consent Source</Label>
                    <Input placeholder="e.g., Website signup, Import" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional consent evidence..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddDialogOpen(false)}>
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import contacts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Button variant="outline">Select File</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Required columns:</p>
              <p>phone (E.164 format recommended)</p>
              <p className="font-medium mt-2 mb-1">Optional columns:</p>
              <p>first_name, last_name, email, country, tags</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              {selectedContact.name}
              <Badge variant="secondary" className={statusColors[selectedContact.status]}>
                {selectedContact.status}
              </Badge>
            </SheetTitle>
            <SheetDescription>{selectedContact.phone}</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formatPhone(selectedContact.phone)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedContact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedContact.country}</span>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedContact.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6">+ Add</Button>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Lists</p>
                <div className="flex flex-wrap gap-1">
                  {selectedContact.lists.map((list) => (
                    <Badge key={list} variant="secondary">{list}</Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Send 1:1 SMS
              </Button>
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {[
                    { type: "sent", desc: "Message sent: Summer Sale", time: "2024-01-15 10:00 AM" },
                    { type: "delivered", desc: "Message delivered", time: "2024-01-15 10:00 AM" },
                    { type: "clicked", desc: "Clicked link: shop.example.com/sale", time: "2024-01-15 10:05 AM" },
                    { type: "sent", desc: "Message sent: Flash Deal", time: "2024-01-14 2:00 PM" },
                    { type: "delivered", desc: "Message delivered", time: "2024-01-14 2:00 PM" },
                  ].map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm">{event.desc}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="notes" className="mt-4 space-y-4">
              <Textarea placeholder="Add a note..." />
              <Button>Save Note</Button>
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm">VIP customer - prefers morning messages</p>
                    <p className="text-xs text-muted-foreground mt-1">Added by John Doe • Jan 10, 2024</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}

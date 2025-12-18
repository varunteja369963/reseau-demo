import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Users,
  ListTree,
  Filter as FilterIcon,
  RefreshCw,
  Download,
  Megaphone,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lists = [
  { id: "1", name: "Newsletter Subscribers", contacts: 5420, created: "2024-01-01" },
  { id: "2", name: "VIP Customers", contacts: 890, created: "2024-01-05" },
  { id: "3", name: "Product Interest", contacts: 2100, created: "2024-01-08" },
  { id: "4", name: "Promotions Opt-in", contacts: 3450, created: "2024-01-10" },
  { id: "5", name: "Appointments", contacts: 650, created: "2024-01-12" },
];

const segments = [
  {
    id: "1",
    name: "Engaged Last 30 Days",
    rules: "Clicked link in last 30 days OR Replied in last 30 days",
    estimated: 2340,
    lastCalculated: "2024-01-16 10:00 AM",
  },
  {
    id: "2",
    name: "High Value Customers",
    rules: "Tag = 'VIP' AND Consent = Subscribed",
    estimated: 450,
    lastCalculated: "2024-01-16 9:00 AM",
  },
  {
    id: "3",
    name: "Re-engagement Target",
    rules: "No message opened in 60 days AND Consent = Subscribed",
    estimated: 1200,
    lastCalculated: "2024-01-15 8:00 PM",
  },
  {
    id: "4",
    name: "US Customers",
    rules: "Country = US",
    estimated: 3800,
    lastCalculated: "2024-01-16 11:00 AM",
  },
];

const ruleTypes = [
  { value: "field_equals", label: "Contact field equals" },
  { value: "field_contains", label: "Contact field contains" },
  { value: "tag_includes", label: "Tag includes" },
  { value: "consent_status", label: "Consent status" },
  { value: "in_list", label: "In list" },
  { value: "delivered_days", label: "Delivered in last X days" },
  { value: "clicked_days", label: "Clicked in last X days" },
  { value: "replied_days", label: "Replied in last X days" },
];

export function SMSListsSegments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createListOpen, setCreateListOpen] = useState(false);
  const [createSegmentOpen, setCreateSegmentOpen] = useState(false);
  const [segmentRules, setSegmentRules] = useState([
    { type: "tag_includes", value: "", operator: "AND" },
  ]);

  const addRule = () => {
    setSegmentRules([...segmentRules, { type: "field_equals", value: "", operator: "AND" }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lists & Segments</h1>
          <p className="text-muted-foreground">Organize contacts into lists and dynamic segments</p>
        </div>
      </div>

      <Tabs defaultValue="lists">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="lists" className="gap-2">
              <ListTree className="h-4 w-4" />
              Lists
            </TabsTrigger>
            <TabsTrigger value="segments" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Segments
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lists" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setCreateListOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create List
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>List Name</TableHead>
                    <TableHead className="text-right">Contacts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">{list.name}</TableCell>
                      <TableCell className="text-right">{list.contacts.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{list.created}</TableCell>
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
                              View Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Add Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setCreateSegmentOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Segment
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment Name</TableHead>
                    <TableHead>Rule Summary</TableHead>
                    <TableHead className="text-right">Est. Recipients</TableHead>
                    <TableHead>Last Calculated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-medium">{segment.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {segment.rules}
                      </TableCell>
                      <TableCell className="text-right">{segment.estimated.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{segment.lastCalculated}</TableCell>
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
                              View Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Recalculate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Megaphone className="h-4 w-4 mr-2" />
                              Create Campaign
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create List Dialog */}
      <Dialog open={createListOpen} onOpenChange={setCreateListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create List</DialogTitle>
            <DialogDescription>
              Create a new contact list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>List Name</Label>
              <Input placeholder="Enter list name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe this list..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateListOpen(false)}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Segment Dialog */}
      <Dialog open={createSegmentOpen} onOpenChange={setCreateSegmentOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Segment</DialogTitle>
            <DialogDescription>
              Define rules to dynamically filter contacts
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            {/* Rules Builder */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Segment Name</Label>
                <Input placeholder="Enter segment name" />
              </div>
              <div className="space-y-2">
                <Label>Rules</Label>
                <div className="space-y-3">
                  {segmentRules.map((rule, index) => (
                    <Card key={index}>
                      <CardContent className="p-3 space-y-2">
                        {index > 0 && (
                          <Select defaultValue={rule.operator}>
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Select defaultValue={rule.type}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rule type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ruleTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input placeholder="Enter value" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button variant="outline" onClick={addRule} className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold">1,234</p>
                    <p className="text-sm text-muted-foreground">Estimated recipients</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Recalculate
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Sample Contacts</CardTitle>
                  <CardDescription>First 5 matching contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "Chris Brown"].map((name) => (
                      <div key={name} className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateSegmentOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Create Campaign from Segment
            </Button>
            <Button onClick={() => setCreateSegmentOpen(false)}>
              Save Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

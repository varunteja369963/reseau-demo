import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Upload, 
  Download, 
  Search, 
  Filter,
  Mail,
  Phone,
  Tag,
  MapPin,
  TrendingUp,
  MoreVertical
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EmailContacts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const contacts = [
    { 
      id: "1", 
      name: "Sarah Johnson", 
      email: "sarah.j@example.com", 
      phone: "+1 (555) 123-4567",
      status: "subscribed", 
      score: 85, 
      tags: ["VIP", "Tech"],
      lists: ["Newsletter", "Product Updates"],
      location: "New York, US",
      subscribed: "2024-01-15"
    },
    { 
      id: "2", 
      name: "Michael Chen", 
      email: "m.chen@company.com", 
      phone: "+1 (555) 234-5678",
      status: "subscribed", 
      score: 72, 
      tags: ["Enterprise"],
      lists: ["Newsletter"],
      location: "San Francisco, US",
      subscribed: "2024-02-20"
    },
    { 
      id: "3", 
      name: "Emma Wilson", 
      email: "emma.w@gmail.com", 
      phone: "+44 20 1234 5678",
      status: "subscribed", 
      score: 65, 
      tags: ["Active"],
      lists: ["Newsletter", "Weekly Digest"],
      location: "London, UK",
      subscribed: "2024-03-10"
    },
  ];

  const lists = [
    { id: "1", name: "Newsletter Subscribers", count: 12458, growth: "+12.5%" },
    { id: "2", name: "Product Updates", count: 8924, growth: "+8.2%" },
    { id: "3", name: "VIP Customers", count: 1250, growth: "+15.3%" },
    { id: "4", name: "Weekly Digest", count: 5680, growth: "+5.7%" },
  ];

  const segments = [
    { id: "1", name: "Highly Engaged", count: 3250, conditions: "Opened > 5 emails in 30 days" },
    { id: "2", name: "New Subscribers", count: 890, conditions: "Subscribed in last 7 days" },
    { id: "3", name: "At Risk", count: 1520, conditions: "No activity in 90 days" },
    { id: "4", name: "Tech Enthusiasts", count: 2100, conditions: "Tagged as Tech" },
  ];

  const tags = [
    { id: "1", name: "VIP", color: "purple", count: 245 },
    { id: "2", name: "Tech", color: "blue", count: 892 },
    { id: "3", name: "Enterprise", color: "green", count: 156 },
    { id: "4", name: "Active", color: "orange", count: 3450 },
    { id: "5", name: "New", color: "yellow", count: 678 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">Manage your email subscribers and audience</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">12,458</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% this month
                </p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Subscribed</p>
                <p className="text-2xl font-bold">11,890</p>
                <p className="text-xs text-muted-foreground mt-1">95.4% of total</p>
              </div>
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unsubscribed</p>
                <p className="text-2xl font-bold">432</p>
                <p className="text-xs text-muted-foreground mt-1">3.5% of total</p>
              </div>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                <p className="text-2xl font-bold">73</p>
                <p className="text-xs text-muted-foreground mt-1">Score out of 100</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="lists">Lists</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts by name, email, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Contacts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Lists</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={contact.status === "subscribed" ? "default" : "secondary"}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{contact.score}</div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${contact.score}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {contact.lists.length} list{contact.lists.length !== 1 ? 's' : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {contact.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                            <DropdownMenuItem>Add to List</DropdownMenuItem>
                            <DropdownMenuItem>Add Tag</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

        <TabsContent value="lists" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Lists</CardTitle>
                  <CardDescription>Static subscriber lists for targeting</CardDescription>
                </div>
                <Button>Create List</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lists.map((list) => (
                  <div key={list.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{list.name}</h4>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{list.count.toLocaleString()}</span>
                      <span className="text-sm text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {list.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Smart Segments</CardTitle>
                  <CardDescription>Dynamic audience segments based on conditions</CardDescription>
                </div>
                <Button>Create Segment</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {segments.map((segment) => (
                  <div key={segment.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{segment.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge>{segment.count.toLocaleString()} contacts</Badge>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{segment.conditions}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contact Tags</CardTitle>
                  <CardDescription>Organize contacts with custom tags</CardDescription>
                </div>
                <Button>Create Tag</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {tags.map((tag) => (
                  <div key={tag.id} className="p-3 border rounded-lg text-center hover:bg-muted/50 transition-smooth">
                    <Tag className="w-5 h-5 mx-auto mb-2" style={{ color: tag.color }} />
                    <div className="font-medium text-sm">{tag.name}</div>
                    <div className="text-xs text-muted-foreground">{tag.count} contacts</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

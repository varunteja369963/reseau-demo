import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Plus, 
  Search, 
  Filter,
  Eye,
  MousePointer,
  Calendar,
  Users,
  MoreVertical,
  Play,
  Pause,
  Copy,
  Trash2,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

export const EmailCampaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const campaigns = {
    draft: [
      { 
        id: "1", 
        name: "Customer Feedback Survey", 
        subject: "We'd love your feedback!", 
        audience: "All Active Customers",
        recipients: 0,
        lastEdited: "2 hours ago"
      },
      { 
        id: "2", 
        name: "Product Feature Announcement", 
        subject: "Exciting new features coming soon", 
        audience: "Beta Users",
        recipients: 0,
        lastEdited: "1 day ago"
      },
    ],
    scheduled: [
      { 
        id: "3", 
        name: "New Product Launch", 
        subject: "🚀 Introducing our latest innovation", 
        audience: "Newsletter Subscribers",
        recipients: 1250,
        scheduledFor: "Tomorrow at 9:00 AM"
      },
      { 
        id: "4", 
        name: "Weekend Special Offer", 
        subject: "🎉 Weekend Sale - 30% Off", 
        audience: "Active Shoppers",
        recipients: 890,
        scheduledFor: "Sat, Jun 15 at 10:00 AM"
      },
    ],
    sent: [
      { 
        id: "5", 
        name: "Summer Sale 2024", 
        subject: "☀️ Summer Sale - Up to 50% Off!", 
        audience: "All Subscribers",
        recipients: 980,
        sent: "2 hours ago",
        delivered: 975,
        opened: 245,
        clicked: 42,
        openRate: 25.1,
        clickRate: 4.3
      },
      { 
        id: "6", 
        name: "Weekly Newsletter #42", 
        subject: "This Week's Top Stories", 
        audience: "Newsletter Subscribers",
        recipients: 2100,
        sent: "3 days ago",
        delivered: 2089,
        opened: 523,
        clicked: 87,
        openRate: 25.0,
        clickRate: 4.2
      },
      { 
        id: "7", 
        name: "Product Update March", 
        subject: "What's New in March", 
        audience: "Product Users",
        recipients: 1580,
        sent: "1 week ago",
        delivered: 1573,
        opened: 420,
        clicked: 68,
        openRate: 26.7,
        clickRate: 4.3
      },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">Create and manage your email campaigns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Campaign
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
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

      {/* Campaign Tabs */}
      <Tabs defaultValue="sent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sent">
            Sent ({campaigns.sent.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({campaigns.scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({campaigns.draft.length})
          </TabsTrigger>
        </TabsList>

        {/* Sent Campaigns */}
        <TabsContent value="sent" className="space-y-4">
          {campaigns.sent.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge>Sent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {campaign.sent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {campaign.recipients.toLocaleString()} recipients
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        Resend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Delivered</div>
                    <div className="text-2xl font-bold">{campaign.delivered}</div>
                    <div className="text-xs text-muted-foreground">
                      {((campaign.delivered / campaign.recipients) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Opens
                    </div>
                    <div className="text-2xl font-bold">{campaign.opened}</div>
                    <div className="text-xs text-green-500">{campaign.openRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      Clicks
                    </div>
                    <div className="text-2xl font-bold">{campaign.clicked}</div>
                    <div className="text-xs text-green-500">{campaign.clickRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Engagement</div>
                    <div className="text-2xl font-bold">
                      {(((campaign.opened + campaign.clicked) / campaign.recipients) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Open Rate</span>
                      <span className="font-medium">{campaign.openRate}%</span>
                    </div>
                    <Progress value={campaign.openRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Click Rate</span>
                      <span className="font-medium">{campaign.clickRate}%</span>
                    </div>
                    <Progress value={campaign.clickRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Scheduled Campaigns */}
        <TabsContent value="scheduled" className="space-y-4">
          {campaigns.scheduled.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {campaign.scheduledFor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {campaign.recipients.toLocaleString()} recipients
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Change Schedule</DropdownMenuItem>
                        <DropdownMenuItem>Preview</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Draft Campaigns */}
        <TabsContent value="draft" className="space-y-4">
          {campaigns.draft.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Last edited {campaign.lastEdited}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">
                      Continue Editing
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

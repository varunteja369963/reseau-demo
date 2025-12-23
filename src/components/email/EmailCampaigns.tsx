import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Pause,
  Copy,
  Trash2,
  Sparkles,
  TrendingUp,
  Mail,
  Clock,
  FileEdit,
  Zap
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
          <h2 className="text-2xl font-bold text-foreground">Campaigns</h2>
          <p className="text-muted-foreground">Create and manage your email campaigns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border border-border/50 bg-card shadow-soft hover:shadow-medium transition-smooth group">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500 group-hover:text-purple-600" />
            AI Campaign
          </Button>
          <Button className="gradient-teal text-white border-0 rounded-xl shadow-soft hover:shadow-medium transition-smooth">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border border-border/50 bg-card shadow-soft focus:shadow-medium transition-smooth"
          />
        </div>
        <Button variant="outline" className="rounded-xl border border-border/50 bg-card shadow-soft hover:shadow-medium transition-smooth">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Campaign Tabs */}
      <Tabs defaultValue="sent" className="space-y-5">
        <TabsList className="bg-card shadow-soft rounded-2xl p-1.5 border border-border/30">
          <TabsTrigger 
            value="sent" 
            className="rounded-xl data-[state=active]:bg-teal-500/10 data-[state=active]:text-teal-600 transition-smooth px-4"
          >
            <Send className="w-4 h-4 mr-2" />
            Sent ({campaigns.sent.length})
          </TabsTrigger>
          <TabsTrigger 
            value="scheduled" 
            className="rounded-xl data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-600 transition-smooth px-4"
          >
            <Clock className="w-4 h-4 mr-2" />
            Scheduled ({campaigns.scheduled.length})
          </TabsTrigger>
          <TabsTrigger 
            value="draft" 
            className="rounded-xl data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-600 transition-smooth px-4"
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Drafts ({campaigns.draft.length})
          </TabsTrigger>
        </TabsList>

        {/* Sent Campaigns */}
        <TabsContent value="sent" className="space-y-4">
          {campaigns.sent.map((campaign) => (
            <Card key={campaign.id} className="rounded-2xl shadow-soft border border-border/30 hover:shadow-medium transition-smooth overflow-hidden group">
              <CardContent className="p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-13">
                        <Badge variant="secondary" className="bg-teal-500/10 text-teal-600 border-0 font-medium">
                          <Zap className="w-3 h-3 mr-1" />
                          Sent
                        </Badge>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {campaign.sent}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {campaign.recipients.toLocaleString()} recipients
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/20">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Delivered</div>
                      <div className="text-2xl font-bold text-foreground">{campaign.delivered.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {((campaign.delivered / campaign.recipients) * 100).toFixed(1)}% success
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                      <div className="text-xs text-blue-600 font-medium flex items-center gap-1 mb-1">
                        <Eye className="w-3 h-3" />
                        Opens
                      </div>
                      <div className="text-2xl font-bold text-foreground">{campaign.opened.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        {campaign.openRate}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                      <div className="text-xs text-purple-600 font-medium flex items-center gap-1 mb-1">
                        <MousePointer className="w-3 h-3" />
                        Clicks
                      </div>
                      <div className="text-2xl font-bold text-foreground">{campaign.clicked.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs text-purple-600 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        {campaign.clickRate}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-500/5 to-teal-500/10 rounded-xl p-4 border border-teal-500/20">
                      <div className="text-xs text-teal-600 font-medium mb-1">Engagement</div>
                      <div className="text-2xl font-bold text-foreground">
                        {(((campaign.opened + campaign.clicked) / campaign.recipients) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-teal-600 mt-1">
                        Overall score
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3 bg-muted/20 rounded-xl p-4 border border-border/20">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground font-medium">Open Rate</span>
                        <span className="font-semibold text-teal-600">{campaign.openRate}%</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-400/60 rounded-full transition-all duration-500"
                          style={{ width: `${campaign.openRate}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground font-medium">Click Rate</span>
                        <span className="font-semibold text-teal-600">{campaign.clickRate}%</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-300/50 rounded-full transition-all duration-500"
                          style={{ width: `${campaign.clickRate * 5}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Scheduled Campaigns */}
        <TabsContent value="scheduled" className="space-y-4">
          {campaigns.scheduled.map((campaign) => (
            <Card key={campaign.id} className="rounded-2xl shadow-soft border border-border/30 hover:shadow-medium transition-smooth overflow-hidden group">
              <CardContent className="p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
                
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-13">
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-0 font-medium">
                          <Clock className="w-3 h-3 mr-1" />
                          Scheduled
                        </Badge>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {campaign.scheduledFor}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {campaign.recipients.toLocaleString()} recipients
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-smooth">
                        <Pause className="w-4 h-4 mr-1.5" />
                        Pause
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Change Schedule</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Draft Campaigns */}
        <TabsContent value="draft" className="space-y-4">
          {campaigns.draft.map((campaign) => (
            <Card key={campaign.id} className="rounded-2xl shadow-soft border border-border/30 hover:shadow-medium transition-smooth overflow-hidden group">
              <CardContent className="p-0">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500" />
                
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <FileEdit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-13">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-600 bg-blue-500/5 font-medium">
                          <FileEdit className="w-3 h-3 mr-1" />
                          Draft
                        </Badge>
                        <span>Last edited {campaign.lastEdited}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="gradient-blue text-white border-0 rounded-xl shadow-soft hover:shadow-medium transition-smooth">
                        Continue Editing
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

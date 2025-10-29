import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailTopNav } from "./EmailTopNav";
import { 
  Mail, 
  Users, 
  Send, 
  TrendingUp, 
  Clock, 
  Eye, 
  MousePointer, 
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const EmailDashboard = () => {
  const stats = [
    {
      title: "Total Contacts",
      value: "12,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Campaigns Sent",
      value: "87",
      change: "+5.2%",
      trend: "up",
      icon: Send,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg. Open Rate",
      value: "24.8%",
      change: "+2.1%",
      trend: "up",
      icon: Eye,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Click Rate",
      value: "3.2%",
      change: "+0.8%",
      trend: "up",
      icon: MousePointer,
      color: "from-orange-500 to-orange-600"
    },
  ];

  const recentCampaigns = [
    { id: "1", name: "Summer Sale 2024", status: "sent", sent: "2 hours ago", opens: 245, clicks: 42, recipients: 980 },
    { id: "2", name: "New Product Launch", status: "scheduled", sent: "Tomorrow 9:00 AM", opens: 0, clicks: 0, recipients: 1250 },
    { id: "3", name: "Weekly Newsletter #42", status: "sent", sent: "3 days ago", opens: 523, clicks: 87, recipients: 2100 },
    { id: "4", name: "Customer Feedback Survey", status: "draft", sent: "Not scheduled", opens: 0, clicks: 0, recipients: 0 },
  ];

  const upcomingEmails = [
    { name: "Weekend Special Offer", schedule: "Sat, Jun 15 at 10:00 AM", audience: "Active Subscribers (8,500)" },
    { name: "Product Update Newsletter", schedule: "Mon, Jun 17 at 2:00 PM", audience: "All Contacts (12,458)" },
    { name: "Abandoned Cart Reminder", schedule: "Auto-trigger", audience: "Cart Abandoners" },
  ];

  const insights = [
    { 
      title: "Best Send Time", 
      value: "Tuesday 10:00 AM", 
      description: "Based on your audience engagement patterns",
      icon: Clock
    },
    { 
      title: "Top Performing Subject", 
      value: "🎉 Special Offer Inside!", 
      description: "38.5% open rate vs 24.8% average",
      icon: TrendingUp
    },
    { 
      title: "Growing Segment", 
      value: "Tech Enthusiasts", 
      description: "+45 new subscribers this week",
      icon: Users
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Your latest email campaigns performance</CardDescription>
                </div>
                <Button size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === "sent" ? "default" : campaign.status === "scheduled" ? "secondary" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {campaign.sent}
                        </span>
                        {campaign.status === "sent" && (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {campaign.opens} opens
                            </span>
                            <span className="flex items-center gap-1">
                              <MousePointer className="w-3 h-3" />
                              {campaign.clicks} clicks
                            </span>
                          </>
                        )}
                      </div>
                      {campaign.status === "sent" && campaign.recipients > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Open Rate</span>
                            <span className="font-medium">{((campaign.opens / campaign.recipients) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(campaign.opens / campaign.recipients) * 100} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Scheduled Emails */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Emails</CardTitle>
            <CardDescription>Scheduled campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEmails.map((email, idx) => (
                <div key={idx} className="p-3 border rounded-lg space-y-1">
                  <h4 className="font-medium text-sm">{email.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {email.schedule}
                  </div>
                  <p className="text-xs text-muted-foreground">{email.audience}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>Optimize your email marketing strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <insight.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{insight.title}</span>
                </div>
                <p className="font-semibold">{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button size="lg" className="h-auto py-6 flex-col gap-2">
          <Send className="w-6 h-6" />
          <span className="font-semibold">Create Campaign</span>
          <span className="text-xs opacity-80">Start a new email campaign</span>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-6 flex-col gap-2">
          <Users className="w-6 h-6" />
          <span className="font-semibold">Manage Contacts</span>
          <span className="text-xs opacity-80">Add or import subscribers</span>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-6 flex-col gap-2">
          <Sparkles className="w-6 h-6" />
          <span className="font-semibold">AI Email Generator</span>
          <span className="text-xs opacity-80">Create with AI assistance</span>
        </Button>
      </div>
    </div>
  );
};

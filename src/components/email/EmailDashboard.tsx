import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Users, 
  Send, 
  TrendingUp, 
  Clock, 
  Eye, 
  MousePointer, 
  Calendar,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  gradient: string;
}

export const EmailDashboard = () => {
  const [isStatsOpen, setIsStatsOpen] = useState(true);

  const stats: Stat[] = [
    {
      title: "Total Contacts",
      value: "12,458",
      change: "+12.5%",
      icon: Users,
      gradient: "gradient-teal"
    },
    {
      title: "Campaigns Sent",
      value: "87",
      change: "+5.2%",
      icon: Send,
      gradient: "gradient-blue"
    },
    {
      title: "Avg. Open Rate",
      value: "24.8%",
      change: "+2.1%",
      icon: Eye,
      gradient: "gradient-purple"
    },
    {
      title: "Click Rate",
      value: "3.2%",
      change: "+0.8%",
      icon: MousePointer,
      gradient: "gradient-red"
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
      {/* Stats Cards - CRM Style */}
      <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-end gap-1.5 mb-3 py-1.5 hover:bg-muted/30 rounded-lg transition-smooth group">
            <span className="text-xs font-medium text-muted-foreground/70 group-hover:text-muted-foreground transition-smooth">
              {isStatsOpen ? 'Hide' : 'Show Overview'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-muted-foreground transition-all ${isStatsOpen ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-card rounded-3xl p-4 md:p-6 shadow-soft hover:shadow-medium transition-smooth text-left group overflow-hidden relative"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className={`w-10 h-10 ${stat.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm font-medium">{stat.title}</div>
                  </div>
                  
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Campaigns</CardTitle>
                  <CardDescription>Your latest email campaigns performance</CardDescription>
                </div>
                <Button size="sm" className="gradient-teal text-white border-0 rounded-xl">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-smooth">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge 
                          variant="secondary"
                          className={`rounded-lg ${
                            campaign.status === "sent" ? "bg-green-500/10 text-green-600" : 
                            campaign.status === "scheduled" ? "bg-blue-500/10 text-blue-600" : 
                            "bg-muted text-muted-foreground"
                          }`}
                        >
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
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-teal rounded-full transition-smooth" 
                              style={{ width: `${(campaign.opens / campaign.recipients) * 100}%` }} 
                            />
                          </div>
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
        <Card className="rounded-3xl shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Emails</CardTitle>
            <CardDescription>Scheduled campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEmails.map((email, idx) => (
                <div key={idx} className="p-4 bg-muted/30 rounded-2xl space-y-2">
                  <h4 className="font-medium text-sm">{email.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {email.schedule}
                  </div>
                  <p className="text-xs text-muted-foreground">{email.audience}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl">
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-purple rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
          </div>
          <CardDescription>Optimize your email marketing strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-muted/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${idx === 0 ? 'gradient-teal' : idx === 1 ? 'gradient-blue' : 'gradient-purple'} rounded-xl flex items-center justify-center`}>
                    <insight.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{insight.title}</span>
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
        <Button size="lg" className="h-auto py-6 flex-col gap-2 gradient-teal text-white border-0 rounded-2xl shadow-soft hover:shadow-medium">
          <Send className="w-6 h-6" />
          <span className="font-semibold">Create Campaign</span>
          <span className="text-xs opacity-80">Start a new email campaign</span>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 rounded-2xl bg-card shadow-soft hover:shadow-medium border-0">
          <Users className="w-6 h-6 text-[hsl(var(--blue))]" />
          <span className="font-semibold">Manage Contacts</span>
          <span className="text-xs text-muted-foreground">Add or import subscribers</span>
        </Button>
        <Button size="lg" variant="outline" className="h-auto py-6 flex-col gap-2 rounded-2xl bg-card shadow-soft hover:shadow-medium border-0">
          <Sparkles className="w-6 h-6 text-[hsl(var(--purple))]" />
          <span className="font-semibold">AI Email Generator</span>
          <span className="text-xs text-muted-foreground">Create with AI assistance</span>
        </Button>
      </div>
    </div>
  );
};

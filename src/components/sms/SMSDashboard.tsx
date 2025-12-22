import { useState } from "react";
import {
  Send,
  CheckCircle2,
  MessageSquare,
  UserMinus,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface KpiStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  gradient: string;
}

const kpiData: KpiStat[] = [
  { label: "Sent (7d)", value: "12,450", change: "+12%", trend: "up", icon: Send, gradient: "gradient-teal" },
  { label: "Delivered (7d)", value: "12,128", change: "+11%", trend: "up", icon: CheckCircle2, gradient: "gradient-blue" },
  { label: "Replies (7d)", value: "856", change: "+24%", trend: "up", icon: MessageSquare, gradient: "gradient-purple" },
  { label: "Opt-outs (7d)", value: "23", change: "-8%", trend: "down", icon: UserMinus, gradient: "gradient-red" },
];

const deliveryTrendData = [
  { date: "Mon", sent: 1800, delivered: 1750 },
  { date: "Tue", sent: 2100, delivered: 2050 },
  { date: "Wed", sent: 1950, delivered: 1900 },
  { date: "Thu", sent: 2300, delivered: 2250 },
  { date: "Fri", sent: 2100, delivered: 2050 },
  { date: "Sat", sent: 1200, delivered: 1180 },
  { date: "Sun", sent: 1000, delivered: 980 },
];

const campaignClicksData = [
  { name: "Summer Sale", clicks: 420 },
  { name: "Flash Deal", clicks: 380 },
  { name: "New Arrival", clicks: 290 },
  { name: "Reminder", clicks: 144 },
];

const recentCampaigns = [
  { id: 1, name: "Summer Sale Announcement", status: "completed", sent: 5420, delivered: 5380, clicks: 420, optouts: 3, date: "2024-01-15" },
  { id: 2, name: "Flash Deal Alert", status: "sending", sent: 3200, delivered: 3150, clicks: 280, optouts: 2, date: "2024-01-16" },
  { id: 3, name: "New Product Launch", status: "scheduled", sent: 0, delivered: 0, clicks: 0, optouts: 0, date: "2024-01-18" },
  { id: 4, name: "Weekly Newsletter", status: "completed", sent: 8900, delivered: 8750, clicks: 534, optouts: 8, date: "2024-01-14" },
  { id: 5, name: "Appointment Reminder", status: "draft", sent: 0, delivered: 0, clicks: 0, optouts: 0, date: "2024-01-19" },
];

const recentInbox = [
  { id: 1, from: "+1 555-0123", message: "Yes, I'd like to confirm my appointment", time: "2 min ago" },
  { id: 2, from: "+1 555-0456", message: "What time does the sale end?", time: "15 min ago" },
  { id: 3, from: "+1 555-0789", message: "STOP", time: "32 min ago" },
  { id: 4, from: "+1 555-0321", message: "Can I reschedule to next week?", time: "1 hr ago" },
  { id: 5, from: "+1 555-0654", message: "Thanks for the info!", time: "2 hr ago" },
];

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/10 text-blue-600",
  sending: "bg-yellow-500/10 text-yellow-600",
  paused: "bg-orange-500/10 text-orange-600",
  completed: "bg-green-500/10 text-green-600",
  failed: "bg-destructive/10 text-destructive",
};

export function SMSDashboard() {
  const [dateRange, setDateRange] = useState("7d");
  const [isStatsOpen, setIsStatsOpen] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your SMS marketing performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] rounded-xl border-0 bg-card shadow-soft">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-teal text-white border-0 rounded-xl">Create Campaign</Button>
        </div>
      </div>

      {/* KPI Cards - CRM Style */}
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
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-card rounded-3xl p-4 md:p-6 shadow-soft hover:shadow-medium transition-smooth text-left group overflow-hidden relative"
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className={`w-10 h-10 ${kpi.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-muted-foreground text-xs md:text-sm font-medium">{kpi.label}</div>
                    </div>
                    
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{kpi.value}</div>
                    
                    <div className={`flex items-center gap-1 ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">{kpi.change}</span>
                      <span className="text-xs text-muted-foreground">vs last week</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg">Delivery Trend</CardTitle>
            <CardDescription>Messages sent vs delivered over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: 'var(--shadow-medium)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="hsl(var(--teal))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke="hsl(var(--blue))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-lg">Clicks by Campaign</CardTitle>
            <CardDescription>Top performing campaigns by link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignClicksData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: 'var(--shadow-medium)'
                    }} 
                  />
                  <Bar dataKey="clicks" fill="hsl(var(--teal))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Campaigns</CardTitle>
              <CardDescription>Last 10 campaigns</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-[hsl(var(--teal))]">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-muted">
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-muted hover:bg-muted/30">
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${statusColors[campaign.status]} rounded-lg`}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.clicks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-soft border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Inbox Activity</CardTitle>
              <CardDescription>Recent inbound messages</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-[hsl(var(--teal))]">
              View Inbox <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInbox.map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-smooth">
                  <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{message.from}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

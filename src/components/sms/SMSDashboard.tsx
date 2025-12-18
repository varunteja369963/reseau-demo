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

const kpiData = [
  { label: "Sent (7d)", value: "12,450", change: "+12%", trend: "up", icon: Send },
  { label: "Delivered (7d)", value: "12,128", change: "+11%", trend: "up", icon: CheckCircle2 },
  { label: "Replies (7d)", value: "856", change: "+24%", trend: "up", icon: MessageSquare },
  { label: "Opt-outs (7d)", value: "23", change: "-8%", trend: "down", icon: UserMinus },
  { label: "Clicks (7d)", value: "1,234", change: "+18%", trend: "up", icon: MousePointerClick },
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
  scheduled: "bg-blue-500/10 text-blue-500",
  sending: "bg-yellow-500/10 text-yellow-500",
  paused: "bg-orange-500/10 text-orange-500",
  completed: "bg-green-500/10 text-green-500",
  failed: "bg-destructive/10 text-destructive",
};

export function SMSDashboard() {
  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your SMS marketing performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Create Campaign</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    kpi.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Trend</CardTitle>
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
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sent" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delivered" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clicks by Campaign</CardTitle>
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
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Last 10 campaigns</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[campaign.status]}>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Inbox Activity</CardTitle>
              <CardDescription>Recent inbound messages</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View Inbox <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInbox.map((message) => (
                <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
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

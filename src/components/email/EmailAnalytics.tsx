import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Mail, 
  Users,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const EmailAnalytics = () => {
  const overallStats = [
    { label: "Total Emails Sent", value: "47,892", change: "+12.5%", trend: "up", icon: Mail },
    { label: "Avg. Open Rate", value: "24.8%", change: "+2.1%", trend: "up", icon: Eye },
    { label: "Avg. Click Rate", value: "3.2%", change: "+0.8%", trend: "up", icon: MousePointer },
    { label: "Bounce Rate", value: "1.2%", change: "-0.3%", trend: "up", icon: AlertCircle },
  ];

  const topCampaigns = [
    { name: "Summer Sale 2024", opens: 2450, clicks: 420, openRate: 35.2, clickRate: 6.8 },
    { name: "Product Launch", opens: 1890, clicks: 320, openRate: 32.1, clickRate: 5.4 },
    { name: "Weekly Newsletter", opens: 5230, clicks: 870, openRate: 24.9, clickRate: 4.1 },
    { name: "Customer Survey", opens: 980, clicks: 156, openRate: 22.3, clickRate: 3.5 },
  ];

  const audienceGrowth = [
    { month: "Jan", subscribers: 8450 },
    { month: "Feb", subscribers: 9120 },
    { month: "Mar", subscribers: 9840 },
    { month: "Apr", subscribers: 10560 },
    { month: "May", subscribers: 11280 },
    { month: "Jun", subscribers: 12458 },
  ];

  const deviceBreakdown = [
    { device: "Desktop", percentage: 42, count: 20120 },
    { device: "Mobile", percentage: 48, count: 22988 },
    { device: "Tablet", percentage: 10, count: 4784 },
  ];

  const engagementBySegment = [
    { segment: "VIP Customers", contacts: 1250, openRate: 45.2, clickRate: 8.3 },
    { segment: "Active Subscribers", contacts: 8500, openRate: 28.7, clickRate: 4.2 },
    { segment: "New Subscribers", contacts: 890, openRate: 32.1, clickRate: 5.1 },
    { segment: "At Risk", contacts: 1520, openRate: 12.3, clickRate: 1.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Track and analyze your email marketing performance</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat, idx) => (
          <div key={stat.label} className="bg-card rounded-3xl p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className={`w-10 h-10 ${idx === 0 ? 'gradient-teal' : idx === 1 ? 'gradient-blue' : idx === 2 ? 'gradient-purple' : 'gradient-red'} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="bg-card shadow-soft rounded-2xl p-1">
          <TabsTrigger value="campaigns" className="rounded-xl">Campaign Performance</TabsTrigger>
          <TabsTrigger value="audience" className="rounded-xl">Audience Insights</TabsTrigger>
          <TabsTrigger value="engagement" className="rounded-xl">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Top Performing Campaigns */}
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Campaigns</CardTitle>
              <CardDescription>Campaigns with the highest engagement rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{campaign.name}</span>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {campaign.opens}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {campaign.clicks}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Open Rate</span>
                        <span className="font-medium">{campaign.openRate}%</span>
                      </div>
                      <Progress value={campaign.openRate} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Click Rate</span>
                        <span className="font-medium">{campaign.clickRate}%</span>
                      </div>
                      <Progress value={campaign.clickRate * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>How subscribers read your emails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceBreakdown.map((device, idx) => (
                  <div key={device.device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${idx === 0 ? 'gradient-teal' : idx === 1 ? 'gradient-purple' : 'bg-gradient-to-br from-amber-500 to-amber-400'} rounded-xl flex items-center justify-center`}>
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {device.count.toLocaleString()} ({device.percentage}%)
                      </span>
                    </div>
                    <Progress value={device.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          {/* Audience Growth */}
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <CardTitle>Audience Growth</CardTitle>
              <CardDescription>Subscriber count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audienceGrowth.map((data, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-medium w-12">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <Progress 
                        value={(data.subscribers / 12458) * 100} 
                        className="h-6"
                      />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">
                      {data.subscribers.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-muted/30 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Growth (6 months)</p>
                    <p className="text-2xl font-bold">+4,008</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold text-teal-500">+47.4%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {/* Engagement by Segment */}
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <CardTitle>Engagement by Segment</CardTitle>
              <CardDescription>Performance across different audience segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engagementBySegment.map((segment, idx) => (
                  <div key={segment.segment} className="space-y-3 p-4 bg-muted/30 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${idx === 0 ? 'gradient-teal' : idx === 1 ? 'gradient-purple' : idx === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-400' : 'gradient-red'} rounded-xl flex items-center justify-center`}>
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{segment.segment}</h4>
                          <p className="text-sm text-muted-foreground">
                            {segment.contacts.toLocaleString()} contacts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{segment.openRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MousePointer className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{segment.clickRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Open Rate</div>
                        <Progress value={segment.openRate} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Click Rate</div>
                        <Progress value={segment.clickRate * 10} className="h-2" />
                      </div>
                    </div>
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

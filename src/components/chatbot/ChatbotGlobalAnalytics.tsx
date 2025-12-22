import { useState } from 'react';
import { Download, MessageSquare, Users, TrendingUp, Bot, CheckCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BotConfiguration } from '@/types/chatbot';
import { toast } from 'sonner';

interface ChatbotGlobalAnalyticsProps {
  bots: BotConfiguration[];
}

export const ChatbotGlobalAnalytics = ({ bots }: ChatbotGlobalAnalyticsProps) => {
  const [dateRange, setDateRange] = useState('7d');

  // Aggregate analytics from all bots
  const totalConversations = bots.reduce((sum, bot) => sum + bot.analyticsMock.conversations, 0);
  const totalLeads = bots.reduce((sum, bot) => sum + bot.analyticsMock.leads, 0);
  const avgHandoffRate = Math.round(bots.reduce((sum, bot) => sum + bot.analyticsMock.handoffRate, 0) / bots.length);
  const avgAiContainment = Math.round(bots.reduce((sum, bot) => sum + bot.analyticsMock.aiContainment, 0) / bots.length);
  const avgFlowCompletion = Math.round(bots.reduce((sum, bot) => sum + bot.analyticsMock.flowCompletion, 0) / bots.length);

  const stats = [
    { label: 'Total Conversations', value: totalConversations.toLocaleString(), icon: MessageSquare, color: 'text-[hsl(var(--blue))]', bg: 'bg-[hsl(var(--blue))]/10' },
    { label: 'Total Leads', value: totalLeads.toLocaleString(), icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg Handoff Rate', value: `${avgHandoffRate}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Avg AI Containment', value: `${avgAiContainment}%`, icon: Bot, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Avg Flow Completion', value: `${avgFlowCompletion}%`, icon: CheckCircle, color: 'text-[hsl(var(--teal))]', bg: 'bg-[hsl(var(--teal))]/10' },
  ];

  // Aggregate conversations over time
  const aggregatedConversations = bots[0]?.analyticsMock.conversationsOverTime.map((day, idx) => ({
    date: day.date,
    count: bots.reduce((sum, bot) => sum + (bot.analyticsMock.conversationsOverTime[idx]?.count || 0), 0),
  })) || [];

  const aggregatedLeads = bots[0]?.analyticsMock.leadsOverTime.map((day, idx) => ({
    date: day.date,
    count: bots.reduce((sum, bot) => sum + (bot.analyticsMock.leadsOverTime[idx]?.count || 0), 0),
  })) || [];

  // Bot type distribution
  const botTypeData = [
    { name: 'AI Bots', value: bots.filter(b => b.bot.type === 'ai').length, color: '#3b82f6' },
    { name: 'Pre-fed Bots', value: bots.filter(b => b.bot.type === 'prefed').length, color: '#a855f7' },
    { name: 'Live Chat', value: bots.filter(b => b.bot.type === 'live').length, color: '#10b981' },
  ];

  // Bot performance comparison
  const botPerformance = bots.map(bot => ({
    name: bot.bot.name.substring(0, 15),
    conversations: bot.analyticsMock.conversations,
    leads: bot.analyticsMock.leads,
  }));

  const exportCSV = () => {
    const headers = ['Bot Name', 'Type', 'Status', 'Conversations', 'Leads', 'Handoff Rate', 'AI Containment', 'Flow Completion'];
    const rows = bots.map(bot => [
      bot.bot.name,
      bot.bot.type,
      bot.bot.status,
      bot.analyticsMock.conversations,
      bot.analyticsMock.leads,
      `${bot.analyticsMock.handoffRate}%`,
      `${bot.analyticsMock.aiContainment}%`,
      `${bot.analyticsMock.flowCompletion}%`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chatbot Analytics</h1>
          <p className="text-muted-foreground mt-1">Overview of all chatbot performance across your organization</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Conversations Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={aggregatedConversations}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--teal))" strokeWidth={2} dot={{ fill: 'hsl(var(--teal))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={aggregatedLeads}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Bot Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={botTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {botTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {botTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Bot Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={botPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="conversations" fill="hsl(var(--teal))" radius={[4, 4, 0, 0]} name="Conversations" />
                <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bot Performance Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[hsl(var(--teal))]" />
            Individual Bot Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Bot Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Conversations</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Leads</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Handoff</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">AI Containment</th>
                </tr>
              </thead>
              <tbody>
                {bots.map((bot) => (
                  <tr key={bot.bot.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{bot.bot.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bot.bot.type === 'ai' ? 'bg-blue-100 text-blue-700' :
                        bot.bot.type === 'prefed' ? 'bg-purple-100 text-purple-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {bot.bot.type === 'prefed' ? 'Pre-fed' : bot.bot.type === 'ai' ? 'AI' : 'Live'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bot.bot.status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {bot.bot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{bot.analyticsMock.conversations}</td>
                    <td className="py-3 px-4 text-right">{bot.analyticsMock.leads}</td>
                    <td className="py-3 px-4 text-right">{bot.analyticsMock.handoffRate}%</td>
                    <td className="py-3 px-4 text-right">{bot.analyticsMock.aiContainment}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { useState } from 'react';
import { Download, MessageSquare, Users, TrendingUp, Bot, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useChatbotState } from '@/hooks/useChatbotState';
import { toast } from 'sonner';

interface AnalyticsTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

export const AnalyticsTab = ({ chatbotState }: AnalyticsTabProps) => {
  const { selectedBot } = chatbotState;
  const [dateRange, setDateRange] = useState('7d');

  if (!selectedBot) return null;
  const { analyticsMock } = selectedBot;

  const stats = [
    { label: 'Conversations', value: analyticsMock.conversations, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Leads', value: analyticsMock.leads, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Handoff Rate', value: `${analyticsMock.handoffRate}%`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'AI Containment', value: `${analyticsMock.aiContainment}%`, icon: Bot, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Flow Completion', value: `${analyticsMock.flowCompletion}%`, icon: CheckCircle, color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  const exportCSV = () => {
    const headers = ['Date', 'Conversations', 'Leads'];
    const rows = analyticsMock.conversationsOverTime.map((c, i) => [c.date, c.count, analyticsMock.leadsOverTime[i]?.count || 0]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported!');
  };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft min-w-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} flex-shrink-0`}><stat.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="text-xl lg:text-2xl font-bold truncate">{stat.value}</div>
                  <div className="text-xs text-muted-foreground truncate">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Conversations Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsMock.conversationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(174, 62%, 47%)" strokeWidth={2} dot={{ fill: 'hsl(174, 62%, 47%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Leads Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsMock.leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: 'hsl(142, 71%, 45%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Top Automations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsMock.topAutomations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={150} />
                <Tooltip />
                <Bar dataKey="triggerCount" fill="hsl(214, 78%, 65%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Top Flows by Completion</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsMock.topFlows} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={150} />
                <Tooltip />
                <Bar dataKey="completionRate" fill="hsl(267, 58%, 70%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

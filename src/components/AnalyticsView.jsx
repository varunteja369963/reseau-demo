import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const leadSourceData = [
  { name: 'Google Ads', value: 45 },
  { name: 'Facebook', value: 32 },
  { name: 'Website', value: 28 },
  { name: 'Walk-in', value: 18 },
  { name: 'Referral', value: 22 },
];

const dealStageData = [
  { stage: 'New', count: 52 },
  { stage: 'Contacted', count: 38 },
  { stage: 'Qualified', count: 45 },
  { stage: 'Negotiation', count: 28 },
  { stage: 'Financing', count: 19 },
  { stage: 'Sold', count: 63 },
];

const monthlyTrend = [
  { month: 'Jan', leads: 45, deals: 12 },
  { month: 'Feb', leads: 52, deals: 15 },
  { month: 'Mar', leads: 61, deals: 18 },
  { month: 'Apr', leads: 55, deals: 14 },
  { month: 'May', leads: 68, deals: 22 },
  { month: 'Jun', leads: 72, deals: 25 },
  { month: 'Jul', leads: 65, deals: 19 },
  { month: 'Aug', leads: 78, deals: 28 },
  { month: 'Sep', leads: 85, deals: 31 },
  { month: 'Oct', leads: 92, deals: 35 },
];

const COLORS = ['hsl(var(--teal))', 'hsl(var(--blue))', 'hsl(var(--purple))', '#f59e0b', '#ef4444'];

export const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-foreground">25.7%</div>
          <div className="text-xs text-[hsl(var(--teal))] mt-1">↑ 3.2% from last month</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Avg Deal Value</div>
          <div className="text-3xl font-bold text-foreground">$45,280</div>
          <div className="text-xs text-[hsl(var(--teal))] mt-1">↑ $2.1k from last month</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Response Time</div>
          <div className="text-3xl font-bold text-foreground">18 min</div>
          <div className="text-xs text-red-500 mt-1">↓ 5 min from last month</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Active Deals</div>
          <div className="text-3xl font-bold text-foreground">127</div>
          <div className="text-xs text-[hsl(var(--blue))] mt-1">23 closing this week</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources Pie Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Deal Stages Bar Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Deal Stages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealStageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="hsl(var(--teal))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Line Chart */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="hsl(var(--blue))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--blue))', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="deals" 
              stroke="hsl(var(--teal))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--teal))', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useMemo } from 'react';
import { generateDemoLeads } from '@/utils/demoData';
import { Lead } from '@/types/lead';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from 'lucide-react';

const COLORS = ['hsl(var(--teal))', 'hsl(var(--blue))', 'hsl(var(--purple))', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'];

interface AnalyticsViewProps {
  leads?: Lead[];
}

const StatCard = ({ title, value, change, icon: Icon, trend }: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: any;
  trend?: 'up' | 'down';
}) => (
  <div className="bg-card rounded-2xl p-6 shadow-soft">
    <div className="flex items-start justify-between mb-3">
      <div className="text-sm text-muted-foreground">{title}</div>
      <Icon className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
    {change && (
      <div className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-[hsl(var(--teal))]' : 'text-red-500'}`}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    )}
  </div>
);

export const AnalyticsView = ({ leads: propLeads }: AnalyticsViewProps) => {
  const allLeads = useMemo(() => propLeads || generateDemoLeads(), [propLeads]);
  
  // Calculate analytics data
  const analytics = useMemo(() => {
    // Lead Status Distribution
    const statusCounts = allLeads.reduce((acc, lead) => {
      acc[lead.leadStatus] = (acc[lead.leadStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Lead Source Distribution
    const sourceCounts = allLeads.reduce((acc, lead) => {
      acc[lead.leadSource] = (acc[lead.leadSource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Deal Stage Funnel
    const stageCounts = allLeads.reduce((acc, lead) => {
      acc[lead.dealStage] = (acc[lead.dealStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Salesperson Performance
    const salespersonStats = allLeads.reduce((acc, lead) => {
      if (!acc[lead.assignedSalesperson]) {
        acc[lead.assignedSalesperson] = { leads: 0, sold: 0, revenue: 0 };
      }
      acc[lead.assignedSalesperson].leads++;
      if (lead.leadStatus === 'Sold') {
        acc[lead.assignedSalesperson].sold++;
        acc[lead.assignedSalesperson].revenue += lead.dealValue || 0;
      }
      return acc;
    }, {} as Record<string, { leads: number; sold: number; revenue: number }>);

    // Monthly Trends
    const monthlyData = allLeads.reduce((acc, lead) => {
      const month = new Date(lead.dateOfInquiry).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!acc[month]) {
        acc[month] = { leads: 0, sold: 0, revenue: 0 };
      }
      acc[month].leads++;
      if (lead.leadStatus === 'Sold') {
        acc[month].sold++;
        acc[month].revenue += lead.dealValue || 0;
      }
      return acc;
    }, {} as Record<string, { leads: number; sold: number; revenue: number }>);

    // Vehicle Make Distribution
    const makeData = allLeads.reduce((acc, lead) => {
      acc[lead.vehicleMake] = (acc[lead.vehicleMake] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Geographic Distribution
    const cityData = allLeads.reduce((acc, lead) => {
      acc[lead.city] = (acc[lead.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Marketing Channel Performance
    const channelData = allLeads.reduce((acc, lead) => {
      if (!acc[lead.leadChannel]) {
        acc[lead.leadChannel] = { count: 0, conversions: 0 };
      }
      acc[lead.leadChannel].count++;
      if (lead.leadStatus === 'Sold') {
        acc[lead.leadChannel].conversions++;
      }
      return acc;
    }, {} as Record<string, { count: number; conversions: number }>);

    // Lead Scoring Distribution
    const scoreData = allLeads.reduce((acc, lead) => {
      const score = Math.floor(lead.leadScoring);
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Response Time Analysis
    const responseTimeRanges = { '0-30 min': 0, '31-60 min': 0, '61-120 min': 0, '120+ min': 0 };
    allLeads.forEach(lead => {
      if (lead.responseTime <= 30) responseTimeRanges['0-30 min']++;
      else if (lead.responseTime <= 60) responseTimeRanges['31-60 min']++;
      else if (lead.responseTime <= 120) responseTimeRanges['61-120 min']++;
      else responseTimeRanges['120+ min']++;
    });

    // Lost Reason Analysis
    const lostReasons = allLeads
      .filter(l => l.lostReason)
      .reduce((acc, lead) => {
        acc[lead.lostReason!] = (acc[lead.lostReason!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // New vs Used
    const newUsedData = allLeads.reduce((acc, lead) => {
      acc[lead.newUsed] = (acc[lead.newUsed] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Customer Type
    const customerTypeData = allLeads.reduce((acc, lead) => {
      acc[lead.customerType] = (acc[lead.customerType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Payment Type for Sold
    const paymentTypeData = allLeads
      .filter(l => l.paymentType)
      .reduce((acc, lead) => {
        acc[lead.paymentType!] = (acc[lead.paymentType!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Calculate KPIs
    const totalLeads = allLeads.length;
    const soldLeads = allLeads.filter(l => l.leadStatus === 'Sold').length;
    const conversionRate = ((soldLeads / totalLeads) * 100).toFixed(1);
    const avgDealValue = Math.round(
      allLeads.filter(l => l.dealValue).reduce((sum, l) => sum + (l.dealValue || 0), 0) / soldLeads
    );
    const totalRevenue = allLeads.filter(l => l.dealValue).reduce((sum, l) => sum + (l.dealValue || 0), 0);
    const avgResponseTime = Math.round(
      allLeads.reduce((sum, l) => sum + l.responseTime, 0) / totalLeads
    );
    const activeDeals = allLeads.filter(l => l.dealStatus === 'Open').length;
    const avgCloseProbability = Math.round(
      allLeads.filter(l => l.dealStatus === 'Open').reduce((sum, l) => sum + l.closeProbability, 0) /
      activeDeals
    );

    return {
      statusCounts,
      sourceCounts,
      stageCounts,
      salespersonStats,
      monthlyData,
      makeData,
      cityData,
      channelData,
      scoreData,
      responseTimeRanges,
      lostReasons,
      newUsedData,
      customerTypeData,
      paymentTypeData,
      kpis: {
        totalLeads,
        soldLeads,
        conversionRate,
        avgDealValue,
        totalRevenue,
        avgResponseTime,
        activeDeals,
        avgCloseProbability
      }
    };
  }, [allLeads]);

  // Transform data for charts
  const leadSourceChart = Object.entries(analytics.sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dealStageChart = Object.entries(analytics.stageCounts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => {
      const order = ['Inquiry', 'Contacted', 'Qualified', 'Negotiation', 'Financing', 'Sold', 'Lost'];
      return order.indexOf(a.stage) - order.indexOf(b.stage);
    });

  const salespersonChart = Object.entries(analytics.salespersonStats)
    .map(([name, stats]) => ({ name, leads: stats.leads, sold: stats.sold, revenue: stats.revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  const monthlyTrendChart = Object.entries(analytics.monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-12);

  const vehicleMakeChart = Object.entries(analytics.makeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const cityChart = Object.entries(analytics.cityData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const channelChart = Object.entries(analytics.channelData)
    .map(([name, data]) => ({ 
      name, 
      leads: data.count, 
      conversions: data.conversions,
      rate: ((data.conversions / data.count) * 100).toFixed(1)
    }))
    .sort((a, b) => b.conversions - a.conversions);

  const scoreChart = Object.entries(analytics.scoreData)
    .map(([score, count]) => ({ score: `${score} stars`, count }))
    .sort((a, b) => parseFloat(a.score) - parseFloat(b.score));

  const responseTimeChart = Object.entries(analytics.responseTimeRanges)
    .map(([range, count]) => ({ range, count }));

  const lostReasonChart = Object.entries(analytics.lostReasons)
    .map(([reason, value]) => ({ reason, value }));

  const newUsedChart = Object.entries(analytics.newUsedData)
    .map(([type, value]) => ({ type, value }));

  const customerTypeChart = Object.entries(analytics.customerTypeData)
    .map(([type, value]) => ({ type, value }));

  const paymentTypeChart = Object.entries(analytics.paymentTypeData)
    .map(([type, value]) => ({ type, value }));

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Leads" 
          value={analytics.kpis.totalLeads} 
          change="+12% from last month"
          icon={Users}
          trend="up"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${analytics.kpis.conversionRate}%`}
          change="+3.2% from last month"
          icon={Target}
          trend="up"
        />
        <StatCard 
          title="Avg Deal Value" 
          value={`$${(analytics.kpis.avgDealValue / 1000).toFixed(0)}K`}
          change="+$2.1k from last month"
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Avg Response Time" 
          value={`${analytics.kpis.avgResponseTime} min`}
          change="-5 min from last month"
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-foreground">${(analytics.kpis.totalRevenue / 1000000).toFixed(2)}M</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Active Deals</div>
          <div className="text-3xl font-bold text-foreground">{analytics.kpis.activeDeals}</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Avg Close Probability</div>
          <div className="text-3xl font-bold text-foreground">{analytics.kpis.avgCloseProbability}%</div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="text-sm text-muted-foreground mb-2">Deals Closed</div>
          <div className="text-3xl font-bold text-foreground">{analytics.kpis.soldLeads}</div>
        </div>
      </div>

      {/* Monthly Revenue & Lead Trends */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Performance Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyTrendChart}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--blue))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--blue))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="leads" 
              stroke="hsl(var(--blue))" 
              fillOpacity={1} 
              fill="url(#colorLeads)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="sold" 
              stroke="hsl(var(--teal))" 
              fillOpacity={1} 
              fill="url(#colorSold)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Deal Stage Funnel & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales Funnel by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealStageChart} layout="vertical">
              <defs>
                <linearGradient id="gradientTeal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
              <Bar dataKey="count" fill="url(#gradientTeal)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourceChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--card))"
                strokeWidth={3}
              >
                {leadSourceChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salesperson Performance */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Salesperson Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salespersonChart}>
            <defs>
              <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--blue))" stopOpacity={1}/>
                <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="gradientTealBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-medium)'
              }} 
            />
            <Legend />
            <Bar dataKey="leads" fill="url(#gradientBlue)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sold" fill="url(#gradientTealBar)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vehicle Interest & Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Vehicle Makes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vehicleMakeChart}>
              <defs>
                <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={1}/>
                  <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
              <Bar dataKey="value" fill="url(#gradientPurple)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Geographic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityChart}>
              <defs>
                <linearGradient id="gradientOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
              <Bar dataKey="value" fill="url(#gradientOrange)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Marketing Channel Performance */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Marketing Channel Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={channelChart}>
            <defs>
              <linearGradient id="gradientBlue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--blue))" stopOpacity={1}/>
                <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0.7}/>
              </linearGradient>
              <linearGradient id="gradientTealBar2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-medium)'
              }} 
            />
            <Legend />
            <Bar dataKey="leads" fill="url(#gradientBlue2)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="conversions" fill="url(#gradientTealBar2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Response Time & Lead Scoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Response Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimeChart}>
              <defs>
                <linearGradient id="gradientTeal3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                  <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
              <Bar dataKey="count" fill="url(#gradientTeal3)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lead Scoring Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreChart}>
              <defs>
                <linearGradient id="gradientPurple2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={1}/>
                  <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="score" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
              <Bar dataKey="count" fill="url(#gradientPurple2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lost Reasons & Vehicle Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lostReasonChart.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Lost Deal Reasons</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lostReasonChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ reason, percent }) => `${reason} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={95}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                >
                  {lostReasonChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-medium)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">New vs Used Vehicles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={newUsedChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--card))"
                strokeWidth={3}
              >
                {newUsedChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Type & Payment Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Customer Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                outerRadius={95}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--card))"
                strokeWidth={3}
              >
                {customerTypeChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-medium)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {paymentTypeChart.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Type (Sold Deals)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentTypeChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={95}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                >
                  {paymentTypeChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-medium)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

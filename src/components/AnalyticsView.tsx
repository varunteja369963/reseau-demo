import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { useMemo, useState, useEffect, useRef } from 'react';
import { generateDemoLeads } from '@/utils/demoData';
import { Lead } from '@/types/lead';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock, BarChart3, UserCheck, Package, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';

const COLORS = ['hsl(var(--teal))', 'hsl(var(--blue))', 'hsl(var(--purple))', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981'];

interface AnalyticsViewProps {
  leads?: Lead[];
  navOffset?: number;
}

const StatCard = ({ title, value, change, icon: Icon, trend }: { 
  title: string; 
  value: string | number; 
  change?: string; 
  icon: any;
  trend?: 'up' | 'down';
}) => (
  <div className="group relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50">
    <div className="flex items-start justify-between mb-3">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="p-2 rounded-lg bg-primary/5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
    {change && (
      <div className={`text-xs flex items-center gap-1 font-medium ${trend === 'up' ? 'text-[hsl(var(--teal))]' : 'text-red-500'}`}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) => (
  <div className={`bg-gradient-to-br from-card via-card to-card/80 rounded-2xl p-6 shadow-soft border border-border/50 ${fullWidth ? 'col-span-full' : ''}`}>
    <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

const navigationSections = [
  { id: 'executive', label: 'Executive Overview', icon: BarChart3 },
  { id: 'sales', label: 'Sales Performance', icon: TrendingUp },
  { id: 'leads', label: 'Lead Management', icon: Users },
  { id: 'team', label: 'Team Performance', icon: UserCheck },
  { id: 'customers', label: 'Customer Insights', icon: Target },
  { id: 'products', label: 'Product & Market', icon: Package },
];

export const AnalyticsView = ({ leads: propLeads, navOffset }: AnalyticsViewProps) => {
  const allLeads = useMemo(() => propLeads || generateDemoLeads(), [propLeads]);
  const [activeSection, setActiveSection] = useState('executive');
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    
    const navHeight = navRef.current?.offsetHeight ?? 56;
    const totalOffset = (navOffset ?? 0) + navHeight + 8;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const scrollPosition = elementPosition - totalOffset;

    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
    setActiveSection(sectionId);
  };
  
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

    // Deal Status Distribution
    const dealStatusCounts = allLeads.reduce((acc, lead) => {
      acc[lead.dealStatus] = (acc[lead.dealStatus] || 0) + 1;
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

    // Vehicle Model Distribution
    const modelData = allLeads.reduce((acc, lead) => {
      acc[lead.vehicleModel] = (acc[lead.vehicleModel] || 0) + 1;
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

    // Close Probability Distribution
    const closeProbRanges = { '0-25%': 0, '26-50%': 0, '51-75%': 0, '76-100%': 0 };
    allLeads.forEach(lead => {
      if (lead.closeProbability <= 25) closeProbRanges['0-25%']++;
      else if (lead.closeProbability <= 50) closeProbRanges['26-50%']++;
      else if (lead.closeProbability <= 75) closeProbRanges['51-75%']++;
      else closeProbRanges['76-100%']++;
    });

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
    const lostLeads = allLeads.filter(l => l.leadStatus === 'Lost').length;
    const avgLeadScore = (allLeads.reduce((sum, l) => sum + l.leadScoring, 0) / totalLeads).toFixed(1);

    return {
      statusCounts,
      sourceCounts,
      stageCounts,
      dealStatusCounts,
      salespersonStats,
      monthlyData,
      makeData,
      modelData,
      cityData,
      channelData,
      scoreData,
      responseTimeRanges,
      lostReasons,
      newUsedData,
      customerTypeData,
      paymentTypeData,
      closeProbRanges,
      kpis: {
        totalLeads,
        soldLeads,
        lostLeads,
        conversionRate,
        avgDealValue,
        totalRevenue,
        avgResponseTime,
        activeDeals,
        avgCloseProbability,
        avgLeadScore
      }
    };
  }, [allLeads]);

  // Transform data for charts
  const leadSourceChart = Object.entries(analytics.sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const leadStatusChart = Object.entries(analytics.statusCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dealStatusChart = Object.entries(analytics.dealStatusCounts)
    .map(([name, value]) => ({ name, value }));

  const dealStageChart = Object.entries(analytics.stageCounts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => {
      const order = ['Inquiry', 'Contacted', 'Qualified', 'Negotiation', 'Financing', 'Sold', 'Lost'];
      return order.indexOf(a.stage) - order.indexOf(b.stage);
    });

  const salespersonChart = Object.entries(analytics.salespersonStats)
    .map(([name, stats]) => ({ name, leads: stats.leads, sold: stats.sold, revenue: stats.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const monthlyTrendChart = Object.entries(analytics.monthlyData)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-12);

  const vehicleMakeChart = Object.entries(analytics.makeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const vehicleModelChart = Object.entries(analytics.modelData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const cityChart = Object.entries(analytics.cityData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

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

  const closeProbChart = Object.entries(analytics.closeProbRanges)
    .map(([range, count]) => ({ range, count }));

  return (
    <div className="relative">
      {/* Navigation Bar - Always Sticky */}
      <div
        ref={navRef}
        className={`sticky z-30 -mx-6 px-6 py-4 mb-6 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
        style={{ top: 0 }}
      >
        <div className="relative flex items-center">
          {/* Scroll indicator */}
          <div className="absolute left-0 z-10 flex items-center justify-center w-8 h-full bg-gradient-to-r from-background via-background to-transparent pointer-events-none">
            <ChevronRight className="w-4 h-4 text-muted-foreground animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto scroll-smooth scrollbar-none pl-8">
            {navigationSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                      : 'bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground hover:scale-102'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-12 pb-8">

      {/* Executive Overview */}
      <section id="executive">
        <SectionHeader 
          icon={BarChart3} 
          title="Executive Overview" 
          description="Key performance indicators and business metrics at a glance"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 shadow-soft border border-border/50">
            <div className="text-sm font-medium text-muted-foreground mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-foreground">${(analytics.kpis.totalRevenue / 1000000).toFixed(2)}M</div>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 shadow-soft border border-border/50">
            <div className="text-sm font-medium text-muted-foreground mb-2">Active Deals</div>
            <div className="text-3xl font-bold text-foreground">{analytics.kpis.activeDeals}</div>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 shadow-soft border border-border/50">
            <div className="text-sm font-medium text-muted-foreground mb-2">Avg Lead Score</div>
            <div className="text-3xl font-bold text-foreground">{analytics.kpis.avgLeadScore} <Star className="w-5 h-5 inline text-yellow-500" /></div>
          </div>
          <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 shadow-soft border border-border/50">
            <div className="text-sm font-medium text-muted-foreground mb-2">Deals Closed</div>
            <div className="text-3xl font-bold text-foreground">{analytics.kpis.soldLeads}</div>
          </div>
        </div>
      </section>

      {/* Sales Performance */}
      <section id="sales">
        <SectionHeader 
          icon={TrendingUp} 
          title="Sales Performance" 
          description="Track revenue, conversions, and sales trends over time"
        />
        
        <div className="grid grid-cols-1 gap-6">
          <ChartCard title="Monthly Performance Trends" fullWidth>
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(var(--blue))" 
                  fillOpacity={1} 
                  fill="url(#colorLeads)"
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="sold" 
                  stroke="hsl(var(--teal))" 
                  fillOpacity={1} 
                  fill="url(#colorSold)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Sales Funnel by Stage">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dealStageChart} layout="vertical">
                  <defs>
                    <linearGradient id="stageGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#stageGradient)" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Close Probability Distribution">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={closeProbChart}>
                  <defs>
                    <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={1}/>
                      <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#probGradient)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </section>

      {/* Lead Management */}
      <section id="leads">
        <SectionHeader 
          icon={Target} 
          title="Lead Management" 
          description="Analyze lead sources, status, and quality metrics"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Lead Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
                >
                  {leadStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lead Sources">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lead Scoring Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreChart}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="score" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="url(#scoreGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Deal Status Overview">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealStatusChart}>
                <defs>
                  <linearGradient id="dealStatusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--blue))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="url(#dealStatusGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Team Performance */}
      <section id="team">
        <SectionHeader 
          icon={UserCheck} 
          title="Team Performance" 
          description="Sales team metrics and individual performance tracking"
        />
        
        <div className="grid grid-cols-1 gap-6">
          <ChartCard title="Salesperson Performance" fullWidth>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salespersonChart}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--blue))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="soldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="leads" fill="url(#leadsGradient)" radius={[12, 12, 0, 0]} />
                <Bar dataKey="sold" fill="url(#soldGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Marketing Channel Performance">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelChart}>
                  <defs>
                    <linearGradient id="channelLeadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={1}/>
                      <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="channelConvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                      <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="leads" fill="url(#channelLeadsGrad)" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="conversions" fill="url(#channelConvGrad)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Response Time Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseTimeChart}>
                  <defs>
                    <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--teal))" stopOpacity={1}/>
                      <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#responseGradient)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </section>

      {/* Customer Insights */}
      <section id="customers">
        <SectionHeader 
          icon={Users} 
          title="Customer Insights" 
          description="Understand customer demographics, preferences, and buying patterns"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Customer Type Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerTypeChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="New vs Used Vehicles">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={newUsedChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {paymentTypeChart.length > 0 && (
            <ChartCard title="Payment Type (Sold Deals)">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentTypeChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={65}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={4}
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
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {lostReasonChart.length > 0 && (
            <ChartCard title="Lost Deal Reasons">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lostReasonChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ reason, percent }) => `${reason} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={65}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="hsl(var(--card))"
                    strokeWidth={4}
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
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      </section>

      {/* Product & Market Analysis */}
      <section id="products">
        <SectionHeader 
          icon={Package} 
          title="Product & Market Analysis" 
          description="Vehicle preferences and geographic distribution insights"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Top Vehicle Makes">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={vehicleMakeChart}>
                <defs>
                  <linearGradient id="makeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--purple))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--purple))" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={80} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="url(#makeGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Vehicle Models">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={vehicleModelChart}>
                <defs>
                  <linearGradient id="modelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--blue))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--blue))" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={80} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="url(#modelGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Geographic Distribution" fullWidth>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cityChart}>
                <defs>
                  <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="value" fill="url(#cityGradient)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
      </div>
    </div>
  );
};
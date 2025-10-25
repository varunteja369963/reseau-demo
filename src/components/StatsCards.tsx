import { TrendingUp, CheckCircle, Inbox } from "lucide-react";

const stats = [
  {
    title: "Leads",
    value: "245",
    gradient: "gradient-teal",
    icon: TrendingUp,
    lightBg: "bg-[hsl(var(--teal-light))]",
  },
  {
    title: "Qualified",
    value: "30",
    gradient: "gradient-blue",
    icon: CheckCircle,
    lightBg: "bg-[hsl(var(--blue-light))]",
  },
  {
    title: "Cold",
    value: "95",
    gradient: "gradient-purple",
    icon: Inbox,
    lightBg: "bg-[hsl(var(--purple-light))]",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <button
          key={stat.title}
          className="bg-card rounded-3xl p-6 shadow-soft hover:shadow-medium transition-smooth text-left group overflow-hidden relative"
        >
          {/* Background decoration */}
          <div className={`absolute -right-6 -bottom-6 w-32 h-32 ${stat.lightBg} rounded-full opacity-20 group-hover:scale-110 transition-smooth`} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-muted-foreground text-sm font-medium">{stat.title}</div>
            </div>
            
            <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${stat.gradient} rounded-full`} style={{ width: '70%' }} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

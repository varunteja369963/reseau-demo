import { TrendingUp, CheckCircle, Inbox, PhoneMissed, LucideIcon, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface Stat {
  title: string;
  value: number;
  gradient: string;
  icon: LucideIcon;
  lightBg: string;
}

const stats: Stat[] = [
  {
    title: "Leads",
    value: 245,
    gradient: "gradient-teal",
    icon: TrendingUp,
    lightBg: "bg-[hsl(var(--teal-light))]",
  },
  {
    title: "Qualified",
    value: 30,
    gradient: "gradient-blue",
    icon: CheckCircle,
    lightBg: "bg-[hsl(var(--blue-light))]",
  },
  {
    title: "Cold",
    value: 95,
    gradient: "gradient-purple",
    icon: Inbox,
    lightBg: "bg-[hsl(var(--purple-light))]",
  },
  {
    title: "DNP",
    value: 52,
    gradient: "gradient-red",
    icon: PhoneMissed,
    lightBg: "bg-[hsl(var(--red-light))]",
  },
];

const maxValue = Math.max(...stats.map(s => s.value));

export const StatsCards = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-end gap-1.5 mb-3 py-1.5 hover:bg-muted/30 rounded-lg transition-smooth group">
          <span className="text-xs font-medium text-muted-foreground/70 group-hover:text-muted-foreground transition-smooth">
            {isOpen ? 'Hide' : 'Show Overview'}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-muted-foreground transition-all ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const percentage = (stat.value / maxValue) * 100;
            
            return (
              <button
                key={stat.title}
                className="bg-card rounded-3xl p-6 shadow-soft hover:shadow-medium transition-smooth text-left group overflow-hidden relative"
              >
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
                    <div className={`h-full ${stat.gradient} rounded-full transition-smooth`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

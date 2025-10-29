import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  FileText, 
  Workflow, 
  BarChart3, 
  Settings 
} from "lucide-react";

interface EmailTopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const EmailTopNav = ({ activeTab, setActiveTab }: EmailTopNavProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "campaigns", label: "Campaigns", icon: Send },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "automations", label: "Automations", icon: Workflow },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50 mb-6">
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

import { Radar, Mail, MessageSquare, Megaphone, Phone, Bot, Package, Plug, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: Radar, label: "My Radar", path: "/" },
  { icon: Mail, label: "CRM", path: "/crm", active: true },
  { icon: MessageSquare, label: "Email Marketing", path: "/email" },
  { icon: MessageSquare, label: "SMS", path: "/sms" },
  { icon: Megaphone, label: "Ads", path: "/ads" },
  { icon: Phone, label: "Calls", path: "/calls" },
  { icon: Bot, label: "Chatbot", path: "/chatbot" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Plug, label: "Integration", path: "/integration" },
  { icon: Zap, label: "Automations", path: "/automations" },
];

export const Sidebar = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 gradient-sidebar text-white z-50 flex flex-col items-center py-6 shadow-strong">
      {/* Logo */}
      <div className="mb-8 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
          <span className="text-[hsl(var(--sidebar-dark))] font-bold text-xl">R</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-smooth relative group",
              item.active
                ? "bg-white/20 backdrop-blur-sm"
                : "hover:bg-white/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium text-center leading-tight">
              {item.label.split(" ").map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </span>
            
            {/* Hover tooltip for desktop */}
            {hoveredIndex === index && (
              <div className="hidden lg:block absolute left-full ml-4 bg-white text-[hsl(var(--foreground))] px-3 py-2 rounded-lg shadow-medium whitespace-nowrap text-sm font-medium">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white" />
              </div>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

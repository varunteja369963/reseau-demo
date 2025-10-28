import { Radar, Users, Mail, Megaphone, Headset, Bot, Package, Plug, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Radar, label: "My Radar", path: "/" },
  { icon: Users, label: "CRM", path: "/crm" },
  { icon: Mail, label: "Email", path: "/email" },
  { icon: MessageSquare, label: "SMS", path: "/sms" },
  { icon: Headset, label: "Calls", path: "/calls" },
  { icon: Bot, label: "Chatbot", path: "/chatbot" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: Megaphone, label: "Ads", path: "/ads" },
  { icon: Zap, label: "Automation", path: "/automation" },
  { icon: Plug, label: "Integration", path: "/integration" },
];

export const Sidebar = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-[60] lg:hidden bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] text-white p-2 rounded-xl shadow-medium"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-24 gradient-sidebar text-white z-50 flex flex-col items-center py-6 shadow-strong transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Logo */}
      <div className="mb-8 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
          <span className="text-[hsl(var(--sidebar-dark))] font-bold text-xl">R</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            to={item.path}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl transition-smooth relative group flex-shrink-0",
              location.pathname === item.path
                ? "bg-white/20 backdrop-blur-sm"
                : "hover:bg-white/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium text-center leading-tight whitespace-nowrap">
              {item.label}
            </span>
            
            {/* Hover tooltip for desktop */}
            {hoveredIndex === index && (
              <div className="hidden lg:block absolute left-full ml-4 bg-white text-[hsl(var(--foreground))] px-3 py-2 rounded-lg shadow-medium whitespace-nowrap text-sm font-medium z-[100]">
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white" />
              </div>
            )}
          </Link>
        ))}
      </nav>
    </aside>
    </>
  );
};

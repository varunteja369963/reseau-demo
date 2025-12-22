import { ChevronDown, Building2, Building, Settings, Bell, UserPlus, MessageSquare, AlertCircle, CheckCircle, Calendar, Bot } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface ChatbotTopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const notifications = [
  { id: 1, type: 'lead', icon: UserPlus, title: 'New lead captured', message: 'Chatbot collected info from visitor', time: '2 min ago', read: false },
  { id: 2, type: 'message', icon: MessageSquare, title: 'Live chat request', message: 'Customer waiting for agent', time: '15 min ago', read: false },
  { id: 3, type: 'alert', icon: AlertCircle, title: 'Bot offline', message: 'Website chatbot needs attention', time: '1 hour ago', read: false },
  { id: 4, type: 'success', icon: CheckCircle, title: 'Flow completed', message: 'Vehicle inquiry flow finished', time: '3 hours ago', read: true },
  { id: 5, type: 'calendar', icon: Calendar, title: 'Appointment booked', message: 'Test drive via chatbot', time: '5 hours ago', read: true },
];

export const ChatbotTopNav = ({ activeTab, setActiveTab }: ChatbotTopNavProps) => {
  const [selectedDealership, setSelectedDealership] = useState<string>('Reseau (Org)');

  const organization = 'Reseau (Org)';
  const dealerships: string[] = [
    'Reseau Chev Kelowna',
    'Reseau Kia Penticton',
    'Reseau Honda Vernon'
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4">
        {/* Left: Toggle */}
        <div className="flex items-center gap-2 md:gap-8 flex-1 lg:flex-initial overflow-x-auto scrollbar-hide">
          <div className="flex bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab("console")}
              className={cn(
                "px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-smooth whitespace-nowrap flex items-center gap-2",
                activeTab === "console"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bot className="w-4 h-4" />
              Console
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-smooth whitespace-nowrap",
                activeTab === "analytics"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-smooth flex items-center justify-center",
                activeTab === "settings"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Settings"
            >
              <Settings className="w-4 md:w-5 h-4 md:h-5" />
            </button>
          </div>
        </div>

        {/* Right: Profile - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dealership Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-2xl transition-smooth">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedDealership}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" sideOffset={8} className="z-[500] w-72 p-2 bg-card rounded-2xl shadow-strong border border-border">
              {/* Organization */}
              <button
                onClick={() => setSelectedDealership(organization)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth text-left",
                  selectedDealership === organization
                    ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"
                    : "hover:bg-muted"
                )}
              >
                <Building2 className="w-5 h-5" />
                <div className="text-sm font-semibold">{organization}</div>
              </button>

              {/* Divider */}
              <div className="my-1 mx-4 border-t border-border/50" />

              {/* Dealerships */}
              <div className="pl-2">
                {dealerships.map((dealer) => (
                  <button
                    key={dealer}
                    onClick={() => setSelectedDealership(dealer)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-smooth text-left",
                      selectedDealership === dealer
                        ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"
                        : "hover:bg-muted"
                    )}
                  >
                    <Building className="w-4 h-4 opacity-70" />
                    <div className="text-sm font-medium">{dealer}</div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Notifications Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative flex items-center justify-center hover:bg-muted p-2 rounded-xl transition-smooth">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" sideOffset={8} className="z-[500] w-80 p-0 bg-card rounded-2xl shadow-strong border border-border">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <button className="text-xs text-primary hover:underline">Mark all as read</button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 hover:bg-muted transition-smooth text-left border-b border-border/50 last:border-0",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      notification.type === 'lead' && "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]",
                      notification.type === 'message' && "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]",
                      notification.type === 'alert' && "bg-orange-500/10 text-orange-500",
                      notification.type === 'success' && "bg-green-500/10 text-green-500",
                      notification.type === 'calendar' && "bg-purple-500/10 text-purple-500"
                    )}>
                      <notification.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{notification.title}</span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                      <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <button className="w-full text-center text-sm text-primary hover:underline">
                  View all notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border" />

          {/* Profile Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-2xl transition-smooth">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] flex items-center justify-center text-white text-sm font-semibold">
                  S
                </div>
                <span className="text-sm font-medium">Sean</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" sideOffset={8} className="z-[500] w-56 p-2 bg-card rounded-2xl shadow-strong border border-border">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-smooth text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] flex items-center justify-center text-white text-sm font-semibold">
                  S
                </div>
                <div>
                  <div className="text-sm font-medium">Profile</div>
                  <div className="text-xs text-muted-foreground">View your profile</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-smooth text-left">
                <div className="text-sm font-medium">Access Management</div>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-smooth text-left">
                <div className="text-sm font-medium">Settings</div>
              </button>
              <div className="my-2 border-t border-border" />
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-smooth text-left">
                <div className="text-sm font-medium">Logout</div>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
};
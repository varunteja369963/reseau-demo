import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  Phone,
  ShoppingCart,
  GitBranch,
  PhoneCall,
  History,
  FileAudio,
  Shield,
  ArrowRightLeft,
  Settings,
  ClipboardList,
  ChevronDown,
  Plus,
  Bell,
  HelpCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CallsTab } from "@/pages/Calls";

interface CallsTopNavProps {
  activeTab: CallsTab;
  onTabChange: (tab: CallsTab) => void;
}

const navItems: { id: CallsTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "connection", label: "Twilio Connection", icon: Link2 },
  { id: "owned", label: "Phone Numbers", icon: Phone },
  { id: "buy", label: "Buy Numbers", icon: ShoppingCart },
  { id: "flows", label: "Call Flows", icon: GitBranch },
  { id: "dialer", label: "Dialer", icon: PhoneCall },
  { id: "calls", label: "Calls", icon: History },
  { id: "recordings", label: "Recordings", icon: FileAudio },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "porting", label: "Porting", icon: ArrowRightLeft },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "audit", label: "Audit Logs", icon: ClipboardList },
];

export function CallsTopNav({ activeTab, onTabChange }: CallsTopNavProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="border-b border-border bg-card">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Calls & Phone</h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search numbers, calls, flows..."
                className="pl-9"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              Search...
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onTabChange("buy")}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy a Number
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange("flows")}>
                <GitBranch className="h-4 w-4 mr-2" />
                Create Call Flow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange("dialer")}>
                <PhoneCall className="h-4 w-4 mr-2" />
                Start a Call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTabChange("porting")}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Port a Number
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Switch Organization</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/login")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`gap-2 whitespace-nowrap ${
                isActive ? "bg-secondary text-secondary-foreground" : ""
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

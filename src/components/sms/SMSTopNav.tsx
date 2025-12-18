import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Workflow,
  Inbox,
  Users,
  ListTree,
  FileText,
  Shield,
  Settings,
  CreditCard,
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
import type { SMSTab } from "@/pages/SMS";

interface SMSTopNavProps {
  activeTab: SMSTab;
  onTabChange: (tab: SMSTab) => void;
}

const navItems: { id: SMSTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "automations", label: "Automations", icon: Workflow },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "lists", label: "Lists & Segments", icon: ListTree },
  { id: "templates", label: "Templates", icon: FileText },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export function SMSTopNav({ activeTab, onTabChange }: SMSTopNavProps) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="border-b border-border bg-card">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">SMS Marketing</h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          {searchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts, campaigns, messages..."
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
              <DropdownMenuItem onClick={() => onTabChange("campaigns")}>
                <Megaphone className="h-4 w-4 mr-2" />
                New Campaign
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange("automations")}>
                <Workflow className="h-4 w-4 mr-2" />
                New Automation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange("templates")}>
                <FileText className="h-4 w-4 mr-2" />
                New Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTabChange("contacts")}>
                <Users className="h-4 w-4 mr-2" />
                Add Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange("contacts")}>
                <ListTree className="h-4 w-4 mr-2" />
                Import Contacts
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

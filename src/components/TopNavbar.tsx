import { ChevronDown, Building2, Building, Settings, History } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopNavbar = ({ activeTab, setActiveTab }: TopNavbarProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDealershipDropdown, setShowDealershipDropdown] = useState<boolean>(false);
  const [selectedDealership, setSelectedDealership] = useState<string>('Reseau (Org)');
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const dealershipDropdownRef = useRef<HTMLDivElement>(null);

  const organization = 'Reseau (Org)';
  const dealerships: string[] = [
    'Reseau Chev Kelowna',
    'Reseau Kia Penticton',
    'Reseau Honda Vernon'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (dealershipDropdownRef.current && !dealershipDropdownRef.current.contains(event.target as Node)) {
        setShowDealershipDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-40 max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 max-w-[calc(100vw-6rem)]">
        {/* Left: Toggle */}
        <div className="flex items-center gap-2 md:gap-8 flex-1 lg:flex-initial overflow-x-auto scrollbar-hide">
          <div className="flex bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab("crm")}
              className={cn(
                "px-3 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-smooth whitespace-nowrap",
                activeTab === "crm"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              CRM
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
              onClick={() => setActiveTab("history")}
              className={cn(
                "px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-smooth flex items-center justify-center",
                activeTab === "history"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="History"
            >
              <History className="w-4 md:w-5 h-4 md:h-5" />
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
          <div className="relative" ref={dealershipDropdownRef}>
            <button
              onClick={() => setShowDealershipDropdown(!showDealershipDropdown)}
              className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-2xl transition-smooth"
            >
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedDealership}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showDealershipDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-card rounded-2xl shadow-strong border border-border overflow-hidden z-50">
                <div className="p-2">
                  {/* Organization */}
                  <button
                    onClick={() => {
                      setSelectedDealership(organization);
                      setShowDealershipDropdown(false);
                    }}
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
                        onClick={() => {
                          setSelectedDealership(dealer);
                          setShowDealershipDropdown(false);
                        }}
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
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-2xl transition-smooth"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] flex items-center justify-center text-white text-sm font-semibold">
                S
              </div>
              <span className="text-sm font-medium">Sean</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-strong border border-border overflow-hidden z-50">
                <div className="p-2">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

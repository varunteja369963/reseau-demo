import { ChevronDown, DollarSign, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const TopNavbar = ({ activeTab, setActiveTab }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDealershipDropdown, setShowDealershipDropdown] = useState(false);
  const [selectedDealership, setSelectedDealership] = useState('Reseau (Org)');

  const dealerships = [
    'Reseau (Org)',
    'Reseau Chev Kelowna',
    'Reseau Kia Penticton',
    'Reseau Honda Vernon'
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Toggle */}
        <div className="flex items-center gap-8">
          <div className="flex bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab("crm")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-smooth",
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
                "px-6 py-2 rounded-full text-sm font-medium transition-smooth",
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
                "px-6 py-2 rounded-full text-sm font-medium transition-smooth",
                activeTab === "settings"
                  ? "bg-white shadow-soft text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          {/* Dealership Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDealershipDropdown(!showDealershipDropdown)}
              className="flex items-center gap-2 hover:bg-muted px-4 py-2 rounded-2xl transition-smooth"
            >
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedDealership}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {showDealershipDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-card rounded-2xl shadow-strong border border-border overflow-hidden z-50">
                <div className="p-2">
                  {dealerships.map((dealer) => (
                    <button
                      key={dealer}
                      onClick={() => {
                        setSelectedDealership(dealer);
                        setShowDealershipDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth text-left",
                        selectedDealership === dealer
                          ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]"
                          : "hover:bg-muted"
                      )}
                    >
                      <Building2 className="w-4 h-4" />
                      <div className="text-sm font-medium">{dealer}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Profile Dropdown */}
          <div className="relative">
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

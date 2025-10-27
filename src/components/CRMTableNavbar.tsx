import { Filter, UserPlus, Calendar, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { useEffect, useRef, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface CRMTableNavbarProps {
  isFilterOpen?: boolean;
  onToggleFilter?: () => void;
}

export const CRMTableNavbar = ({ isFilterOpen = false, onToggleFilter }: CRMTableNavbarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (isSearchFocused && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [isSearchFocused]);

  const presets = [
    {
      label: "Today",
      value: () => ({ from: new Date(), to: new Date() })
    },
    {
      label: "Yesterday",
      value: () => {
        const yesterday = subDays(new Date(), 1);
        return { from: yesterday, to: yesterday };
      }
    },
    {
      label: "Last 7 days",
      value: () => ({ from: subDays(new Date(), 6), to: new Date() })
    },
    {
      label: "Last 30 days",
      value: () => ({ from: subDays(new Date(), 29), to: new Date() })
    },
    {
      label: "This month",
      value: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) })
    },
    {
      label: "Last month",
      value: () => {
        const lastMonth = subMonths(new Date(), 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      }
    },
    {
      label: "This year",
      value: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) })
    },
    {
      label: "Last year",
      value: () => {
        const lastYear = subYears(new Date(), 1);
        return { from: startOfYear(lastYear), to: endOfYear(lastYear) };
      }
    }
  ];

  const formatDateRange = () => {
    if (!date?.from) return "Date Range";
    if (!date.to) return format(date.from, "MMM dd, yyyy");
    return `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      {/* Compact search expands on focus; closes on outside click without flicker */}
      <div ref={searchRef} className={cn(
        "relative transition-all duration-300 ease-in-out",
        isSearchFocused ? "w-full max-w-md" : "w-48"
      )}>
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search Leads..."
          className="rounded-2xl border-border bg-background h-10 pl-11 w-full"
          onFocus={() => setIsSearchFocused(true)}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button 
          onClick={onToggleFilter}
          variant={isFilterOpen ? "default" : "outline"}
          className={`h-10 rounded-2xl transition-smooth ${
            isFilterOpen 
              ? "shadow-medium" 
              : "border-border hover:bg-muted"
          }`}
        >
          {isFilterOpen ? (
            <>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Show Filters
            </>
          )}
        </Button>
        
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "h-10 rounded-2xl border-border hover:bg-muted transition-smooth",
                date?.from && "shadow-soft"
              )}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex">
              <div className="border-r border-border p-3 flex flex-col space-y-1">
                <div className="text-sm font-medium mb-2">Quick Select</div>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-sm h-8 px-2 w-full"
                    onClick={() => {
                      setDate(preset.value());
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
                {date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-sm text-destructive hover:text-destructive h-8 px-2 w-full"
                    onClick={() => setDate(undefined)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-col">
                <div className="p-3">
                  <CalendarComponent
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className={cn("pointer-events-auto")}
                  />
                </div>
                {date?.from && (
                  <div className="border-t border-border p-3 flex justify-end">
                    <Button 
                      size="sm"
                      className="h-8 px-6 rounded-lg"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Select
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="h-10 rounded-2xl gradient-teal text-white font-medium shadow-soft hover:shadow-medium transition-smooth">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};

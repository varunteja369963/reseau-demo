import { Filter, UserPlus, Calendar, Search, SlidersHorizontal, Columns3, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { AddCustomerModal } from "./modals/AddCustomerModal";

interface CRMTableNavbarProps {
  isFilterOpen?: boolean;
  onToggleFilter?: () => void;
  isChatOpen?: boolean;
  onToggleChat?: () => void;
  visibleColumns?: string[];
  onColumnChange?: (columns: string[]) => void;
}

export const CRMTableNavbar = ({ 
  isFilterOpen = false, 
  onToggleFilter,
  isChatOpen = false,
  onToggleChat,
  visibleColumns = [],
  onColumnChange
}: CRMTableNavbarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const allColumns = [
    { key: 'fullName', label: 'Full Name', category: 'Customer Info' },
    { key: 'email', label: 'Email', category: 'Customer Info' },
    { key: 'phoneNumber', label: 'Phone', category: 'Customer Info' },
    { key: 'dealership', label: 'Dealership', category: 'Lead Info' },
    { key: 'leadStatus', label: 'Status', category: 'Lead Info' },
    { key: 'leadScoring', label: 'Score', category: 'Lead Info' },
    { key: 'leadSource', label: 'Lead Source', category: 'Lead Info' },
    { key: 'leadChannel', label: 'Channel', category: 'Lead Info' },
    { key: 'campaignName', label: 'Campaign', category: 'Marketing' },
    { key: 'dateOfInquiry', label: 'Inquiry Date', category: 'Lead Info' },
    { key: 'assignedSalesperson', label: 'Salesperson', category: 'Lead Info' },
    { key: 'vehicleMake', label: 'Make', category: 'Vehicle' },
    { key: 'model', label: 'Model', category: 'Vehicle' },
    { key: 'year', label: 'Year', category: 'Vehicle' },
    { key: 'trim', label: 'Trim', category: 'Vehicle' },
    { key: 'colorPreference', label: 'Color', category: 'Vehicle' },
    { key: 'newUsed', label: 'New/Used', category: 'Vehicle' },
    { key: 'budgetRange', label: 'Budget', category: 'Deal Info' },
    { key: 'tradeIn', label: 'Trade-In', category: 'Deal Info' },
    { key: 'dealStage', label: 'Deal Stage', category: 'Deal Info' },
    { key: 'dealValue', label: 'Deal Value', category: 'Deal Info' },
    { key: 'closeProbability', label: 'Close Prob %', category: 'Deal Info' },
    { key: 'expectedCloseDate', label: 'Expected Close', category: 'Deal Info' },
  ];

  const columnsByCategory = allColumns.reduce((acc, column) => {
    if (!acc[column.category]) {
      acc[column.category] = [];
    }
    acc[column.category].push(column);
    return acc;
  }, {} as Record<string, typeof allColumns>);

  const toggleColumn = (columnKey: string) => {
    if (!onColumnChange) return;
    
    if (visibleColumns.includes(columnKey)) {
      onColumnChange(visibleColumns.filter(col => col !== columnKey));
    } else {
      onColumnChange([...visibleColumns, columnKey]);
    }
  };
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
      {/* Compact search expands on focus via CSS (focus-within) */}
      <div className="relative transition-[width] duration-300 ease-in-out w-48 md:w-64 focus-within:w-80 md:focus-within:w-96">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search Leads..."
          className="rounded-2xl border-border bg-background h-10 pl-11 w-full"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button 
          onClick={onToggleChat}
          variant={isChatOpen ? "default" : "outline"}
          className={`h-10 rounded-2xl transition-smooth ${
            isChatOpen 
              ? "shadow-medium" 
              : "border-border hover:bg-muted"
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>

        <Popover open={isColumnsOpen} onOpenChange={setIsColumnsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-10 w-10 rounded-2xl border-border hover:bg-muted transition-smooth p-0"
            >
              <Columns3 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border bg-gradient-to-b from-muted/30 to-transparent">
              <h4 className="font-semibold text-foreground text-base">Customize Columns</h4>
              <p className="text-xs text-muted-foreground mt-1">Select which columns to display</p>
            </div>
            <ScrollArea className="h-[420px]">
              <div className="p-3 space-y-4">
                {Object.entries(columnsByCategory).map(([category, columns]) => (
                  <div key={category} className="space-y-1">
                    <div className="px-3 py-1.5">
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {category}
                      </h5>
                    </div>
                    <div className="space-y-0.5">
                      {columns.map((column) => (
                        <div 
                          key={column.key} 
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 cursor-pointer group",
                            visibleColumns.includes(column.key) && "bg-primary/5 hover:bg-primary/10"
                          )}
                          onClick={() => toggleColumn(column.key)}
                        >
                          <Checkbox
                            id={column.key}
                            checked={visibleColumns.includes(column.key)}
                            onCheckedChange={() => toggleColumn(column.key)}
                            className="pointer-events-none data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[hsl(var(--teal))] data-[state=checked]:to-[hsl(var(--blue))] data-[state=checked]:border-0"
                          />
                          <label
                            htmlFor={column.key}
                            className={cn(
                              "text-sm font-medium leading-none cursor-pointer flex-1 transition-colors",
                              visibleColumns.includes(column.key) ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            {column.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

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

        <Button 
          onClick={() => setIsAddCustomerOpen(true)}
          className="h-10 rounded-2xl gradient-teal text-white font-medium shadow-soft hover:shadow-medium transition-smooth"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <AddCustomerModal 
        isOpen={isAddCustomerOpen} 
        onClose={() => setIsAddCustomerOpen(false)} 
      />
    </div>
  );
};

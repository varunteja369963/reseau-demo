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

  const allColumns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'dealership', label: 'Dealership' },
    { key: 'leadStatus', label: 'Status' },
    { key: 'leadScoring', label: 'Score' },
    { key: 'leadSource', label: 'Lead Source' },
    { key: 'leadChannel', label: 'Channel' },
    { key: 'campaignName', label: 'Campaign' },
    { key: 'dateOfInquiry', label: 'Inquiry Date' },
    { key: 'assignedSalesperson', label: 'Salesperson' },
    { key: 'vehicleMake', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'trim', label: 'Trim' },
    { key: 'colorPreference', label: 'Color' },
    { key: 'newUsed', label: 'New/Used' },
    { key: 'budgetRange', label: 'Budget' },
    { key: 'tradeIn', label: 'Trade-In' },
    { key: 'dealStage', label: 'Deal Stage' },
    { key: 'dealValue', label: 'Deal Value' },
    { key: 'closeProbability', label: 'Close Prob %' },
    { key: 'expectedCloseDate', label: 'Expected Close' },
  ];

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
        <Popover open={isColumnsOpen} onOpenChange={setIsColumnsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth"
            >
              <Columns3 className="w-4 h-4 mr-2" />
              Customize Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border">
              <h4 className="font-semibold text-foreground">Customize Columns</h4>
              <p className="text-xs text-muted-foreground mt-1">Select columns to display in the table</p>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-3">
                {allColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={column.key}
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {column.label}
                    </label>
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

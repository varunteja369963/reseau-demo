import { Filter, UserPlus, Calendar, Search, SlidersHorizontal, Columns3, MessageSquare, Download, GripVertical } from "lucide-react";
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
  leads?: any[];
}

export const CRMTableNavbar = ({ 
  isFilterOpen = false, 
  onToggleFilter,
  isChatOpen = false,
  onToggleChat,
  visibleColumns = [],
  onColumnChange,
  leads = []
}: CRMTableNavbarProps) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

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
    
    // Prevent toggling Full Name - it's always visible
    if (columnKey === 'fullName') return;
    
    if (visibleColumns.includes(columnKey)) {
      onColumnChange(visibleColumns.filter(col => col !== columnKey));
    } else {
      onColumnChange([...visibleColumns, columnKey]);
    }
  };

  const handleDragStart = (e: React.DragEvent, columnKey: string) => {
    setDraggedColumn(columnKey);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (!onColumnChange || !draggedColumn || draggedColumn === targetColumnKey) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const draggedIndex = visibleColumns.indexOf(draggedColumn);
    const targetIndex = visibleColumns.indexOf(targetColumnKey);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    const newColumns = [...visibleColumns];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    onColumnChange(newColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Separate visible and hidden columns
  const visibleColumnItems = visibleColumns
    .map(key => allColumns.find(col => col.key === key))
    .filter(Boolean) as typeof allColumns;

  const hiddenColumnsByCategory = Object.entries(columnsByCategory).reduce((acc, [category, columns]) => {
    const hiddenCols = columns.filter(col => !visibleColumns.includes(col.key));
    if (hiddenCols.length > 0) {
      acc[category] = hiddenCols;
    }
    return acc;
  }, {} as Record<string, typeof allColumns>);
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

  const handleDownloadLeads = () => {
    if (leads.length === 0) return;

    // Get column labels for headers
    const headers = allColumns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => col.label);

    // Prepare CSV data
    const csvData = [
      headers.join(','),
      ...leads.map(lead => 
        allColumns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => {
            const value = lead[col.key as keyof typeof lead];
            // Handle values with commas or quotes
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <Button 
          onClick={handleDownloadLeads}
          variant="outline"
          className="h-10 w-10 rounded-2xl border-border hover:bg-muted transition-smooth p-0"
          title="Download Leads"
        >
          <Download className="w-4 h-4" />
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
              <p className="text-xs text-muted-foreground mt-1">Drag to reorder, check to show/hide</p>
            </div>
            <ScrollArea className="h-[420px]">
              <div className="p-3 space-y-4">
                {/* Visible Columns - Draggable */}
                {visibleColumnItems.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5">
                      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Visible Columns
                      </h5>
                    </div>
                    <div className="space-y-0.5">
                      {visibleColumnItems.map((column) => (
                        <div 
                          key={column.key}
                          draggable
                          onDragStart={(e) => handleDragStart(e, column.key)}
                          onDragOver={(e) => handleDragOver(e, column.key)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, column.key)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 cursor-move group",
                            "bg-primary/5 hover:bg-primary/10",
                            draggedColumn === column.key && "opacity-50",
                            dragOverColumn === column.key && "border-2 border-primary border-dashed"
                          )}
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <Checkbox
                            id={column.key}
                            checked={true}
                            disabled={column.key === 'fullName'}
                            onCheckedChange={() => toggleColumn(column.key)}
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[hsl(var(--teal))] data-[state=checked]:to-[hsl(var(--blue))] data-[state=checked]:border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label
                            htmlFor={column.key}
                            className={cn(
                              "text-sm font-medium leading-none cursor-move flex-1 text-foreground",
                              column.key === 'fullName' && "opacity-70"
                            )}
                          >
                            {column.label}
                            {column.key === 'fullName' && (
                              <span className="text-xs text-muted-foreground ml-2">(Required)</span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hidden Columns by Category */}
                {Object.entries(hiddenColumnsByCategory).map(([category, columns]) => (
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
                            "flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 cursor-pointer group"
                          )}
                          onClick={() => toggleColumn(column.key)}
                        >
                          <Checkbox
                            id={column.key}
                            checked={false}
                            onCheckedChange={() => toggleColumn(column.key)}
                            className="pointer-events-none"
                          />
                          <label
                            htmlFor={column.key}
                            className={cn(
                              "text-sm font-medium leading-none cursor-pointer flex-1 transition-colors text-muted-foreground group-hover:text-foreground"
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

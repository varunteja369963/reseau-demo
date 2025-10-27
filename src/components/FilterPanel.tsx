import { Star, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export interface FilterValues {
  // String filters
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Lead Status
  leadStatus: string[];
  
  // Lead Info
  leadSource: string[];
  leadChannel: string[];
  campaignName: string;
  dealership: string[];
  assignedSalesperson: string[];
  
  // Date filters
  inquiryDateRange?: DateRange;
  expectedCloseDateRange?: DateRange;
  
  // Lead Scoring
  minLeadScore: number;
  maxLeadScore: number;
  
  // Vehicle filters
  vehicleMake: string[];
  newUsed: string[];
  budgetRange: string[];
  
  // Deal filters
  dealStage: string[];
  minDealValue: string;
  maxDealValue: string;
  minCloseProbability: string;
  maxCloseProbability: string;
  
  // Boolean filters
  tradeInOnly: boolean;
  communicationConsent: boolean;
}

interface FilterPanelProps {
  onToggle: () => void;
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

export const FilterPanel = ({ onToggle, filters, onFiltersChange }: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customerInfo: true,
    leadInfo: false,
    dateFilters: false,
    vehicleInfo: false,
    dealInfo: false,
    otherFilters: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Partial<FilterValues>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = (key: keyof FilterValues, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const clearFilters = () => {
    onFiltersChange({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      leadStatus: [],
      leadSource: [],
      leadChannel: [],
      campaignName: '',
      dealership: [],
      assignedSalesperson: [],
      inquiryDateRange: undefined,
      expectedCloseDateRange: undefined,
      minLeadScore: 0,
      maxLeadScore: 5,
      vehicleMake: [],
      newUsed: [],
      budgetRange: [],
      dealStage: [],
      minDealValue: '',
      maxDealValue: '',
      minCloseProbability: '',
      maxCloseProbability: '',
      tradeInOnly: false,
      communicationConsent: false,
    });
  };

  return (
    <div className="bg-card rounded-3xl shadow-soft max-h-[700px] overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Filters</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded-lg hover:bg-muted"
            >
              Clear All
            </button>
            <button 
              onClick={onToggle}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
              aria-label="Close filter panel"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Customer Info Section */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('customerInfo')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
            >
              <h4 className="text-sm font-semibold text-foreground">Customer Info</h4>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expandedSections.customerInfo && "rotate-180"
              )} />
            </button>
            
            {expandedSections.customerInfo && (
              <div className="p-4 pt-0 space-y-3">
                {/* Customer Name */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Name</label>
                  <Input
                    placeholder="Filter by name..."
                    value={filters.customerName}
                    onChange={(e) => updateFilters({ customerName: e.target.value })}
                    className="h-9 rounded-xl"
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Email</label>
                  <Input
                    placeholder="Filter by email..."
                    value={filters.customerEmail}
                    onChange={(e) => updateFilters({ customerEmail: e.target.value })}
                    className="h-9 rounded-xl"
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Phone</label>
                  <Input
                    placeholder="Filter by phone..."
                    value={filters.customerPhone}
                    onChange={(e) => updateFilters({ customerPhone: e.target.value })}
                    className="h-9 rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lead Info Section */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('leadInfo')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
            >
              <h4 className="text-sm font-semibold text-foreground">Lead Info</h4>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expandedSections.leadInfo && "rotate-180"
              )} />
            </button>
            
            {expandedSections.leadInfo && (
              <div className="p-4 pt-0 space-y-4">
                {/* Lead Status */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['Qualified', 'New', 'Working', 'Lost', 'Sold'].map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleArrayFilter('leadStatus', status)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full transition-smooth",
                          filters.leadStatus.includes(status)
                            ? "bg-[hsl(var(--teal))] text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lead Source */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Source</label>
                  <Select 
                    value={filters.leadSource[0] || "all"}
                    onValueChange={(val) => updateFilters({ leadSource: val === "all" ? [] : [val] })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lead Channel */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Channel</label>
                  <Select
                    value={filters.leadChannel[0] || "all"}
                    onValueChange={(val) => updateFilters({ leadChannel: val === "all" ? [] : [val] })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Direct">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dealership */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Dealership</label>
                  <Select
                    value={filters.dealership[0] || "all"}
                    onValueChange={(val) => updateFilters({ dealership: val === "all" ? [] : [val] })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="All Dealerships" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dealerships</SelectItem>
                      <SelectItem value="Downtown">Downtown</SelectItem>
                      <SelectItem value="North York">North York</SelectItem>
                      <SelectItem value="Mississauga">Mississauga</SelectItem>
                      <SelectItem value="Scarborough">Scarborough</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lead Score */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Lead Score: {filters.minLeadScore}-{filters.maxLeadScore}
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => updateFilters({ minLeadScore: score })}
                        className="p-2 hover:scale-110 transition-smooth"
                      >
                        <Star className={cn(
                          "w-5 h-5",
                          score <= filters.minLeadScore
                            ? "text-[hsl(var(--teal))] fill-[hsl(var(--teal))]"
                            : "text-muted-foreground"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Filters Section */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('dateFilters')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
            >
              <h4 className="text-sm font-semibold text-foreground">Date Filters</h4>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expandedSections.dateFilters && "rotate-180"
              )} />
            </button>
            
            {expandedSections.dateFilters && (
              <div className="p-4 pt-0 space-y-4">
                {/* Inquiry Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Inquiry Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-9 rounded-xl justify-start text-left font-normal">
                        {filters.inquiryDateRange?.from ? (
                          filters.inquiryDateRange.to ? (
                            `${format(filters.inquiryDateRange.from, "MMM dd")} - ${format(filters.inquiryDateRange.to, "MMM dd")}`
                          ) : (
                            format(filters.inquiryDateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={filters.inquiryDateRange}
                        onSelect={(range) => updateFilters({ inquiryDateRange: range })}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Expected Close Date */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Expected Close Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-9 rounded-xl justify-start text-left font-normal">
                        {filters.expectedCloseDateRange?.from ? (
                          filters.expectedCloseDateRange.to ? (
                            `${format(filters.expectedCloseDateRange.from, "MMM dd")} - ${format(filters.expectedCloseDateRange.to, "MMM dd")}`
                          ) : (
                            format(filters.expectedCloseDateRange.from, "MMM dd, yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={filters.expectedCloseDateRange}
                        onSelect={(range) => updateFilters({ expectedCloseDateRange: range })}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Info Section */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('vehicleInfo')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
            >
              <h4 className="text-sm font-semibold text-foreground">Vehicle Info</h4>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expandedSections.vehicleInfo && "rotate-180"
              )} />
            </button>
            
            {expandedSections.vehicleInfo && (
              <div className="p-4 pt-0 space-y-4">
                {/* Vehicle Make */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Make</label>
                  <Select
                    value={filters.vehicleMake[0] || "all"}
                    onValueChange={(val) => updateFilters({ vehicleMake: val === "all" ? [] : [val] })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                      <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Mercedes">Mercedes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* New/Used */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Condition</label>
                  <div className="flex gap-2">
                    {['New', 'Used'].map((condition) => (
                      <button
                        key={condition}
                        onClick={() => toggleArrayFilter('newUsed', condition)}
                        className={cn(
                          "flex-1 px-3 py-2 text-xs font-medium rounded-xl transition-smooth",
                          filters.newUsed.includes(condition)
                            ? "bg-[hsl(var(--blue))] text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Budget Range</label>
                  <Select
                    value={filters.budgetRange[0] || "all"}
                    onValueChange={(val) => updateFilters({ budgetRange: val === "all" ? [] : [val] })}
                  >
                    <SelectTrigger className="h-9 rounded-xl">
                      <SelectValue placeholder="All Budgets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="$10,000 - $20,000">$10k - $20k</SelectItem>
                      <SelectItem value="$20,000 - $35,000">$20k - $35k</SelectItem>
                      <SelectItem value="$35,000 - $50,000">$35k - $50k</SelectItem>
                      <SelectItem value="$50,000+">$50k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade-In */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.tradeInOnly}
                      onChange={(e) => updateFilters({ tradeInOnly: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-muted peer-checked:bg-[hsl(var(--blue))] rounded-full transition-smooth" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-smooth peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                    Has Trade-In
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Deal Info Section */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleSection('dealInfo')}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-smooth"
            >
              <h4 className="text-sm font-semibold text-foreground">Deal Info</h4>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                expandedSections.dealInfo && "rotate-180"
              )} />
            </button>
            
            {expandedSections.dealInfo && (
              <div className="p-4 pt-0 space-y-4">
                {/* Deal Stage */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Deal Stage</label>
                  <div className="flex flex-wrap gap-2">
                    {['Inquiry', 'Negotiation', 'Closing', 'Closed'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => toggleArrayFilter('dealStage', stage)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-full transition-smooth",
                          filters.dealStage.includes(stage)
                            ? "bg-[hsl(var(--purple))] text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deal Value Range */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Deal Value Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minDealValue}
                      onChange={(e) => updateFilters({ minDealValue: e.target.value })}
                      className="h-9 rounded-xl"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxDealValue}
                      onChange={(e) => updateFilters({ maxDealValue: e.target.value })}
                      className="h-9 rounded-xl"
                    />
                  </div>
                </div>

                {/* Close Probability */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Close Probability %</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min %"
                      value={filters.minCloseProbability}
                      onChange={(e) => updateFilters({ minCloseProbability: e.target.value })}
                      className="h-9 rounded-xl"
                      min="0"
                      max="100"
                    />
                    <Input
                      type="number"
                      placeholder="Max %"
                      value={filters.maxCloseProbability}
                      onChange={(e) => updateFilters({ maxCloseProbability: e.target.value })}
                      className="h-9 rounded-xl"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

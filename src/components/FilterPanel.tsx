import { Star, ChevronDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Filters {
  qualified: boolean;
  cold: boolean;
  lost: boolean;
  todayOnly: boolean;
}

interface FilterPanelProps {
  onToggle: () => void;
}

export const FilterPanel = ({ onToggle }: FilterPanelProps) => {
  const [filters, setFilters] = useState<Filters>({
    qualified: true,
    cold: false,
    lost: false,
    todayOnly: false,
  });
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-card rounded-3xl shadow-soft p-6 sticky top-24">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Lead Filter</h3>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <button 
              onClick={onToggle}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
              aria-label="Close filter panel"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-8">
            {/* Lead Status */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-foreground">Lead Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.qualified}
                      onChange={(e) => setFilters({ ...filters, qualified: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-[hsl(var(--blue-light))] peer-checked:bg-[hsl(var(--blue))] rounded-full transition-smooth" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-smooth peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                    Qualified Leads
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.cold}
                      onChange={(e) => setFilters({ ...filters, cold: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-[hsl(var(--purple-light))] peer-checked:bg-[hsl(var(--purple))] rounded-full transition-smooth" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-smooth peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                    Cold Leads
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.lost}
                      onChange={(e) => setFilters({ ...filters, lost: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-muted peer-checked:bg-destructive rounded-full transition-smooth" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-smooth peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                    Lost Leads
                  </span>
                </label>
              </div>
            </div>

            {/* Lead Date */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-foreground">Lead Date</h3>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.todayOnly}
                    onChange={(e) => setFilters({ ...filters, todayOnly: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-muted peer-checked:bg-[hsl(var(--teal))] rounded-full transition-smooth" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-smooth peer-checked:translate-x-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                  Today Only
                </span>
              </label>
            </div>

            {/* Lead Score */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-foreground">Lead Score Minimum</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="p-2 hover:scale-110 transition-smooth"
                  >
                    <Star className="w-6 h-6 text-muted-foreground hover:text-[hsl(var(--teal))] hover:fill-[hsl(var(--teal))]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Contact Button */}
            <Button className="w-full h-12 rounded-2xl gradient-blue text-white font-semibold shadow-soft hover:shadow-medium transition-smooth">
              ADD NEW CONTACT
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

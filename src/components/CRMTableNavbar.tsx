import { Filter, ArrowUpDown, UserPlus, Calendar } from "lucide-react";
import { Button } from "./ui/button";

export const CRMTableNavbar = () => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth">
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Sort
        </Button>
        <Button variant="outline" className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
      </div>
      <Button className="h-10 rounded-2xl gradient-teal text-white font-medium shadow-soft hover:shadow-medium transition-smooth">
        <UserPlus className="w-4 h-4 mr-2" />
        Add Customer
      </Button>
    </div>
  );
};

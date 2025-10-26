import { Filter, UserPlus, Calendar, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const CRMTableNavbar = () => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Leads..."
          className="rounded-2xl border-border bg-background h-10 pl-11"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" className="h-10 rounded-2xl border-border hover:bg-muted transition-smooth">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button className="h-10 rounded-2xl gradient-teal text-white font-medium shadow-soft hover:shadow-medium transition-smooth">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};

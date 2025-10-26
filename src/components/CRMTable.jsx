import { Mail, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_COLUMNS = ['fullName', 'email', 'phoneNumber', 'leadStatus', 'leadScoring'];

export const CRMTable = ({ leads, visibleColumns, onOpenProfile, onOpenContact }) => {
  const columns = visibleColumns || DEFAULT_COLUMNS;
  return (
    <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Good Morning Sean. Here are your leads!</h2>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border overflow-x-auto">
        {leads.map((lead) => (
          <div
            key={lead.leadId}
            className="flex items-center gap-4 p-6 hover:bg-muted/50 transition-smooth group"
          >
            {/* Avatar */}
            <button
              onClick={() => onOpenProfile(lead)}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 hover:scale-110 transition-smooth",
                lead.color
              )}
            >
              {lead.initials}
            </button>

            {/* Dynamic Columns */}
            {columns.map((col) => {
              if (col === 'fullName') {
                return (
                  <button
                    key={col}
                    onClick={() => onOpenProfile(lead)}
                    className="min-w-[200px] text-left hover:text-[hsl(var(--teal))] transition-smooth"
                  >
                    <div className="font-medium text-foreground">{lead.fullName}</div>
                  </button>
                );
              }
              
              if (col === 'email') {
                return (
                  <button
                    key={col}
                    onClick={() => onOpenContact(lead, "email")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--teal))] transition-smooth min-w-[250px]"
                  >
                    <Mail className="w-4 h-4 text-[hsl(var(--teal))]" />
                    <span className="text-sm">{lead.email}</span>
                  </button>
                );
              }
              
              if (col === 'phoneNumber') {
                return (
                  <button
                    key={col}
                    onClick={() => onOpenContact(lead, "call")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--blue))] transition-smooth min-w-[180px]"
                  >
                    <Phone className="w-4 h-4 text-[hsl(var(--blue))]" />
                    <span className="text-sm">{lead.phoneNumber}</span>
                  </button>
                );
              }
              
              if (col === 'leadStatus') {
                return (
                  <div key={col} className="min-w-[140px]">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      lead.leadStatus === 'Qualified' || lead.leadStatus === 'Sold' ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]" :
                      lead.leadStatus === 'Lost' ? "bg-red-100 text-red-700" :
                      "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]"
                    )}>
                      {lead.leadStatus}
                    </span>
                  </div>
                );
              }
              
              if (col === 'leadScoring') {
                return (
                  <div key={col} className="flex gap-1 min-w-[140px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-5 h-5 transition-smooth",
                          star <= lead.leadScoring
                            ? "fill-[hsl(var(--teal))] text-[hsl(var(--teal))]"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                );
              }
              
              return (
                <div key={col} className="min-w-[150px] text-sm text-muted-foreground">
                  {lead[col] ? String(lead[col]) : '-'}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

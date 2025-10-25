import { Mail, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Lead {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  status: "qualified" | "cold" | "lost";
  score: number;
  color: string;
}

const leads: Lead[] = [
  {
    id: "1",
    name: "Christopher Stewart",
    initials: "CS",
    email: "chris.stewart4@icloud.com",
    phone: "(250) 470 - 2310",
    status: "qualified",
    score: 1,
    color: "bg-[hsl(var(--teal))]",
  },
  {
    id: "2",
    name: "Auston Matthews",
    initials: "AM",
    email: "am34@leafs.com",
    phone: "(555) 555 - 3434",
    status: "qualified",
    score: 2,
    color: "bg-[hsl(var(--teal))]",
  },
  {
    id: "3",
    name: "Christopher Stewart",
    initials: "CS",
    email: "chris.stewart4@icloud.com",
    phone: "(250) 470 - 2310",
    status: "lost",
    score: 0,
    color: "bg-[hsl(var(--purple))]",
  },
  {
    id: "4",
    name: "Auston Matthews",
    initials: "AM",
    email: "am34@leafs.com",
    phone: "(555) 555 - 3434",
    status: "qualified",
    score: 3.5,
    color: "bg-[hsl(var(--blue))]",
  },
  {
    id: "5",
    name: "Auston Matthews",
    initials: "AM",
    email: "am34@leafs.com",
    phone: "(555) 555 - 3434",
    status: "cold",
    score: 0,
    color: "bg-gradient-to-br from-red-300 to-red-400",
  },
];

export const CRMTable = ({ onOpenProfile, onOpenContact }: { 
  onOpenProfile: (lead: Lead) => void;
  onOpenContact: (lead: Lead, type: "call" | "email") => void;
}) => {
  return (
    <div className="bg-card rounded-3xl shadow-soft overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Good Morning Sean. Here are your leads!</h2>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {leads.map((lead) => (
          <div
            key={lead.id}
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

            {/* Name */}
            <button
              onClick={() => onOpenProfile(lead)}
              className="min-w-[200px] text-left hover:text-[hsl(var(--teal))] transition-smooth"
            >
              <div className="font-medium text-foreground">{lead.name}</div>
            </button>

            {/* Email */}
            <button
              onClick={() => onOpenContact(lead, "email")}
              className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--teal))] transition-smooth min-w-[250px]"
            >
              <Mail className="w-4 h-4 text-[hsl(var(--teal))]" />
              <span className="text-sm">{lead.email}</span>
            </button>

            {/* Phone */}
            <button
              onClick={() => onOpenContact(lead, "call")}
              className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--blue))] transition-smooth min-w-[180px]"
            >
              <Phone className="w-4 h-4 text-[hsl(var(--blue))]" />
              <span className="text-sm">{lead.phone}</span>
            </button>

            {/* Rating */}
            <div className="flex gap-1 ml-auto">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5 transition-smooth",
                    star <= lead.score
                      ? "fill-[hsl(var(--teal))] text-[hsl(var(--teal))]"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

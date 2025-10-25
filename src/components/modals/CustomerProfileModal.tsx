import { X, Mail, Phone, Calendar, TrendingUp, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    name: string;
    initials: string;
    email: string;
    phone: string;
    color: string;
  } | null;
}

export const CustomerProfileModal = ({ isOpen, onClose, lead }: CustomerProfileModalProps) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="gradient-teal p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl", lead.color)}>
                {lead.initials}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">{lead.name}</DialogTitle>
                <div className="flex gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {lead.phone}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button className="h-12 rounded-2xl bg-[hsl(var(--blue-light))] text-[hsl(var(--blue))] hover:bg-[hsl(var(--blue))] hover:text-white transition-smooth font-medium">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button className="h-12 rounded-2xl bg-[hsl(var(--teal-light))] text-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))] hover:text-white transition-smooth font-medium">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button className="h-12 rounded-2xl bg-[hsl(var(--purple-light))] text-[hsl(var(--purple))] hover:bg-[hsl(var(--purple))] hover:text-white transition-smooth font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[hsl(var(--teal-light))] to-[hsl(var(--blue-light))] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[hsl(var(--teal))]" />
              <h3 className="font-semibold text-foreground">AI-Generated Insights</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Top 3 Preferences:</strong> Toyota, Budget under $30k, Red color</p>
              <p>• <strong>Engagement:</strong> Last contacted 3 days ago, opened 2 emails this week</p>
              <p>• <strong>Alert:</strong> High interest in SUV models, recommend showing new inventory</p>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Customer Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {["SUV Interest", "Budget: $25-30k", "Red Color", "Toyota Brand", "Financing Needed"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interaction Logs */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Recent Interactions</h3>
            <div className="space-y-3">
              {[
                { type: "Email", message: "Sent inventory list for SUVs", time: "2 hours ago" },
                { type: "Call", message: "Discussed financing options", time: "3 days ago" },
                { type: "Visit", message: "Visited dealership for test drive", time: "1 week ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--teal))] mt-1.5" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">{log.type}</div>
                    <div className="text-sm text-muted-foreground">{log.message}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

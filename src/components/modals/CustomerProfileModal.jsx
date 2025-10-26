import { Mail, Phone, Calendar, TrendingUp, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const CustomerProfileModal = ({ isOpen, onClose, lead }) => {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="gradient-teal p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl", lead.avatarColor)}>
                {lead.initials}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">{lead.fullName}</DialogTitle>
                <div className="flex gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {lead.phoneNumber}
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
              <p>• <strong>Top Preferences:</strong> {lead.vehicleMake} {lead.vehicleModel}, Budget {lead.budgetRange}</p>
              <p>• <strong>Lead Status:</strong> {lead.leadStatus}</p>
              <p>• <strong>Source:</strong> {lead.leadSource} via {lead.leadChannel}</p>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Customer Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {lead.tags && lead.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interaction Logs */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
                <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Lead Source</div>
                    <div className="font-medium">{lead.leadSource}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date of Inquiry</div>
                    <div className="font-medium">{lead.dateOfInquiry}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Vehicle Interest</div>
                    <div className="font-medium">{lead.vehicleMake} {lead.vehicleModel}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Budget</div>
                    <div className="font-medium">{lead.budgetRange}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

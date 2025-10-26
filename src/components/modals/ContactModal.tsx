import { Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Lead } from "@/types/lead";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string | null;
  lead: Lead | null;
}

export const ContactModal = ({ isOpen, onClose, type, lead }: ContactModalProps) => {
  if (!lead || !type) return null;

  const isEmail = type === "email";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {isEmail ? (
              <>
                <div className="w-10 h-10 rounded-2xl bg-[hsl(var(--teal-light))] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[hsl(var(--teal))]" />
                </div>
                Send Email to {lead.fullName}
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-[hsl(var(--blue-light))] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[hsl(var(--blue))]" />
                </div>
                Call {lead.fullName}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {isEmail ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">To:</label>
                <Input
                  value={lead.email}
                  disabled
                  className="rounded-2xl bg-muted border-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Subject:</label>
                <Input
                  placeholder="Enter subject..."
                  className="rounded-2xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Message:</label>
                <Textarea
                  placeholder="Type your message here..."
                  className="rounded-2xl min-h-[150px] resize-none"
                />
              </div>
              <Button className="w-full h-12 rounded-2xl gradient-teal text-white font-semibold shadow-soft hover:shadow-medium transition-smooth">
                Send Email
              </Button>
            </>
          ) : (
            <>
              <div className="bg-muted rounded-2xl p-6 text-center space-y-4">
                <div className="text-3xl font-bold text-foreground">{lead.phoneNumber}</div>
                <p className="text-sm text-muted-foreground">Click a button below to initiate contact</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-12 rounded-2xl gradient-blue text-white font-semibold shadow-soft hover:shadow-medium transition-smooth">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button className="h-12 rounded-2xl bg-[hsl(var(--purple-light))] text-[hsl(var(--purple))] hover:bg-[hsl(var(--purple))] hover:text-white transition-smooth font-semibold">
                  <Mail className="w-4 h-4 mr-2" />
                  SMS
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

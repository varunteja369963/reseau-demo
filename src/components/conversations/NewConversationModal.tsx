import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, Plus, X, UserPlus, Info } from "lucide-react";

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Participant {
  id: string;
  type: "identity" | "address";
  value: string;
  displayName?: string;
}

export const NewConversationModal = ({ open, onOpenChange }: NewConversationModalProps) => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("default");
  const [friendlyName, setFriendlyName] = useState("");
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantType, setNewParticipantType] = useState<"identity" | "address">("address");
  const [newParticipantValue, setNewParticipantValue] = useState("");
  const [newParticipantName, setNewParticipantName] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [sendFirstMessage, setSendFirstMessage] = useState(false);

  const addParticipant = () => {
    if (newParticipantValue) {
      setParticipants([
        ...participants,
        {
          id: `p-${Date.now()}`,
          type: newParticipantType,
          value: newParticipantValue,
          displayName: newParticipantName || undefined,
        },
      ]);
      setNewParticipantValue("");
      setNewParticipantName("");
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleCreate = () => {
    // Create conversation logic
    console.log({
      service,
      friendlyName,
      attributes,
      participants,
      firstMessage: sendFirstMessage ? firstMessage : undefined,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setService("default");
    setFriendlyName("");
    setAttributes([]);
    setParticipants([]);
    setFirstMessage("");
    setSendFirstMessage(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      Default Service
                      <Badge variant="secondary" className="text-[10px]">Default</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="stage">Staging</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Services separate environments and scope resources.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Conversation Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Friendly Name</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Avoid putting personal data in Friendly Name. Use an internal reference instead.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                value={friendlyName}
                onChange={(e) => setFriendlyName(e.target.value)}
                placeholder="e.g., Support Request #1234"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Attributes (optional)</Label>
                <Button variant="ghost" size="sm" onClick={addAttribute}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={attr.key}
                    onChange={(e) => {
                      const newAttrs = [...attributes];
                      newAttrs[index].key = e.target.value;
                      setAttributes(newAttrs);
                    }}
                    placeholder="Key"
                    className="flex-1"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => {
                      const newAttrs = [...attributes];
                      newAttrs[index].value = e.target.value;
                      setAttributes(newAttrs);
                    }}
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttributes(attributes.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select defaultValue="open">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Add Participants */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Participants</Label>
              <div className="flex gap-2">
                <Select
                  value={newParticipantType}
                  onValueChange={(v) => setNewParticipantType(v as "identity" | "address")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identity">By Identity</SelectItem>
                    <SelectItem value="address">By Address</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newParticipantValue}
                  onChange={(e) => setNewParticipantValue(e.target.value)}
                  placeholder={
                    newParticipantType === "identity"
                      ? "user@example.com"
                      : "+1 234 567 8900"
                  }
                  className="flex-1"
                />
              </div>
              <Input
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Display name (optional)"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addParticipant}
                disabled={!newParticipantValue}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            </div>

            {participants.length > 0 && (
              <div className="space-y-2">
                <Label>Added Participants ({participants.length})</Label>
                <div className="space-y-2">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {p.displayName || p.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.type === "identity" ? "Identity" : "Address"}: {p.value}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(p.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  You can create a conversation with up to 10 participants at once.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Send First Message (optional) */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendFirstMessage"
                checked={sendFirstMessage}
                onChange={(e) => setSendFirstMessage(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="sendFirstMessage">Send first message</Label>
            </div>

            {sendFirstMessage && (
              <>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={firstMessage}
                    onChange={(e) => setFirstMessage(e.target.value)}
                    placeholder="Type your first message..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Send via</Label>
                  <Select defaultValue="sms">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleCreate}>Create Conversation</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

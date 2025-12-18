import { useState } from "react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileAudio,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ownedNumbers = [
  { value: "+15550100", label: "+1 (555) 010-0100 - Marketing" },
  { value: "+15550200", label: "+1 (555) 010-0200 - Support" },
  { value: "+15550300", label: "+1 (555) 010-0300 - Sales" },
];

const callFlows = ["None", "Main IVR", "Support Line", "Sales"];

type CallStatus = "idle" | "initiating" | "ringing" | "in-progress" | "completed" | "failed";

const statusConfig: Record<CallStatus, { color: string; icon: React.ElementType; label: string }> = {
  idle: { color: "text-muted-foreground", icon: Phone, label: "Ready" },
  initiating: { color: "text-yellow-500", icon: Clock, label: "Initiating..." },
  ringing: { color: "text-blue-500", icon: Phone, label: "Ringing..." },
  "in-progress": { color: "text-green-500", icon: Phone, label: "In Progress" },
  completed: { color: "text-green-500", icon: CheckCircle2, label: "Completed" },
  failed: { color: "text-red-500", icon: XCircle, label: "Failed" },
};

export function CallsDialer() {
  const [fromNumber, setFromNumber] = useState(ownedNumbers[0].value);
  const [toNumber, setToNumber] = useState("");
  const [recordCall, setRecordCall] = useState(false);
  const [enableAMD, setEnableAMD] = useState(false);
  const [callFlow, setCallFlow] = useState("None");
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [lastCallSummary, setLastCallSummary] = useState<{
    duration: string;
    status: string;
    hasRecording: boolean;
  } | null>(null);

  const handleCall = () => {
    if (!toNumber) return;
    
    setCallStatus("initiating");
    setCallDuration(0);
    
    setTimeout(() => setCallStatus("ringing"), 1000);
    setTimeout(() => {
      setCallStatus("in-progress");
      // Start duration timer
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      
      // Simulate call end after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setCallStatus("completed");
        setLastCallSummary({
          duration: "0:05",
          status: "completed",
          hasRecording: recordCall,
        });
      }, 5000);
    }, 3000);
  };

  const handleHangUp = () => {
    setCallStatus("completed");
    setLastCallSummary({
      duration: formatDuration(callDuration),
      status: "completed",
      hasRecording: recordCall,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCallActive = ["initiating", "ringing", "in-progress"].includes(callStatus);
  const StatusIcon = statusConfig[callStatus].icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dialer</h1>
        <p className="text-muted-foreground">Make outbound calls</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dialer Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Make a Call</CardTitle>
            <CardDescription>Configure and start an outbound call</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>From Number</Label>
              <Select value={fromNumber} onValueChange={setFromNumber} disabled={isCallActive}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ownedNumbers.map((num) => (
                    <SelectItem key={num.value} value={num.value}>
                      {num.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To Number</Label>
              <Input
                placeholder="+1 555 123 4567"
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
                disabled={isCallActive}
                className="font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label>Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Record call</Label>
                  <Switch checked={recordCall} onCheckedChange={setRecordCall} disabled={isCallActive} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Enable AMD</Label>
                  <Switch checked={enableAMD} onCheckedChange={setEnableAMD} disabled={isCallActive} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Apply Call Flow (optional)</Label>
              <Select value={callFlow} onValueChange={setCallFlow} disabled={isCallActive}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {callFlows.map((flow) => (
                    <SelectItem key={flow} value={flow}>
                      {flow}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isCallActive ? (
              <Button onClick={handleCall} className="w-full" disabled={!toNumber}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            ) : (
              <Button onClick={handleHangUp} variant="destructive" className="w-full">
                <PhoneOff className="h-4 w-4 mr-2" />
                Hang Up
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Live Call Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Call Status</CardTitle>
            <CardDescription>Live call information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div className="text-center py-8">
              <div className={`h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isCallActive ? "bg-primary/10 animate-pulse" : "bg-muted"
              }`}>
                <StatusIcon className={`h-10 w-10 ${statusConfig[callStatus].color}`} />
              </div>
              <Badge
                variant="secondary"
                className={`${statusConfig[callStatus].color} text-lg px-4 py-1`}
              >
                {statusConfig[callStatus].label}
              </Badge>
              {callStatus === "in-progress" && (
                <p className="text-2xl font-mono mt-4">{formatDuration(callDuration)}</p>
              )}
            </div>

            {/* Call Timeline */}
            {isCallActive && (
              <div className="space-y-2">
                <Label>Timeline</Label>
                <div className="space-y-2 text-sm">
                  {callStatus !== "idle" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Call initiated</span>
                    </div>
                  )}
                  {(callStatus === "ringing" || callStatus === "in-progress") && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Ringing</span>
                    </div>
                  )}
                  {callStatus === "in-progress" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Connected</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call Controls */}
            {callStatus === "in-progress" && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant={!isSpeakerOn ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {/* Last Call Summary */}
            {lastCallSummary && callStatus === "completed" && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="font-medium mb-2">Call Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{lastCallSummary.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        {lastCallSummary.status}
                      </Badge>
                    </div>
                    {lastCallSummary.hasRecording && (
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-muted-foreground">Recording</span>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileAudio className="h-3 w-3" />
                          Play
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

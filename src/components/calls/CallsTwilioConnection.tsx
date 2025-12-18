import { useState } from "react";
import {
  Link2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CallsTwilioConnection() {
  const [isConnected, setIsConnected] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [credentialType, setCredentialType] = useState("account");
  const [useSubaccount, setUseSubaccount] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Twilio Connection</h1>
        <p className="text-muted-foreground">Connect and manage your Twilio account credentials</p>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isConnected ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {isConnected ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  {isConnected ? "Your Twilio account is connected" : "No Twilio account connected"}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className={isConnected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        {isConnected && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Account SID</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono">
                    ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Last Validated</Label>
                <p className="text-sm">January 16, 2024 at 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setRotateDialogOpen(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Rotate Credentials
              </Button>
              <Button variant="outline" className="text-destructive" onClick={() => setDisconnectDialogOpen(true)}>
                Disconnect
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Connection Form */}
      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Twilio Account</CardTitle>
            <CardDescription>Enter your Twilio credentials to connect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Credential Type</Label>
              <Select value={credentialType} onValueChange={setCredentialType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account SID + Auth Token</SelectItem>
                  <SelectItem value="api">API Key SID + Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {credentialType === "account" ? (
              <>
                <div className="space-y-2">
                  <Label>Account SID</Label>
                  <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <Label>Auth Token</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      placeholder="Enter your Auth Token"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>API Key SID</Label>
                  <Input placeholder="SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                <div className="space-y-2">
                  <Label>API Secret</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? "text" : "password"}
                      placeholder="Enter your API Secret"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <Switch checked={useSubaccount} onCheckedChange={setUseSubaccount} />
              <Label>Use Subaccount</Label>
            </div>

            {useSubaccount && (
              <div className="space-y-2">
                <Label>Subaccount SID</Label>
                <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
              </div>
            )}

            <Button onClick={handleValidate} disabled={isValidating} className="w-full">
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                "Validate & Connect"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Debug Accordion */}
      <Collapsible open={debugOpen} onOpenChange={setDebugOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Debug Information</CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${debugOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
{`{
  "status": "connected",
  "account_sid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "friendly_name": "My Twilio Account",
  "type": "Trial",
  "validated_at": "2024-01-16T10:30:00Z",
  "capabilities": {
    "voice": true,
    "sms": true,
    "mms": true,
    "fax": false
  }
}`}
              </pre>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Rotate Credentials Dialog */}
      <Dialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rotate Credentials</DialogTitle>
            <DialogDescription>
              Enter your new Twilio credentials to rotate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Auth Token</Label>
              <Input type="password" placeholder="Enter new Auth Token" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRotateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setRotateDialogOpen(false)}>
              Update Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation */}
      <AlertDialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Twilio Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect your Twilio account from Reseau. Your phone numbers and call flows will stop working until you reconnect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setIsConnected(false);
                setDisconnectDialogOpen(false);
              }}
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

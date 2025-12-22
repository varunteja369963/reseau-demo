import { useState } from "react";
import {
  Search,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  MapPin,
  ShoppingCart,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

const searchResults = [
  { number: "+1 (555) 123-4567", locality: "San Francisco, CA", capabilities: ["voice", "sms", "mms"], price: "$1.00/mo" },
  { number: "+1 (555) 234-5678", locality: "San Francisco, CA", capabilities: ["voice", "sms"], price: "$1.00/mo" },
  { number: "+1 (555) 345-6789", locality: "Oakland, CA", capabilities: ["voice", "sms", "mms"], price: "$1.00/mo" },
  { number: "+1 (555) 456-7890", locality: "San Jose, CA", capabilities: ["voice"], price: "$1.00/mo" },
  { number: "+1 (555) 567-8901", locality: "Palo Alto, CA", capabilities: ["voice", "sms", "mms", "fax"], price: "$1.00/mo" },
];

const callFlows = ["Main IVR", "Support Line", "Sales", "Forwarding", "Voicemail", "Office Hours"];

const capabilityIcons: Record<string, { icon: React.ElementType; label: string }> = {
  voice: { icon: Phone, label: "Voice" },
  sms: { icon: MessageSquare, label: "SMS" },
  mms: { icon: Mail, label: "MMS" },
  fax: { icon: FileText, label: "Fax" },
};

export function CallsBuyNumbers() {
  const [country, setCountry] = useState("US");
  const [numberType, setNumberType] = useState("local");
  const [containsSearch, setContainsSearch] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [mmsEnabled, setMmsEnabled] = useState(false);
  const [faxEnabled, setFaxEnabled] = useState(false);
  const [resultLimit, setResultLimit] = useState("10");
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<typeof searchResults[0] | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1000);
  };

  const handleBuy = (number: typeof searchResults[0]) => {
    setSelectedNumber(number);
    setBuyDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Buy Numbers</h1>
        <p className="text-muted-foreground">Search and purchase phone numbers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel */}
        <Card className="lg:col-span-1 rounded-3xl shadow-soft border-0 bg-card">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>Configure your number search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">🇺🇸 United States</SelectItem>
                  <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                  <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                  <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number Type</Label>
              <Tabs value={numberType} onValueChange={setNumberType}>
                <TabsList className="w-full">
                  <TabsTrigger value="local" className="flex-1">Local</TabsTrigger>
                  <TabsTrigger value="tollfree" className="flex-1">Toll-Free</TabsTrigger>
                  <TabsTrigger value="mobile" className="flex-1">Mobile</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-3">
              <Label>Capabilities</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Voice</Label>
                  <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">SMS</Label>
                  <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">MMS</Label>
                  <Switch checked={mmsEnabled} onCheckedChange={setMmsEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Fax</Label>
                  <Switch checked={faxEnabled} onCheckedChange={setFaxEnabled} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contains</Label>
              <Input
                placeholder="e.g., 555"
                value={containsSearch}
                onChange={(e) => setContainsSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Area Code</Label>
              <Input
                placeholder="e.g., 415"
                value={areaCode}
                onChange={(e) => setAreaCode(e.target.value)}
              />
            </div>

            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  {advancedOpen ? "Hide" : "Show"} Advanced Options
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Near Address</Label>
                  <Input placeholder="Enter address" />
                </div>
                <div className="space-y-2">
                  <Label>Distance (miles)</Label>
                  <Input type="number" placeholder="25" />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-2">
              <Label>Results Limit</Label>
              <Select value={resultLimit} onValueChange={setResultLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 results</SelectItem>
                  <SelectItem value="20">20 results</SelectItem>
                  <SelectItem value="50">50 results</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl" disabled={isSearching}>
              {isSearching ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Numbers
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {hasSearched ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {searchResults.length} numbers
                </p>
              </div>

              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-mono text-lg font-medium">{result.number}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {result.locality}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {result.capabilities.map((cap) => {
                              const CapIcon = capabilityIcons[cap]?.icon;
                              return CapIcon ? (
                                <Badge key={cap} variant="secondary" className="gap-1">
                                  <CapIcon className="h-3 w-3" />
                                  {capabilityIcons[cap].label}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-medium">{result.price}</p>
                          <Button onClick={() => handleBuy(result)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Search for Numbers</h3>
                <p className="text-muted-foreground">
                  Configure your filters and click Search to find available numbers
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Provision Number</DialogTitle>
            <DialogDescription>
              Configure and purchase {selectedNumber?.number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-medium">{selectedNumber?.number}</p>
                    <p className="text-sm text-muted-foreground">{selectedNumber?.locality}</p>
                  </div>
                  <p className="font-medium">{selectedNumber?.price}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Friendly Name</Label>
              <Input placeholder="e.g., Main Sales Line" />
            </div>

            <div className="space-y-2">
              <Label>Assign Call Flow</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a call flow" />
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

            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  Advanced Options
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Voice Webhook URL</Label>
                  <Input placeholder="https://your-server.com/voice" />
                </div>
                <div className="space-y-2">
                  <Label>Messaging Webhook URL</Label>
                  <Input placeholder="https://your-server.com/sms" />
                </div>
                <div className="space-y-2">
                  <Label>Status Callback URL</Label>
                  <Input placeholder="https://your-server.com/status" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Record inbound calls</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-normal">Enable AMD</Label>
                  <Switch />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This country may require documentation for regulatory compliance.{" "}
                <Button variant="link" className="h-auto p-0">
                  View Compliance requirements
                </Button>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setBuyDialogOpen(false)}>
              <Check className="h-4 w-4 mr-2" />
              Provision Number
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import {
  Shield,
  FileText,
  MapPin,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const complianceBundles = [
  { id: "1", country: "US", status: "approved", updated: "2024-01-10" },
  { id: "2", country: "UK", status: "submitted", updated: "2024-01-15" },
  { id: "3", country: "CA", status: "not_started", updated: null },
  { id: "4", country: "DE", status: "rejected", updated: "2024-01-12" },
];

const emergencyAddresses = [
  { id: "1", name: "HQ Office", address: "123 Main St, San Francisco, CA 94105", numbers: 3 },
  { id: "2", name: "Support Center", address: "456 Oak Ave, New York, NY 10001", numbers: 2 },
];

const numbersNeedingAddress = [
  { number: "+1 555-0300", type: "Local", country: "US" },
];

const countryRequirements: Record<string, { documents: string[]; addressRequired: boolean; notes: string }> = {
  US: {
    documents: ["Business registration", "Tax ID"],
    addressRequired: true,
    notes: "All US numbers require a registered emergency address.",
  },
  UK: {
    documents: ["Business registration", "Proof of address", "ID verification"],
    addressRequired: true,
    notes: "UK regulations require identity verification for all number types.",
  },
  CA: {
    documents: ["Business registration"],
    addressRequired: false,
    notes: "Canadian numbers have minimal documentation requirements.",
  },
  DE: {
    documents: ["Business registration", "Proof of address", "ID verification", "Power of attorney"],
    addressRequired: true,
    notes: "German regulations are strict. All documents must be notarized.",
  },
};

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  approved: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2, label: "Approved" },
  submitted: { color: "bg-blue-500/10 text-blue-500", icon: Clock, label: "Submitted" },
  not_started: { color: "bg-muted text-muted-foreground", icon: FileText, label: "Not Started" },
  rejected: { color: "bg-red-500/10 text-red-500", icon: XCircle, label: "Rejected" },
};

export function CallsCompliance() {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const requirements = countryRequirements[selectedCountry];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Compliance</h1>
        <p className="text-muted-foreground">Manage regulatory requirements and emergency addresses</p>
      </div>

      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements">Country Requirements</TabsTrigger>
          <TabsTrigger value="bundles">Compliance Bundles</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Country Requirements Viewer</CardTitle>
              <CardDescription>View regulatory requirements by country</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                    <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                    <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {requirements && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <p className="font-medium mb-2">Required Documents</p>
                      <ul className="space-y-1">
                        {requirements.documents.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Address Requirements</p>
                      <Badge variant={requirements.addressRequired ? "default" : "secondary"}>
                        {requirements.addressRequired ? "Required" : "Not Required"}
                      </Badge>
                    </div>
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{requirements.notes}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4 mt-4">
          <div className="flex items-center justify-end">
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceBundles.map((bundle) => {
                    const StatusIcon = statusConfig[bundle.status].icon;
                    return (
                      <TableRow key={bundle.id}>
                        <TableCell className="font-medium">{bundle.country}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusConfig[bundle.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[bundle.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {bundle.updated || "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {bundle.status === "rejected" && (
                              <Button variant="ghost" size="sm">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Resubmit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4 mt-4">
          {numbersNeedingAddress.length > 0 && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                {numbersNeedingAddress.length} number(s) need an emergency address assigned.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-end">
            <Button onClick={() => setAddressDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Numbers Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emergencyAddresses.map((addr) => (
                    <TableRow key={addr.id}>
                      <TableCell className="font-medium">{addr.name}</TableCell>
                      <TableCell className="text-muted-foreground">{addr.address}</TableCell>
                      <TableCell className="text-right">{addr.numbers}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {numbersNeedingAddress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Numbers Needing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Assign Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {numbersNeedingAddress.map((num, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono">{num.number}</TableCell>
                        <TableCell>{num.type}</TableCell>
                        <TableCell>{num.country}</TableCell>
                        <TableCell>
                          <Select>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select address" />
                            </SelectTrigger>
                            <SelectContent>
                              {emergencyAddresses.map((addr) => (
                                <SelectItem key={addr.id} value={addr.id}>
                                  {addr.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Documents Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload compliance documents for verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Registration</SelectItem>
                  <SelectItem value="tax">Tax ID</SelectItem>
                  <SelectItem value="id">ID Verification</SelectItem>
                  <SelectItem value="address">Proof of Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <Button variant="outline">Select File</Button>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Address</DialogTitle>
            <DialogDescription>
              Create a new emergency address for your numbers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Friendly Name</Label>
              <Input placeholder="e.g., HQ Office" />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="San Francisco" />
              </div>
              <div className="space-y-2">
                <Label>State/Province</Label>
                <Input placeholder="CA" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input placeholder="94105" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select defaultValue="US">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddressDialogOpen(false)}>
              Create Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

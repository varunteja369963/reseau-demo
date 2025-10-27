import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Upload, FileText, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal = ({ isOpen, onClose }: AddCustomerModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<"select" | "mapping">("select");
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const crmFields = [
    { key: "fullName", label: "Full Name", required: true },
    { key: "email", label: "Email", required: true },
    { key: "phoneNumber", label: "Phone Number", required: true },
    { key: "dealership", label: "Dealership", required: false },
    { key: "leadStatus", label: "Lead Status", required: false },
    { key: "leadSource", label: "Lead Source", required: false },
    { key: "leadChannel", label: "Lead Channel", required: false },
    { key: "campaignName", label: "Campaign Name", required: false },
    { key: "assignedSalesperson", label: "Assigned Salesperson", required: false },
    { key: "vehicleMake", label: "Vehicle Make", required: false },
    { key: "model", label: "Vehicle Model", required: false },
    { key: "year", label: "Year", required: false },
    { key: "trim", label: "Trim", required: false },
    { key: "colorPreference", label: "Color Preference", required: false },
    { key: "newUsed", label: "New/Used", required: false },
    { key: "budgetRange", label: "Budget Range", required: false },
    { key: "dealStage", label: "Deal Stage", required: false },
    { key: "dealValue", label: "Deal Value", required: false },
    { key: "address", label: "Address", required: false },
    { key: "city", label: "City", required: false },
    { key: "province", label: "Province", required: false },
    { key: "postalCode", label: "Postal Code", required: false },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "text/csv",
      "text/tab-separated-values",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ];

    const validExtensions = [".csv", ".tsv", ".xls", ".xlsx", ".pdf"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .csv, .tsv, .xls, .xlsx or .pdf file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setUploadStep("mapping");
    // Parse file headers and pre-populate field mappings
    parseFileHeaders(file);
  };

  const parseFileHeaders = async (file: File) => {
    // This is a simplified version - in production, you'd use a proper CSV/Excel parser
    if (file.name.endsWith(".csv") || file.name.endsWith(".tsv")) {
      const text = await file.text();
      const delimiter = file.name.endsWith(".csv") ? "," : "\t";
      const headers = text.split("\n")[0].split(delimiter).map(h => h.trim());
      
      // Auto-map common field names
      const autoMappings: Record<string, string> = {};
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes("name")) autoMappings["fullName"] = header;
        if (lowerHeader.includes("email")) autoMappings["email"] = header;
        if (lowerHeader.includes("phone")) autoMappings["phoneNumber"] = header;
        if (lowerHeader.includes("dealership")) autoMappings["dealership"] = header;
        if (lowerHeader.includes("status")) autoMappings["leadStatus"] = header;
        if (lowerHeader.includes("make")) autoMappings["vehicleMake"] = header;
        if (lowerHeader.includes("model")) autoMappings["model"] = header;
      });
      
      setFieldMappings(autoMappings);
    }
  };

  const handleImport = () => {
    toast({
      title: "Import Started",
      description: `Importing customers from ${selectedFile?.name}`,
    });
    onClose();
    // Reset state
    setSelectedFile(null);
    setUploadStep("select");
    setFieldMappings({});
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStep("select");
    setFieldMappings({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Customer</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            {uploadStep === "select" ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 transition-smooth">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload Customer Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supported formats: CSV, TSV, XLS, XLSX, PDF
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.tsv,.xls,.xlsx,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild className="rounded-2xl gradient-teal text-white">
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Select File
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile && (selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={resetUpload} className="rounded-2xl">
                    Change File
                  </Button>
                </div>

                <div className="border border-border rounded-2xl p-4">
                  <h3 className="font-semibold mb-4">Map Fields</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Match the columns in your file with CRM fields
                  </p>
                  
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {crmFields.map((field) => (
                        <div key={field.key} className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <Label className="text-sm font-medium">
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                          </div>
                          <Select
                            value={fieldMappings[field.key] || ""}
                            onValueChange={(value) =>
                              setFieldMappings({ ...fieldMappings, [field.key]: value })
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Skip this field</SelectItem>
                              <SelectItem value="Column 1">Column 1</SelectItem>
                              <SelectItem value="Column 2">Column 2</SelectItem>
                              <SelectItem value="Column 3">Column 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={resetUpload} className="rounded-2xl">
                    Cancel
                  </Button>
                  <Button onClick={handleImport} className="rounded-2xl gradient-teal text-white">
                    Import Customers
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name<span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input id="fullName" placeholder="John Doe" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email<span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">
                        Phone Number<span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input id="phoneNumber" placeholder="+1 (555) 123-4567" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main St" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Toronto" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" placeholder="ON" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" placeholder="M5H 2N2" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Lead Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">
                    Lead Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dealership">Dealership</Label>
                      <Input id="dealership" placeholder="Downtown Auto" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadStatus">Lead Status</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="negotiating">Negotiating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadSource">Lead Source</Label>
                      <Input id="leadSource" placeholder="Website" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadChannel">Lead Channel</Label>
                      <Input id="leadChannel" placeholder="Online" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaignName">Campaign Name</Label>
                      <Input id="campaignName" placeholder="Summer Sale 2024" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedSalesperson">Assigned Salesperson</Label>
                      <Input id="assignedSalesperson" placeholder="Jane Smith" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Vehicle Interest */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">
                    Vehicle Interest
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Input id="vehicleMake" placeholder="Toyota" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" placeholder="Camry" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" type="number" placeholder="2024" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trim">Trim</Label>
                      <Input id="trim" placeholder="XLE" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colorPreference">Color Preference</Label>
                      <Input id="colorPreference" placeholder="Blue" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUsed">New/Used</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Budget Range</Label>
                      <Input id="budgetRange" placeholder="$30,000 - $40,000" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Deal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">
                    Deal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dealStage">Deal Stage</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dealValue">Deal Value</Label>
                      <Input id="dealValue" type="number" placeholder="35000" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-base border-b border-border pb-2">
                    Additional Notes
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes about this customer..."
                      className="rounded-xl min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button variant="outline" onClick={onClose} className="rounded-2xl">
                    Cancel
                  </Button>
                  <Button className="rounded-2xl gradient-teal text-white">
                    Add Customer
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

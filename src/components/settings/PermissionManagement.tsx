import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AVAILABLE_FIELDS = [
  // Lead Information
  { key: 'leadId', label: 'Lead ID' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'leadChannel', label: 'Lead Channel' },
  { key: 'campaignName', label: 'Campaign Name' },
  { key: 'dateOfInquiry', label: 'Inquiry Date' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'assignedSalesperson', label: 'Salesperson' },
  { key: 'leadOwner', label: 'Lead Owner' },
  { key: 'leadNotes', label: 'Notes' },
  
  // Customer Information
  { key: 'customerId', label: 'Customer ID' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'province', label: 'Province' },
  { key: 'postalCode', label: 'Postal Code' },
  { key: 'preferredContactMethod', label: 'Contact Method' },
  { key: 'customerType', label: 'Customer Type' },
  { key: 'communicationConsent', label: 'Communication Consent' },
  { key: 'tags', label: 'Tags' },
  
  // Vehicle Interest
  { key: 'vehicleMake', label: 'Vehicle Make' },
  { key: 'model', label: 'Model' },
  { key: 'vehicleModel', label: 'Vehicle Model' },
  { key: 'year', label: 'Year' },
  { key: 'trim', label: 'Trim' },
  { key: 'colorPreference', label: 'Color Preference' },
  { key: 'newUsed', label: 'New/Used' },
  { key: 'vin', label: 'VIN' },
  { key: 'stockNumber', label: 'Stock Number' },
  { key: 'budgetRange', label: 'Budget Range' },
  { key: 'tradeIn', label: 'Trade-In' },
  { key: 'tradeInDetails', label: 'Trade-In Details' },
  
  // Deal & Sales Pipeline
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'dealValue', label: 'Deal Value' },
  { key: 'paymentType', label: 'Payment Type' },
  { key: 'depositAmount', label: 'Deposit Amount' },
  { key: 'financingInstitution', label: 'Financing Institution' },
  { key: 'closeProbability', label: 'Close Probability' },
  { key: 'expectedCloseDate', label: 'Expected Close Date' },
  { key: 'dealStatus', label: 'Deal Status' },
  { key: 'lostReason', label: 'Lost Reason' },
  
  // Marketing & Attribution
  { key: 'utmSource', label: 'UTM Source' },
  { key: 'utmMedium', label: 'UTM Medium' },
  { key: 'landingPageUrl', label: 'Landing Page' },
  { key: 'conversionEvent', label: 'Conversion Event' },
  { key: 'timeToFirstContact', label: 'Time to First Contact' },
  { key: 'responseTime', label: 'Response Time' },
  { key: 'leadScoring', label: 'Lead Scoring' },
  
  // Operational Metadata
  { key: 'recordCreatedBy', label: 'Created By' },
  { key: 'recordCreatedDate', label: 'Created Date' },
  { key: 'lastModifiedBy', label: 'Modified By' },
  { key: 'lastModifiedDate', label: 'Modified Date' },
  { key: 'dataSource', label: 'Data Source' },
  { key: 'crmSyncStatus', label: 'CRM Sync Status' },
  { key: 'duplicateFlag', label: 'Duplicate Flag' },
];

interface PermissionManagementProps {
  userId?: string;
}

export const PermissionManagement = ({ userId }: PermissionManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [selectedFields, setSelectedFields] = useState<string[]>(AVAILABLE_FIELDS.map(f => f.key));
  const [canAddCustomer, setCanAddCustomer] = useState(true);
  const [canUseChat, setCanUseChat] = useState(true);
  const [canDownloadData, setCanDownloadData] = useState(true);
  const [canAccessAnalytics, setCanAccessAnalytics] = useState(true);
  const [canUseChatInAnalytics, setCanUseChatInAnalytics] = useState(true);
  const [canAccessHistory, setCanAccessHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFieldsExpanded, setIsFieldsExpanded] = useState(false);
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !email) return;

    setIsLoading(true);
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase
        .from('crm_access_permissions')
        .insert({
          owner_id: userId,
          granted_to_email: email.toLowerCase().trim(),
          permission_level: permissionLevel,
          accessible_fields: selectedFields.length > 0 ? selectedFields : null,
          can_add_customer: canAddCustomer,
          can_use_chat: canUseChat,
          can_download_data: canDownloadData,
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already granted access to this email');
        }
        throw error;
      }

      toast({
        title: 'Access Granted',
        description: `Successfully granted ${permissionLevel} access to ${email}`,
      });

      // Reset form
      setEmail('');
      setPermissionLevel('viewer');
      setSelectedFields(AVAILABLE_FIELDS.map(f => f.key));
      setCanAddCustomer(true);
      setCanUseChat(true);
      setCanDownloadData(true);
      setCanAccessAnalytics(true);
      setCanUseChatInAnalytics(true);
      setCanAccessHistory(true);
      setIsFieldsExpanded(false);
      setIsFeaturesExpanded(true);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error granting access:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to grant access. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleField = (fieldKey: string) => {
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  const toggleAllFields = () => {
    if (selectedFields.length === AVAILABLE_FIELDS.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(AVAILABLE_FIELDS.map(f => f.key));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Grant CRM Access
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto pb-6">
        <DialogHeader>
          <DialogTitle>Grant CRM Access</DialogTitle>
          <DialogDescription>
            Give another user access to your CRM data with customizable permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-0">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Permission Level */}
          <div className="space-y-2">
            <Label htmlFor="permission">Permission Level</Label>
          <Select value={permissionLevel} onValueChange={(value: any) => {
              setPermissionLevel(value);
              // Uncheck (but don't disable) History and Download Data for viewer role
              if (value === 'viewer') {
                setCanAccessHistory(false);
                setCanDownloadData(false);
              } else {
                setCanAccessHistory(true);
                setCanDownloadData(true);
              }
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                <SelectItem value="editor">Editor - Can edit and add data</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Access */}
          <div className="rounded-xl bg-muted/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsFieldsExpanded(!isFieldsExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer">Accessible Fields</Label>
                <span className="text-xs text-muted-foreground">
                  ({selectedFields.length} selected) • Optional
                </span>
              </div>
              {isFieldsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isFieldsExpanded && (
              <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Select which fields the user can access
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllFields}
                    className="h-7 text-xs"
                  >
                    {selectedFields.length === AVAILABLE_FIELDS.length ? 'Uncheck All' : 'Check All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3 rounded-lg bg-background/50 border border-border">
                  {AVAILABLE_FIELDS.map((field) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <Checkbox
                        id={field.key}
                        checked={selectedFields.includes(field.key)}
                        onCheckedChange={() => toggleField(field.key)}
                      />
                      <label
                        htmlFor={field.key}
                        className="text-sm cursor-pointer select-none"
                      >
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navbar Features */}
          <div className="rounded-xl bg-muted/30 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer">Navbar Features Access</Label>
                <span className="text-xs text-muted-foreground">
                  ({[canAddCustomer, canUseChat, canDownloadData, canAccessAnalytics, canUseChatInAnalytics, canAccessHistory].filter(Boolean).length}/6 selected) • Optional
                </span>
              </div>
              {isFeaturesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isFeaturesExpanded && (
              <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="add-customer"
                    checked={canAddCustomer}
                    onCheckedChange={(checked) => setCanAddCustomer(checked as boolean)}
                  />
                  <label htmlFor="add-customer" className="text-sm cursor-pointer">
                    Can add new customers
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="use-chat"
                    checked={canUseChat}
                    onCheckedChange={(checked) => setCanUseChat(checked as boolean)}
                  />
                  <label htmlFor="use-chat" className="text-sm cursor-pointer">
                    Can use chat feature
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="download-data"
                    checked={canDownloadData}
                    onCheckedChange={(checked) => setCanDownloadData(checked as boolean)}
                  />
                  <label htmlFor="download-data" className="text-sm cursor-pointer">
                    Can download CRM data
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="access-analytics"
                    checked={canAccessAnalytics}
                    onCheckedChange={(checked) => setCanAccessAnalytics(checked as boolean)}
                  />
                  <label htmlFor="access-analytics" className="text-sm cursor-pointer">
                    Can access Analytics
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="use-chat-analytics"
                    checked={canUseChatInAnalytics}
                    onCheckedChange={(checked) => setCanUseChatInAnalytics(checked as boolean)}
                  />
                  <label htmlFor="use-chat-analytics" className="text-sm cursor-pointer">
                    Can use chat in Analytics
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="access-history"
                    checked={canAccessHistory}
                    onCheckedChange={(checked) => setCanAccessHistory(checked as boolean)}
                  />
                  <label htmlFor="access-history" className="text-sm cursor-pointer">
                    Can access History
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2 pb-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Granting...' : 'Grant Access'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

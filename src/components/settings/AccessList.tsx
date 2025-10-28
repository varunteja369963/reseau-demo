import { useState, useEffect } from 'react';
import { Trash2, Shield, Eye, Edit as EditIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/dialog';

const AVAILABLE_FIELDS = [
  { key: 'leadId', label: 'Lead ID' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'leadChannel', label: 'Lead Channel' },
  { key: 'campaignName', label: 'Campaign Name' },
  { key: 'dateOfInquiry', label: 'Inquiry Date' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'assignedSalesperson', label: 'Salesperson' },
  { key: 'leadOwner', label: 'Lead Owner' },
  { key: 'leadNotes', label: 'Notes' },
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
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'dealValue', label: 'Deal Value' },
  { key: 'paymentType', label: 'Payment Type' },
  { key: 'depositAmount', label: 'Deposit Amount' },
  { key: 'financingInstitution', label: 'Financing Institution' },
  { key: 'closeProbability', label: 'Close Probability' },
  { key: 'expectedCloseDate', label: 'Expected Close Date' },
  { key: 'dealStatus', label: 'Deal Status' },
  { key: 'lostReason', label: 'Lost Reason' },
  { key: 'utmSource', label: 'UTM Source' },
  { key: 'utmMedium', label: 'UTM Medium' },
  { key: 'landingPageUrl', label: 'Landing Page' },
  { key: 'conversionEvent', label: 'Conversion Event' },
  { key: 'timeToFirstContact', label: 'Time to First Contact' },
  { key: 'responseTime', label: 'Response Time' },
  { key: 'leadScoring', label: 'Lead Scoring' },
  { key: 'recordCreatedBy', label: 'Created By' },
  { key: 'recordCreatedDate', label: 'Created Date' },
  { key: 'lastModifiedBy', label: 'Modified By' },
  { key: 'lastModifiedDate', label: 'Modified Date' },
  { key: 'dataSource', label: 'Data Source' },
  { key: 'crmSyncStatus', label: 'CRM Sync Status' },
  { key: 'duplicateFlag', label: 'Duplicate Flag' },
];

interface AccessPermission {
  id: string;
  granted_to_email: string;
  permission_level: 'viewer' | 'editor' | 'admin';
  accessible_fields: string[] | null;
  can_add_customer: boolean;
  can_use_chat: boolean;
  can_download_data: boolean;
  created_at: string;
}

interface AccessListProps {
  userId?: string;
}

export const AccessList = ({ userId }: AccessListProps) => {
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPermission, setEditingPermission] = useState<AccessPermission | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPermissionLevel, setEditPermissionLevel] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [editSelectedFields, setEditSelectedFields] = useState<string[]>([]);
  const [editCanAddCustomer, setEditCanAddCustomer] = useState(false);
  const [editCanUseChat, setEditCanUseChat] = useState(false);
  const [editCanDownloadData, setEditCanDownloadData] = useState(false);
  const [editCanAccessAnalytics, setEditCanAccessAnalytics] = useState(false);
  const [editCanUseChatInAnalytics, setEditCanUseChatInAnalytics] = useState(false);
  const [editCanAccessHistory, setEditCanAccessHistory] = useState(false);
  const [isFieldsExpanded, setIsFieldsExpanded] = useState(false);
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    loadPermissions();
  }, [userId]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_access_permissions')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPermissions((data as AccessPermission[]) || []);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load access list.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccess = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from('crm_access_permissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPermissions(permissions.filter(p => p.id !== id));
      toast({
        title: 'Access Removed',
        description: `Removed access for ${email}`,
      });
    } catch (error) {
      console.error('Error removing access:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove access. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditAccess = (permission: AccessPermission) => {
    setEditingPermission(permission);
    setEditEmail(permission.granted_to_email);
    setEditPermissionLevel(permission.permission_level);
    setEditSelectedFields(permission.accessible_fields || AVAILABLE_FIELDS.map(f => f.key));
    setEditCanAddCustomer(permission.can_add_customer);
    setEditCanUseChat(permission.can_use_chat);
    setEditCanDownloadData(permission.can_download_data);
    setEditCanAccessAnalytics(true);
    setEditCanUseChatInAnalytics(true);
    setEditCanAccessHistory(permission.permission_level !== 'viewer');
    setIsFieldsExpanded(false);
    setIsFeaturesExpanded(true);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPermission) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('crm_access_permissions')
        .update({
          permission_level: editPermissionLevel,
          accessible_fields: editSelectedFields.length > 0 ? editSelectedFields : null,
          can_add_customer: editCanAddCustomer,
          can_use_chat: editCanUseChat,
          can_download_data: editCanDownloadData,
        })
        .eq('id', editingPermission.id);

      if (error) throw error;

      await loadPermissions();
      toast({
        title: 'Access Updated',
        description: `Successfully updated access for ${editEmail}`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating access:', error);
      toast({
        title: 'Error',
        description: 'Failed to update access. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleEditField = (fieldKey: string) => {
    if (editSelectedFields.includes(fieldKey)) {
      setEditSelectedFields(editSelectedFields.filter(f => f !== fieldKey));
    } else {
      setEditSelectedFields([...editSelectedFields, fieldKey]);
    }
  };

  const toggleAllEditFields = () => {
    if (editSelectedFields.length === AVAILABLE_FIELDS.length) {
      setEditSelectedFields([]);
    } else {
      setEditSelectedFields(AVAILABLE_FIELDS.map(f => f.key));
    }
  };

  const getPermissionIcon = (level: string) => {
    switch (level) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'editor':
        return <EditIcon className="w-4 h-4" />;
      case 'viewer':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'viewer':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Don't show loading state, show demo data immediately

  // Show demo data if no real permissions exist
  const displayPermissions = permissions.length > 0 ? permissions : [
    {
      id: 'demo-1',
      granted_to_email: 'john.doe@example.com',
      permission_level: 'viewer' as const,
      accessible_fields: ['fullName', 'email', 'phoneNumber', 'leadStatus'],
      can_add_customer: false,
      can_use_chat: true,
      can_download_data: false,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      granted_to_email: 'jane.smith@example.com',
      permission_level: 'editor' as const,
      accessible_fields: null,
      can_add_customer: true,
      can_use_chat: true,
      can_download_data: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-3',
      granted_to_email: 'admin@example.com',
      permission_level: 'admin' as const,
      accessible_fields: null,
      can_add_customer: true,
      can_use_chat: true,
      can_download_data: true,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <>
      <div className="space-y-3">
        {permissions.length === 0 && (
          <div className="text-xs text-muted-foreground italic mb-3 p-3 bg-muted/30 rounded-lg">
            Demo data shown below. Grant access to see real permissions here.
          </div>
        )}
        {displayPermissions.map((permission) => (
        <div
          key={permission.id}
          className="p-4 rounded-xl bg-muted/30 border border-border space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-foreground">
                  {permission.granted_to_email}
                </span>
                <Badge
                  variant="outline"
                  className={`${getPermissionColor(permission.permission_level)} capitalize`}
                >
                  {getPermissionIcon(permission.permission_level)}
                  <span className="ml-1">{permission.permission_level}</span>
                </Badge>
              </div>

              {/* Field Access */}
              {permission.accessible_fields && permission.accessible_fields.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Fields: </span>
                  {permission.accessible_fields.join(', ')}
                </div>
              )}

              {/* Feature Access */}
              <div className="flex flex-wrap gap-2">
                {permission.can_add_customer && (
                  <Badge variant="secondary" className="text-xs">
                    Add Customer
                  </Badge>
                )}
                {permission.can_use_chat && (
                  <Badge variant="secondary" className="text-xs">
                    Chat
                  </Badge>
                )}
                {permission.can_download_data && (
                  <Badge variant="secondary" className="text-xs">
                    Download Data
                  </Badge>
                )}
              </div>
            </div>

            {permissions.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[hsl(var(--teal))] hover:text-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/10"
                  onClick={() => handleEditAccess(permission)}
                >
                  <EditIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveAccess(permission.id, permission.granted_to_email)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Granted on {new Date(permission.created_at).toLocaleDateString()}
          </div>
        </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit CRM Access</DialogTitle>
            <DialogDescription>
              Update permissions for {editEmail}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateAccess} className="space-y-6">
            {/* Email Display (read-only) */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={editEmail} disabled className="bg-muted" />
            </div>

            {/* Permission Level */}
            <div className="space-y-2">
              <Label htmlFor="edit-permission">Permission Level</Label>
              <Select value={editPermissionLevel} onValueChange={(value: any) => {
                setEditPermissionLevel(value);
                if (value === 'viewer') {
                  setEditCanAccessHistory(false);
                  setEditCanDownloadData(false);
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
                    ({editSelectedFields.length} selected) • Optional
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
                      onClick={toggleAllEditFields}
                      className="h-7 text-xs"
                    >
                      {editSelectedFields.length === AVAILABLE_FIELDS.length ? 'Uncheck All' : 'Check All'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3 rounded-lg bg-background/50 border border-border">
                    {AVAILABLE_FIELDS.map((field) => (
                      <div key={field.key} className="flex items-center gap-2">
                        <Checkbox
                          id={`edit-${field.key}`}
                          checked={editSelectedFields.includes(field.key)}
                          onCheckedChange={() => toggleEditField(field.key)}
                        />
                        <label
                          htmlFor={`edit-${field.key}`}
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
                    ({[editCanAddCustomer, editCanUseChat, editCanDownloadData, editCanAccessAnalytics, editCanUseChatInAnalytics, editCanAccessHistory].filter(Boolean).length}/6 selected) • Optional
                  </span>
                </div>
                {isFeaturesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {isFeaturesExpanded && (
                <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-add-customer"
                      checked={editCanAddCustomer}
                      onCheckedChange={(checked) => setEditCanAddCustomer(checked as boolean)}
                    />
                    <label htmlFor="edit-add-customer" className="text-sm cursor-pointer">
                      Can add new customers
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-use-chat"
                      checked={editCanUseChat}
                      onCheckedChange={(checked) => setEditCanUseChat(checked as boolean)}
                    />
                    <label htmlFor="edit-use-chat" className="text-sm cursor-pointer">
                      Can use chat feature
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-download-data"
                      checked={editCanDownloadData}
                      onCheckedChange={(checked) => setEditCanDownloadData(checked as boolean)}
                      disabled={editPermissionLevel === 'viewer'}
                    />
                    <label htmlFor="edit-download-data" className={cn("text-sm cursor-pointer", editPermissionLevel === 'viewer' && "opacity-50")}>
                      Can download CRM data
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-access-analytics"
                      checked={editCanAccessAnalytics}
                      onCheckedChange={(checked) => setEditCanAccessAnalytics(checked as boolean)}
                    />
                    <label htmlFor="edit-access-analytics" className="text-sm cursor-pointer">
                      Can access Analytics
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-use-chat-analytics"
                      checked={editCanUseChatInAnalytics}
                      onCheckedChange={(checked) => setEditCanUseChatInAnalytics(checked as boolean)}
                    />
                    <label htmlFor="edit-use-chat-analytics" className="text-sm cursor-pointer">
                      Can use chat in Analytics
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-access-history"
                      checked={editCanAccessHistory}
                      onCheckedChange={(checked) => setEditCanAccessHistory(checked as boolean)}
                      disabled={editPermissionLevel === 'viewer'}
                    />
                    <label htmlFor="edit-access-history" className={cn("text-sm cursor-pointer", editPermissionLevel === 'viewer' && "opacity-50")}>
                      Can access History
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Access'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CardSelection } from './settings/CardSelection';
import { PermissionManagement } from './settings/PermissionManagement';
import { AccessList } from './settings/AccessList';
import { CustomColumnManagement } from './settings/CustomColumnManagement';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Column {
  key: string;
  label: string;
}

const AVAILABLE_COLUMNS: Column[] = [
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

const DEFAULT_COLUMNS = [
  'fullName', 'email', 'phoneNumber', 'leadStatus', 'leadScoring', 
  'leadSource', 'leadChannel', 'campaignName', 'dateOfInquiry', 'assignedSalesperson',
  'vehicleMake', 'model', 'year', 'trim', 'colorPreference', 'newUsed', 'budgetRange', 
  'tradeIn', 'dealStage', 'dealValue', 'closeProbability', 'expectedCloseDate'
];

interface SettingsViewProps {
  visibleColumns?: string[];
  onColumnChange: (columns: string[]) => void;
}

export const SettingsView = ({ visibleColumns, onColumnChange }: SettingsViewProps) => {
  const columns = visibleColumns || DEFAULT_COLUMNS;
  const [userId, setUserId] = useState<string | undefined>();
  const [showStatsCards, setShowStatsCards] = useState(true);
  const [enableChatInAnalytics, setEnableChatInAnalytics] = useState(false);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);
  const [statsCardOpen, setStatsCardOpen] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    getUserId();
  }, []);

  const toggleColumn = (columnKey: string) => {
    if (columns.includes(columnKey)) {
      onColumnChange(columns.filter(c => c !== columnKey));
    } else {
      onColumnChange([...columns, columnKey]);
    }
  };

  return (
    <div className="space-y-6">
      {/* CRM Access Permissions */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-2">CRM Access Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Grant access to your CRM data with customizable permissions.
        </p>
        <PermissionManagement userId={userId} />
      </div>

      {/* Active Access List */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-2">Granted Access</h3>
        <p className="text-sm text-muted-foreground mb-4">
          View and manage users who have access to your CRM.
        </p>
        <AccessList userId={userId} />
      </div>

      {/* Custom Columns Management */}
      <Collapsible open={customColumnsOpen} onOpenChange={setCustomColumnsOpen}>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">Custom Columns</h3>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform",
                customColumnsOpen && "rotate-180"
              )} />
            </div>
          </CollapsibleTrigger>
          <p className="text-sm text-muted-foreground mb-4 text-left">
            Add custom fields to your CRM table with different data types.
          </p>
          <CollapsibleContent>
            <CustomColumnManagement userId={userId} />
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Card Selection */}
      {showStatsCards && (
        <Collapsible open={statsCardOpen} onOpenChange={setStatsCardOpen}>
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">Stats Card Display</h3>
                <ChevronDown className={cn(
                  "h-5 w-5 transition-transform",
                  statsCardOpen && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <p className="text-sm text-muted-foreground mb-6 text-left">
              Select up to 4 stat cards to display above your CRM table.
            </p>
            <CollapsibleContent>
              <CardSelection userId={userId} />
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-2">Display Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize your CRM display settings.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setShowStatsCards(!showStatsCards)}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 w-full hover:bg-muted/40 transition-smooth"
          >
            <span className="text-sm font-medium">Show stats cards</span>
            <div className={cn(
              "w-12 h-6 rounded-full relative transition-smooth",
              showStatsCards ? "bg-[hsl(var(--teal))]" : "bg-muted"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-smooth",
                showStatsCards ? "right-0.5" : "left-0.5"
              )}></div>
            </div>
          </button>
          <button
            onClick={() => setEnableChatInAnalytics(!enableChatInAnalytics)}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 w-full hover:bg-muted/40 transition-smooth"
          >
            <span className="text-sm font-medium">Enable chat in Analytics</span>
            <div className={cn(
              "w-12 h-6 rounded-full relative transition-smooth",
              enableChatInAnalytics ? "bg-[hsl(var(--teal))]" : "bg-muted"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-smooth",
                enableChatInAnalytics ? "right-0.5" : "left-0.5"
              )}></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

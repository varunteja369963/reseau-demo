import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
}

const AVAILABLE_COLUMNS: Column[] = [
  // Lead Information
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'leadScoring', label: 'Lead Rating' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'leadChannel', label: 'Lead Channel' },
  { key: 'campaignName', label: 'Campaign Name' },
  { key: 'dateOfInquiry', label: 'Inquiry Date' },
  { key: 'assignedSalesperson', label: 'Salesperson' },
  
  // Customer Information
  { key: 'city', label: 'City' },
  { key: 'province', label: 'Province' },
  { key: 'customerType', label: 'Customer Type' },
  { key: 'tags', label: 'Tags' },
  
  // Vehicle Interest
  { key: 'vehicleMake', label: 'Vehicle Make' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'trim', label: 'Trim' },
  { key: 'colorPreference', label: 'Color' },
  { key: 'newUsed', label: 'New/Used' },
  { key: 'budgetRange', label: 'Budget' },
  { key: 'tradeIn', label: 'Trade-In' },
  
  // Deal & Sales Pipeline
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'dealValue', label: 'Deal Value' },
  { key: 'paymentType', label: 'Payment Type' },
  { key: 'closeProbability', label: 'Close Probability' },
  { key: 'expectedCloseDate', label: 'Expected Close Date' },
];

const DEFAULT_COLUMNS = ['fullName', 'email', 'phoneNumber', 'leadStatus', 'leadSource', 'vehicleMake', 'model', 'year', 'budgetRange', 'dealStage', 'leadScoring'];

interface SettingsViewProps {
  visibleColumns?: string[];
  onColumnChange: (columns: string[]) => void;
}

export const SettingsView = ({ visibleColumns, onColumnChange }: SettingsViewProps) => {
  const columns = visibleColumns || DEFAULT_COLUMNS;

  const toggleColumn = (columnKey: string) => {
    if (columns.includes(columnKey)) {
      onColumnChange(columns.filter(c => c !== columnKey));
    } else {
      onColumnChange([...columns, columnKey]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-2">Customize Table View</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select which columns you want to see in your CRM table. Changes are applied immediately.
        </p>

        <div className="space-y-3">
          {AVAILABLE_COLUMNS.map((col) => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl transition-smooth border-2",
                columns.includes(col.key)
                  ? "bg-[hsl(var(--teal))]/10 border-[hsl(var(--teal))] text-foreground"
                  : "bg-muted/30 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-medium">{col.label}</span>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-smooth",
                columns.includes(col.key)
                  ? "bg-[hsl(var(--teal))] text-white"
                  : "bg-muted"
              )}>
                {columns.includes(col.key) && <Check className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={() => onColumnChange(DEFAULT_COLUMNS)}
            className="w-full px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-smooth text-sm font-medium"
          >
            Reset to Default View
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-2">Display Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Additional settings coming soon...
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
            <span className="text-sm font-medium">Show stats cards</span>
            <div className="w-12 h-6 bg-[hsl(var(--teal))] rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

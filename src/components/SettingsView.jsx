import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_COLUMNS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'leadScoring', label: 'Lead Rating' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'assignedSalesperson', label: 'Assigned To' },
  { key: 'vehicleMake', label: 'Vehicle Make' },
  { key: 'model', label: 'Model' },
  { key: 'budgetRange', label: 'Budget' },
  { key: 'dateOfInquiry', label: 'Inquiry Date' },
  { key: 'closeProbability', label: 'Close Probability' },
  { key: 'dealValue', label: 'Deal Value' },
];

const DEFAULT_COLUMNS = ['fullName', 'email', 'phoneNumber', 'leadStatus', 'leadScoring'];

export const SettingsView = ({ visibleColumns, onColumnChange }) => {
  const columns = visibleColumns || DEFAULT_COLUMNS;

  const toggleColumn = (columnKey) => {
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

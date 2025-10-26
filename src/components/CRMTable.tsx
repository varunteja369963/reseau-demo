import * as React from "react";
import { Mail, Phone, Star, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const DEFAULT_COLUMNS = [
  'fullName', 'email', 'phoneNumber', 'dealership', 'leadStatus', 'leadScoring', 
  'leadSource', 'leadChannel', 'campaignName', 'dateOfInquiry', 'assignedSalesperson',
  'vehicleMake', 'model', 'year', 'trim', 'colorPreference', 'newUsed', 'budgetRange', 
  'tradeIn', 'dealStage', 'dealValue', 'closeProbability', 'expectedCloseDate'
];

interface CRMTableProps {
  leads: Lead[];
  visibleColumns?: string[];
  onOpenProfile: (lead: Lead) => void;
  onOpenContact: (lead: Lead, type: string) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const COLUMN_LABELS: Record<string, string> = {
  // Lead Information
  leadId: 'Lead ID',
  leadSource: 'Lead Source',
  leadChannel: 'Channel',
  campaignName: 'Campaign',
  dateOfInquiry: 'Inquiry Date',
  leadStatus: 'Status',
  assignedSalesperson: 'Salesperson',
  leadOwner: 'Lead Owner',
  leadNotes: 'Notes',
  dealership: 'Dealership',
  
  // Customer Information
  customerId: 'Customer ID',
  fullName: 'Full Name',
  email: 'Email',
  phoneNumber: 'Phone',
  address: 'Address',
  city: 'City',
  province: 'Province',
  postalCode: 'Postal Code',
  preferredContactMethod: 'Contact Method',
  customerType: 'Customer Type',
  communicationConsent: 'Consent',
  tags: 'Tags',
  
  // Vehicle Interest
  vehicleMake: 'Make',
  model: 'Model',
  vehicleModel: 'Vehicle Model',
  year: 'Year',
  trim: 'Trim',
  colorPreference: 'Color',
  newUsed: 'New/Used',
  vin: 'VIN',
  stockNumber: 'Stock #',
  budgetRange: 'Budget',
  tradeIn: 'Trade-In',
  tradeInDetails: 'Trade-In Details',
  
  // Deal & Sales Pipeline
  dealStage: 'Deal Stage',
  dealValue: 'Deal Value',
  paymentType: 'Payment Type',
  depositAmount: 'Deposit',
  financingInstitution: 'Financing',
  closeProbability: 'Close Prob %',
  expectedCloseDate: 'Expected Close',
  dealStatus: 'Deal Status',
  lostReason: 'Lost Reason',
  
  // Marketing & Attribution
  utmSource: 'UTM Source',
  utmMedium: 'UTM Medium',
  landingPageUrl: 'Landing Page',
  conversionEvent: 'Conversion',
  timeToFirstContact: 'Time to Contact',
  responseTime: 'Response Time',
  leadScoring: 'Score',
  
  // Operational Metadata
  recordCreatedBy: 'Created By',
  recordCreatedDate: 'Created Date',
  lastModifiedBy: 'Modified By',
  lastModifiedDate: 'Modified Date',
  dataSource: 'Data Source',
  crmSyncStatus: 'Sync Status',
  duplicateFlag: 'Duplicate',
};

export const CRMTable = ({ 
  leads, 
  visibleColumns, 
  onOpenProfile, 
  onOpenContact,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: CRMTableProps) => {
  const columns = visibleColumns || DEFAULT_COLUMNS;
  
  // Sorting state
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Sort leads based on current sort column and direction
  const sortedLeads = React.useMemo(() => {
    if (!sortColumn) return leads;

    return [...leads].sort((a, b) => {
      const aValue = a[sortColumn as keyof Lead];
      const bValue = b[sortColumn as keyof Lead];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

      // Date comparison
      if (sortColumn === 'dateOfInquiry' || sortColumn === 'expectedCloseDate' || 
          sortColumn === 'recordCreatedDate' || sortColumn === 'lastModifiedDate') {
        const aTime = new Date(aValue as Date).getTime();
        const bTime = new Date(bValue as Date).getTime();
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      // Number comparison
      if (sortColumn === 'leadScoring' || sortColumn === 'dealValue' || 
          sortColumn === 'depositAmount' || sortColumn === 'closeProbability') {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Boolean comparison
      if (sortColumn === 'tradeIn' || sortColumn === 'communicationConsent' || sortColumn === 'duplicateFlag') {
        const aBool = aValue ? 1 : 0;
        const bBool = bValue ? 1 : 0;
        return sortDirection === 'asc' ? aBool - bBool : bBool - aBool;
      }

      // String comparison (default)
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = sortedLeads.slice(startIndex, endIndex);

  // Column resizing state and handlers
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const resizingColRef = React.useRef<string | null>(null);
  const startXRef = React.useRef<number>(0);
  const startWidthRef = React.useRef<number>(0);

  const onResizeMouseMove = React.useCallback((e: MouseEvent) => {
    const col = resizingColRef.current;
    if (!col) return;
    const delta = e.clientX - startXRef.current;
    const newWidth = Math.max(100, Math.min(600, startWidthRef.current + delta));
    setColumnWidths((prev) => ({ ...prev, [col]: newWidth }));
  }, []);

  const onResizeMouseUp = React.useCallback(() => {
    resizingColRef.current = null;
    window.removeEventListener('mousemove', onResizeMouseMove);
    window.removeEventListener('mouseup', onResizeMouseUp);
  }, [onResizeMouseMove]);

  const onResizeMouseDown = (col: string, e: React.MouseEvent) => {
    e.preventDefault();
    resizingColRef.current = col;
    startXRef.current = e.clientX;
    const th = (e.currentTarget as HTMLElement).parentElement as HTMLElement | null;
    startWidthRef.current = th?.offsetWidth || (columnWidths[col] ?? 150);
    window.addEventListener('mousemove', onResizeMouseMove);
    window.addEventListener('mouseup', onResizeMouseUp);
  };

  React.useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onResizeMouseMove);
      window.removeEventListener('mouseup', onResizeMouseUp);
    };
  }, [onResizeMouseMove, onResizeMouseUp]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction or clear sort
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-2 opacity-40" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-2 text-[hsl(var(--teal))]" />
      : <ArrowDown className="w-4 h-4 ml-2 text-[hsl(var(--teal))]" />
  };

  const renderCellContent = (lead: Lead, col: string) => {
    if (col === 'fullName') {
      return (
        <TableCell>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenProfile(lead)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 hover:scale-110 transition-smooth",
                lead.color
              )}
            >
              {lead.initials}
            </button>
            <button
              onClick={() => onOpenProfile(lead)}
              className="font-medium text-foreground hover:text-[hsl(var(--teal))] transition-smooth text-left"
            >
              {lead.fullName}
            </button>
          </div>
        </TableCell>
      );
    }
    
    if (col === 'email') {
      return (
        <TableCell>
          <button
            onClick={() => onOpenContact(lead, "email")}
            className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--teal))] transition-smooth"
          >
            <Mail className="w-4 h-4 text-[hsl(var(--teal))]" />
            <span className="text-sm">{lead.email}</span>
          </button>
        </TableCell>
      );
    }
    
    if (col === 'phoneNumber') {
      return (
        <TableCell>
          <button
            onClick={() => onOpenContact(lead, "call")}
            className="flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--blue))] transition-smooth"
          >
            <Phone className="w-4 h-4 text-[hsl(var(--blue))]" />
            <span className="text-sm">{lead.phoneNumber}</span>
          </button>
        </TableCell>
      );
    }
    
    if (col === 'leadStatus') {
      return (
        <TableCell>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            lead.leadStatus === 'Qualified' || lead.leadStatus === 'Sold' ? "bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]" :
            lead.leadStatus === 'Lost' ? "bg-red-100 text-red-700" :
            "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]"
          )}>
            {lead.leadStatus}
          </span>
        </TableCell>
      );
    }
    
    if (col === 'leadScoring') {
      return (
        <TableCell>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-4 h-4 transition-smooth",
                  star <= lead.leadScoring
                    ? "fill-[hsl(var(--teal))] text-[hsl(var(--teal))]"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </TableCell>
      );
    }

    if (col === 'dateOfInquiry' || col === 'expectedCloseDate') {
      const date = lead[col as keyof Lead] as Date | null;
      return (
        <TableCell className="text-sm text-muted-foreground">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </TableCell>
      );
    }

    if (col === 'tradeIn' || col === 'communicationConsent' || col === 'duplicateFlag') {
      const value = lead[col as keyof Lead];
      return (
        <TableCell className="text-sm text-muted-foreground">
          {value ? 'Yes' : 'No'}
        </TableCell>
      );
    }

    if (col === 'dealValue' || col === 'depositAmount') {
      const value = lead[col as keyof Lead] as number | null;
      return (
        <TableCell className="text-sm text-muted-foreground">
          {value ? `$${value.toLocaleString()}` : '-'}
        </TableCell>
      );
    }

    if (col === 'recordCreatedDate' || col === 'lastModifiedDate') {
      const date = lead[col as keyof Lead] as Date | null;
      return (
        <TableCell className="text-sm text-muted-foreground">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </TableCell>
      );
    }

    if (col === 'tags') {
      return (
        <TableCell>
          {lead.tags && lead.tags.length > 0 ? (
            <div className="flex gap-1">
              {lead.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 text-xs rounded-full bg-[hsl(var(--purple))]/10 text-[hsl(var(--purple))]">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </TableCell>
      );
    }
    
    return (
      <TableCell className="text-sm text-muted-foreground">
        {lead[col as keyof Lead] ? String(lead[col as keyof Lead]) : '-'}
      </TableCell>
    );
  };

  return (
    <div className="bg-card rounded-3xl shadow-soft overflow-hidden w-full">
      {/* Table */}
      <div className="relative max-h-[700px] overflow-auto">
        <Table className="min-w-max">
          <TableHeader className="sticky top-0 z-20 bg-card shadow-sm">
            <TableRow className="hover:bg-transparent border-b">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="bg-card font-semibold text-foreground whitespace-nowrap relative border-b-0 group cursor-pointer"
                  style={{
                    width: columnWidths[col] ? `${columnWidths[col]}px` : undefined,
                    minWidth: 120,
                    maxWidth: 400,
                  }}
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center justify-between pr-4">
                    <span>{COLUMN_LABELS[col] || col}</span>
                    {getSortIcon(col)}
                  </div>
                  <span
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none opacity-0 group-hover:opacity-100 hover:bg-primary/20 transition-opacity"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onResizeMouseDown(col, e);
                    }}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow key={lead.leadId}>
                {columns.map((col) => (
                  <React.Fragment key={col}>
                    {renderCellContent(lead, col)}
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={String(itemsPerPage)} onValueChange={(val) => onItemsPerPageChange(Number(val))}>
            <SelectTrigger className="w-[80px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {startIndex + 1}-{Math.min(endIndex, sortedLeads.length)} of {sortedLeads.length}
          </span>
        </div>

        <div className="ml-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={cn(
                    "cursor-pointer",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => onPageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={cn(
                    "cursor-pointer",
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

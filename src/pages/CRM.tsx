import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { StatsCards } from "@/components/StatsCards";
import { CRMTable } from "@/components/CRMTable";
import { FilterPanel, FilterValues } from "@/components/FilterPanel";
import { CRMTableNavbar } from "@/components/CRMTableNavbar";
import { CustomerProfileModal } from "@/components/modals/CustomerProfileModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { ChatPanel } from "@/components/ChatPanel";
import { generateDemoLeads } from "@/utils/demoData";
import { Lead } from "@/types/lead";
import { ChevronDown } from "lucide-react";
import { isWithinInterval } from "date-fns";

const CRM = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'fullName', 'email', 'phoneNumber', 'dealership', 'leadStatus', 'leadScoring', 
    'leadSource', 'leadChannel', 'campaignName', 'dateOfInquiry', 'assignedSalesperson',
    'vehicleMake', 'model', 'year', 'trim', 'colorPreference', 'newUsed', 'budgetRange', 
    'tradeIn', 'dealStage', 'dealValue', 'closeProbability', 'expectedCloseDate'
  ]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [contactType, setContactType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    customerName: '',
    customerNameFilterType: 'contains',
    customerEmail: '',
    customerEmailFilterType: 'contains',
    customerPhone: '',
    customerPhoneFilterType: 'contains',
    leadStatus: [],
    leadSource: [],
    leadChannel: [],
    campaignName: '',
    dealership: [],
    assignedSalesperson: [],
    inquiryDateRange: undefined,
    expectedCloseDateRange: undefined,
    minLeadScore: 0,
    maxLeadScore: 100,
    vehicleMake: [],
    newUsed: [],
    budgetMin: 0,
    budgetMax: 0,
    dealStage: [],
    minDealValue: '0',
    maxDealValue: '0',
    minCloseProbability: '0',
    maxCloseProbability: '100',
    tradeInOnly: false,
    communicationConsent: false
  });

  useEffect(() => {
    const demoLeads = generateDemoLeads();
    setLeads(demoLeads);
  }, []);

  const matchesStringFilter = (value: string, filterValue: string, filterType: string): boolean => {
    if (!filterValue) return true;
    const lowerValue = value.toLowerCase();
    const lowerFilter = filterValue.toLowerCase();

    switch (filterType) {
      case 'contains':
        return lowerValue.includes(lowerFilter);
      case 'startsWith':
        return lowerValue.startsWith(lowerFilter);
      case 'endsWith':
        return lowerValue.endsWith(lowerFilter);
      case 'exact':
        return lowerValue === lowerFilter;
      default:
        return true;
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Customer Name filter
      if (filters.customerName && !matchesStringFilter(
        lead.fullName,
        filters.customerName,
        filters.customerNameFilterType
      )) return false;

      // Customer Email filter
      if (filters.customerEmail && !matchesStringFilter(
        lead.email,
        filters.customerEmail,
        filters.customerEmailFilterType
      )) return false;

      // Customer Phone filter
      if (filters.customerPhone && !matchesStringFilter(
        lead.phoneNumber,
        filters.customerPhone,
        filters.customerPhoneFilterType
      )) return false;

      // Lead Status filter
      if (filters.leadStatus.length > 0 && !filters.leadStatus.includes(lead.leadStatus)) {
        return false;
      }

      // Lead Source filter
      if (filters.leadSource.length > 0 && !filters.leadSource.includes(lead.leadSource)) {
        return false;
      }

      // Lead Channel filter
      if (filters.leadChannel.length > 0 && !filters.leadChannel.includes(lead.leadChannel)) {
        return false;
      }

      // Campaign Name filter
      if (filters.campaignName && !lead.campaignName.toLowerCase().includes(filters.campaignName.toLowerCase())) {
        return false;
      }

      // Dealership filter
      if (filters.dealership.length > 0 && !filters.dealership.includes(lead.dealership)) {
        return false;
      }

      // Assigned Salesperson filter
      if (filters.assignedSalesperson.length > 0 && !filters.assignedSalesperson.includes(lead.assignedSalesperson)) {
        return false;
      }

      // Inquiry Date Range filter
      if (filters.inquiryDateRange?.from || filters.inquiryDateRange?.to) {
        const inquiryDate = new Date(lead.dateOfInquiry);
        const from = filters.inquiryDateRange.from || new Date(0);
        const to = filters.inquiryDateRange.to || new Date();
        
        if (!isWithinInterval(inquiryDate, { start: from, end: to })) {
          return false;
        }
      }

      // Expected Close Date Range filter
      if (filters.expectedCloseDateRange?.from || filters.expectedCloseDateRange?.to) {
        const closeDate = new Date(lead.expectedCloseDate);
        const from = filters.expectedCloseDateRange.from || new Date(0);
        const to = filters.expectedCloseDateRange.to || new Date();
        
        if (!isWithinInterval(closeDate, { start: from, end: to })) {
          return false;
        }
      }

      // Lead Score filter
      if (lead.leadScoring < filters.minLeadScore || lead.leadScoring > filters.maxLeadScore) {
        return false;
      }

      // Vehicle Make filter
      if (filters.vehicleMake.length > 0 && !filters.vehicleMake.includes(lead.vehicleMake)) {
        return false;
      }

      // Budget filter
      if (filters.budgetMin > 0 || filters.budgetMax > 0) {
        const budgetMatch = lead.budgetRange.match(/\$(\d+)k-\$(\d+)k/);
        if (budgetMatch) {
          const minBudget = parseInt(budgetMatch[1]) * 1000;
          const maxBudget = parseInt(budgetMatch[2]) * 1000;
          
          if (filters.budgetMin > 0 && maxBudget < filters.budgetMin) return false;
          if (filters.budgetMax > 0 && minBudget > filters.budgetMax) return false;
        }
      }

      // Trade-In filter
      if (filters.tradeInOnly && !lead.tradeIn) {
        return false;
      }

      // Deal Stage filter
      if (filters.dealStage.length > 0 && !filters.dealStage.includes(lead.dealStage)) {
        return false;
      }

      // Deal Value filter
      const minDealValue = parseFloat(filters.minDealValue) || 0;
      const maxDealValue = parseFloat(filters.maxDealValue) || 0;
      if (minDealValue > 0 && lead.dealValue < minDealValue) {
        return false;
      }
      if (maxDealValue > 0 && lead.dealValue > maxDealValue) {
        return false;
      }

      // Close Probability filter
      const minCloseProb = parseFloat(filters.minCloseProbability) || 0;
      const maxCloseProb = parseFloat(filters.maxCloseProbability) || 100;
      if (lead.closeProbability < minCloseProb || lead.closeProbability > maxCloseProb) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  const handleOpenProfile = (lead: Lead) => {
    setSelectedLead(lead);
    setShowProfileModal(true);
  };

  const handleOpenContact = (lead: Lead, type: string) => {
    setSelectedLead(lead);
    setContactType(type);
    setShowContactModal(true);
  };

  const handleToggleChat = () => {
    setIsChatPanelOpen(!isChatPanelOpen);
    if (!isChatPanelOpen && isFilterPanelOpen) {
      setIsFilterPanelOpen(false);
    }
  };

  const handleToggleFilter = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    if (!isFilterPanelOpen && isChatPanelOpen) {
      setIsChatPanelOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex pl-24 bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar activeTab="crm" setActiveTab={() => {}} />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Customer Relationship Management</h1>
                <p className="text-muted-foreground">Manage and track your customer interactions</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-smooth">
                <span className="text-sm font-medium">Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <StatsCards />
            
            <CRMTableNavbar 
              isFilterOpen={isFilterPanelOpen}
              onToggleFilter={handleToggleFilter}
              isChatOpen={isChatPanelOpen}
              onToggleChat={handleToggleChat}
              visibleColumns={visibleColumns}
              onColumnChange={setVisibleColumns}
              leads={filteredLeads}
            />
            
            <div className="flex gap-4 relative">
              <div className="flex-1 overflow-hidden">
                <CRMTable 
                  leads={filteredLeads}
                  visibleColumns={visibleColumns}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  onOpenProfile={handleOpenProfile}
                  onOpenContact={handleOpenContact}
                />
              </div>
              
              {isFilterPanelOpen && (
                <FilterPanel 
                  onToggle={() => setIsFilterPanelOpen(false)}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              )}

              {isChatPanelOpen && (
                <ChatPanel 
                  onToggle={() => setIsChatPanelOpen(false)}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {showProfileModal && selectedLead && (
        <CustomerProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          lead={selectedLead}
        />
      )}

      {showContactModal && selectedLead && contactType && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          lead={selectedLead}
          type={contactType}
        />
      )}
    </div>
  );
};

export default CRM;

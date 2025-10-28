import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { StatsCards } from "@/components/StatsCards";
import { CRMTable } from "@/components/CRMTable";
import { FilterPanel, FilterValues } from "@/components/FilterPanel";
import { CRMTableNavbar } from "@/components/CRMTableNavbar";
import { CustomerProfileModal } from "@/components/modals/CustomerProfileModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { AnalyticsView } from "@/components/AnalyticsView";
import { SettingsView } from "@/components/SettingsView";
import { ChatPanel } from "@/components/ChatPanel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { generateDemoLeads } from "@/utils/demoData";
import { Lead } from "@/types/lead";
import { ChevronDown } from "lucide-react";
import { isWithinInterval } from "date-fns";

const CRM = () => {
  const [activeTab, setActiveTab] = useState<string>("crm");
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
  const [groupBy, setGroupBy] = useState<string | null>(null);
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
    maxLeadScore: 5,
    vehicleMake: [],
    newUsed: [],
    budgetMin: 10000,
    budgetMax: 100000,
    dealStage: [],
    minDealValue: '',
    maxDealValue: '',
    minCloseProbability: '',
    maxCloseProbability: '',
    tradeInOnly: false,
    communicationConsent: false,
  });

  useEffect(() => {
    setLeads(generateDemoLeads());
  }, []);

  // Helper function for string filtering
  const matchesStringFilter = (value: string, filterValue: string, filterType: 'contains' | 'startsWith' | 'endsWith' | 'exact'): boolean => {
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

  // Filter leads based on current filter values
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Customer Name
      if (!matchesStringFilter(lead.fullName, filters.customerName, filters.customerNameFilterType)) {
        return false;
      }

      // Customer Email
      if (!matchesStringFilter(lead.email, filters.customerEmail, filters.customerEmailFilterType)) {
        return false;
      }

      // Customer Phone
      if (!matchesStringFilter(lead.phoneNumber, filters.customerPhone, filters.customerPhoneFilterType)) {
        return false;
      }

      // Lead Status
      if (filters.leadStatus.length > 0 && !filters.leadStatus.includes(lead.leadStatus)) {
        return false;
      }

      // Lead Source
      if (filters.leadSource.length > 0 && !filters.leadSource.includes(lead.leadSource)) {
        return false;
      }

      // Lead Channel
      if (filters.leadChannel.length > 0 && !filters.leadChannel.includes(lead.leadChannel)) {
        return false;
      }

      // Dealership
      if (filters.dealership.length > 0 && !filters.dealership.includes(lead.dealership)) {
        return false;
      }

      // Lead Score
      if (lead.leadScoring < filters.minLeadScore || lead.leadScoring > filters.maxLeadScore) {
        return false;
      }

      // Inquiry Date Range
      if (filters.inquiryDateRange?.from) {
        const inquiryDate = new Date(lead.dateOfInquiry);
        const from = filters.inquiryDateRange.from;
        const to = filters.inquiryDateRange.to || filters.inquiryDateRange.from;
        if (!isWithinInterval(inquiryDate, { start: from, end: to })) {
          return false;
        }
      }

      // Expected Close Date Range
      if (filters.expectedCloseDateRange?.from && lead.expectedCloseDate) {
        const closeDate = new Date(lead.expectedCloseDate);
        const from = filters.expectedCloseDateRange.from;
        const to = filters.expectedCloseDateRange.to || filters.expectedCloseDateRange.from;
        if (!isWithinInterval(closeDate, { start: from, end: to })) {
          return false;
        }
      }

      // Vehicle Make
      if (filters.vehicleMake.length > 0 && !filters.vehicleMake.includes(lead.vehicleMake)) {
        return false;
      }

      // New/Used
      if (filters.newUsed.length > 0 && !filters.newUsed.includes(lead.newUsed)) {
        return false;
      }

      // Budget Range - parse the lead's budget range string and check if it overlaps with filter range
      if (lead.budgetRange) {
        // Parse budget range like "$10,000 - $20,000" or "$50,000+"
        const budgetMatch = lead.budgetRange.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)|\$?([\d,]+)\+/);
        if (budgetMatch) {
          let leadBudgetMin = 0;
          let leadBudgetMax = Infinity;
          
          if (budgetMatch[3]) {
            // Format: "$50,000+"
            leadBudgetMin = parseInt(budgetMatch[3].replace(/,/g, ''));
            leadBudgetMax = Infinity;
          } else {
            // Format: "$10,000 - $20,000"
            leadBudgetMin = parseInt(budgetMatch[1].replace(/,/g, ''));
            leadBudgetMax = parseInt(budgetMatch[2].replace(/,/g, ''));
          }
          
          // Check if ranges overlap
          if (leadBudgetMax < filters.budgetMin || leadBudgetMin > filters.budgetMax) {
            return false;
          }
        }
      }

      // Deal Stage
      if (filters.dealStage.length > 0 && !filters.dealStage.includes(lead.dealStage)) {
        return false;
      }

      // Deal Value Range
      if (filters.minDealValue && lead.dealValue && lead.dealValue < Number(filters.minDealValue)) {
        return false;
      }
      if (filters.maxDealValue && lead.dealValue && lead.dealValue > Number(filters.maxDealValue)) {
        return false;
      }

      // Close Probability Range
      if (filters.minCloseProbability && lead.closeProbability < Number(filters.minCloseProbability)) {
        return false;
      }
      if (filters.maxCloseProbability && lead.closeProbability > Number(filters.maxCloseProbability)) {
        return false;
      }

      // Trade-In Only
      if (filters.tradeInOnly && !lead.tradeIn) {
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
    if (!isChatPanelOpen) {
      setIsFilterPanelOpen(false);
    }
  };

  const handleToggleFilter = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    if (!isFilterPanelOpen) {
      setIsChatPanelOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <div className="lg:ml-24 min-h-screen flex flex-col max-w-[100vw]">
        <TopNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden pt-16 lg:pt-8">
          <div className="max-w-full mx-auto">
            {activeTab === "crm" && (
              <>
                <StatsCards />
                
                <CRMTableNavbar 
                  isFilterOpen={isFilterPanelOpen}
                  onToggleFilter={handleToggleFilter}
                  isChatOpen={isChatPanelOpen}
                  onToggleChat={handleToggleChat}
                  visibleColumns={visibleColumns}
                  onColumnChange={setVisibleColumns}
                  leads={filteredLeads}
                  groupBy={groupBy}
                  onGroupByChange={setGroupBy}
                />
                
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1 min-w-0 overflow-x-auto">
                    <CRMTable 
                      leads={filteredLeads} 
                      visibleColumns={visibleColumns}
                      onOpenProfile={handleOpenProfile}
                      onOpenContact={handleOpenContact}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={(items) => {
                        setItemsPerPage(items);
                        setCurrentPage(1);
                      }}
                      groupBy={groupBy}
                    />
                  </div>
                  
                  {/* Desktop side panels */}
                  {isFilterPanelOpen && (
                    <div className="hidden lg:block w-[280px] flex-shrink-0">
                      <FilterPanel 
                        onToggle={handleToggleFilter}
                        filters={filters}
                        onFiltersChange={setFilters}
                      />
                    </div>
                  )}

                  {isChatPanelOpen && (
                    <div className="hidden lg:block w-[280px] flex-shrink-0">
                      <ChatPanel onToggle={handleToggleChat} />
                    </div>
                  )}
                </div>

                {/* Mobile sheets for filter and chat */}
                <Sheet open={isFilterPanelOpen && window.innerWidth < 1024} onOpenChange={handleToggleFilter}>
                  <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 overflow-auto">
                    <FilterPanel 
                      onToggle={handleToggleFilter}
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </SheetContent>
                </Sheet>

                <Sheet open={isChatPanelOpen && window.innerWidth < 1024} onOpenChange={handleToggleChat}>
                  <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
                    <ChatPanel onToggle={handleToggleChat} />
                  </SheetContent>
                </Sheet>
              </>
            )}

            {activeTab === "analytics" && <AnalyticsView />}
            
            {activeTab === "settings" && (
              <SettingsView 
                visibleColumns={visibleColumns}
                onColumnChange={setVisibleColumns}
              />
            )}
          </div>
        </main>
      </div>

      <CustomerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        lead={selectedLead}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        type={contactType}
        lead={selectedLead}
      />
    </div>
  );
};

export default CRM;

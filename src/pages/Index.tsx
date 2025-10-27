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
import { generateDemoLeads } from "@/utils/demoData";
import { Lead } from "@/types/lead";
import { ChevronDown } from "lucide-react";
import { isWithinInterval } from "date-fns";

const Index = () => {
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
  const [filters, setFilters] = useState<FilterValues>({
    searchText: '',
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
    budgetRange: [],
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

  // Filter leads based on current filter values
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Text search
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesSearch = 
          lead.fullName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.phoneNumber.includes(searchLower);
        if (!matchesSearch) return false;
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

      // Budget Range
      if (filters.budgetRange.length > 0 && !filters.budgetRange.includes(lead.budgetRange)) {
        return false;
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
      
      <div className="ml-24 min-h-screen flex flex-col max-w-[100vw]">
        <TopNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8 overflow-x-hidden">
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
                />
                
                <div className={`grid grid-cols-1 gap-4 items-start ${(isFilterPanelOpen || isChatPanelOpen) ? 'xl:grid-cols-[1fr_280px]' : ''}`}>
                  <div className="min-w-0">
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
                    />
                  </div>
                  
                  {isFilterPanelOpen && (
                    <div className="flex-shrink-0">
                      <FilterPanel 
                        onToggle={handleToggleFilter}
                        filters={filters}
                        onFiltersChange={setFilters}
                      />
                    </div>
                  )}

                  {isChatPanelOpen && (
                    <div className="flex-shrink-0">
                      <ChatPanel onToggle={handleToggleChat} />
                    </div>
                  )}
                </div>
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

export default Index;

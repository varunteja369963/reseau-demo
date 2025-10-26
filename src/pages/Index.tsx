import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { StatsCards } from "@/components/StatsCards";
import { CRMTable } from "@/components/CRMTable";
import { FilterPanel } from "@/components/FilterPanel";
import { CRMTableNavbar } from "@/components/CRMTableNavbar";
import { CustomerProfileModal } from "@/components/modals/CustomerProfileModal";
import { ContactModal } from "@/components/modals/ContactModal";
import { AnalyticsView } from "@/components/AnalyticsView";
import { SettingsView } from "@/components/SettingsView";
import { generateDemoLeads } from "@/utils/demoData";
import { Lead } from "@/types/lead";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("crm");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'fullName', 'email', 'phoneNumber', 'leadStatus', 'leadScoring', 
    'leadSource', 'leadChannel', 'campaignName', 'dateOfInquiry', 'assignedSalesperson',
    'vehicleMake', 'model', 'year', 'trim', 'colorPreference', 'newUsed', 'budgetRange', 
    'tradeIn', 'dealStage', 'dealValue', 'closeProbability', 'expectedCloseDate'
  ]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [contactType, setContactType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    setLeads(generateDemoLeads());
  }, []);

  const handleOpenProfile = (lead: Lead) => {
    setSelectedLead(lead);
    setShowProfileModal(true);
  };

  const handleOpenContact = (lead: Lead, type: string) => {
    setSelectedLead(lead);
    setContactType(type);
    setShowContactModal(true);
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
                
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                  <div>
                    <CRMTableNavbar />
              <CRMTable 
                leads={leads} 
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
                  
                  <div>
                    <FilterPanel />
                  </div>
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

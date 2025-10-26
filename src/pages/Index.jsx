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

const Index = () => {
  const [activeTab, setActiveTab] = useState("crm");
  const [leads, setLeads] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(['fullName', 'email', 'phoneNumber', 'leadStatus', 'leadScoring']);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState(null);

  useEffect(() => {
    setLeads(generateDemoLeads());
  }, []);

  const handleOpenProfile = (lead) => {
    setSelectedLead(lead);
    setShowProfileModal(true);
  };

  const handleOpenContact = (lead, type) => {
    setSelectedLead(lead);
    setContactType(type);
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-24 min-h-screen flex flex-col">
        <TopNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto">
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

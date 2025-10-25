import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { StatsCards } from "@/components/StatsCards";
import { CRMTable } from "@/components/CRMTable";
import { FilterPanel } from "@/components/FilterPanel";
import { CRMTableNavbar } from "@/components/CRMTableNavbar";
import { CustomerProfileModal } from "@/components/modals/CustomerProfileModal";
import { ContactModal } from "@/components/modals/ContactModal";

const Index = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<"call" | "email" | null>(null);

  const handleOpenProfile = (lead: any) => {
    setSelectedLead(lead);
    setShowProfileModal(true);
  };

  const handleOpenContact = (lead: any, type: "call" | "email") => {
    setSelectedLead(lead);
    setContactType(type);
    setShowContactModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-24 min-h-screen flex flex-col">
        <TopNavbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto">
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
              <div>
                <CRMTableNavbar />
                <CRMTable 
                  onOpenProfile={handleOpenProfile}
                  onOpenContact={handleOpenContact}
                />
              </div>
              
              <div>
                <FilterPanel />
              </div>
            </div>
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

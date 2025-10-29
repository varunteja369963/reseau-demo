import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EmailTopNav } from "@/components/email/EmailTopNav";
import { EmailDashboard } from "@/components/email/EmailDashboard";
import { EmailContacts } from "@/components/email/EmailContacts";
import { EmailCampaigns } from "@/components/email/EmailCampaigns";
import { EmailTemplates } from "@/components/email/EmailTemplates";
import { EmailAutomations } from "@/components/email/EmailAutomations";
import { EmailAnalytics } from "@/components/email/EmailAnalytics";
import { EmailSettings } from "@/components/email/EmailSettings";

const Email = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <div className="lg:ml-24 min-h-screen flex flex-col max-w-[100vw]">
        <EmailTopNav activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-6 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            {activeTab === "dashboard" && <EmailDashboard />}
            {activeTab === "contacts" && <EmailContacts />}
            {activeTab === "campaigns" && <EmailCampaigns />}
            {activeTab === "templates" && <EmailTemplates />}
            {activeTab === "automations" && <EmailAutomations />}
            {activeTab === "analytics" && <EmailAnalytics />}
            {activeTab === "settings" && <EmailSettings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Email;

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SMSTopNav } from "@/components/sms/SMSTopNav";
import { SMSDashboard } from "@/components/sms/SMSDashboard";
import { SMSCampaigns } from "@/components/sms/SMSCampaigns";
import { SMSAutomations } from "@/components/sms/SMSAutomations";
import { SMSInbox } from "@/components/sms/SMSInbox";
import { SMSContacts } from "@/components/sms/SMSContacts";
import { SMSListsSegments } from "@/components/sms/SMSListsSegments";
import { SMSTemplates } from "@/components/sms/SMSTemplates";
import { SMSCompliance } from "@/components/sms/SMSCompliance";
import { SMSSettings } from "@/components/sms/SMSSettings";
import { SMSBilling } from "@/components/sms/SMSBilling";

export type SMSTab = 
  | "dashboard" 
  | "campaigns" 
  | "automations" 
  | "inbox" 
  | "contacts" 
  | "lists" 
  | "templates" 
  | "compliance" 
  | "settings" 
  | "billing";

const SMS = () => {
  const [activeTab, setActiveTab] = useState<SMSTab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SMSDashboard />;
      case "campaigns":
        return <SMSCampaigns />;
      case "automations":
        return <SMSAutomations />;
      case "inbox":
        return <SMSInbox />;
      case "contacts":
        return <SMSContacts />;
      case "lists":
        return <SMSListsSegments />;
      case "templates":
        return <SMSTemplates />;
      case "compliance":
        return <SMSCompliance />;
      case "settings":
        return <SMSSettings />;
      case "billing":
        return <SMSBilling />;
      default:
        return <SMSDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <div className="lg:ml-24 min-h-screen flex flex-col max-w-[100vw]">
        <SMSTopNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-6 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SMS;

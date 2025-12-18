import { useState } from "react";
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
    <div className="min-h-screen bg-background">
      <SMSTopNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default SMS;

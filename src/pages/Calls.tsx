import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CallsTopNav } from "@/components/calls/CallsTopNav";
import { CallsDashboard } from "@/components/calls/CallsDashboard";
import { CallsTwilioConnection } from "@/components/calls/CallsTwilioConnection";
import { CallsOwnedNumbers } from "@/components/calls/CallsOwnedNumbers";
import { CallsBuyNumbers } from "@/components/calls/CallsBuyNumbers";
import { CallsFlows } from "@/components/calls/CallsFlows";
import { CallsDialer } from "@/components/calls/CallsDialer";
import { CallsLogs } from "@/components/calls/CallsLogs";
import { CallsRecordings } from "@/components/calls/CallsRecordings";
import { CallsCompliance } from "@/components/calls/CallsCompliance";
import { CallsPorting } from "@/components/calls/CallsPorting";
import { CallsSettings } from "@/components/calls/CallsSettings";
import { CallsAuditLogs } from "@/components/calls/CallsAuditLogs";

export type CallsTab =
  | "dashboard"
  | "connection"
  | "owned"
  | "buy"
  | "flows"
  | "dialer"
  | "calls"
  | "recordings"
  | "compliance"
  | "porting"
  | "settings"
  | "audit";

const Calls = () => {
  const [activeTab, setActiveTab] = useState<CallsTab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CallsDashboard onNavigate={setActiveTab} />;
      case "connection":
        return <CallsTwilioConnection />;
      case "owned":
        return <CallsOwnedNumbers onNavigate={setActiveTab} />;
      case "buy":
        return <CallsBuyNumbers />;
      case "flows":
        return <CallsFlows />;
      case "dialer":
        return <CallsDialer />;
      case "calls":
        return <CallsLogs />;
      case "recordings":
        return <CallsRecordings />;
      case "compliance":
        return <CallsCompliance />;
      case "porting":
        return <CallsPorting />;
      case "settings":
        return <CallsSettings />;
      case "audit":
        return <CallsAuditLogs />;
      default:
        return <CallsDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <div className="lg:ml-24 min-h-screen flex flex-col max-w-[100vw]">
        <CallsTopNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-6 overflow-x-hidden">
          <div className="max-w-full mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calls;

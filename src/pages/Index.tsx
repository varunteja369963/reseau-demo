import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { Radar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex pl-24 bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar activeTab="radar" setActiveTab={() => {}} />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl gradient-teal flex items-center justify-center">
                  <Radar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">My Radar</h1>
                  <p className="text-muted-foreground">Your command center for automotive operations</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link 
                to="/crm" 
                className="group p-6 rounded-2xl bg-gradient-to-br from-[hsl(var(--teal-light))] to-[hsl(var(--blue-light))] hover:shadow-medium transition-smooth"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Radar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Customer Relationship Management</h3>
                  <p className="text-white/80 text-sm">Manage and track your customer interactions</p>
                </div>
              </Link>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border hover:shadow-soft transition-smooth opacity-50 cursor-not-allowed">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    <Radar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Email Marketing</h3>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border hover:shadow-soft transition-smooth opacity-50 cursor-not-allowed">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    <Radar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">SMS Campaigns</h3>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border hover:shadow-soft transition-smooth opacity-50 cursor-not-allowed">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    <Radar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">AI Calls</h3>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border hover:shadow-soft transition-smooth opacity-50 cursor-not-allowed">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    <Radar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Chatbot</h3>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border hover:shadow-soft transition-smooth opacity-50 cursor-not-allowed">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted-foreground/20 flex items-center justify-center">
                    <Radar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Inventory Management</h3>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

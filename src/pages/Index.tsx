import { Sidebar } from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">My Radar</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

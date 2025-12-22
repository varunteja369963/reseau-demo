import {
  Phone,
  GitBranch,
  PhoneCall,
  FileAudio,
  AlertTriangle,
  ArrowRightLeft,
  ShoppingCart,
  Plus,
  PhoneOutgoing,
  Wrench,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import type { CallsTab } from "@/pages/Calls";

interface CallsDashboardProps {
  onNavigate: (tab: CallsTab) => void;
}

interface KpiStat {
  label: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
}

const kpiData: KpiStat[] = [
  { label: "Owned Numbers", value: "12", icon: Phone, gradient: "gradient-teal" },
  { label: "Active Call Flows", value: "5", icon: GitBranch, gradient: "gradient-blue" },
  { label: "Calls (7d)", value: "1,234", icon: PhoneCall, gradient: "gradient-purple" },
  { label: "Recording Minutes", value: "456", icon: FileAudio, gradient: "gradient-teal" },
  { label: "Compliance Alerts", value: "2", icon: AlertTriangle, gradient: "gradient-red" },
  { label: "Porting In Progress", value: "1", icon: ArrowRightLeft, gradient: "gradient-blue" },
];

const recentCalls = [
  { id: "1", date: "2024-01-16 10:30 AM", from: "+1 555-0100", to: "+1 555-1234", status: "completed", duration: "3:45" },
  { id: "2", date: "2024-01-16 10:15 AM", from: "+1 555-0200", to: "+1 555-5678", status: "completed", duration: "1:23" },
  { id: "3", date: "2024-01-16 9:50 AM", from: "+1 555-9999", to: "+1 555-0100", status: "missed", duration: "-" },
  { id: "4", date: "2024-01-16 9:30 AM", from: "+1 555-0100", to: "+1 555-4321", status: "completed", duration: "5:12" },
  { id: "5", date: "2024-01-16 9:00 AM", from: "+1 555-8888", to: "+1 555-0200", status: "voicemail", duration: "0:45" },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-600",
  missed: "bg-red-500/10 text-red-600",
  voicemail: "bg-yellow-500/10 text-yellow-600",
  failed: "bg-destructive/10 text-destructive",
  "in-progress": "bg-blue-500/10 text-blue-600",
};

export function CallsDashboard({ onNavigate }: CallsDashboardProps) {
  const [isStatsOpen, setIsStatsOpen] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your phone system</p>
      </div>

      {/* KPI Cards - CRM Style */}
      <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-end gap-1.5 mb-3 py-1.5 hover:bg-muted/30 rounded-lg transition-smooth group">
            <span className="text-xs font-medium text-muted-foreground/70 group-hover:text-muted-foreground transition-smooth">
              {isStatsOpen ? 'Hide' : 'Show Overview'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-muted-foreground transition-all ${isStatsOpen ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-card rounded-3xl p-4 md:p-5 shadow-soft hover:shadow-medium transition-smooth text-left group overflow-hidden relative"
                >
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${kpi.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                        <div className="text-xs text-muted-foreground">{kpi.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Actions */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-5 flex flex-col items-center gap-2 rounded-2xl bg-card border-0 shadow-soft hover:shadow-medium"
              onClick={() => onNavigate("buy")}
            >
              <div className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Buy a Number</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-5 flex flex-col items-center gap-2 rounded-2xl bg-card border-0 shadow-soft hover:shadow-medium"
              onClick={() => onNavigate("flows")}
            >
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Create Call Flow</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-5 flex flex-col items-center gap-2 rounded-2xl bg-card border-0 shadow-soft hover:shadow-medium"
              onClick={() => onNavigate("dialer")}
            >
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
                <PhoneOutgoing className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Start a Call</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-5 flex flex-col items-center gap-2 rounded-2xl bg-card border-0 shadow-soft hover:shadow-medium"
              onClick={() => onNavigate("compliance")}
            >
              <div className="w-10 h-10 gradient-red rounded-xl flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium">Fix Compliance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card className="rounded-3xl shadow-soft border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Last 10 calls</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-[hsl(var(--teal))]" onClick={() => onNavigate("calls")}>
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-muted">
                <TableHead>Date/Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call.id} className="border-muted hover:bg-muted/30">
                  <TableCell className="text-muted-foreground">{call.date}</TableCell>
                  <TableCell className="font-mono">{call.from}</TableCell>
                  <TableCell className="font-mono">{call.to}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors[call.status]} rounded-lg`}>
                      {call.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{call.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

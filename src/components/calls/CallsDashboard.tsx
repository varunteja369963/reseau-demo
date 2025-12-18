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
  TrendingUp,
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
import type { CallsTab } from "@/pages/Calls";

interface CallsDashboardProps {
  onNavigate: (tab: CallsTab) => void;
}

const kpiData = [
  { label: "Owned Numbers", value: "12", icon: Phone, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Active Call Flows", value: "5", icon: GitBranch, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Calls (7d)", value: "1,234", icon: PhoneCall, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Recording Minutes (7d)", value: "456", icon: FileAudio, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Compliance Alerts", value: "2", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  { label: "Porting In Progress", value: "1", icon: ArrowRightLeft, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const recentCalls = [
  { id: "1", date: "2024-01-16 10:30 AM", from: "+1 555-0100", to: "+1 555-1234", status: "completed", duration: "3:45" },
  { id: "2", date: "2024-01-16 10:15 AM", from: "+1 555-0200", to: "+1 555-5678", status: "completed", duration: "1:23" },
  { id: "3", date: "2024-01-16 9:50 AM", from: "+1 555-9999", to: "+1 555-0100", status: "missed", duration: "-" },
  { id: "4", date: "2024-01-16 9:30 AM", from: "+1 555-0100", to: "+1 555-4321", status: "completed", duration: "5:12" },
  { id: "5", date: "2024-01-16 9:00 AM", from: "+1 555-8888", to: "+1 555-0200", status: "voicemail", duration: "0:45" },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/10 text-green-500",
  missed: "bg-red-500/10 text-red-500",
  voicemail: "bg-yellow-500/10 text-yellow-500",
  failed: "bg-destructive/10 text-destructive",
  "in-progress": "bg-blue-500/10 text-blue-500",
};

export function CallsDashboard({ onNavigate }: CallsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your phone system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onNavigate("buy")}
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Buy a Number</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onNavigate("flows")}
            >
              <Plus className="h-6 w-6" />
              <span>Create Call Flow</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onNavigate("dialer")}
            >
              <PhoneOutgoing className="h-6 w-6" />
              <span>Start a Call</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => onNavigate("compliance")}
            >
              <Wrench className="h-6 w-6" />
              <span>Fix Compliance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 10 calls</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => onNavigate("calls")}>
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="text-muted-foreground">{call.date}</TableCell>
                  <TableCell className="font-mono">{call.from}</TableCell>
                  <TableCell className="font-mono">{call.to}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[call.status]}>
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

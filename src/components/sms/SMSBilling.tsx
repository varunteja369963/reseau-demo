import {
  CreditCard,
  TrendingUp,
  MessageSquare,
  Users,
  Workflow,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  { id: "INV-001", date: "Jan 1, 2024", amount: "$249.00", status: "paid" },
  { id: "INV-002", date: "Dec 1, 2023", amount: "$249.00", status: "paid" },
  { id: "INV-003", date: "Nov 1, 2023", amount: "$199.00", status: "paid" },
  { id: "INV-004", date: "Oct 1, 2023", amount: "$199.00", status: "paid" },
];

const usageMeters = [
  { label: "Messages Sent", used: 8500, limit: 10000, icon: MessageSquare, color: "teal" },
  { label: "Inbound Messages", used: 1200, limit: 5000, icon: MessageSquare, color: "purple" },
  { label: "Contacts", used: 4500, limit: 10000, icon: Users, color: "amber" },
  { label: "Active Automations", used: 5, limit: 10, icon: Workflow, color: "red" },
];

const colorClasses: Record<string, { bg: string; text: string; progress: string }> = {
  teal: { bg: "from-teal-500/20 to-teal-600/20", text: "text-teal-500", progress: "[&>div]:bg-gradient-to-r [&>div]:from-teal-500 [&>div]:to-teal-600" },
  purple: { bg: "from-purple-500/20 to-purple-600/20", text: "text-purple-500", progress: "[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-600" },
  amber: { bg: "from-amber-500/20 to-amber-600/20", text: "text-amber-500", progress: "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-600" },
  red: { bg: "from-red-500/20 to-red-600/20", text: "text-red-500", progress: "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-red-600" },
};

export function SMSBilling() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card className="lg:col-span-2 rounded-3xl shadow-soft border-0 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Current Plan</CardTitle>
                <CardDescription>Your subscription details</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-600 rounded-lg">
                Pro Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="text-3xl font-bold text-foreground">$249<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                <p className="text-sm text-muted-foreground">Next billing date: Feb 1, 2024</p>
              </div>
              <div className="text-right">
                <Button variant="outline" className="gap-2 rounded-xl border-0 bg-muted/50 hover:bg-muted">
                  <TrendingUp className="h-4 w-4" />
                  Upgrade Plan
                </Button>
              </div>
            </div>

            <div>
              <p className="font-medium mb-3 text-foreground">Plan includes:</p>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  10,000 messages/month
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  10,000 contacts
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  10 active automations
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  5,000 inbound messages
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Advanced analytics
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="rounded-3xl shadow-soft border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Payment Method</CardTitle>
            <CardDescription>Your default payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border-0 bg-muted/30 rounded-xl">
              <div className="h-10 w-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl border-0 bg-muted/50 hover:bg-muted">
              Update Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Current Usage</CardTitle>
          <CardDescription>Your usage for this billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageMeters.map((meter) => {
              const Icon = meter.icon;
              const percentage = (meter.used / meter.limit) * 100;
              const colors = colorClasses[meter.color];
              return (
                <div key={meter.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${colors.text}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{meter.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {meter.used.toLocaleString()} / {meter.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={percentage} className={`h-2 bg-muted/50 ${colors.progress}`} />
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% used
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Invoices</CardTitle>
            <CardDescription>Your billing history</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50">
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-border/30">
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-teal-500/10 text-teal-600 rounded-lg">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1 rounded-xl">
                      <Download className="h-4 w-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
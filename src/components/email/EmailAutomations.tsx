import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Workflow, 
  Play, 
  Pause, 
  MoreVertical,
  Clock,
  Users,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EmailAutomations = () => {
  const automations = [
    {
      id: "1",
      name: "Welcome Series",
      description: "3-email welcome sequence for new subscribers",
      trigger: "New Subscriber",
      status: "active",
      enrolled: 1250,
      completed: 980,
      completionRate: 78.4,
      steps: 3
    },
    {
      id: "2",
      name: "Abandoned Cart Recovery",
      description: "Recover abandoned carts with 3 reminder emails",
      trigger: "Cart Abandoned",
      status: "active",
      enrolled: 456,
      completed: 189,
      completionRate: 41.4,
      steps: 3
    },
    {
      id: "3",
      name: "Re-engagement Campaign",
      description: "Win back inactive subscribers",
      trigger: "90 Days Inactive",
      status: "paused",
      enrolled: 892,
      completed: 342,
      completionRate: 38.3,
      steps: 4
    },
    {
      id: "4",
      name: "Birthday Wishes",
      description: "Send birthday emails with special offers",
      trigger: "Birthday Date",
      status: "active",
      enrolled: 2340,
      completed: 2280,
      completionRate: 97.4,
      steps: 1
    },
    {
      id: "5",
      name: "Post-Purchase Follow-up",
      description: "Request feedback and suggest related products",
      trigger: "Purchase Made",
      status: "active",
      enrolled: 680,
      completed: 598,
      completionRate: 87.9,
      steps: 2
    },
  ];

  const workflows = [
    { name: "Welcome New Subscriber", type: "new_subscriber", popular: true },
    { name: "Abandoned Cart", type: "abandoned_cart", popular: true },
    { name: "Win Back Inactive", type: "re_engagement", popular: true },
    { name: "Birthday Campaign", type: "date_based", popular: false },
    { name: "Post-Purchase", type: "custom_event", popular: false },
    { name: "Lead Nurture", type: "segment_joined", popular: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
          <p className="text-muted-foreground">Create automated email workflows and sequences</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Quick Start Templates */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Popular Automation Workflows</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflows.map((workflow, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto py-4 justify-start text-left"
              >
                <Workflow className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{workflow.name}</div>
                  {workflow.popular && (
                    <Badge variant="secondary" className="text-xs mt-1">Popular</Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Automations */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Workflow className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">{automation.name}</h3>
                    <Badge variant={automation.status === "active" ? "default" : "secondary"}>
                      {automation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{automation.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Trigger: {automation.trigger}
                    </span>
                    <span>{automation.steps} steps</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={automation.status === "active"} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Workflow</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>
                        {automation.status === "active" ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Users className="w-3 h-3" />
                    Enrolled
                  </div>
                  <div className="text-2xl font-bold">{automation.enrolled.toLocaleString()}</div>
                </div>
                <div className="text-center border-x border-border">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </div>
                  <div className="text-2xl font-bold">{automation.completed.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Completion
                  </div>
                  <div className="text-2xl font-bold">{automation.completionRate}%</div>
                </div>
              </div>

              {/* Workflow Visualization Preview */}
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg text-sm whitespace-nowrap">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {automation.trigger}
                </div>
                {Array.from({ length: automation.steps }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-px bg-border" />
                    <div className="px-3 py-2 bg-muted rounded-lg text-sm whitespace-nowrap">
                      Email {idx + 1}
                    </div>
                  </div>
                ))}
                <div className="w-8 h-px bg-border" />
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg text-sm whitespace-nowrap">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  Complete
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

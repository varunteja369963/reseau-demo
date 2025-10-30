import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Eye, 
  Copy, 
  MoreVertical,
  Sparkles,
  Layout,
  FileText,
  Briefcase,
  ShoppingBag,
  Heart,
  Calendar as CalendarIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EmailTemplateBuilder } from "./EmailTemplateBuilder";

export const EmailTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const systemTemplates = [
    { 
      id: "1", 
      name: "Welcome Email", 
      category: "Onboarding", 
      description: "Welcome new subscribers",
      icon: Heart,
      usageCount: 42
    },
    { 
      id: "2", 
      name: "Newsletter", 
      category: "Newsletter", 
      description: "Weekly newsletter template",
      icon: FileText,
      usageCount: 156
    },
    { 
      id: "3", 
      name: "Product Launch", 
      category: "Marketing", 
      description: "Announce new products",
      icon: ShoppingBag,
      usageCount: 28
    },
    { 
      id: "4", 
      name: "Event Invitation", 
      category: "Events", 
      description: "Invite to events",
      icon: CalendarIcon,
      usageCount: 15
    },
    { 
      id: "5", 
      name: "Business Proposal", 
      category: "Business", 
      description: "Professional proposal template",
      icon: Briefcase,
      usageCount: 8
    },
    { 
      id: "6", 
      name: "Simple Text", 
      category: "Basic", 
      description: "Plain text email",
      icon: Layout,
      usageCount: 89
    },
  ];

  const customTemplates = [
    { 
      id: "7", 
      name: "Summer Sale Promotion", 
      category: "Marketing", 
      lastEdited: "2 days ago",
      usageCount: 12
    },
    { 
      id: "8", 
      name: "Customer Feedback Request", 
      category: "Feedback", 
      lastEdited: "1 week ago",
      usageCount: 8
    },
    { 
      id: "9", 
      name: "Monthly Product Update", 
      category: "Product", 
      lastEdited: "2 weeks ago",
      usageCount: 24
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">Create and manage reusable email templates</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setEditingTemplate(null);
              setBuilderOpen(true);
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Template
          </Button>
          <Button
            onClick={() => {
              setEditingTemplate(null);
              setBuilderOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Template Tabs */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">
            System Templates ({systemTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="custom">
            My Templates ({customTemplates.length})
          </TabsTrigger>
        </TabsList>

        {/* System Templates */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-smooth group">
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
                    <template.icon className="w-16 h-16 text-muted-foreground/20" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Copy className="w-4 h-4 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Templates */}
        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-smooth group">
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                    <Layout className="w-16 h-16 text-primary/20" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Last edited {template.lastEdited}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingTemplate(template);
                              setBuilderOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Template Card */}
            <Card className="overflow-hidden border-dashed hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer">
              <CardContent className="p-0">
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Plus className="w-12 h-12 text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium">Create New Template</p>
                    <p className="text-xs text-muted-foreground">Start from scratch</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <EmailTemplateBuilder
        open={builderOpen}
        onClose={() => {
          setBuilderOpen(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
      />
    </div>
  );
};

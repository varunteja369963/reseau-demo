import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  Archive,
  FileText,
  Sparkles,
  Code,
  Type,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templates = [
  {
    id: "1",
    name: "Welcome Message",
    category: "Onboarding",
    preview: "Hi {{first_name}}! Welcome to our community...",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Promotional Offer",
    category: "Marketing",
    preview: "🎉 Flash Sale! Get 50% off everything...",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Appointment Reminder",
    category: "Transactional",
    preview: "Reminder: Your appointment is scheduled for {{date}}...",
    lastUpdated: "2024-01-12",
  },
  {
    id: "4",
    name: "Order Confirmation",
    category: "Transactional",
    preview: "Thank you for your order #{{order_id}}...",
    lastUpdated: "2024-01-10",
  },
  {
    id: "5",
    name: "Re-engagement",
    category: "Marketing",
    preview: "We miss you! Here's 20% off your next purchase...",
    lastUpdated: "2024-01-08",
  },
  {
    id: "6",
    name: "Feedback Request",
    category: "Survey",
    preview: "How was your experience? Reply 1-5 to rate...",
    lastUpdated: "2024-01-05",
  },
];

const categories = ["All", "Onboarding", "Marketing", "Transactional", "Survey", "Custom"];

export function SMSTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [templateBody, setTemplateBody] = useState("");
  const [testContact, setTestContact] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openEditor = (template?: typeof templates[0]) => {
    setSelectedTemplate(template || null);
    setTemplateBody(template?.preview || "");
    setEditorOpen(true);
  };

  const insertMergeTag = (tag: string) => {
    setTemplateBody((prev) => prev + ` {{${tag}}}`);
  };

  const charCount = templateBody.length;
  const segments = Math.ceil(charCount / 160) || 1;
  const isUnicode = /[^\x00-\x7F]/.test(templateBody);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Create and manage SMS message templates</p>
        </div>
        <Button onClick={() => openEditor()} className="gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-soft">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl shadow-soft border-0 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className="rounded-xl"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="rounded-3xl shadow-soft border-0 bg-card hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => openEditor(template)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-3 mb-3">
                <p className="text-sm line-clamp-3">{template.preview}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {template.lastUpdated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              Create or edit your SMS template
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
            {/* Editor */}
            <div className="space-y-4 overflow-y-auto">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input 
                  placeholder="Enter template name" 
                  defaultValue={selectedTemplate?.name}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue={selectedTemplate?.category || "Custom"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Message Body</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        Insert Merge Tag
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => insertMergeTag("first_name")}>
                        {"{{first_name}}"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertMergeTag("last_name")}>
                        {"{{last_name}}"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertMergeTag("company_name")}>
                        {"{{company_name}}"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => insertMergeTag("custom.field")}>
                        {"{{custom.field}}"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[200px] font-mono"
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {charCount}/160 characters • {segments} segment{segments > 1 ? "s" : ""}
                  </span>
                  <Badge variant={isUnicode ? "secondary" : "outline"}>
                    {isUnicode ? "Unicode" : "GSM-7"}
                  </Badge>
                </div>
                {isUnicode && (
                  <p className="text-xs text-yellow-500">
                    ⚠️ Unicode characters detected. Message segments will be limited to 70 characters.
                  </p>
                )}
              </div>
            </div>

            {/* Preview & Tools */}
            <div className="space-y-4 overflow-y-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {templateBody || "Your message preview will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Test Render
                  </CardTitle>
                  <CardDescription>
                    Preview with a sample contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={testContact} onValueChange={setTestContact}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith (+1 555-0123)</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson (+1 555-0456)</SelectItem>
                      <SelectItem value="mike">Mike Wilson (+1 555-0789)</SelectItem>
                    </SelectContent>
                  </Select>
                  {testContact && (
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {templateBody
                          .replace("{{first_name}}", testContact === "john" ? "John" : testContact === "sarah" ? "Sarah" : "Mike")
                          .replace("{{last_name}}", testContact === "john" ? "Smith" : testContact === "sarah" ? "Johnson" : "Wilson")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Available Merge Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["first_name", "last_name", "phone", "email", "company_name", "custom.field"].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => insertMergeTag(tag)}
                      >
                        {`{{${tag}}}`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button onClick={() => setEditorOpen(false)}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

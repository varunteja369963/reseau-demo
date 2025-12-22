import { useState, useRef } from 'react';
import { Search, Plus, Bot, Filter, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotConfiguration, BotType } from '@/types/chatbot';
import { cn } from '@/lib/utils';

interface ChatbotSidebarProps {
  bots: BotConfiguration[];
  selectedBotId: string;
  onSelectBot: (id: string) => void;
  onCreateBot: (name: string, type: BotType, domain: string) => void;
  onImportConfig: (json: string) => void;
}

export const ChatbotSidebar = ({
  bots,
  selectedBotId,
  onSelectBot,
  onCreateBot,
  onImportConfig,
}: ChatbotSidebarProps) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<BotType | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [newBotType, setNewBotType] = useState<BotType>('ai');
  const [newBotDomain, setNewBotDomain] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBots = bots.filter(b => {
    const matchesSearch = b.bot.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || b.bot.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreate = () => {
    if (newBotName && newBotDomain) {
      onCreateBot(newBotName, newBotType, newBotDomain);
      setShowCreateModal(false);
      setNewBotName('');
      setNewBotType('ai');
      setNewBotDomain('');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        onImportConfig(json);
      };
      reader.readAsText(file);
    }
  };

  const getTypeBadge = (type: BotType) => {
    const styles = {
      prefed: 'bg-purple-100 text-purple-700 border-purple-200',
      live: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      ai: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    const labels = { prefed: 'Pre-fed', live: 'Live', ai: 'AI' };
    return (
      <Badge variant="outline" className={cn('text-xs', styles[type])}>
        {labels[type]}
      </Badge>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Bot className="h-5 w-5 text-[hsl(var(--teal))]" />
            Chatbots
          </h2>
          <div className="flex gap-1">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {typeFilter === 'all' ? 'All Types' : typeFilter === 'prefed' ? 'Pre-fed' : typeFilter === 'live' ? 'Live' : 'AI'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setTypeFilter('all')}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('prefed')}>Pre-fed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('live')}>Live</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter('ai')}>AI</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bot List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2">
          {filteredBots.map((config) => (
            <button
              key={config.bot.id}
              onClick={() => onSelectBot(config.bot.id)}
              className={cn(
                'w-full text-left p-3 rounded-xl mb-2 transition-all',
                selectedBotId === config.bot.id
                  ? 'bg-[hsl(var(--teal))]/10 border border-[hsl(var(--teal))]/30'
                  : 'hover:bg-muted/50 border border-transparent'
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-sm text-foreground truncate">
                  {config.bot.name}
                </span>
                <Badge
                  variant={config.bot.status === 'live' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs ml-2',
                    config.bot.status === 'live' && 'bg-emerald-500'
                  )}
                >
                  {config.bot.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {getTypeBadge(config.bot.type)}
                <span className="text-xs text-muted-foreground truncate">
                  {config.bot.websiteDomain}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Create Bot Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chatbot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                placeholder="e.g., Main Website Bot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Bot Type</Label>
              <Select value={newBotType} onValueChange={(v) => setNewBotType(v as BotType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prefed">Pre-fed Flow Bot</SelectItem>
                  <SelectItem value="live">Live Chat</SelectItem>
                  <SelectItem value="ai">AI Bot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Website Domain</Label>
              <Input
                id="domain"
                value={newBotDomain}
                onChange={(e) => setNewBotDomain(e.target.value)}
                placeholder="e.g., www.yoursite.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white">
              Create Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
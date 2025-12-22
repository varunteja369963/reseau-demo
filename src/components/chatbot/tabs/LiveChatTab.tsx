import { useState } from 'react';
import { Search, Send, StickyNote, User, Tag, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatbotState } from '@/hooks/useChatbotState';
import { cn } from '@/lib/utils';

interface LiveChatTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

export const LiveChatTab = ({ chatbotState }: LiveChatTabProps) => {
  const { selectedBot, updateConversation, addMessage, updateLiveChatSettings } = chatbotState;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNote, setIsNote] = useState(false);
  const [newTag, setNewTag] = useState('');

  if (!selectedBot) return null;
  const { conversations, liveChatSettings } = selectedBot;

  const filteredConvs = conversations.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConvId) return;
    addMessage(selectedBot.bot.id, selectedConvId, { content: newMessage, sender: 'agent', isNote });
    setNewMessage('');
  };

  const addTag = () => {
    if (!newTag.trim() || !selectedConv) return;
    updateConversation(selectedBot.bot.id, selectedConv.id, { tags: [...selectedConv.tags, newTag] });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    if (!selectedConv) return;
    updateConversation(selectedBot.bot.id, selectedConv.id, { tags: selectedConv.tags.filter(t => t !== tag) });
  };

  return (
    <div className="h-full flex">
      {/* Conversation List */}
      <div className="w-72 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 h-9" />
          </div>
          <div className="flex gap-1">
            {(['all', 'open', 'pending', 'closed'] as const).map((s) => (
              <Button key={s} variant={statusFilter === s ? 'default' : 'ghost'} size="sm" onClick={() => setStatusFilter(s)} className="flex-1 text-xs capitalize">{s}</Button>
            ))}
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConvs.map((conv) => (
            <button key={conv.id} onClick={() => setSelectedConvId(conv.id)} className={cn('w-full text-left p-3 border-b border-border hover:bg-muted/50', selectedConvId === conv.id && 'bg-teal-50')}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{conv.customerName}</span>
                {conv.unreadCount > 0 && <Badge className="bg-teal-500 text-xs">{conv.unreadCount}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Conversation View */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedConv.customerName}</h3>
                <p className="text-xs text-muted-foreground">{selectedConv.customerEmail}</p>
              </div>
              <Select value={selectedConv.status} onValueChange={(v) => updateConversation(selectedBot.bot.id, selectedConv.id, { status: v as typeof selectedConv.status })}>
                <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="flex-1 p-4">
              {selectedConv.messages.map((msg) => (
                <div key={msg.id} className={cn('mb-3', msg.sender === 'customer' ? 'text-left' : 'text-right')}>
                  {msg.isNote ? (
                    <div className="inline-block max-w-[80%] p-3 bg-amber-50 border border-amber-200 rounded-lg text-left">
                      <div className="flex items-center gap-1 text-xs text-amber-600 mb-1"><StickyNote className="h-3 w-3" />Internal Note</div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ) : (
                    <div className={cn('inline-block max-w-[80%] p-3 rounded-2xl text-sm', msg.sender === 'customer' ? 'bg-muted' : 'bg-teal-500 text-white')}>{msg.content}</div>
                  )}
                </div>
              ))}
            </ScrollArea>
            <div className="p-3 border-t border-border space-y-2">
              <div className="flex items-center gap-2">
                <Switch checked={isNote} onCheckedChange={setIsNote} /><Label className="text-xs">Internal Note</Label>
              </div>
              <div className="flex gap-2">
                <Textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={isNote ? 'Add internal note...' : 'Type a message...'} rows={2} className="flex-1" />
                <Button onClick={handleSend} className="self-end"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a conversation</div>
        )}
      </div>

      {/* Customer Panel */}
      {selectedConv && (
        <div className="w-72 border-l border-border p-4 space-y-4 overflow-auto">
          <Card className="shadow-soft">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" />Customer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Email:</span> {selectedConv.customerEmail}</p>
              <p><span className="text-muted-foreground">Phone:</span> {selectedConv.customerPhone}</p>
              {selectedConv.vehicleInterest && <p><span className="text-muted-foreground">Interest:</span> {selectedConv.vehicleInterest}</p>}
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Tag className="h-4 w-4" />Tags</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedConv.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>{tag} ×</Badge>
                ))}
              </div>
              <div className="flex gap-1">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" className="h-8 text-xs" />
                <Button size="sm" onClick={addTag}>Add</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" />Assignment</CardTitle></CardHeader>
            <CardContent>
              <Select value={selectedConv.assignedAgentId || ''} onValueChange={(v) => updateConversation(selectedBot.bot.id, selectedConv.id, { assignedAgentId: v })}>
                <SelectTrigger className="h-8"><SelectValue placeholder="Assign agent" /></SelectTrigger>
                <SelectContent>
                  {liveChatSettings.agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4" />Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Away Mode</Label>
                <Switch checked={liveChatSettings.awayMode} onCheckedChange={(v) => updateLiveChatSettings(selectedBot.bot.id, { awayMode: v })} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { Edit2, Copy, Trash2, MessageSquare, Users, TrendingUp, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useChatbotState } from '@/hooks/useChatbotState';
import { BotType } from '@/types/chatbot';

interface OverviewTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

export const OverviewTab = ({ chatbotState }: OverviewTabProps) => {
  const { selectedBot, updateBot, duplicateBot, deleteBot } = chatbotState;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(selectedBot?.bot.name || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!selectedBot) return null;

  const { bot, analyticsMock } = selectedBot;

  const handleSaveName = () => {
    updateBot(bot.id, { name: editName });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Conversations', value: analyticsMock.conversations, icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Leads', value: analyticsMock.leads, icon: Users, color: 'text-emerald-500' },
    { label: 'Handoff Rate', value: `${analyticsMock.handoffRate}%`, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'AI Containment', value: `${analyticsMock.aiContainment}%`, icon: Bot, color: 'text-purple-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Bot Info Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-64" />
                  <Button size="sm" onClick={handleSaveName}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <CardTitle>{bot.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => { setEditName(bot.name); setIsEditing(true); }}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <Badge variant={bot.status === 'live' ? 'default' : 'secondary'} className={bot.status === 'live' ? 'bg-emerald-500' : ''}>
              {bot.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Bot Type</label>
              <Select value={bot.type} onValueChange={(v) => updateBot(bot.id, { type: v as BotType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prefed">Pre-fed Flow Bot</SelectItem>
                  <SelectItem value="live">Live Chat</SelectItem>
                  <SelectItem value="ai">AI Bot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <Select value={bot.status} onValueChange={(v) => updateBot(bot.id, { status: v as 'draft' | 'live' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Last updated: {new Date(bot.lastUpdated).toLocaleString()}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => duplicateBot(bot.id)}><Copy className="h-4 w-4 mr-2" />Duplicate</Button>
            <Button variant="outline" className="text-destructive" onClick={() => setShowDeleteModal(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Bot</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete "{bot.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { deleteBot(bot.id); setShowDeleteModal(false); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

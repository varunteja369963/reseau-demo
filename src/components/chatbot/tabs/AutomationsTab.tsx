import { useState } from 'react';
import { Plus, Trash2, GripVertical, Clock, MousePointer, UserCheck, Moon, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatbotState } from '@/hooks/useChatbotState';
import { AutomationRule, AutomationCondition, AutomationAction } from '@/types/chatbot';
import { cn } from '@/lib/utils';

interface AutomationsTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

const generateId = () => Math.random().toString(36).substring(2, 11);
const triggerIcons = { 'time-on-page': Clock, 'page-path': MousePointer, 'returning-visitor': UserCheck, 'after-hours': Moon, 'exit-intent': LogOut };

export const AutomationsTab = ({ chatbotState }: AutomationsTabProps) => {
  const { selectedBot, updateAutomationRules } = chatbotState;
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');

  if (!selectedBot) return null;
  const { automationRules } = selectedBot;

  const selectedRule = automationRules.find(r => r.id === selectedRuleId);

  const toggleRule = (id: string) => {
    const updated = automationRules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    updateAutomationRules(selectedBot.bot.id, updated);
  };

  const createRule = () => {
    if (!newRuleName) return;
    const newRule: AutomationRule = {
      id: `rule_${generateId()}`,
      name: newRuleName,
      enabled: false,
      trigger: 'time-on-page',
      triggerValue: '30',
      conditions: [],
      actions: [{ id: `action_${generateId()}`, type: 'message', value: 'Hello! Can I help you?' }],
      priority: automationRules.length + 1,
    };
    updateAutomationRules(selectedBot.bot.id, [...automationRules, newRule]);
    setShowCreateModal(false);
    setNewRuleName('');
    setSelectedRuleId(newRule.id);
  };

  const updateRule = (id: string, updates: Partial<AutomationRule>) => {
    const updated = automationRules.map(r => r.id === id ? { ...r, ...updates } : r);
    updateAutomationRules(selectedBot.bot.id, updated);
  };

  const deleteRule = (id: string) => {
    updateAutomationRules(selectedBot.bot.id, automationRules.filter(r => r.id !== id));
    if (selectedRuleId === id) setSelectedRuleId(null);
  };

  const moveRule = (id: string, direction: 'up' | 'down') => {
    const idx = automationRules.findIndex(r => r.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === automationRules.length - 1)) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...automationRules];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    updated.forEach((r, i) => r.priority = i + 1);
    updateAutomationRules(selectedBot.bot.id, updated);
  };

  return (
    <div className="h-full flex">
      {/* Rules List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Automation Rules</h3>
          <Button size="sm" onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4 mr-1" />Add</Button>
        </div>
        <ScrollArea className="flex-1">
          {automationRules.sort((a, b) => a.priority - b.priority).map((rule) => {
            const Icon = triggerIcons[rule.trigger];
            return (
              <div key={rule.id} onClick={() => setSelectedRuleId(rule.id)} className={cn('p-3 border-b border-border cursor-pointer hover:bg-muted/50', selectedRuleId === rule.id && 'bg-teal-50')}>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Switch checked={rule.enabled} onClick={(e) => { e.stopPropagation(); toggleRule(rule.id); }} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{rule.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Icon className="h-3 w-3" />{rule.trigger}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">#{rule.priority}</Badge>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      {/* Rule Editor */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedRule ? (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <Input value={selectedRule.name} onChange={(e) => updateRule(selectedRule.id, { name: e.target.value })} className="text-lg font-semibold w-auto" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => moveRule(selectedRule.id, 'up')}>↑</Button>
                <Button variant="outline" size="sm" onClick={() => moveRule(selectedRule.id, 'down')}>↓</Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteRule(selectedRule.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-sm">Trigger</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedRule.trigger} onValueChange={(v) => updateRule(selectedRule.id, { trigger: v as AutomationRule['trigger'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time-on-page">Time on page</SelectItem>
                    <SelectItem value="page-path">Page path contains</SelectItem>
                    <SelectItem value="returning-visitor">Returning visitor</SelectItem>
                    <SelectItem value="after-hours">After hours</SelectItem>
                    <SelectItem value="exit-intent">Exit intent</SelectItem>
                  </SelectContent>
                </Select>
                {(selectedRule.trigger === 'time-on-page' || selectedRule.trigger === 'page-path') && (
                  <Input value={selectedRule.triggerValue || ''} onChange={(e) => updateRule(selectedRule.id, { triggerValue: e.target.value })} placeholder={selectedRule.trigger === 'time-on-page' ? 'Seconds' : 'Path (e.g., /inventory)'} />
                )}
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-sm">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {selectedRule.actions.map((action, idx) => (
                  <div key={action.id} className="flex gap-2">
                    <Select value={action.type} onValueChange={(v) => {
                      const newActions = [...selectedRule.actions];
                      newActions[idx] = { ...action, type: v as AutomationAction['type'] };
                      updateRule(selectedRule.id, { actions: newActions });
                    }}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="message">Send Message</SelectItem>
                        <SelectItem value="flow">Start Flow</SelectItem>
                        <SelectItem value="tag">Tag Lead</SelectItem>
                        <SelectItem value="lead-form">Show Lead Form</SelectItem>
                        <SelectItem value="handoff">Handoff to Live Chat</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input value={action.value} onChange={(e) => {
                      const newActions = [...selectedRule.actions];
                      newActions[idx] = { ...action, value: e.target.value };
                      updateRule(selectedRule.id, { actions: newActions });
                    }} placeholder="Value" className="flex-1" />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => updateRule(selectedRule.id, { actions: [...selectedRule.actions, { id: `action_${generateId()}`, type: 'message', value: '' }] })}><Plus className="h-4 w-4 mr-1" />Add Action</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select a rule to edit</div>
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Automation Rule</DialogTitle></DialogHeader>
          <Input value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} placeholder="Rule name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={createRule}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useState, useRef } from 'react';
import { Plus, Copy, Trash2, Play, Upload, Download, MessageSquare, MousePointer, HelpCircle, FileText, GitBranch, PhoneForwarded, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChatbotState } from '@/hooks/useChatbotState';
import { FlowNode } from '@/types/chatbot';
import { cn } from '@/lib/utils';

interface PrefedFlowTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

const nodeIcons = { message: MessageSquare, buttons: MousePointer, question: HelpCircle, form: FileText, condition: GitBranch, handoff: PhoneForwarded, end: Square };

export const PrefedFlowTab = ({ chatbotState }: PrefedFlowTabProps) => {
  const { selectedBot, createFlow, duplicateFlow, deleteFlow, updateFlow, updateFlowSettings, exportFlow, importFlow } = chatbotState;
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedBot) return null;
  const { flowSettings } = selectedBot;
  const selectedFlow = flowSettings.flows.find(f => f.id === selectedFlowId);
  const selectedNode = selectedFlow?.jsonDefinition.find(n => n.id === selectedNodeId);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => importFlow(selectedBot.bot.id, event.target?.result as string);
      reader.readAsText(file);
    }
  };

  const updateNode = (nodeId: string, updates: Partial<FlowNode>) => {
    if (!selectedFlow) return;
    const updatedNodes = selectedFlow.jsonDefinition.map(n => n.id === nodeId ? { ...n, ...updates } : n);
    updateFlow(selectedBot.bot.id, selectedFlow.id, { jsonDefinition: updatedNodes });
  };

  return (
    <div className="h-full flex">
      {/* Flow List */}
      <div className="w-72 border-r border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Flows</h3>
          <div className="flex gap-1">
            <input type="file" ref={fileInputRef} accept=".json" onChange={handleImport} className="hidden" />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
            <Button size="sm" onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-3rem)]">
          {flowSettings.flows.map((flow) => (
            <div key={flow.id} onClick={() => setSelectedFlowId(flow.id)} className={cn('p-3 rounded-lg mb-2 cursor-pointer border', selectedFlowId === flow.id ? 'bg-teal-50 border-teal-200' : 'hover:bg-muted border-transparent')}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{flow.name}</span>
                <Badge variant="outline" className="text-xs">{flow.version}</Badge>
              </div>
              {flowSettings.activeFlowId === flow.id && <Badge className="mt-2 bg-emerald-500 text-xs">Active</Badge>}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Flow Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFlow ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{selectedFlow.name}</h3>
                <Select value={selectedFlow.version} onValueChange={(v) => updateFlow(selectedBot.bot.id, selectedFlow.id, { version: v })}>
                  <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">v1</SelectItem>
                    <SelectItem value="v2">v2</SelectItem>
                    <SelectItem value="v3">v3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updateFlowSettings(selectedBot.bot.id, { activeFlowId: selectedFlow.id })} disabled={flowSettings.activeFlowId === selectedFlow.id}><Play className="h-4 w-4 mr-1" />Set Active</Button>
                <Button variant="outline" size="sm" onClick={() => duplicateFlow(selectedBot.bot.id, selectedFlow.id)}><Copy className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => exportFlow(selectedBot.bot.id, selectedFlow.id)}><Download className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setShowDeleteModal(true)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="flex-1 flex">
              {/* Canvas */}
              <div className="flex-1 p-4 bg-muted/30 overflow-auto">
                <div className="min-w-[600px] min-h-[400px] relative">
                  {selectedFlow.jsonDefinition.map((node) => {
                    const Icon = nodeIcons[node.type];
                    return (
                      <div key={node.id} onClick={() => setSelectedNodeId(node.id)} style={{ left: node.position.x, top: node.position.y }} className={cn('absolute p-3 bg-card rounded-lg shadow-soft border-2 cursor-pointer min-w-[140px]', selectedNodeId === node.id ? 'border-teal-500' : 'border-transparent hover:border-muted-foreground/30')}>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4 text-teal-500" />
                          <span className="text-xs font-medium capitalize">{node.type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{node.data.text || node.data.questionPrompt || 'Configure...'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Properties Panel */}
              {selectedNode && (
                <div className="w-72 border-l border-border p-4 space-y-4">
                  <h4 className="font-semibold capitalize">{selectedNode.type} Properties</h4>
                  {(selectedNode.type === 'message' || selectedNode.type === 'handoff' || selectedNode.type === 'end') && (
                    <div className="space-y-2">
                      <Label>Message Text</Label>
                      <Textarea value={selectedNode.data.text || ''} onChange={(e) => updateNode(selectedNode.id, { data: { ...selectedNode.data, text: e.target.value } })} rows={3} />
                    </div>
                  )}
                  {selectedNode.type === 'buttons' && (
                    <div className="space-y-2">
                      <Label>Button Labels</Label>
                      {selectedNode.data.buttons?.map((btn, idx) => (
                        <Input key={btn.id} value={btn.label} onChange={(e) => {
                          const newButtons = [...(selectedNode.data.buttons || [])];
                          newButtons[idx] = { ...btn, label: e.target.value };
                          updateNode(selectedNode.id, { data: { ...selectedNode.data, buttons: newButtons } });
                        }} />
                      ))}
                    </div>
                  )}
                  {selectedNode.type === 'question' && (
                    <div className="space-y-2">
                      <Label>Question Prompt</Label>
                      <Textarea value={selectedNode.data.questionPrompt || ''} onChange={(e) => updateNode(selectedNode.id, { data: { ...selectedNode.data, questionPrompt: e.target.value } })} rows={3} />
                    </div>
                  )}
                  {selectedNode.type === 'form' && (
                    <div className="space-y-2">
                      <Label>Required Fields (comma-separated)</Label>
                      <Input value={selectedNode.data.requiredFields?.join(', ') || ''} onChange={(e) => updateNode(selectedNode.id, { data: { ...selectedNode.data, requiredFields: e.target.value.split(',').map(s => s.trim()) } })} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a flow to edit</div>
        )}
      </div>

      {/* Modals */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Flow</DialogTitle></DialogHeader>
          <Input value={newFlowName} onChange={(e) => setNewFlowName(e.target.value)} placeholder="Flow name" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={() => { createFlow(selectedBot.bot.id, newFlowName); setShowCreateModal(false); setNewFlowName(''); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Flow</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this flow?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (selectedFlowId) deleteFlow(selectedBot.bot.id, selectedFlowId); setShowDeleteModal(false); setSelectedFlowId(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

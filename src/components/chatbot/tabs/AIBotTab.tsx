import { useState } from 'react';
import { Plus, Trash2, Upload, Link, HelpCircle, Send, Brain, Gauge } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChatbotState } from '@/hooks/useChatbotState';
import { KnowledgeSource } from '@/types/chatbot';

interface AIBotTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const AIBotTab = ({ chatbotState }: AIBotTabProps) => {
  const { selectedBot, updateAISettings } = chatbotState;
  const [testQuestion, setTestQuestion] = useState('');
  const [testAnswer, setTestAnswer] = useState<{ answer: string; confidence: number } | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<KnowledgeSource['type']>('url');

  if (!selectedBot) return null;
  const { aiSettings } = selectedBot;
  const update = (updates: Partial<typeof aiSettings>) => updateAISettings(selectedBot.bot.id, updates);

  const addSource = () => {
    if (!newSourceName) return;
    const newSource: KnowledgeSource = { id: `ks_${generateId()}`, name: newSourceName, type: newSourceType, notes: '' };
    update({ knowledgeSources: [...aiSettings.knowledgeSources, newSource] });
    setNewSourceName('');
  };

  const removeSource = (id: string) => {
    update({ knowledgeSources: aiSettings.knowledgeSources.filter(s => s.id !== id) });
  };

  const simulateTest = () => {
    const mockConfidence = Math.floor(Math.random() * 40) + 60;
    const mockAnswers = [
      "Based on our inventory, the 2024 Honda Accord starts at $27,295.",
      "We have several financing options available with rates as low as 2.9% APR.",
      "You can schedule a test drive online or call us at (555) 123-4567.",
    ];
    setTestAnswer({ answer: mockAnswers[Math.floor(Math.random() * mockAnswers.length)], confidence: mockConfidence });
  };

  const sourceIcons = { upload: Upload, url: Link, qa: HelpCircle };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Knowledge Sources */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-teal-500" />Knowledge Sources</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={newSourceName} onChange={(e) => setNewSourceName(e.target.value)} placeholder="Source name" className="flex-1" />
              <Select value={newSourceType} onValueChange={(v) => setNewSourceType(v as KnowledgeSource['type'])}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="qa">Q&A</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addSource}><Plus className="h-4 w-4" /></Button>
            </div>
            <ScrollArea className="h-48">
              {aiSettings.knowledgeSources.map((source) => {
                const Icon = sourceIcons[source.type];
                return (
                  <div key={source.id} className="flex items-center justify-between p-2 bg-muted rounded-lg mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{source.name}</span>
                      <Badge variant="outline" className="text-xs">{source.type}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeSource(source.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tone & Rules */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Tone & Rules</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tone</Label>
              <RadioGroup value={aiSettings.tone} onValueChange={(v) => update({ tone: v as typeof aiSettings.tone })} className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="friendly" id="tone-friendly" /><Label htmlFor="tone-friendly" className="text-sm">Friendly</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="professional" id="tone-professional" /><Label htmlFor="tone-professional" className="text-sm">Professional</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="concise" id="tone-concise" /><Label htmlFor="tone-concise" className="text-sm">Concise</Label></div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Do's</Label>
              <Textarea value={aiSettings.rules.doList} onChange={(e) => update({ rules: { ...aiSettings.rules, doList: e.target.value } })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Don'ts</Label>
              <Textarea value={aiSettings.rules.dontList} onChange={(e) => update({ rules: { ...aiSettings.rules, dontList: e.target.value } })} rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Answer only from knowledge sources</Label>
              <Switch checked={aiSettings.answerOnlyFromKnowledge} onCheckedChange={(v) => update({ answerOnlyFromKnowledge: v })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Confidence & Escalation */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5 text-teal-500" />Confidence & Escalation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between"><Label>Confidence Threshold</Label><span className="text-sm font-medium">{aiSettings.confidenceThreshold}%</span></div>
              <Slider value={[aiSettings.confidenceThreshold]} onValueChange={([v]) => update({ confidenceThreshold: v })} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label>When below threshold</Label>
              <Select value={aiSettings.escalationMode} onValueChange={(v) => update({ escalationMode: v as typeof aiSettings.escalationMode })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="handoff">Handoff to Live Chat</SelectItem>
                  <SelectItem value="lead-form">Show Lead Form</SelectItem>
                  <SelectItem value="callback">Request Callback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Test Console */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Test Console</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={testQuestion} onChange={(e) => setTestQuestion(e.target.value)} placeholder="Ask a question..." className="flex-1" />
              <Button onClick={simulateTest}><Send className="h-4 w-4" /></Button>
            </div>
            {testAnswer && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <p className="text-sm">{testAnswer.answer}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className={`h-full ${testAnswer.confidence >= aiSettings.confidenceThreshold ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${testAnswer.confidence}%` }} />
                  </div>
                  <span className="text-xs font-medium">{testAnswer.confidence}%</span>
                </div>
                {testAnswer.confidence < aiSettings.confidenceThreshold && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Would trigger: {aiSettings.escalationMode}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

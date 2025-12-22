import { useState } from 'react';
import { Plus, Trash2, Copy, RefreshCw, Check, Globe, Key, Code, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useChatbotState } from '@/hooks/useChatbotState';
import { toast } from 'sonner';

interface InstallTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

export const InstallTab = ({ chatbotState }: InstallTabProps) => {
  const { selectedBot, updateInstallSettings, regenerateWidgetKey } = chatbotState;
  const [newDomain, setNewDomain] = useState('');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false, false]);

  if (!selectedBot) return null;
  const { installSettings } = selectedBot;

  const validateDomain = (domain: string) => domain.includes('.') && !domain.includes(' ');

  const addDomain = () => {
    if (validateDomain(newDomain)) {
      updateInstallSettings(selectedBot.bot.id, { allowedDomains: [...installSettings.allowedDomains, newDomain] });
      setNewDomain('');
    } else {
      toast.error('Invalid domain format');
    }
  };

  const removeDomain = (domain: string) => {
    updateInstallSettings(selectedBot.bot.id, { allowedDomains: installSettings.allowedDomains.filter(d => d !== domain) });
  };

  const snippet = `<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];
  var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s);j.async=true;
  j.src='https://widget.reseau.com/loader.js';
  j.dataset.key='${installSettings.widgetKey}';
  j.dataset.domain='${installSettings.allowedDomains[0] || 'your-domain.com'}';
  f.parentNode.insertBefore(j,f);
  })(window,document,'script','Reseau','reseau');
</script>`;

  const copySnippet = () => { navigator.clipboard.writeText(snippet); toast.success('Snippet copied!'); };

  const checklistItems = ['Add snippet to website', 'Verify domain', 'Open site and check launcher', 'Send a test message', 'Confirm messages appear in Live Chat inbox'];

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-teal-500" />Allowed Domains</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="www.example.com" />
            <Button onClick={addDomain}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </div>
          <div className="space-y-2">
            {installSettings.allowedDomains.map((domain) => (
              <div key={domain} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm">{domain}</span>
                <Button variant="ghost" size="icon" onClick={() => removeDomain(domain)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-teal-500" />Widget Key</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">{installSettings.widgetKey}</div>
          <Button variant="outline" onClick={() => setShowRegenerateModal(true)}><RefreshCw className="h-4 w-4 mr-2" />Regenerate Key</Button>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-teal-500" />Installation Snippet</CardTitle></CardHeader>
        <CardContent>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">{snippet}</pre>
          <Button className="mt-3" onClick={copySnippet}><Copy className="h-4 w-4 mr-2" />Copy to Clipboard</Button>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-teal-500" />Installation Checklist</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklistItems.map((item, idx) => (
              <button key={idx} onClick={() => setChecklist(c => c.map((v, i) => i === idx ? !v : v))} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checklist[idx] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground'}`}>
                  {checklist[idx] && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={checklist[idx] ? 'line-through text-muted-foreground' : ''}>{item}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Regenerate Widget Key</DialogTitle></DialogHeader>
          <p>This will invalidate your current key. You'll need to update your website.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegenerateModal(false)}>Cancel</Button>
            <Button onClick={() => { regenerateWidgetKey(selectedBot.bot.id); setShowRegenerateModal(false); }}>Regenerate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

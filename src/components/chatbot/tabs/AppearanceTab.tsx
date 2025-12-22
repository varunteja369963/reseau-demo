import { Palette, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChatbotState } from '@/hooks/useChatbotState';

interface AppearanceTabProps {
  chatbotState: ReturnType<typeof useChatbotState>;
}

export const AppearanceTab = ({ chatbotState }: AppearanceTabProps) => {
  const { selectedBot, updateAppearanceSettings } = chatbotState;
  if (!selectedBot) return null;

  const { appearanceSettings } = selectedBot;
  const update = (updates: Partial<typeof appearanceSettings>) => updateAppearanceSettings(selectedBot.bot.id, updates);

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-teal-500" />Widget Appearance</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <input type="color" value={appearanceSettings.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
                <Input value={appearanceSettings.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })} className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Launcher Text</Label>
              <Input value={appearanceSettings.launcherText} onChange={(e) => update({ launcherText: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Launcher Position</Label>
            <RadioGroup value={appearanceSettings.launcherPosition} onValueChange={(v) => update({ launcherPosition: v as 'bottom-left' | 'bottom-right' })} className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="bottom-left" /><Label>Bottom Left</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="bottom-right" /><Label>Bottom Right</Label></div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-teal-500" />Messages</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Textarea value={appearanceSettings.welcomeMessage} onChange={(e) => update({ welcomeMessage: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Offline Message</Label>
            <Textarea value={appearanceSettings.offlineMessage} onChange={(e) => update({ offlineMessage: e.target.value })} rows={3} />
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label>Show Branding</Label>
              <p className="text-xs text-muted-foreground">Display "Powered by Reseau"</p>
            </div>
            <Switch checked={appearanceSettings.showBranding} onCheckedChange={(v) => update({ showBranding: v })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

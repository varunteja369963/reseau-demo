import { useState } from 'react';
import { Settings, Globe, Bell, Shield, Users, Palette, Code, Clock, Save, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const ChatbotGlobalSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [settings, setSettings] = useState({
    // General
    organizationName: 'Reseau Auto Group',
    defaultLanguage: 'en',
    timezone: 'America/Vancouver',
    
    // Notifications
    emailNotifications: true,
    slackIntegration: false,
    slackWebhook: '',
    notifyOnNewLead: true,
    notifyOnHandoff: true,
    dailyDigest: false,
    
    // Security
    ipWhitelist: '',
    requireAuth: false,
    sessionTimeout: '30',
    
    // Branding
    globalPrimaryColor: '#0d9488',
    companyLogo: '',
    poweredByText: 'Powered by Reseau',
    showBranding: true,
    
    // API
    apiKey: 'rsk_live_xxxxxxxxxxxx',
    webhookUrl: '',
    webhookEvents: ['lead.created', 'conversation.ended'],
    
    // Business Hours
    enableBusinessHours: true,
    businessHoursStart: '09:00',
    businessHoursEnd: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
          <p className="text-muted-foreground mt-1">Configure settings that apply to all chatbots</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1 h-auto">
          <TabsTrigger value="general" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="branding" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2">
            <Code className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-[hsl(var(--teal))]" />
                Organization Settings
              </CardTitle>
              <CardDescription>Basic settings for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input 
                    value={settings.organizationName}
                    onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={settings.defaultLanguage} onValueChange={(v) => setSettings({ ...settings, defaultLanguage: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Vancouver">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-[hsl(var(--teal))]" />
                Business Hours
              </CardTitle>
              <CardDescription>Set default business hours for all chatbots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Business Hours</Label>
                  <p className="text-sm text-muted-foreground">Show offline message outside business hours</p>
                </div>
                <Switch 
                  checked={settings.enableBusinessHours}
                  onCheckedChange={(v) => setSettings({ ...settings, enableBusinessHours: v })}
                />
              </div>
              {settings.enableBusinessHours && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input 
                      type="time"
                      value={settings.businessHoursStart}
                      onChange={(e) => setSettings({ ...settings, businessHoursStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input 
                      type="time"
                      value={settings.businessHoursEnd}
                      onChange={(e) => setSettings({ ...settings, businessHoursEnd: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-5 w-5 text-[hsl(var(--teal))]" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label>Notify on New Lead</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a new lead is captured</p>
                </div>
                <Switch 
                  checked={settings.notifyOnNewLead}
                  onCheckedChange={(v) => setSettings({ ...settings, notifyOnNewLead: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label>Notify on Handoff</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a conversation needs agent attention</p>
                </div>
                <Switch 
                  checked={settings.notifyOnHandoff}
                  onCheckedChange={(v) => setSettings({ ...settings, notifyOnHandoff: v })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of chatbot activity</p>
                </div>
                <Switch 
                  checked={settings.dailyDigest}
                  onCheckedChange={(v) => setSettings({ ...settings, dailyDigest: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Slack Integration</CardTitle>
              <CardDescription>Send notifications to your Slack workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Slack</Label>
                <Switch 
                  checked={settings.slackIntegration}
                  onCheckedChange={(v) => setSettings({ ...settings, slackIntegration: v })}
                />
              </div>
              {settings.slackIntegration && (
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input 
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.slackWebhook}
                    onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-[hsl(var(--teal))]" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security options for your chatbots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <Label>Require Authentication</Label>
                  <p className="text-sm text-muted-foreground">Visitors must be authenticated to use chatbot</p>
                </div>
                <Switch 
                  checked={settings.requireAuth}
                  onCheckedChange={(v) => setSettings({ ...settings, requireAuth: v })}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select value={settings.sessionTimeout} onValueChange={(v) => setSettings({ ...settings, sessionTimeout: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>IP Whitelist</Label>
                <Textarea 
                  placeholder="Enter IP addresses, one per line"
                  value={settings.ipWhitelist}
                  onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground">Leave empty to allow all IPs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-5 w-5 text-[hsl(var(--teal))]" />
                Default Branding
              </CardTitle>
              <CardDescription>Set default branding for new chatbots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Global Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    value={settings.globalPrimaryColor}
                    onChange={(e) => setSettings({ ...settings, globalPrimaryColor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={settings.globalPrimaryColor}
                    onChange={(e) => setSettings({ ...settings, globalPrimaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Powered By Text</Label>
                <Input 
                  value={settings.poweredByText}
                  onChange={(e) => setSettings({ ...settings, poweredByText: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Branding</Label>
                  <p className="text-sm text-muted-foreground">Display "Powered by" text in chatbots</p>
                </div>
                <Switch 
                  checked={settings.showBranding}
                  onCheckedChange={(v) => setSettings({ ...settings, showBranding: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="mt-6 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="h-5 w-5 text-[hsl(var(--teal))]" />
                API Configuration
              </CardTitle>
              <CardDescription>Manage API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password"
                    value={settings.apiKey}
                    readOnly
                    className="flex-1 font-mono"
                  />
                  <Button variant="outline" onClick={() => toast.info('API key copied!')}>
                    Copy
                  </Button>
                  <Button variant="outline" onClick={() => toast.success('New API key generated!')}>
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Use this key to authenticate API requests</p>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input 
                  placeholder="https://your-server.com/webhook"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook Events</Label>
                <div className="flex flex-wrap gap-2">
                  {['lead.created', 'conversation.started', 'conversation.ended', 'handoff.requested'].map((event) => (
                    <Button
                      key={event}
                      variant={settings.webhookEvents.includes(event) ? 'default' : 'outline'}
                      size="sm"
                      className={settings.webhookEvents.includes(event) ? 'bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90' : ''}
                      onClick={() => {
                        if (settings.webhookEvents.includes(event)) {
                          setSettings({ ...settings, webhookEvents: settings.webhookEvents.filter(e => e !== event) });
                        } else {
                          setSettings({ ...settings, webhookEvents: [...settings.webhookEvents, event] });
                        }
                      }}
                    >
                      {event}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
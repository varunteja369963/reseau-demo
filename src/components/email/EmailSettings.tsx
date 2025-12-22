import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const EmailSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Email Settings</h2>
        <p className="text-muted-foreground">Configure your email marketing settings</p>
      </div>

      <Tabs defaultValue="sender" className="space-y-4">
        <TabsList className="bg-card shadow-soft rounded-2xl p-1">
          <TabsTrigger value="sender" className="rounded-xl">Sender Info</TabsTrigger>
          <TabsTrigger value="domain" className="rounded-xl">Domain & DNS</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-xl">Integrations</TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="sender" className="space-y-4">
          <Card className="rounded-3xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-lg">Default Sender Information</CardTitle>
              <CardDescription>
                This information will be used as the default for all campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="Your Company Name" defaultValue="Reseau" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" placeholder="noreply@example.com" defaultValue="noreply@reseau.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To Email</Label>
                <Input id="reply-to" type="email" placeholder="support@example.com" defaultValue="support@reseau.com" className="rounded-xl" />
              </div>
              <Button className="gradient-teal text-white border-0 rounded-xl">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Required for compliance with email regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Company Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Input id="address" placeholder="123 Main St, City, State, ZIP" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Setup</CardTitle>
              <CardDescription>
                Configure your custom sending domain for better deliverability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" placeholder="mail.yourdomain.com" />
              </div>
              <Button>Verify Domain</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DNS Records</CardTitle>
              <CardDescription>
                Add these DNS records to your domain provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SPF Record</span>
                    <span className="text-xs text-green-500">✓ Verified</span>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                    v=spf1 include:_spf.example.com ~all
                  </code>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">DKIM Record</span>
                    <span className="text-xs text-yellow-500">⚠ Pending</span>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                    k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
                  </code>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">DMARC Record</span>
                    <span className="text-xs text-red-500">✗ Not Set</span>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                    v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Service Provider</CardTitle>
              <CardDescription>
                Connect your email sending service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <h4 className="font-semibold">Resend</h4>
                    <p className="text-sm text-muted-foreground">Email delivery service</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    📮
                  </div>
                  <div>
                    <h4 className="font-semibold">SendGrid</h4>
                    <p className="text-sm text-muted-foreground">Alternative provider</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CRM Integration</CardTitle>
              <CardDescription>
                Sync contacts with your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    👥
                  </div>
                  <div>
                    <h4 className="font-semibold">Reseau CRM</h4>
                    <p className="text-sm text-muted-foreground">Sync with main CRM</p>
                  </div>
                </div>
                <Button>Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>
                Configure default email settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Track Opens</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients open your emails
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Track Clicks</Label>
                  <p className="text-sm text-muted-foreground">
                    Track clicks on links in your emails
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Archive Campaigns</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically archive sent campaigns after 90 days
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Double Opt-In</Label>
                  <p className="text-sm text-muted-foreground">
                    Require confirmation for new subscribers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unsubscribe Settings</CardTitle>
              <CardDescription>
                Configure how unsubscribes are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unsub-message">Unsubscribe Confirmation Message</Label>
                <Input 
                  id="unsub-message" 
                  placeholder="You've been unsubscribed" 
                  defaultValue="You've been successfully unsubscribed from our emails."
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>One-Click Unsubscribe</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable one-click unsubscribe in email headers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

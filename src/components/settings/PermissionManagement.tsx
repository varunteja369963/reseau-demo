import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AVAILABLE_FIELDS = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'leadStatus', label: 'Lead Status' },
  { key: 'leadScoring', label: 'Lead Scoring' },
  { key: 'leadSource', label: 'Lead Source' },
  { key: 'vehicleMake', label: 'Vehicle Make' },
  { key: 'model', label: 'Model' },
  { key: 'dealStage', label: 'Deal Stage' },
  { key: 'dealValue', label: 'Deal Value' },
];

interface PermissionManagementProps {
  userId?: string;
}

export const PermissionManagement = ({ userId }: PermissionManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [canAddCustomer, setCanAddCustomer] = useState(false);
  const [canUseChat, setCanUseChat] = useState(false);
  const [canDownloadData, setCanDownloadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !email) return;

    setIsLoading(true);
    try {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      const { error } = await supabase
        .from('crm_access_permissions')
        .insert({
          owner_id: userId,
          granted_to_email: email.toLowerCase().trim(),
          permission_level: permissionLevel,
          accessible_fields: selectedFields.length > 0 ? selectedFields : null,
          can_add_customer: canAddCustomer,
          can_use_chat: canUseChat,
          can_download_data: canDownloadData,
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already granted access to this email');
        }
        throw error;
      }

      toast({
        title: 'Access Granted',
        description: `Successfully granted ${permissionLevel} access to ${email}`,
      });

      // Reset form
      setEmail('');
      setPermissionLevel('viewer');
      setSelectedFields([]);
      setCanAddCustomer(false);
      setCanUseChat(false);
      setCanDownloadData(false);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error granting access:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to grant access. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleField = (fieldKey: string) => {
    if (selectedFields.includes(fieldKey)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldKey));
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Grant CRM Access
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grant CRM Access</DialogTitle>
          <DialogDescription>
            Give another user access to your CRM data with customizable permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Permission Level */}
          <div className="space-y-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permissionLevel} onValueChange={(value: any) => setPermissionLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                <SelectItem value="editor">Editor - Can edit and add data</SelectItem>
                <SelectItem value="admin">Admin - Full access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Access */}
          <div className="space-y-3">
            <Label>Accessible Fields (optional)</Label>
            <p className="text-xs text-muted-foreground">
              Leave empty to grant access to all fields
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-muted/30">
              {AVAILABLE_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.includes(field.key)}
                    onCheckedChange={() => toggleField(field.key)}
                  />
                  <label
                    htmlFor={field.key}
                    className="text-sm cursor-pointer select-none"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Navbar Features */}
          <div className="space-y-3">
            <Label>Navbar Features Access</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="add-customer"
                  checked={canAddCustomer}
                  onCheckedChange={(checked) => setCanAddCustomer(checked as boolean)}
                />
                <label htmlFor="add-customer" className="text-sm cursor-pointer">
                  Can add new customers
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-chat"
                  checked={canUseChat}
                  onCheckedChange={(checked) => setCanUseChat(checked as boolean)}
                />
                <label htmlFor="use-chat" className="text-sm cursor-pointer">
                  Can use chat feature
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="download-data"
                  checked={canDownloadData}
                  onCheckedChange={(checked) => setCanDownloadData(checked as boolean)}
                />
                <label htmlFor="download-data" className="text-sm cursor-pointer">
                  Can download CRM data
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Granting...' : 'Grant Access'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

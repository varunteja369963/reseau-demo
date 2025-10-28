import { useState, useEffect } from 'react';
import { Trash2, Shield, Eye, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AccessPermission {
  id: string;
  granted_to_email: string;
  permission_level: 'viewer' | 'editor' | 'admin';
  accessible_fields: string[] | null;
  can_add_customer: boolean;
  can_use_chat: boolean;
  can_download_data: boolean;
  created_at: string;
}

interface AccessListProps {
  userId?: string;
}

export const AccessList = ({ userId }: AccessListProps) => {
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    loadPermissions();
  }, [userId]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_access_permissions')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPermissions((data as AccessPermission[]) || []);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load access list.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccess = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from('crm_access_permissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPermissions(permissions.filter(p => p.id !== id));
      toast({
        title: 'Access Removed',
        description: `Removed access for ${email}`,
      });
    } catch (error) {
      console.error('Error removing access:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove access. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getPermissionIcon = (level: string) => {
    switch (level) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'editor':
        return <Edit className="w-4 h-4" />;
      case 'viewer':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPermissionColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'viewer':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading access list...</div>;
  }

  // Show demo data if no real permissions exist
  const displayPermissions = permissions.length > 0 ? permissions : [
    {
      id: 'demo-1',
      granted_to_email: 'john.doe@example.com',
      permission_level: 'viewer' as const,
      accessible_fields: ['fullName', 'email', 'phoneNumber', 'leadStatus'],
      can_add_customer: false,
      can_use_chat: true,
      can_download_data: false,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-2',
      granted_to_email: 'jane.smith@example.com',
      permission_level: 'editor' as const,
      accessible_fields: null,
      can_add_customer: true,
      can_use_chat: true,
      can_download_data: true,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'demo-3',
      granted_to_email: 'admin@example.com',
      permission_level: 'admin' as const,
      accessible_fields: null,
      can_add_customer: true,
      can_use_chat: true,
      can_download_data: true,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <div className="space-y-3">
      {permissions.length === 0 && (
        <div className="text-xs text-muted-foreground italic mb-3 p-3 bg-muted/30 rounded-lg">
          Demo data shown below. Grant access to see real permissions here.
        </div>
      )}
      {displayPermissions.map((permission) => (
        <div
          key={permission.id}
          className="p-4 rounded-xl bg-muted/30 border border-border space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-foreground">
                  {permission.granted_to_email}
                </span>
                <Badge
                  variant="outline"
                  className={`${getPermissionColor(permission.permission_level)} capitalize`}
                >
                  {getPermissionIcon(permission.permission_level)}
                  <span className="ml-1">{permission.permission_level}</span>
                </Badge>
              </div>

              {/* Field Access */}
              {permission.accessible_fields && permission.accessible_fields.length > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Fields: </span>
                  {permission.accessible_fields.join(', ')}
                </div>
              )}

              {/* Feature Access */}
              <div className="flex flex-wrap gap-2">
                {permission.can_add_customer && (
                  <Badge variant="secondary" className="text-xs">
                    Add Customer
                  </Badge>
                )}
                {permission.can_use_chat && (
                  <Badge variant="secondary" className="text-xs">
                    Chat
                  </Badge>
                )}
                {permission.can_download_data && (
                  <Badge variant="secondary" className="text-xs">
                    Download Data
                  </Badge>
                )}
              </div>
            </div>

            {permissions.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveAccess(permission.id, permission.granted_to_email)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Granted on {new Date(permission.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

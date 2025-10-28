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

  if (permissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No access granted yet</p>
        <p className="text-xs mt-1">Grant access to others to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {permissions.map((permission) => (
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

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveAccess(permission.id, permission.granted_to_email)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Granted on {new Date(permission.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { History, Clock, RotateCcw, User, FileText, Trash2, Edit, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_id: string;
  entity_data: any;
  previous_data: any;
  description: string;
  created_at: string;
}

export const HistoryView = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'create' | 'update' | 'delete'>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities((data || []) as ActivityLog[]);
    } catch (error) {
      console.error('Error loading activity log:', error);
      toast.error('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (activity: ActivityLog) => {
    try {
      setReverting(activity.id);
      
      // For now, we're working with demo data in state
      // In a real implementation, this would restore data from the database
      toast.info('Revert functionality will restore this change once data persistence is implemented');
      
      // TODO: Implement actual revert logic when data is persisted
      // Based on action_type:
      // - 'create': Delete the entity
      // - 'update': Restore previous_data
      // - 'delete': Recreate entity with entity_data
      
    } catch (error) {
      console.error('Error reverting change:', error);
      toast.error('Failed to revert change');
    } finally {
      setReverting(null);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <Plus className="w-4 h-4" />;
      case 'update':
        return <Edit className="w-4 h-4" />;
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'update':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'delete':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Activity History</h2>
            <p className="text-sm text-muted-foreground mt-1">Track and revert changes made to your CRM data</p>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="w-20 h-9 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Activity History</h2>
            <p className="text-sm text-muted-foreground mt-1">Track and revert changes made to your CRM data</p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No Activity Yet</h3>
              <p className="text-sm text-muted-foreground">
                Start making changes to your CRM data to see activity history here
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.action_type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Activity History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track and revert changes made to your CRM data
            </p>
          </div>
        </div>
        <Button onClick={loadActivities} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          All ({activities.length})
        </Button>
        <Button
          variant={filterType === 'create' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('create')}
          className={filterType === 'create' ? '' : 'border-green-200 text-green-700 hover:bg-green-50'}
        >
          <Plus className="w-3 h-3 mr-1" />
          Created ({activities.filter(a => a.action_type === 'create').length})
        </Button>
        <Button
          variant={filterType === 'update' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('update')}
          className={filterType === 'update' ? '' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}
        >
          <Edit className="w-3 h-3 mr-1" />
          Updated ({activities.filter(a => a.action_type === 'update').length})
        </Button>
        <Button
          variant={filterType === 'delete' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('delete')}
          className={filterType === 'delete' ? '' : 'border-red-200 text-red-700 hover:bg-red-50'}
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Deleted ({activities.filter(a => a.action_type === 'delete').length})
        </Button>
      </div>

      <div className="bg-blue-500/10 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Demo Mode Active</p>
          <p className="text-blue-700">
            Changes are currently stored in your browser session. Revert functionality will be available once you connect your data to the database.
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getActionColor(
                      activity.action_type
                    )}`}
                  >
                    {getActionIcon(activity.action_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`font-medium ${getActionColor(activity.action_type)}`}
                      >
                        {activity.action_type.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground capitalize">
                        {activity.entity_type}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-foreground mb-2 break-words">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>

                    {activity.action_type === 'update' && activity.previous_data && (
                      <details className="mt-3 text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View changes
                        </summary>
                        <div className="mt-2 p-3 bg-muted rounded-lg space-y-1">
                          {Object.entries(activity.previous_data).map(([key, value]) => {
                            const newValue = activity.entity_data[key];
                            if (value !== newValue) {
                              return (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium">{key}:</span>
                                  <span className="text-red-600 line-through">
                                    {String(value)}
                                  </span>
                                  <span>→</span>
                                  <span className="text-green-600">{String(newValue)}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </details>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleRevert(activity)}
                  variant="outline"
                  size="sm"
                  disabled={reverting === activity.id}
                  className="flex-shrink-0"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {reverting === activity.id ? 'Reverting...' : 'Revert'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomColumn {
  id: string;
  column_key: string;
  column_label: string;
  field_type: string;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'boolean', label: 'Yes/No' },
  { value: 'url', label: 'URL' },
  { value: 'textarea', label: 'Long Text' },
];

interface CustomColumnManagementProps {
  userId?: string;
}

export const CustomColumnManagement = ({ userId }: CustomColumnManagementProps) => {
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [columnLabel, setColumnLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchCustomColumns();
    }
  }, [userId]);

  const fetchCustomColumns = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('crm_custom_columns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching custom columns:', error);
      return;
    }

    setCustomColumns(data || []);
  };

  const generateColumnKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleAddColumn = async () => {
    if (!userId || !columnLabel.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a column name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const columnKey = generateColumnKey(columnLabel);

    // Check if column key already exists
    const exists = customColumns.some(col => col.column_key === columnKey);
    if (exists) {
      toast({
        title: 'Error',
        description: 'A column with this name already exists',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('crm_custom_columns')
      .insert({
        user_id: userId,
        column_key: columnKey,
        column_label: columnLabel.trim(),
        field_type: fieldType,
      });

    if (error) {
      console.error('Error adding custom column:', error);
      toast({
        title: 'Error',
        description: 'Failed to add custom column',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Custom column added successfully',
      });
      setColumnLabel('');
      setFieldType('text');
      fetchCustomColumns();
    }

    setIsLoading(false);
  };

  const handleDeleteColumn = async (columnId: string) => {
    const { error } = await supabase
      .from('crm_custom_columns')
      .delete()
      .eq('id', columnId);

    if (error) {
      console.error('Error deleting custom column:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete custom column',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Custom column deleted successfully',
      });
      fetchCustomColumns();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Custom Column Form */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="columnLabel">Column Name</Label>
            <Input
              id="columnLabel"
              placeholder="e.g., Customer Rating"
              value={columnLabel}
              onChange={(e) => setColumnLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fieldType">Field Type</Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger id="fieldType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={handleAddColumn}
          disabled={isLoading || !columnLabel.trim()}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Column
        </Button>
      </div>

      {/* Custom Columns List */}
      {customColumns.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Custom Columns</h4>
          <div className="space-y-2">
            {customColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {column.column_label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Type: {FIELD_TYPES.find(t => t.value === column.field_type)?.label}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteColumn(column.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {customColumns.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No custom columns added yet. Create your first custom column above.
        </p>
      )}
    </div>
  );
};

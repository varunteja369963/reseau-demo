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
  number_subtype?: string;
  options?: string[];
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
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'multiple_select', label: 'Multiple Select' },
  { value: 'range', label: 'Range (Min/Max)' },
  { value: 'rating', label: 'Rating' },
];

const NUMBER_SUBTYPES = [
  { value: 'integer', label: 'Whole Number' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'percentage', label: 'Percentage' },
  { value: 'price', label: 'Price' },
];

interface CustomColumnManagementProps {
  userId?: string;
}

export const CustomColumnManagement = ({ userId }: CustomColumnManagementProps) => {
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [columnLabel, setColumnLabel] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [numberSubtype, setNumberSubtype] = useState('integer');
  const [options, setOptions] = useState<string[]>(['']);
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

    // Validate options for dropdown/multiple choice/multiple select
    const needsOptions = ['dropdown', 'multiple_choice', 'multiple_select'].includes(fieldType);
    if (needsOptions) {
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast({
          title: 'Error',
          description: 'Please enter at least 2 options',
          variant: 'destructive',
        });
        return;
      }
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

    const insertData: any = {
      user_id: userId,
      column_key: columnKey,
      column_label: columnLabel.trim(),
      field_type: fieldType,
    };

    // Add number subtype if field type is number
    if (fieldType === 'number') {
      insertData.number_subtype = numberSubtype;
    }

    // Add options if field type requires them
    if (needsOptions) {
      insertData.options = options.filter(opt => opt.trim() !== '');
    }

    const { error } = await supabase
      .from('crm_custom_columns')
      .insert(insertData);

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
      setNumberSubtype('integer');
      setOptions(['']);
      fetchCustomColumns();
    }

    setIsLoading(false);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const getFieldTypeLabel = (type: string) => {
    return FIELD_TYPES.find(t => t.value === type)?.label || type;
  };

  const getNumberSubtypeLabel = (subtype: string) => {
    return NUMBER_SUBTYPES.find(t => t.value === subtype)?.label || subtype;
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
            <Select value={fieldType} onValueChange={(value) => {
              setFieldType(value);
              if (value !== 'number') setNumberSubtype('integer');
              if (!['dropdown', 'multiple_choice', 'multiple_select'].includes(value)) {
                setOptions(['']);
              }
            }}>
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

        {/* Number Subtype Selection */}
        {fieldType === 'number' && (
          <div className="space-y-2">
            <Label htmlFor="numberSubtype">Number Type</Label>
            <Select value={numberSubtype} onValueChange={setNumberSubtype}>
              <SelectTrigger id="numberSubtype">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NUMBER_SUBTYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Options Input for dropdown/multiple choice/multiple select */}
        {(['dropdown', 'multiple_choice', 'multiple_select'].includes(fieldType)) && (
          <div className="space-y-2">
            <Label>Options (minimum 2)</Label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Option
              </Button>
            </div>
          </div>
        )}

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
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {column.column_label}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      Type: {getFieldTypeLabel(column.field_type)}
                    </p>
                    {column.field_type === 'number' && column.number_subtype && (
                      <p className="text-xs text-muted-foreground">
                        • {getNumberSubtypeLabel(column.number_subtype)}
                      </p>
                    )}
                    {column.options && column.options.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        • Options: {column.options.join(', ')}
                      </p>
                    )}
                  </div>
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
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center py-4">
            No custom columns added yet. Create your first custom column above.
          </p>
          
          {/* Demo Examples */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium text-foreground">Example Custom Columns</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                <p className="text-sm font-medium">Customer Satisfaction</p>
                <p className="text-xs text-muted-foreground">Type: Rating • For collecting feedback</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                <p className="text-sm font-medium">Budget Range</p>
                <p className="text-xs text-muted-foreground">Type: Range (Min/Max) • For tracking price expectations</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                <p className="text-sm font-medium">Preferred Contact Method</p>
                <p className="text-xs text-muted-foreground">Type: Dropdown • Options: Email, Phone, SMS, WhatsApp</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                <p className="text-sm font-medium">Vehicle Features</p>
                <p className="text-xs text-muted-foreground">Type: Multiple Select • Options: Sunroof, Leather, Navigation, etc.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                <p className="text-sm font-medium">Commission</p>
                <p className="text-xs text-muted-foreground">Type: Number • Percentage</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

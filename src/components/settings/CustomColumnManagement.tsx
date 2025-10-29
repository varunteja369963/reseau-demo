import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CustomColumn {
  id: string;
  column_key: string;
  column_label: string;
  field_type: string;
  number_subtype?: string;
  options?: string[];
  is_optional?: boolean;
  default_value?: string;
  min_value?: number;
  max_value?: number;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'year', label: 'Year' },
  { value: 'email', label: 'Email' },
  { value: 'business_email', label: 'Business Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'address', label: 'Address' },
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
  const [isOptional, setIsOptional] = useState(true);
  const [defaultValue, setDefaultValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const { toast } = useToast();

  // Demo data that appears when no custom columns exist
  const demoColumns: CustomColumn[] = [
    {
      id: 'demo-1',
      column_key: 'customer_rating',
      column_label: 'Customer Rating',
      field_type: 'rating',
      is_optional: true,
      default_value: '3',
    },
    {
      id: 'demo-2',
      column_key: 'purchase_amount',
      column_label: 'Purchase Amount',
      field_type: 'number',
      number_subtype: 'price',
      min_value: 0,
      is_optional: false,
    },
    {
      id: 'demo-3',
      column_key: 'subscription_type',
      column_label: 'Subscription Type',
      field_type: 'dropdown',
      options: ['Free', 'Basic', 'Premium', 'Enterprise'],
      is_optional: true,
      default_value: 'Free',
    },
  ];

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

  const resetForm = () => {
    setColumnLabel('');
    setFieldType('text');
    setNumberSubtype('integer');
    setOptions(['']);
    setIsOptional(true);
    setDefaultValue('');
    setMinValue('');
    setMaxValue('');
    setEditingColumn(null);
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

    // Check if column key already exists (excluding current editing column)
    const exists = customColumns.some(col => 
      col.column_key === columnKey && col.id !== editingColumn?.id
    );
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
      is_optional: isOptional,
      default_value: defaultValue.trim() || null,
    };

    // Add number subtype if field type is number
    if (fieldType === 'number') {
      insertData.number_subtype = numberSubtype;
      if (minValue) insertData.min_value = parseFloat(minValue);
      if (maxValue) insertData.max_value = parseFloat(maxValue);
    }

    // Add options if field type requires them
    if (needsOptions) {
      insertData.options = options.filter(opt => opt.trim() !== '');
    }

    if (editingColumn) {
      // Update existing column
      const { error } = await supabase
        .from('crm_custom_columns')
        .update(insertData)
        .eq('id', editingColumn.id);

      if (error) {
        console.error('Error updating custom column:', error);
        toast({
          title: 'Error',
          description: 'Failed to update custom column',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Custom column updated successfully',
        });
        resetForm();
        fetchCustomColumns();
      }
    } else {
      // Insert new column
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
        resetForm();
        fetchCustomColumns();
      }
    }

    setIsLoading(false);
  };

  const handleEditColumn = async (column: CustomColumn) => {
    // If it's a demo column, convert it to a real column
    if (column.id.startsWith('demo-')) {
      const columnKey = generateColumnKey(column.column_label);
      const insertData: any = {
        user_id: userId,
        column_key: columnKey,
        column_label: column.column_label,
        field_type: column.field_type,
        is_optional: column.is_optional ?? true,
        default_value: column.default_value || null,
      };

      if (column.field_type === 'number') {
        insertData.number_subtype = column.number_subtype;
        if (column.min_value) insertData.min_value = column.min_value;
        if (column.max_value) insertData.max_value = column.max_value;
      }

      if (column.options) {
        insertData.options = column.options;
      }

      const { error } = await supabase
        .from('crm_custom_columns')
        .insert(insertData);

      if (error) {
        console.error('Error converting demo column:', error);
        toast({
          title: 'Error',
          description: 'Failed to create column',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Demo column converted to custom column',
      });
      fetchCustomColumns();
      return;
    }

    // Regular edit
    setEditingColumn(column);
    setColumnLabel(column.column_label);
    setFieldType(column.field_type);
    setNumberSubtype(column.number_subtype || 'integer');
    setOptions(column.options || ['']);
    setIsOptional(column.is_optional ?? true);
    setDefaultValue(column.default_value || '');
    setMinValue(column.min_value?.toString() || '');
    setMaxValue(column.max_value?.toString() || '');
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

  const handleDeleteColumn = async () => {
    if (!deleteColumnId) return;

    // If it's a demo column, just close the dialog
    if (deleteColumnId.startsWith('demo-')) {
      toast({
        title: 'Info',
        description: 'Demo columns are for reference only',
      });
      setDeleteColumnId(null);
      return;
    }

    const { error } = await supabase
      .from('crm_custom_columns')
      .delete()
      .eq('id', deleteColumnId);

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
    setDeleteColumnId(null);
  };

  const getInputTypeForFieldType = (fieldType: string) => {
    switch (fieldType) {
      case 'number':
      case 'rating':
      case 'range':
        return 'number';
      case 'date':
        return 'date';
      case 'year':
        return 'number';
      case 'email':
      case 'business_email':
        return 'email';
      case 'url':
        return 'url';
      case 'phone':
        return 'tel';
      default:
        return 'text';
    }
  };

  const displayColumns = customColumns.length > 0 ? customColumns : demoColumns;

  return (
    <div className="space-y-6">
      {/* Add/Edit Custom Column Form */}
      <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              {editingColumn ? 'Edit Custom Column' : 'Add New Custom Column'}
            </h4>
          </div>
          {editingColumn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>

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
              if (value !== 'number') {
                setNumberSubtype('integer');
                setMinValue('');
                setMaxValue('');
              }
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

        {/* Number Subtype and Range */}
        {fieldType === 'number' && (
          <div className="space-y-4">
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minValue">Min Value (Optional)</Label>
                <Input
                  id="minValue"
                  type="number"
                  placeholder="e.g., 0"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxValue">Max Value (Optional)</Label>
                <Input
                  id="maxValue"
                  type="number"
                  placeholder="e.g., 100"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Options Input for dropdown/multiple choice/multiple select */}
        {fieldType && ['dropdown', 'multiple_choice', 'multiple_select'].includes(fieldType) && (
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

        {/* Optional Field Toggle - Only show after field type is selected */}
        {fieldType && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="isOptional" className="text-sm font-medium">
                Optional Field
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow this field to be left empty
              </p>
            </div>
            <Switch
              id="isOptional"
              checked={isOptional}
              onCheckedChange={setIsOptional}
            />
          </div>
        )}

        {/* Default Value - Only show after field type is selected */}
        {fieldType && (
          <div className="space-y-2">
            <Label htmlFor="defaultValue">Default Value (Optional)</Label>
            {fieldType === 'textarea' ? (
              <textarea
                id="defaultValue"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter default value"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
              />
            ) : fieldType === 'boolean' ? (
              <select
                id="defaultValue"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
              >
                <option value="">None</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <Input
                id="defaultValue"
                type={getInputTypeForFieldType(fieldType)}
                placeholder="Enter default value"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
                min={fieldType === 'year' ? '1900' : undefined}
                max={fieldType === 'year' ? '2100' : undefined}
              />
            )}
          </div>
        )}

        <Button
          onClick={handleAddColumn}
          disabled={isLoading || !columnLabel.trim()}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          {editingColumn ? 'Update Column' : 'Add Custom Column'}
        </Button>
      </div>

      {/* Custom Columns List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            {customColumns.length > 0 ? 'Your Custom Columns' : 'Example Custom Columns'}
          </h4>
          {customColumns.length === 0 && (
            <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
              Demo Data - Click Edit to use
            </span>
          )}
        </div>
        <div className="space-y-3">
          {displayColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-start justify-between p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {column.column_label}
                    </p>
                    {!column.is_optional && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                      {getFieldTypeLabel(column.field_type)}
                    </span>
                    
                    {column.field_type === 'number' && column.number_subtype && (
                      <span className="px-2 py-1 rounded-md bg-muted">
                        {getNumberSubtypeLabel(column.number_subtype)}
                      </span>
                    )}
                    
                    {column.min_value !== null && column.min_value !== undefined && (
                      <span className="px-2 py-1 rounded-md bg-muted">
                        Min: {column.min_value}
                      </span>
                    )}
                    
                    {column.max_value !== null && column.max_value !== undefined && (
                      <span className="px-2 py-1 rounded-md bg-muted">
                        Max: {column.max_value}
                      </span>
                    )}
                    
                    {column.default_value && (
                      <span className="px-2 py-1 rounded-md bg-muted">
                        Default: {column.default_value}
                      </span>
                    )}
                  </div>
                  
                  {column.options && column.options.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-muted-foreground mb-1">Options:</p>
                      <div className="flex flex-wrap gap-1">
                        {column.options.map((opt, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-accent/50 text-accent-foreground">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditColumn(column)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteColumnId(column.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteColumnId} onOpenChange={() => setDeleteColumnId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteColumnId?.startsWith('demo-') ? 'Demo Column' : 'Delete Custom Column'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteColumnId?.startsWith('demo-') 
                ? 'This is a demo column for reference. You can edit it to create a real custom column.'
                : 'Are you sure you want to delete this custom column? This action cannot be undone and will remove all data associated with this column.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteColumn}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

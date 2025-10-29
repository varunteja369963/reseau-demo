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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  { value: 'range', label: 'Range (Min & Max)' },
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

interface ColumnFormData {
  id: string;
  columnLabel: string;
  fieldType: string;
  numberSubtype: string;
  options: string[];
  isOptional: boolean;
  defaultValue: string;
  minValue: string;
  maxValue: string;
}

const createEmptyForm = (): ColumnFormData => ({
  id: Math.random().toString(36).substr(2, 9),
  columnLabel: '',
  fieldType: 'text',
  numberSubtype: 'integer',
  options: [''],
  isOptional: true,
  defaultValue: '',
  minValue: '',
  maxValue: '',
});

export const CustomColumnManagement = ({ userId }: CustomColumnManagementProps) => {
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [columnForms, setColumnForms] = useState<ColumnFormData[]>([createEmptyForm()]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState<ColumnFormData | null>(null);
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
    setColumnForms([createEmptyForm()]);
    setEditingColumn(null);
    setShowEditDialog(false);
    setEditFormData(null);
  };

  const isFormValid = (form: ColumnFormData) => {
    // Must have column name
    if (!form.columnLabel.trim()) return false;
    
    // Must have field type
    if (!form.fieldType) return false;
    
    // For dropdown/multiple choice/multiple select, must have at least 1 non-empty option
    const needsOptions = ['dropdown', 'multiple_choice', 'multiple_select'].includes(form.fieldType);
    if (needsOptions) {
      const validOptions = form.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 1) return false;
    }
    
    return true;
  };

  const updateFormField = (formId: string, field: keyof ColumnFormData, value: any) => {
    setColumnForms(forms => 
      forms.map(form => 
        form.id === formId ? { ...form, [field]: value } : form
      )
    );
  };

  const addNewForm = () => {
    if (columnForms.length < 10) {
      setColumnForms([...columnForms, createEmptyForm()]);
    }
  };

  const removeForm = (formId: string) => {
    if (columnForms.length > 1) {
      setColumnForms(forms => forms.filter(form => form.id !== formId));
    }
  };

  const handleSaveAllColumns = async () => {
    if (!userId) return;

    const validForms = columnForms.filter(form => isFormValid(form));
    
    if (validForms.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill out at least one column form completely',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      for (const form of validForms) {
        const columnKey = generateColumnKey(form.columnLabel);

        // Check if column key already exists
        const exists = customColumns.some(col => col.column_key === columnKey);
        if (exists) {
          toast({
            title: 'Error',
            description: `Column "${form.columnLabel}" already exists`,
            variant: 'destructive',
          });
          continue;
        }

        const needsOptions = ['dropdown', 'multiple_choice', 'multiple_select'].includes(form.fieldType);
        if (needsOptions) {
          const validOptions = form.options.filter(opt => opt.trim() !== '');
          if (validOptions.length < 2) {
            toast({
              title: 'Error',
              description: `"${form.columnLabel}" needs at least 2 options`,
              variant: 'destructive',
            });
            continue;
          }
        }

        const insertData: any = {
          user_id: userId,
          column_key: columnKey,
          column_label: form.columnLabel.trim(),
          field_type: form.fieldType,
          is_optional: form.isOptional,
          default_value: form.defaultValue.trim() || null,
        };

        if (form.fieldType === 'number') {
          insertData.number_subtype = form.numberSubtype;
          if (form.minValue) insertData.min_value = parseFloat(form.minValue);
          if (form.maxValue) insertData.max_value = parseFloat(form.maxValue);
        }

        if (needsOptions) {
          insertData.options = form.options.filter(opt => opt.trim() !== '');
        }

        const { error } = await supabase
          .from('crm_custom_columns')
          .insert(insertData);

        if (error) {
          console.error('Error adding custom column:', error);
          toast({
            title: 'Error',
            description: `Failed to add "${form.columnLabel}"`,
            variant: 'destructive',
          });
        }
      }

      toast({
        title: 'Success',
        description: `Added ${validForms.length} custom column${validForms.length > 1 ? 's' : ''}`,
      });
      resetForm();
      fetchCustomColumns();
    } catch (error) {
      console.error('Error saving columns:', error);
      toast({
        title: 'Error',
        description: 'Failed to save columns',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleUpdateColumn = async () => {
    if (!userId || !editFormData || !editingColumn) return;

    const form = editFormData;

    if (!form.columnLabel.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a column name',
        variant: 'destructive',
      });
      return;
    }

    const needsOptions = ['dropdown', 'multiple_choice', 'multiple_select'].includes(form.fieldType);
    if (needsOptions) {
      const validOptions = form.options.filter(opt => opt.trim() !== '');
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
    const columnKey = generateColumnKey(form.columnLabel);

    const exists = customColumns.some(col => 
      col.column_key === columnKey && col.id !== editingColumn.id
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

    const updateData: any = {
      user_id: userId,
      column_key: columnKey,
      column_label: form.columnLabel.trim(),
      field_type: form.fieldType,
      is_optional: form.isOptional,
      default_value: form.defaultValue.trim() || null,
    };

    if (form.fieldType === 'number') {
      updateData.number_subtype = form.numberSubtype;
      if (form.minValue) updateData.min_value = parseFloat(form.minValue);
      if (form.maxValue) updateData.max_value = parseFloat(form.maxValue);
    }

    if (needsOptions) {
      updateData.options = form.options.filter(opt => opt.trim() !== '');
    }

    const { error } = await supabase
      .from('crm_custom_columns')
      .update(updateData)
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

    setIsLoading(false);
  };

  const handleEditColumn = (column: CustomColumn) => {
    setEditingColumn(column.id.startsWith('demo-') ? null : column);
    setEditFormData({
      id: 'edit',
      columnLabel: column.column_label,
      fieldType: column.field_type,
      numberSubtype: column.number_subtype || 'integer',
      options: column.options && column.options.length > 0 ? column.options : [''],
      isOptional: column.is_optional ?? true,
      defaultValue: column.default_value || '',
      minValue: column.min_value?.toString() || '',
      maxValue: column.max_value?.toString() || '',
    });
    setShowEditDialog(true);
  };

  const handleAddOption = (formId: string, form: ColumnFormData) => {
    updateFormField(formId, 'options', [...form.options, '']);
  };

  const handleRemoveOption = (formId: string, form: ColumnFormData, index: number) => {
    if (form.options.length > 1) {
      updateFormField(formId, 'options', form.options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (formId: string, form: ColumnFormData, index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    updateFormField(formId, 'options', newOptions);
  };

  const handleEditAddOption = () => {
    if (editFormData) {
      setEditFormData({ ...editFormData, options: [...editFormData.options, ''] });
    }
  };

  const handleEditRemoveOption = (index: number) => {
    if (editFormData && editFormData.options.length > 1) {
      setEditFormData({
        ...editFormData,
        options: editFormData.options.filter((_, i) => i !== index)
      });
    }
  };

  const handleEditOptionChange = (index: number, value: string) => {
    if (editFormData) {
      const newOptions = [...editFormData.options];
      newOptions[index] = value;
      setEditFormData({ ...editFormData, options: newOptions });
    }
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

  const renderFormFields = (form: ColumnFormData, formIndex: number) => (
    <>
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-medium text-foreground">
          Column {formIndex + 1}
        </h5>
        {columnForms.length > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeForm(form.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`columnLabel-${form.id}`}>Column Name</Label>
          <Input
            id={`columnLabel-${form.id}`}
            placeholder="e.g., Customer Rating"
            value={form.columnLabel}
            onChange={(e) => updateFormField(form.id, 'columnLabel', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`fieldType-${form.id}`}>Field Type</Label>
          <Select value={form.fieldType} onValueChange={(value) => {
            updateFormField(form.id, 'fieldType', value);
            if (value !== 'number') {
              updateFormField(form.id, 'numberSubtype', 'integer');
              updateFormField(form.id, 'minValue', '');
              updateFormField(form.id, 'maxValue', '');
            }
            if (!['dropdown', 'multiple_choice', 'multiple_select'].includes(value)) {
              updateFormField(form.id, 'options', ['']);
            }
          }}>
            <SelectTrigger id={`fieldType-${form.id}`}>
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
      {form.fieldType === 'number' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor={`numberSubtype-${form.id}`}>Number Type</Label>
            <Select value={form.numberSubtype} onValueChange={(value) => updateFormField(form.id, 'numberSubtype', value)}>
              <SelectTrigger id={`numberSubtype-${form.id}`}>
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
          <div className="space-y-2">
            <Label htmlFor={`minValue-${form.id}`}>Min Value (Optional)</Label>
            <Input
              id={`minValue-${form.id}`}
              type="number"
              placeholder="e.g., 0"
              value={form.minValue}
              onChange={(e) => updateFormField(form.id, 'minValue', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`maxValue-${form.id}`}>Max Value (Optional)</Label>
            <Input
              id={`maxValue-${form.id}`}
              type="number"
              placeholder="e.g., 100"
              value={form.maxValue}
              onChange={(e) => updateFormField(form.id, 'maxValue', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Range Type Input */}
      {form.fieldType === 'range' && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`minRange-${form.id}`}>Minimum Range (User can enter from)</Label>
              <Input
                id={`minRange-${form.id}`}
                type="number"
                placeholder="e.g., 0"
                value={form.minValue}
                onChange={(e) => updateFormField(form.id, 'minValue', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxRange-${form.id}`}>Maximum Range (User can enter up to)</Label>
              <Input
                id={`maxRange-${form.id}`}
                type="number"
                placeholder="e.g., 100"
                value={form.maxValue}
                onChange={(e) => updateFormField(form.id, 'maxValue', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Options Input for dropdown/multiple choice/multiple select */}
      {form.fieldType && ['dropdown', 'multiple_choice', 'multiple_select'].includes(form.fieldType) && (
        <div className="space-y-2">
          <Label>Options (at least 1 required)</Label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {form.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(form.id, form, index, e.target.value)}
                />
                {form.options.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(form.id, form, index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddOption(form.id, form)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        </div>
      )}

      {/* Optional Field Toggle */}
      {form.fieldType && (
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 max-w-md">
          <div className="space-y-0.5">
            <Label htmlFor={`isOptional-${form.id}`} className="text-sm font-medium">
              Optional Field
            </Label>
            <p className="text-xs text-muted-foreground">
              Allow this field to be left empty
            </p>
          </div>
          <Switch
            id={`isOptional-${form.id}`}
            checked={form.isOptional}
            onCheckedChange={(checked) => updateFormField(form.id, 'isOptional', checked)}
          />
        </div>
      )}

      {/* Default Value */}
      {form.fieldType && (
        <div className="space-y-2 max-w-md">
          <Label htmlFor={`defaultValue-${form.id}`}>Default Value (Optional)</Label>
          {form.fieldType === 'textarea' ? (
            <textarea
              id={`defaultValue-${form.id}`}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter default value"
              value={form.defaultValue}
              onChange={(e) => updateFormField(form.id, 'defaultValue', e.target.value)}
            />
          ) : form.fieldType === 'boolean' ? (
            <select
              id={`defaultValue-${form.id}`}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.defaultValue}
              onChange={(e) => updateFormField(form.id, 'defaultValue', e.target.value)}
            >
              <option value="">None</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : form.fieldType === 'range' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`defaultMin-${form.id}`} className="text-sm text-muted-foreground">Minimum</Label>
                <Input
                  id={`defaultMin-${form.id}`}
                  type="number"
                  placeholder="Min default"
                  value={form.defaultValue.split('-')[0] || ''}
                  onChange={(e) => {
                    const maxVal = form.defaultValue.split('-')[1] || '';
                    updateFormField(form.id, 'defaultValue', `${e.target.value}-${maxVal}`);
                  }}
                />
              </div>
              <div>
                <Label htmlFor={`defaultMax-${form.id}`} className="text-sm text-muted-foreground">Maximum</Label>
                <Input
                  id={`defaultMax-${form.id}`}
                  type="number"
                  placeholder="Max default"
                  value={form.defaultValue.split('-')[1] || ''}
                  onChange={(e) => {
                    const minVal = form.defaultValue.split('-')[0] || '';
                    updateFormField(form.id, 'defaultValue', `${minVal}-${e.target.value}`);
                  }}
                />
              </div>
            </div>
          ) : (
            <Input
              id={`defaultValue-${form.id}`}
              type={getInputTypeForFieldType(form.fieldType)}
              placeholder="Enter default value"
              value={form.defaultValue}
              onChange={(e) => updateFormField(form.id, 'defaultValue', e.target.value)}
              min={form.fieldType === 'year' ? '1900' : undefined}
              max={form.fieldType === 'year' ? '2100' : undefined}
            />
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Add Custom Columns Form */}
      <div className="space-y-6 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              Add New Custom Columns
            </h4>
          </div>
          <span className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
            {columnForms.length} of 10 forms
          </span>
        </div>

        {columnForms.map((form, index) => (
          <div key={form.id} className="space-y-4 p-5 rounded-lg bg-background/50 border border-border">
            {renderFormFields(form, index)}
            
            {isFormValid(form) && index === columnForms.length - 1 && columnForms.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addNewForm}
                className="w-full border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Column
              </Button>
            )}
          </div>
        ))}

        {columnForms.some(form => isFormValid(form)) && (
          <Button
            onClick={handleSaveAllColumns}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            Save All Columns ({columnForms.filter(form => isFormValid(form)).length})
          </Button>
        )}
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

      {/* Edit Column Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => {
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingColumn ? 'Edit Custom Column' : 'Create Custom Column'}</DialogTitle>
            <DialogDescription>
              {editingColumn ? 'Modify the settings for this custom column' : 'Configure your new custom column'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editFormData && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-columnLabel">Column Name</Label>
                    <Input
                      id="edit-columnLabel"
                      placeholder="e.g., Customer Rating"
                      value={editFormData.columnLabel}
                      onChange={(e) => setEditFormData({ ...editFormData, columnLabel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fieldType">Field Type</Label>
                    <Select value={editFormData.fieldType} onValueChange={(value) => {
                      setEditFormData({
                        ...editFormData,
                        fieldType: value,
                        numberSubtype: value === 'number' ? editFormData.numberSubtype : 'integer',
                        minValue: value === 'number' ? editFormData.minValue : '',
                        maxValue: value === 'number' ? editFormData.maxValue : '',
                        options: ['dropdown', 'multiple_choice', 'multiple_select'].includes(value) ? editFormData.options : ['']
                      });
                    }}>
                      <SelectTrigger id="edit-fieldType">
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

                {editFormData.fieldType === 'number' && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="edit-numberSubtype">Number Type</Label>
                      <Select value={editFormData.numberSubtype} onValueChange={(value) => setEditFormData({ ...editFormData, numberSubtype: value })}>
                        <SelectTrigger id="edit-numberSubtype">
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
                    <div className="space-y-2">
                      <Label htmlFor="edit-minValue">Min Value (Optional)</Label>
                      <Input
                        id="edit-minValue"
                        type="number"
                        placeholder="e.g., 0"
                        value={editFormData.minValue}
                        onChange={(e) => setEditFormData({ ...editFormData, minValue: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxValue">Max Value (Optional)</Label>
                      <Input
                        id="edit-maxValue"
                        type="number"
                        placeholder="e.g., 100"
                        value={editFormData.maxValue}
                        onChange={(e) => setEditFormData({ ...editFormData, maxValue: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {editFormData.fieldType === 'range' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-minRange">Minimum Range (User can enter from)</Label>
                      <Input
                        id="edit-minRange"
                        type="number"
                        placeholder="e.g., 0"
                        value={editFormData.minValue}
                        onChange={(e) => setEditFormData({ ...editFormData, minValue: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxRange">Maximum Range (User can enter up to)</Label>
                      <Input
                        id="edit-maxRange"
                        type="number"
                        placeholder="e.g., 100"
                        value={editFormData.maxValue}
                        onChange={(e) => setEditFormData({ ...editFormData, maxValue: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {['dropdown', 'multiple_choice', 'multiple_select'].includes(editFormData.fieldType) && (
                  <div className="space-y-2">
                    <Label>Options (at least 1 required)</Label>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {editFormData.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleEditOptionChange(index, e.target.value)}
                          />
                          {editFormData.options.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditRemoveOption(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditAddOption}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 max-w-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-isOptional" className="text-sm font-medium">
                      Optional Field
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow this field to be left empty
                    </p>
                  </div>
                  <Switch
                    id="edit-isOptional"
                    checked={editFormData.isOptional}
                    onCheckedChange={(checked) => setEditFormData({ ...editFormData, isOptional: checked })}
                  />
                </div>

                <div className="space-y-2 max-w-md">
                  <Label htmlFor="edit-defaultValue">Default Value (Optional)</Label>
                  {editFormData.fieldType === 'textarea' ? (
                    <textarea
                      id="edit-defaultValue"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter default value"
                      value={editFormData.defaultValue}
                      onChange={(e) => setEditFormData({ ...editFormData, defaultValue: e.target.value })}
                    />
                  ) : editFormData.fieldType === 'boolean' ? (
                    <select
                      id="edit-defaultValue"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={editFormData.defaultValue}
                      onChange={(e) => setEditFormData({ ...editFormData, defaultValue: e.target.value })}
                    >
                      <option value="">None</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : editFormData.fieldType === 'range' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="edit-defaultMin" className="text-sm text-muted-foreground">Minimum</Label>
                        <Input
                          id="edit-defaultMin"
                          type="number"
                          placeholder="Min default"
                          value={editFormData.defaultValue.split('-')[0] || ''}
                          onChange={(e) => {
                            const maxVal = editFormData.defaultValue.split('-')[1] || '';
                            setEditFormData({ ...editFormData, defaultValue: `${e.target.value}-${maxVal}` });
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-defaultMax" className="text-sm text-muted-foreground">Maximum</Label>
                        <Input
                          id="edit-defaultMax"
                          type="number"
                          placeholder="Max default"
                          value={editFormData.defaultValue.split('-')[1] || ''}
                          onChange={(e) => {
                            const minVal = editFormData.defaultValue.split('-')[0] || '';
                            setEditFormData({ ...editFormData, defaultValue: `${minVal}-${e.target.value}` });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Input
                      id="edit-defaultValue"
                      type={getInputTypeForFieldType(editFormData.fieldType)}
                      placeholder="Enter default value"
                      value={editFormData.defaultValue}
                      onChange={(e) => setEditFormData({ ...editFormData, defaultValue: e.target.value })}
                      min={editFormData.fieldType === 'year' ? '1900' : undefined}
                      max={editFormData.fieldType === 'year' ? '2100' : undefined}
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateColumn} 
              disabled={isLoading || !editFormData || !isFormValid(editFormData)}
            >
              {editingColumn ? 'Update Column' : 'Create Column'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

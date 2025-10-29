-- Add additional columns to crm_custom_columns for enhanced field types
ALTER TABLE public.crm_custom_columns
ADD COLUMN number_subtype text,
ADD COLUMN options text[];

-- Add comment to explain the new columns
COMMENT ON COLUMN public.crm_custom_columns.number_subtype IS 'Subtype for number fields: integer, decimal, percentage, price';
COMMENT ON COLUMN public.crm_custom_columns.options IS 'Options array for dropdown, multiple_choice, and multiple_select fields';
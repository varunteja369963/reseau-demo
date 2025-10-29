-- Add new columns to crm_custom_columns table
ALTER TABLE public.crm_custom_columns
ADD COLUMN is_optional boolean DEFAULT true,
ADD COLUMN default_value text,
ADD COLUMN min_value numeric,
ADD COLUMN max_value numeric;
-- Create custom columns table for storing user-defined CRM columns
CREATE TABLE public.crm_custom_columns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  column_key text NOT NULL,
  column_label text NOT NULL,
  field_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, column_key)
);

-- Enable Row Level Security
ALTER TABLE public.crm_custom_columns ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own custom columns"
ON public.crm_custom_columns
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom columns"
ON public.crm_custom_columns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom columns"
ON public.crm_custom_columns
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom columns"
ON public.crm_custom_columns
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_crm_custom_columns_updated_at
BEFORE UPDATE ON public.crm_custom_columns
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
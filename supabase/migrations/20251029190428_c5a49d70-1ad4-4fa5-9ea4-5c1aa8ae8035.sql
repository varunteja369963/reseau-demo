-- Create activity log table for tracking CRM changes
CREATE TABLE public.crm_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete')),
  entity_type TEXT NOT NULL DEFAULT 'lead',
  entity_id TEXT NOT NULL,
  entity_data JSONB NOT NULL,
  previous_data JSONB,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crm_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for activity log
CREATE POLICY "Users can view their own activity log"
ON public.crm_activity_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity log"
ON public.crm_activity_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_activity_log_user_created ON public.crm_activity_log(user_id, created_at DESC);
CREATE INDEX idx_activity_log_entity ON public.crm_activity_log(entity_type, entity_id);
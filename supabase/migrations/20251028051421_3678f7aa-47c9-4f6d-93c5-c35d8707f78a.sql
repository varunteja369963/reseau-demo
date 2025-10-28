-- Create table for storing user's selected stat cards
CREATE TABLE public.crm_card_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  selected_cards TEXT[] NOT NULL CHECK (array_length(selected_cards, 1) <= 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.crm_card_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for card settings
CREATE POLICY "Users can view their own card settings"
  ON public.crm_card_settings FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own card settings"
  ON public.crm_card_settings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own card settings"
  ON public.crm_card_settings FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own card settings"
  ON public.crm_card_settings FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Create table for CRM access permissions
CREATE TABLE public.crm_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  granted_to_email TEXT NOT NULL,
  granted_to_user_id UUID,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('viewer', 'editor', 'admin')),
  accessible_fields TEXT[],
  can_add_customer BOOLEAN DEFAULT false,
  can_use_chat BOOLEAN DEFAULT false,
  can_download_data BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, granted_to_email)
);

-- Enable RLS
ALTER TABLE public.crm_access_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for access permissions
CREATE POLICY "Users can view permissions they own"
  ON public.crm_access_permissions FOR SELECT
  USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can view permissions granted to them"
  ON public.crm_access_permissions FOR SELECT
  USING (auth.uid()::text = granted_to_user_id::text);

CREATE POLICY "Users can insert their own permissions"
  ON public.crm_access_permissions FOR INSERT
  WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can update their own permissions"
  ON public.crm_access_permissions FOR UPDATE
  USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can delete their own permissions"
  ON public.crm_access_permissions FOR DELETE
  USING (auth.uid()::text = owner_id::text);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_crm_card_settings_updated_at
  BEFORE UPDATE ON public.crm_card_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_crm_access_permissions_updated_at
  BEFORE UPDATE ON public.crm_access_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
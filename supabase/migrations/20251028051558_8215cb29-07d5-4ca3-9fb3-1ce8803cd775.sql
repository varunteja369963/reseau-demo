-- Fix security warning: Set search_path for function
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers after function update
CREATE TRIGGER update_crm_card_settings_updated_at
  BEFORE UPDATE ON public.crm_card_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_crm_access_permissions_updated_at
  BEFORE UPDATE ON public.crm_access_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
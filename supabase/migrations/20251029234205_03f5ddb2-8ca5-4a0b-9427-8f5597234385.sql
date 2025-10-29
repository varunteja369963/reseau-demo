-- Email Marketing Platform Database Schema

-- 1. Email Contacts (Subscribers/Audience)
CREATE TABLE public.email_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  country TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced', 'complained')),
  engagement_score INTEGER DEFAULT 50,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email)
);

-- 2. Email Lists (Static Lists)
CREATE TABLE public.email_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Contact List Mapping (Many-to-Many)
CREATE TABLE public.email_contact_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES public.email_lists(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contact_id, list_id)
);

-- 4. Email Segments (Smart/Dynamic Segments)
CREATE TABLE public.email_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL DEFAULT '[]',
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Email Tags
CREATE TABLE public.email_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- 6. Contact Tags Mapping (Many-to-Many)
CREATE TABLE public.email_contact_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.email_tags(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contact_id, tag_id)
);

-- 7. Email Templates
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject TEXT,
  html_content TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'custom',
  is_system_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Email Campaigns
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_to TEXT,
  html_content TEXT NOT NULL,
  template_id UUID REFERENCES public.email_templates(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  audience_type TEXT NOT NULL CHECK (audience_type IN ('all', 'list', 'segment', 'tags')),
  audience_ids JSONB DEFAULT '[]',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  total_complained INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Email Automations / Workflows
CREATE TABLE public.email_automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('new_subscriber', 'tag_added', 'segment_joined', 'date_based', 'custom_event', 'abandoned_cart')),
  trigger_config JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  total_enrolled INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Automation Steps
CREATE TABLE public.email_automation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL REFERENCES public.email_automations(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('send_email', 'wait', 'condition', 'add_tag', 'remove_tag', 'update_field')),
  step_config JSONB NOT NULL DEFAULT '{}',
  template_id UUID REFERENCES public.email_templates(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Contact Activity Log
CREATE TABLE public.email_contact_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE SET NULL,
  automation_id UUID REFERENCES public.email_automations(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'complained')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Campaign Link Clicks
CREATE TABLE public.email_campaign_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.email_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_contact_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_contacts
CREATE POLICY "Users can view their own contacts" ON public.email_contacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own contacts" ON public.email_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contacts" ON public.email_contacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contacts" ON public.email_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_lists
CREATE POLICY "Users can view their own lists" ON public.email_lists
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lists" ON public.email_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lists" ON public.email_lists
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own lists" ON public.email_lists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_segments
CREATE POLICY "Users can view their own segments" ON public.email_segments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own segments" ON public.email_segments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own segments" ON public.email_segments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own segments" ON public.email_segments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_tags
CREATE POLICY "Users can view their own tags" ON public.email_tags
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tags" ON public.email_tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tags" ON public.email_tags
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tags" ON public.email_tags
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_templates
CREATE POLICY "Users can view templates" ON public.email_templates
  FOR SELECT USING (auth.uid() = user_id OR is_system_template = true);
CREATE POLICY "Users can insert their own templates" ON public.email_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON public.email_templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON public.email_templates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_campaigns
CREATE POLICY "Users can view their own campaigns" ON public.email_campaigns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own campaigns" ON public.email_campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own campaigns" ON public.email_campaigns
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own campaigns" ON public.email_campaigns
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for email_automations
CREATE POLICY "Users can view their own automations" ON public.email_automations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own automations" ON public.email_automations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own automations" ON public.email_automations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own automations" ON public.email_automations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for child tables (accessible through parent relationships)
CREATE POLICY "Users can view contact list mappings" ON public.email_contact_lists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.email_contacts ec 
      WHERE ec.id = contact_id AND ec.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view contact tag mappings" ON public.email_contact_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.email_contacts ec 
      WHERE ec.id = contact_id AND ec.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view automation steps" ON public.email_automation_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.email_automations ea 
      WHERE ea.id = automation_id AND ea.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view contact activity" ON public.email_contact_activity
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.email_contacts ec 
      WHERE ec.id = contact_id AND ec.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view campaign clicks" ON public.email_campaign_clicks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.email_campaigns ec 
      WHERE ec.id = campaign_id AND ec.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_email_contacts_updated_at
  BEFORE UPDATE ON public.email_contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_lists_updated_at
  BEFORE UPDATE ON public.email_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_segments_updated_at
  BEFORE UPDATE ON public.email_segments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_automations_updated_at
  BEFORE UPDATE ON public.email_automations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_email_automation_steps_updated_at
  BEFORE UPDATE ON public.email_automation_steps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_email_contacts_user_id ON public.email_contacts(user_id);
CREATE INDEX idx_email_contacts_email ON public.email_contacts(email);
CREATE INDEX idx_email_contacts_status ON public.email_contacts(status);
CREATE INDEX idx_email_lists_user_id ON public.email_lists(user_id);
CREATE INDEX idx_email_segments_user_id ON public.email_segments(user_id);
CREATE INDEX idx_email_campaigns_user_id ON public.email_campaigns(user_id);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_automations_user_id ON public.email_automations(user_id);
CREATE INDEX idx_email_contact_activity_contact_id ON public.email_contact_activity(contact_id);
CREATE INDEX idx_email_contact_activity_campaign_id ON public.email_contact_activity(campaign_id);
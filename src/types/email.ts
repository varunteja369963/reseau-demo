export interface EmailContact {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  engagement_score: number;
  subscribed_at: string;
  unsubscribed_at?: string;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  tags?: EmailTag[];
  lists?: EmailList[];
}

export interface EmailList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailSegment {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  conditions: any[];
  subscriber_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  contact_count: number;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject?: string;
  html_content: string;
  thumbnail_url?: string;
  category: string;
  is_system_template: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  preview_text?: string;
  from_name: string;
  from_email: string;
  reply_to?: string;
  html_content: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  audience_type: 'all' | 'list' | 'segment' | 'tags';
  audience_ids: string[];
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  total_unsubscribed: number;
  total_complained: number;
  created_at: string;
  updated_at: string;
}

export interface EmailAutomation {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger_type: 'new_subscriber' | 'tag_added' | 'segment_joined' | 'date_based' | 'custom_event' | 'abandoned_cart';
  trigger_config: any;
  status: 'draft' | 'active' | 'paused';
  total_enrolled: number;
  total_completed: number;
  created_at: string;
  updated_at: string;
  steps?: AutomationStep[];
}

export interface AutomationStep {
  id: string;
  automation_id: string;
  step_order: number;
  step_type: 'send_email' | 'wait' | 'condition' | 'add_tag' | 'remove_tag' | 'update_field';
  step_config: any;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  campaign_id?: string;
  automation_id?: string;
  activity_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'complained';
  metadata: any;
  created_at: string;
}

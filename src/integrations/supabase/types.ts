export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      crm_access_permissions: {
        Row: {
          accessible_fields: string[] | null
          can_add_customer: boolean | null
          can_download_data: boolean | null
          can_use_chat: boolean | null
          created_at: string
          granted_to_email: string
          granted_to_user_id: string | null
          id: string
          owner_id: string
          permission_level: string
          updated_at: string
        }
        Insert: {
          accessible_fields?: string[] | null
          can_add_customer?: boolean | null
          can_download_data?: boolean | null
          can_use_chat?: boolean | null
          created_at?: string
          granted_to_email: string
          granted_to_user_id?: string | null
          id?: string
          owner_id: string
          permission_level: string
          updated_at?: string
        }
        Update: {
          accessible_fields?: string[] | null
          can_add_customer?: boolean | null
          can_download_data?: boolean | null
          can_use_chat?: boolean | null
          created_at?: string
          granted_to_email?: string
          granted_to_user_id?: string | null
          id?: string
          owner_id?: string
          permission_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_activity_log: {
        Row: {
          action_type: string
          created_at: string
          description: string
          entity_data: Json
          entity_id: string
          entity_type: string
          id: string
          previous_data: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          entity_data: Json
          entity_id: string
          entity_type?: string
          id?: string
          previous_data?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          entity_data?: Json
          entity_id?: string
          entity_type?: string
          id?: string
          previous_data?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      crm_card_settings: {
        Row: {
          created_at: string
          id: string
          selected_cards: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          selected_cards: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          selected_cards?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_custom_columns: {
        Row: {
          column_key: string
          column_label: string
          created_at: string
          default_value: string | null
          field_type: string
          id: string
          is_optional: boolean | null
          max_value: number | null
          min_value: number | null
          number_subtype: string | null
          options: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          column_key: string
          column_label: string
          created_at?: string
          default_value?: string | null
          field_type: string
          id?: string
          is_optional?: boolean | null
          max_value?: number | null
          min_value?: number | null
          number_subtype?: string | null
          options?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          column_key?: string
          column_label?: string
          created_at?: string
          default_value?: string | null
          field_type?: string
          id?: string
          is_optional?: boolean | null
          max_value?: number | null
          min_value?: number | null
          number_subtype?: string | null
          options?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_automation_steps: {
        Row: {
          automation_id: string
          created_at: string
          id: string
          step_config: Json
          step_order: number
          step_type: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          automation_id: string
          created_at?: string
          id?: string
          step_config?: Json
          step_order: number
          step_type: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          automation_id?: string
          created_at?: string
          id?: string
          step_config?: Json
          step_order?: number
          step_type?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_automation_steps_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_automation_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_automations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          total_completed: number | null
          total_enrolled: number | null
          trigger_config: Json | null
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          total_completed?: number | null
          total_enrolled?: number | null
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          total_completed?: number | null
          total_enrolled?: number | null
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_campaign_clicks: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          contact_id: string
          id: string
          url: string
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          contact_id: string
          id?: string
          url: string
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          contact_id?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaign_clicks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "email_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          audience_ids: Json | null
          audience_type: string
          created_at: string
          from_email: string
          from_name: string
          html_content: string
          id: string
          name: string
          preview_text: string | null
          reply_to: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          template_id: string | null
          total_bounced: number | null
          total_clicked: number | null
          total_complained: number | null
          total_delivered: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience_ids?: Json | null
          audience_type: string
          created_at?: string
          from_email: string
          from_name: string
          html_content: string
          id?: string
          name: string
          preview_text?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          template_id?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_complained?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience_ids?: Json | null
          audience_type?: string
          created_at?: string
          from_email?: string
          from_name?: string
          html_content?: string
          id?: string
          name?: string
          preview_text?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          template_id?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_complained?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_activity: {
        Row: {
          activity_type: string
          automation_id: string | null
          campaign_id: string | null
          contact_id: string
          created_at: string
          id: string
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          automation_id?: string | null
          campaign_id?: string | null
          contact_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          automation_id?: string | null
          campaign_id?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_contact_activity_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "email_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_contact_activity_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_contact_activity_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "email_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_lists: {
        Row: {
          added_at: string | null
          contact_id: string
          id: string
          list_id: string
        }
        Insert: {
          added_at?: string | null
          contact_id: string
          id?: string
          list_id: string
        }
        Update: {
          added_at?: string | null
          contact_id?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_contact_lists_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "email_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_contact_lists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_tags: {
        Row: {
          added_at: string | null
          contact_id: string
          id: string
          tag_id: string
        }
        Insert: {
          added_at?: string | null
          contact_id: string
          id?: string
          tag_id: string
        }
        Update: {
          added_at?: string | null
          contact_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_contact_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "email_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_contact_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "email_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contacts: {
        Row: {
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          custom_fields: Json | null
          email: string
          engagement_score: number | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          status: string
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          email: string
          engagement_score?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string
          engagement_score?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          subscriber_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subscriber_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subscriber_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_segments: {
        Row: {
          conditions: Json
          created_at: string
          description: string | null
          id: string
          name: string
          subscriber_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subscriber_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subscriber_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_tags: {
        Row: {
          color: string | null
          contact_count: number | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          contact_count?: number | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          contact_count?: number | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string | null
          created_at: string
          html_content: string
          id: string
          is_system_template: boolean | null
          name: string
          subject: string | null
          thumbnail_url: string | null
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          html_content: string
          id?: string
          is_system_template?: boolean | null
          name: string
          subject?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          html_content?: string
          id?: string
          is_system_template?: boolean | null
          name?: string
          subject?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

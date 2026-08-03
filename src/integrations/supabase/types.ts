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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          accent_color: string | null
          admin_notification_email: string | null
          booking_cutoff_hours: number
          booking_request_message: string | null
          bootstrap_completed: boolean
          business_hours: Json
          business_name: string
          cancellation_deadline_hours: number
          coach_name: string
          confirmation_public_message: string | null
          contact_email: string | null
          contact_instructions_after_cutoff: string | null
          contact_phone: string | null
          created_at: string
          default_location: string | null
          id: number
          logo_storage_path: string | null
          social_links: Json
          timezone: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          admin_notification_email?: string | null
          booking_cutoff_hours?: number
          booking_request_message?: string | null
          bootstrap_completed?: boolean
          business_hours?: Json
          business_name?: string
          cancellation_deadline_hours?: number
          coach_name?: string
          confirmation_public_message?: string | null
          contact_email?: string | null
          contact_instructions_after_cutoff?: string | null
          contact_phone?: string | null
          created_at?: string
          default_location?: string | null
          id: number
          logo_storage_path?: string | null
          social_links?: Json
          timezone?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          admin_notification_email?: string | null
          booking_cutoff_hours?: number
          booking_request_message?: string | null
          bootstrap_completed?: boolean
          business_hours?: Json
          business_name?: string
          cancellation_deadline_hours?: number
          coach_name?: string
          confirmation_public_message?: string | null
          contact_email?: string | null
          contact_instructions_after_cutoff?: string | null
          contact_phone?: string | null
          created_at?: string
          default_location?: string | null
          id?: number
          logo_storage_path?: string | null
          social_links?: Json
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: Database["public"]["Enums"]["actor_type"]
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["actor_type"]
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["actor_type"]
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_exceptions: {
        Row: {
          availability_rule_id: string
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          exception_date: string
          exception_type: Database["public"]["Enums"]["availability_exception_type"]
          id: string
          location: string | null
          max_slots: number | null
          price_cents: number | null
          reason: string | null
          start_time_local: string | null
        }
        Insert: {
          availability_rule_id: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          exception_date: string
          exception_type: Database["public"]["Enums"]["availability_exception_type"]
          id?: string
          location?: string | null
          max_slots?: number | null
          price_cents?: number | null
          reason?: string | null
          start_time_local?: string | null
        }
        Update: {
          availability_rule_id?: string
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          exception_date?: string
          exception_type?: Database["public"]["Enums"]["availability_exception_type"]
          id?: string
          location?: string | null
          max_slots?: number | null
          price_cents?: number | null
          reason?: string | null
          start_time_local?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_availability_rule_id_fkey"
            columns: ["availability_rule_id"]
            isOneToOne: false
            referencedRelation: "availability_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_exceptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_rules: {
        Row: {
          booking_cutoff_hours: number | null
          cancellation_deadline_hours: number | null
          created_at: string
          created_by: string | null
          days_of_week: number[]
          duration_minutes: number
          ends_on: string | null
          id: string
          is_active: boolean
          location: string | null
          max_slots: number | null
          mode: Database["public"]["Enums"]["availability_rule_mode"]
          price_cents: number | null
          session_id: string
          start_time_local: string
          starts_on: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          booking_cutoff_hours?: number | null
          cancellation_deadline_hours?: number | null
          created_at?: string
          created_by?: string | null
          days_of_week: number[]
          duration_minutes: number
          ends_on?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          max_slots?: number | null
          mode: Database["public"]["Enums"]["availability_rule_mode"]
          price_cents?: number | null
          session_id: string
          start_time_local: string
          starts_on: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          booking_cutoff_hours?: number | null
          cancellation_deadline_hours?: number | null
          created_at?: string
          created_by?: string | null
          days_of_week?: number[]
          duration_minutes?: number
          ends_on?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          max_slots?: number | null
          mode?: Database["public"]["Enums"]["availability_rule_mode"]
          price_cents?: number | null
          session_id?: string
          start_time_local?: string
          starts_on?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_history: {
        Row: {
          actor_id: string | null
          actor_type: Database["public"]["Enums"]["actor_type"]
          booking_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["booking_status"] | null
          id: string
          payload: Json
          to_status: Database["public"]["Enums"]["booking_status"] | null
        }
        Insert: {
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["actor_type"]
          booking_id: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["booking_status"] | null
          id?: string
          payload?: Json
          to_status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["actor_type"]
          booking_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["booking_status"] | null
          id?: string
          payload?: Json
          to_status?: Database["public"]["Enums"]["booking_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          admin_note: string | null
          amount_paid_cents: number | null
          cancel_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_note: string | null
          completed_at: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          created_by: string | null
          created_by_admin: boolean
          currency: string
          goal: string | null
          id: string
          no_show_marked_at: string | null
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_note: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_updated_by: string | null
          price_snapshot_cents: number
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          session_occurrence_id: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount_paid_cents?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_note?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          created_by?: string | null
          created_by_admin?: boolean
          currency?: string
          goal?: string | null
          id?: string
          no_show_marked_at?: string | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_updated_by?: string | null
          price_snapshot_cents: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          session_occurrence_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          amount_paid_cents?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_note?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          created_by?: string | null
          created_by_admin?: boolean
          currency?: string
          goal?: string | null
          id?: string
          no_show_marked_at?: string | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_note?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_updated_by?: string | null
          price_snapshot_cents?: number
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          session_occurrence_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_payment_updated_by_fkey"
            columns: ["payment_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_session_occurrence_id_fkey"
            columns: ["session_occurrence_id"]
            isOneToOne: false
            referencedRelation: "session_occurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_outbox: {
        Row: {
          created_at: string
          error: string | null
          id: string
          idempotency_key: string | null
          payload: Json
          provider_id: string | null
          status: Database["public"]["Enums"]["email_outbox_status"]
          template_key: string
          to_email: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key?: string | null
          payload?: Json
          provider_id?: string | null
          status?: Database["public"]["Enums"]["email_outbox_status"]
          template_key: string
          to_email: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key?: string | null
          payload?: Json
          provider_id?: string | null
          status?: Database["public"]["Enums"]["email_outbox_status"]
          template_key?: string
          to_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      login_events: {
        Row: {
          auth_method: string | null
          created_at: string
          email_attempted: string | null
          id: string
          ip_hash: string | null
          succeeded: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          auth_method?: string | null
          created_at?: string
          email_attempted?: string | null
          id?: string
          ip_hash?: string | null
          succeeded: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          auth_method?: string | null
          created_at?: string
          email_attempted?: string | null
          id?: string
          ip_hash?: string | null
          succeeded?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          address_line_1: string | null
          address_line_2: string | null
          avatar_storage_path: string | null
          ban_reason: string | null
          banned_at: string | null
          banned_by: string | null
          city: string | null
          country_code: string | null
          created_at: string
          display_name: string | null
          email: string
          first_name: string | null
          id: string
          is_banned: boolean
          last_name: string | null
          phone_country_code: string | null
          phone_number: string | null
          postal_code: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          role: Database["public"]["Enums"]["user_role"]
          state_or_region: string | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_storage_path?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          first_name?: string | null
          id: string
          is_banned?: boolean
          last_name?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          postal_code?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state_or_region?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_storage_path?: string | null
          ban_reason?: string | null
          banned_at?: string | null
          banned_by?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_banned?: boolean
          last_name?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          postal_code?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state_or_region?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_category_history: {
        Row: {
          action: string
          actor_id: string | null
          category_id: string | null
          changed_fields: Json
          created_at: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          category_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          category_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_category_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_category_history_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "session_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      session_history: {
        Row: {
          action: string
          actor_id: string | null
          changed_fields: Json
          created_at: string
          id: string
          session_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          session_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_occurrence_history: {
        Row: {
          action: string
          actor_id: string | null
          changed_fields: Json
          created_at: string
          id: string
          occurrence_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          occurrence_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          occurrence_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_occurrence_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrence_history_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "session_occurrences"
            referencedColumns: ["id"]
          },
        ]
      }
      session_occurrences: {
        Row: {
          availability_rule_id: string | null
          booked_count: number
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          detached_from_rule: boolean
          ends_at: string
          id: string
          image_storage_path: string | null
          is_active: boolean
          location: string | null
          max_slots: number
          price_cents: number
          session_id: string
          session_type_id: string
          starts_at: string
          status: Database["public"]["Enums"]["session_occurrence_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability_rule_id?: string | null
          booked_count?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          detached_from_rule?: boolean
          ends_at: string
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          location?: string | null
          max_slots: number
          price_cents: number
          session_id: string
          session_type_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["session_occurrence_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability_rule_id?: string | null
          booked_count?: number
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          detached_from_rule?: boolean
          ends_at?: string
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          location?: string | null
          max_slots?: number
          price_cents?: number
          session_id?: string
          session_type_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["session_occurrence_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_occurrences_availability_rule_id_fkey"
            columns: ["availability_rule_id"]
            isOneToOne: false
            referencedRelation: "availability_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrences_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrences_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrences_session_type_id_fkey"
            columns: ["session_type_id"]
            isOneToOne: false
            referencedRelation: "session_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_occurrences_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_type_history: {
        Row: {
          action: string
          actor_id: string | null
          changed_fields: Json
          created_at: string
          id: string
          session_type_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          session_type_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
          session_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_type_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_type_history_session_type_id_fkey"
            columns: ["session_type_id"]
            isOneToOne: false
            referencedRelation: "session_types"
            referencedColumns: ["id"]
          },
        ]
      }
      session_types: {
        Row: {
          base_price_cents: number
          category_id: string
          created_at: string
          created_by: string | null
          default_duration_minutes: number
          default_location: string | null
          default_max_slots: number
          description: string | null
          id: string
          image_storage_path: string | null
          is_active: boolean
          name: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          base_price_cents: number
          category_id: string
          created_at?: string
          created_by?: string | null
          default_duration_minutes: number
          default_location?: string | null
          default_max_slots: number
          description?: string | null
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          base_price_cents?: number
          category_id?: string
          created_at?: string
          created_by?: string | null
          default_duration_minutes?: number
          default_location?: string | null
          default_max_slots?: number
          description?: string | null
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_types_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "session_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          active_from: string | null
          active_until: string | null
          created_at: string
          created_by: string | null
          currency: string
          description: string | null
          id: string
          image_storage_path: string | null
          is_active: boolean
          location: string | null
          max_slots: number
          price_cents: number
          session_type_id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          location?: string | null
          max_slots: number
          price_cents: number
          session_type_id: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string | null
          id?: string
          image_storage_path?: string | null
          is_active?: boolean
          location?: string | null
          max_slots?: number
          price_cents?: number
          session_type_id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_session_type_id_fkey"
            columns: ["session_type_id"]
            isOneToOne: false
            referencedRelation: "session_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_history: {
        Row: {
          actor_id: string | null
          changed_fields: Json
          created_at: string
          id: string
        }
        Insert: {
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
        }
        Update: {
          actor_id?: string | null
          changed_fields?: Json
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_moderation_history: {
        Row: {
          action: Database["public"]["Enums"]["moderation_action"]
          actor_id: string | null
          created_at: string
          id: string
          new_is_banned: boolean | null
          new_status: Database["public"]["Enums"]["account_status"] | null
          previous_is_banned: boolean | null
          previous_status: Database["public"]["Enums"]["account_status"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["moderation_action"]
          actor_id?: string | null
          created_at?: string
          id?: string
          new_is_banned?: boolean | null
          new_status?: Database["public"]["Enums"]["account_status"] | null
          previous_is_banned?: boolean | null
          previous_status?: Database["public"]["Enums"]["account_status"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["moderation_action"]
          actor_id?: string | null
          created_at?: string
          id?: string
          new_is_banned?: boolean | null
          new_status?: Database["public"]["Enums"]["account_status"] | null
          previous_is_banned?: boolean | null
          previous_status?: Database["public"]["Enums"]["account_status"] | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_moderation_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_moderation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_history: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          previous_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          previous_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          previous_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_mutate_bookings: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      account_status: "active" | "rejected"
      actor_type: "user" | "admin" | "system" | "edge_function"
      availability_exception_type: "cancel" | "modify" | "block"
      availability_rule_mode: "date_range" | "ongoing"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled_by_client"
        | "cancelled_by_admin"
        | "rejected"
        | "no_show"
      email_outbox_status: "pending" | "sent" | "failed"
      moderation_action: "rejected" | "unrejected" | "banned" | "unbanned"
      payment_method: "cash" | "card_in_person" | "other"
      payment_status: "unpaid" | "paid" | "waived"
      session_occurrence_status:
        | "scheduled"
        | "cancelled"
        | "completed"
        | "blocked"
      user_role: "user" | "client" | "admin"
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
    Enums: {
      account_status: ["active", "rejected"],
      actor_type: ["user", "admin", "system", "edge_function"],
      availability_exception_type: ["cancel", "modify", "block"],
      availability_rule_mode: ["date_range", "ongoing"],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled_by_client",
        "cancelled_by_admin",
        "rejected",
        "no_show",
      ],
      email_outbox_status: ["pending", "sent", "failed"],
      moderation_action: ["rejected", "unrejected", "banned", "unbanned"],
      payment_method: ["cash", "card_in_person", "other"],
      payment_status: ["unpaid", "paid", "waived"],
      session_occurrence_status: [
        "scheduled",
        "cancelled",
        "completed",
        "blocked",
      ],
      user_role: ["user", "client", "admin"],
    },
  },
} as const

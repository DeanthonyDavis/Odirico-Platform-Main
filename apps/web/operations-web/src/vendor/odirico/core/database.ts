export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin" | "qa" | "designer" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin" | "qa" | "designer" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: "admin" | "qa" | "designer" | "viewer";
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          client_name: string;
          pole_code: string;
          status: "Submitted" | "In QA" | "Issues Found" | "Rework" | "Approved" | "Rejected";
          priority: "LOW" | "MED" | "HIGH";
          designer_id: string;
          qa_owner_id: string;
          created_by: string;
          current_revision: number;
          days_in_qa: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          pole_code: string;
          status?: "Submitted" | "In QA" | "Issues Found" | "Rework" | "Approved" | "Rejected";
          priority?: "LOW" | "MED" | "HIGH";
          designer_id: string;
          qa_owner_id: string;
          created_by: string;
          current_revision?: number;
          days_in_qa?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_name?: string;
          pole_code?: string;
          status?: "Submitted" | "In QA" | "Issues Found" | "Rework" | "Approved" | "Rejected";
          priority?: "LOW" | "MED" | "HIGH";
          designer_id?: string;
          qa_owner_id?: string;
          current_revision?: number;
          days_in_qa?: number;
          updated_at?: string;
        };
      };
      ticket_issues: {
        Row: {
          id: string;
          ticket_id: string;
          title: string;
          severity: "LOW" | "MED" | "HIGH";
          status: "Open" | "In Progress" | "Resolved";
          category: string;
          assigned_to: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          title: string;
          severity?: "LOW" | "MED" | "HIGH";
          status?: "Open" | "In Progress" | "Resolved";
          category: string;
          assigned_to?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          severity?: "LOW" | "MED" | "HIGH";
          status?: "Open" | "In Progress" | "Resolved";
          category?: string;
          assigned_to?: string | null;
        };
      };
      ticket_comments: {
        Row: {
          id: string;
          ticket_id: string;
          author_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          author_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          body?: string;
        };
      };
      ticket_events: {
        Row: {
          id: string;
          ticket_id: string;
          actor_id: string | null;
          event_type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          actor_id?: string | null;
          event_type: string;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          payload?: Json;
        };
      };
      billing_customers: {
        Row: {
          user_id: string;
          email: string | null;
          stripe_customer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          stripe_customer_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          stripe_customer_id?: string;
          updated_at?: string;
        };
      };
      billing_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          stripe_price_id: string | null;
          plan_key: "free" | "pro" | "semester";
          status:
            | "trialing"
            | "active"
            | "past_due"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "unpaid"
            | "paused";
          cancel_at_period_end: boolean;
          current_period_start: string | null;
          current_period_end: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          stripe_price_id?: string | null;
          plan_key?: "free" | "pro" | "semester";
          status:
            | "trialing"
            | "active"
            | "past_due"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "unpaid"
            | "paused";
          cancel_at_period_end?: boolean;
          current_period_start?: string | null;
          current_period_end?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_customer_id?: string;
          stripe_price_id?: string | null;
          plan_key?: "free" | "pro" | "semester";
          status?:
            | "trialing"
            | "active"
            | "past_due"
            | "canceled"
            | "incomplete"
            | "incomplete_expired"
            | "unpaid"
            | "paused";
          cancel_at_period_end?: boolean;
          current_period_start?: string | null;
          current_period_end?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
      };
      surge_companies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          normalized_name: string;
          category: string;
          location: string;
          website: string;
          priority: "high" | "med" | "low";
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          normalized_name: string;
          category?: string;
          location?: string;
          website?: string;
          priority?: "high" | "med" | "low";
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          normalized_name?: string;
          category?: string;
          location?: string;
          website?: string;
          priority?: "high" | "med" | "low";
          notes?: string;
          updated_at?: string;
        };
      };
      surge_roles: {
        Row: {
          id: string;
          owner_id: string;
          company_id: string;
          title: string;
          normalized_title: string;
          role_type: string;
          location: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          company_id: string;
          title: string;
          normalized_title: string;
          role_type?: string;
          location?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          normalized_title?: string;
          role_type?: string;
          location?: string;
          notes?: string;
          updated_at?: string;
        };
      };
      surge_applications: {
        Row: {
          id: string;
          owner_id: string;
          company_id: string;
          role_id: string;
          source: "linkedin" | "indeed" | "direct" | "email" | "browser" | "imported" | "other";
          status: "lead" | "applied" | "confirmed" | "review" | "recruiter" | "interview" | "offer" | "rejected" | "withdrawn";
          applied_at: string | null;
          source_url: string;
          location: string;
          compensation: string;
          next_step: string;
          next_step_at: string | null;
          notes: string;
          job_description: string;
          last_signal_at: string;
          workspace: Json;
          tailoring: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          company_id: string;
          role_id: string;
          source?: "linkedin" | "indeed" | "direct" | "email" | "browser" | "imported" | "other";
          status?: "lead" | "applied" | "confirmed" | "review" | "recruiter" | "interview" | "offer" | "rejected" | "withdrawn";
          applied_at?: string | null;
          source_url?: string;
          location?: string;
          compensation?: string;
          next_step?: string;
          next_step_at?: string | null;
          notes?: string;
          job_description?: string;
          last_signal_at?: string;
          workspace?: Json;
          tailoring?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          source?: "linkedin" | "indeed" | "direct" | "email" | "browser" | "imported" | "other";
          status?: "lead" | "applied" | "confirmed" | "review" | "recruiter" | "interview" | "offer" | "rejected" | "withdrawn";
          applied_at?: string | null;
          source_url?: string;
          location?: string;
          compensation?: string;
          next_step?: string;
          next_step_at?: string | null;
          notes?: string;
          job_description?: string;
          last_signal_at?: string;
          workspace?: Json;
          tailoring?: Json;
          updated_at?: string;
        };
      };
      surge_documents: {
        Row: {
          id: string;
          owner_id: string;
          application_id: string;
          document_type: string;
          stage: "working" | "final" | "extras";
          file_name: string;
          absolute_path: string;
          relative_path: string;
          extension: string;
          tags: Json;
          source_template: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          application_id: string;
          document_type: string;
          stage?: "working" | "final" | "extras";
          file_name: string;
          absolute_path?: string;
          relative_path?: string;
          extension?: string;
          tags?: Json;
          source_template?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          document_type?: string;
          stage?: "working" | "final" | "extras";
          file_name?: string;
          absolute_path?: string;
          relative_path?: string;
          extension?: string;
          tags?: Json;
          source_template?: string;
          updated_at?: string;
        };
      };
    };
  };
};

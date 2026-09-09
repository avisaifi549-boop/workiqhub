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
      applications: {
        Row: {
          bid_amount_inr: number | null
          cover_letter: string
          created_at: string
          delivery_days: number | null
          freelancer_id: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          bid_amount_inr?: number | null
          cover_letter?: string
          created_at?: string
          delivery_days?: number | null
          freelancer_id: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          bid_amount_inr?: number | null
          cover_letter?: string
          created_at?: string
          delivery_days?: number | null
          freelancer_id?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          client_type: string
          company_description: string | null
          company_logo_url: string | null
          company_name: string | null
          company_size: string | null
          company_website: string | null
          created_at: string
          hire_frequency: string
          industry: string | null
          is_public: boolean
          need_categories: string[]
          payment_verified: boolean
          preferred_experience: string
          typical_budget: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_type?: string
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          hire_frequency?: string
          industry?: string | null
          is_public?: boolean
          need_categories?: string[]
          payment_verified?: boolean
          preferred_experience?: string
          typical_budget?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_type?: string
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          hire_frequency?: string
          industry?: string | null
          is_public?: boolean
          need_categories?: string[]
          payment_verified?: boolean
          preferred_experience?: string
          typical_budget?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          amount_inr: number
          application_id: string | null
          client_id: string
          completed_at: string | null
          created_at: string
          deadline: string | null
          description: string
          freelancer_id: string
          id: string
          job_id: string | null
          status: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at: string
        }
        Insert: {
          amount_inr?: number
          application_id?: string | null
          client_id: string
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          freelancer_id: string
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          title: string
          updated_at?: string
        }
        Update: {
          amount_inr?: number
          application_id?: string | null
          client_id?: string
          completed_at?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          freelancer_id?: string
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          achievements: string
          availability: string
          bio: string
          category_id: string | null
          certifications: Json
          companies: Json
          created_at: string
          education: Json
          email_verified: boolean
          employment_status: string
          experience_level: string
          headline: string
          hourly_rate_inr: number | null
          is_public: boolean
          is_published: boolean
          languages: string[]
          min_project_budget_inr: number | null
          plan: Database["public"]["Enums"]["plan_tier"]
          preferred_project_size: string
          response_time_hours: number | null
          skills: string[]
          slug: string
          starting_price_inr: number | null
          updated_at: string
          user_id: string
          verification: Database["public"]["Enums"]["verification_level"]
          working_hours: string | null
          years_experience: number | null
        }
        Insert: {
          achievements?: string
          availability?: string
          bio?: string
          category_id?: string | null
          certifications?: Json
          companies?: Json
          created_at?: string
          education?: Json
          email_verified?: boolean
          employment_status?: string
          experience_level?: string
          headline?: string
          hourly_rate_inr?: number | null
          is_public?: boolean
          is_published?: boolean
          languages?: string[]
          min_project_budget_inr?: number | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          preferred_project_size?: string
          response_time_hours?: number | null
          skills?: string[]
          slug: string
          starting_price_inr?: number | null
          updated_at?: string
          user_id: string
          verification?: Database["public"]["Enums"]["verification_level"]
          working_hours?: string | null
          years_experience?: number | null
        }
        Update: {
          achievements?: string
          availability?: string
          bio?: string
          category_id?: string | null
          certifications?: Json
          companies?: Json
          created_at?: string
          education?: Json
          email_verified?: boolean
          employment_status?: string
          experience_level?: string
          headline?: string
          hourly_rate_inr?: number | null
          is_public?: boolean
          is_published?: boolean
          languages?: string[]
          min_project_budget_inr?: number | null
          plan?: Database["public"]["Enums"]["plan_tier"]
          preferred_project_size?: string
          response_time_hours?: number | null
          skills?: string[]
          slug?: string
          starting_price_inr?: number | null
          updated_at?: string
          user_id?: string
          verification?: Database["public"]["Enums"]["verification_level"]
          working_hours?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_profiles_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          budget_max_inr: number | null
          budget_min_inr: number | null
          category_id: string | null
          client_id: string
          created_at: string
          description: string
          experience_level: string
          id: string
          location: string | null
          project_type: string
          skills: string[]
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          timeline_weeks: number | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max_inr?: number | null
          budget_min_inr?: number | null
          category_id?: string | null
          client_id: string
          created_at?: string
          description?: string
          experience_level?: string
          id?: string
          location?: string | null
          project_type?: string
          skills?: string[]
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          timeline_weeks?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max_inr?: number | null
          budget_min_inr?: number | null
          category_id?: string | null
          client_id?: string
          created_at?: string
          description?: string
          experience_level?: string
          id?: string
          location?: string | null
          project_type?: string
          skills?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          timeline_weeks?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          amount_inr: number
          contract_id: string
          created_at: string
          due_date: string | null
          id: string
          sort_order: number
          status: Database["public"]["Enums"]["milestone_status"]
          submitted_note: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amount_inr?: number
          contract_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          submitted_note?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amount_inr?: number
          contract_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          submitted_note?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          budget_inr: number | null
          category_id: string | null
          client_type: string | null
          contract_id: string | null
          created_at: string
          description: string
          duration_weeks: number | null
          id: string
          image_url: string | null
          images: string[]
          is_verified: boolean
          my_role: string | null
          outcome: string | null
          project_type: string | null
          project_url: string | null
          skills: string[]
          sort_order: number
          technologies: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_inr?: number | null
          category_id?: string | null
          client_type?: string | null
          contract_id?: string | null
          created_at?: string
          description?: string
          duration_weeks?: number | null
          id?: string
          image_url?: string | null
          images?: string[]
          is_verified?: boolean
          my_role?: string | null
          outcome?: string | null
          project_type?: string | null
          project_url?: string | null
          skills?: string[]
          sort_order?: number
          technologies?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_inr?: number | null
          category_id?: string | null
          client_type?: string | null
          contract_id?: string | null
          created_at?: string
          description?: string
          duration_weeks?: number | null
          id?: string
          image_url?: string | null
          images?: string[]
          is_verified?: boolean
          my_role?: string | null
          outcome?: string | null
          project_type?: string | null
          project_url?: string | null
          skills?: string[]
          sort_order?: number
          technologies?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_items_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_items_user_id_freelancer_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string
          id: string
          languages: string[]
          location: string | null
          onboarding_complete: boolean
          onboarding_step: number
          phone: string | null
          phone_verified: boolean
          timezone: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id: string
          languages?: string[]
          location?: string | null
          onboarding_complete?: boolean
          onboarding_step?: number
          phone?: string | null
          phone_verified?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          id?: string
          languages?: string[]
          location?: string | null
          onboarding_complete?: boolean
          onboarding_step?: number
          phone?: string | null
          phone_verified?: boolean
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string
          id: string
          reason: string
          reporter_id: string
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          details?: string
          id?: string
          reason: string
          reporter_id: string
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          details?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          communication: number | null
          contract_id: string
          created_at: string
          direction: Database["public"]["Enums"]["review_direction"]
          id: string
          is_hidden: boolean
          professionalism: number | null
          quality: number | null
          rating: number
          reviewee_id: string
          reviewer_id: string
          timeliness: number | null
          title: string
          updated_at: string
          value_for_money: number | null
        }
        Insert: {
          body?: string
          communication?: number | null
          contract_id: string
          created_at?: string
          direction: Database["public"]["Enums"]["review_direction"]
          id?: string
          is_hidden?: boolean
          professionalism?: number | null
          quality?: number | null
          rating: number
          reviewee_id: string
          reviewer_id: string
          timeliness?: number | null
          title?: string
          updated_at?: string
          value_for_money?: number | null
        }
        Update: {
          body?: string
          communication?: number | null
          contract_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["review_direction"]
          id?: string
          is_hidden?: boolean
          professionalism?: number | null
          quality?: number | null
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          timeliness?: number | null
          title?: string
          updated_at?: string
          value_for_money?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_freelancers: {
        Row: {
          created_at: string
          freelancer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          freelancer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          freelancer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_freelancers_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          delivery_days: number | null
          description: string
          freelancer_id: string
          id: string
          is_published: boolean
          pricing_type: string
          skills: string[]
          slug: string
          sort_order: number
          starting_price_inr: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          delivery_days?: number | null
          description?: string
          freelancer_id: string
          id?: string
          is_published?: boolean
          pricing_type?: string
          skills?: string[]
          slug: string
          sort_order?: number
          starting_price_inr?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          delivery_days?: number | null
          description?: string
          freelancer_id?: string
          id?: string
          is_published?: boolean
          pricing_type?: string
          skills?: string[]
          slug?: string
          sort_order?: number
          starting_price_inr?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "freelancer" | "client"
      app_role: "admin" | "moderator" | "user"
      application_status:
        | "submitted"
        | "shortlisted"
        | "interview"
        | "hired"
        | "rejected"
        | "withdrawn"
      contract_status:
        | "hired"
        | "contracted"
        | "milestone_funded"
        | "in_progress"
        | "submitted"
        | "revision_requested"
        | "completed"
        | "cancelled"
        | "disputed"
      job_status:
        | "draft"
        | "published"
        | "shortlisting"
        | "interview"
        | "hired"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      milestone_status:
        | "pending"
        | "funded"
        | "submitted"
        | "approved"
        | "released"
        | "cancelled"
      plan_tier: "free" | "starter" | "pro" | "elite"
      review_direction: "client_to_freelancer" | "freelancer_to_client"
      verification_level:
        | "none"
        | "identity_verified"
        | "skill_verified"
        | "top_talent"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      account_type: ["freelancer", "client"],
      app_role: ["admin", "moderator", "user"],
      application_status: [
        "submitted",
        "shortlisted",
        "interview",
        "hired",
        "rejected",
        "withdrawn",
      ],
      contract_status: [
        "hired",
        "contracted",
        "milestone_funded",
        "in_progress",
        "submitted",
        "revision_requested",
        "completed",
        "cancelled",
        "disputed",
      ],
      job_status: [
        "draft",
        "published",
        "shortlisting",
        "interview",
        "hired",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      milestone_status: [
        "pending",
        "funded",
        "submitted",
        "approved",
        "released",
        "cancelled",
      ],
      plan_tier: ["free", "starter", "pro", "elite"],
      review_direction: ["client_to_freelancer", "freelancer_to_client"],
      verification_level: [
        "none",
        "identity_verified",
        "skill_verified",
        "top_talent",
      ],
    },
  },
} as const

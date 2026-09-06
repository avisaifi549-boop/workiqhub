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
      freelancer_profiles: {
        Row: {
          availability: string
          bio: string
          category_id: string | null
          created_at: string
          headline: string
          hourly_rate_inr: number | null
          is_published: boolean
          languages: string[]
          plan: Database["public"]["Enums"]["plan_tier"]
          response_time_hours: number | null
          skills: string[]
          slug: string
          starting_price_inr: number | null
          updated_at: string
          user_id: string
          verification: Database["public"]["Enums"]["verification_level"]
          years_experience: number | null
        }
        Insert: {
          availability?: string
          bio?: string
          category_id?: string | null
          created_at?: string
          headline?: string
          hourly_rate_inr?: number | null
          is_published?: boolean
          languages?: string[]
          plan?: Database["public"]["Enums"]["plan_tier"]
          response_time_hours?: number | null
          skills?: string[]
          slug: string
          starting_price_inr?: number | null
          updated_at?: string
          user_id: string
          verification?: Database["public"]["Enums"]["verification_level"]
          years_experience?: number | null
        }
        Update: {
          availability?: string
          bio?: string
          category_id?: string | null
          created_at?: string
          headline?: string
          hourly_rate_inr?: number | null
          is_published?: boolean
          languages?: string[]
          plan?: Database["public"]["Enums"]["plan_tier"]
          response_time_hours?: number | null
          skills?: string[]
          slug?: string
          starting_price_inr?: number | null
          updated_at?: string
          user_id?: string
          verification?: Database["public"]["Enums"]["verification_level"]
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
      portfolio_items: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          outcome: string | null
          project_url: string | null
          sort_order: number
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          outcome?: string | null
          project_url?: string | null
          sort_order?: number
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          outcome?: string | null
          project_url?: string | null
          sort_order?: number
          title?: string
          user_id?: string
        }
        Relationships: [
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
          created_at: string
          full_name: string
          id: string
          location: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          location?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          location?: string | null
          updated_at?: string
        }
        Relationships: []
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
      plan_tier: "free" | "starter" | "pro" | "elite"
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
      plan_tier: ["free", "starter", "pro", "elite"],
      verification_level: [
        "none",
        "identity_verified",
        "skill_verified",
        "top_talent",
      ],
    },
  },
} as const

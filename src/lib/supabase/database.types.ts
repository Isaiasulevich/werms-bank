export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      employees: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          hire_date: string | null
          id: string
          lifetime_earned: Json
          manager_id: string | null
          name: string
          permissions:
            | Database["public"]["Enums"]["employee_permission"][]
            | null
          role: string | null
          slack_username: string | null
          updated_at: string
          werm_balances: Json
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          hire_date?: string | null
          id: string
          lifetime_earned?: Json
          manager_id?: string | null
          name: string
          permissions?:
            | Database["public"]["Enums"]["employee_permission"][]
            | null
          role?: string | null
          slack_username?: string | null
          updated_at?: string
          werm_balances?: Json
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          hire_date?: string | null
          id?: string
          lifetime_earned?: Json
          manager_id?: string | null
          name?: string
          permissions?:
            | Database["public"]["Enums"]["employee_permission"][]
            | null
          role?: string | null
          slack_username?: string | null
          updated_at?: string
          werm_balances?: Json
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          approval_required: boolean
          bronze_reward: number
          category: string
          created_at: string
          created_by: Json
          description: string
          effective_at: string
          execution_mode: string
          expires_at: string | null
          gold_reward: number
          id: string
          is_system_policy: boolean
          metadata: Json
          operation: string
          silver_reward: number
          status: string
          target_type: string
          target_values: Json
          title: string
          updated_at: string
        }
        Insert: {
          approval_required?: boolean
          bronze_reward?: number
          category: string
          created_at?: string
          created_by: Json
          description: string
          effective_at: string
          execution_mode?: string
          expires_at?: string | null
          gold_reward?: number
          id?: string
          is_system_policy?: boolean
          metadata?: Json
          operation: string
          silver_reward?: number
          status?: string
          target_type?: string
          target_values?: Json
          title: string
          updated_at?: string
        }
        Update: {
          approval_required?: boolean
          bronze_reward?: number
          category?: string
          created_at?: string
          created_by?: Json
          description?: string
          effective_at?: string
          execution_mode?: string
          expires_at?: string | null
          gold_reward?: number
          id?: string
          is_system_policy?: boolean
          metadata?: Json
          operation?: string
          silver_reward?: number
          status?: string
          target_type?: string
          target_values?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      werm_transactions: {
        Row: {
          amount: number | null
          breakdown: Json | null
          created_at: string
          description: string | null
          id: string
          policy_id: string | null
          receiver_id: string | null
          receiver_username: string
          sender_email: string
          sender_id: string | null
          source: string | null
          status: string | null
          total_werms: number
          value_aud: number
          werm_type: string | null
        }
        Insert: {
          amount?: number | null
          breakdown?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          policy_id?: string | null
          receiver_id?: string | null
          receiver_username: string
          sender_email: string
          sender_id?: string | null
          source?: string | null
          status?: string | null
          total_werms?: number
          value_aud?: number
          werm_type?: string | null
        }
        Update: {
          amount?: number | null
          breakdown?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          policy_id?: string | null
          receiver_id?: string | null
          receiver_username?: string
          sender_email?: string
          sender_id?: string | null
          source?: string | null
          status?: string | null
          total_werms?: number
          value_aud?: number
          werm_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "werm_transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "werm_transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employee_permission:
        | "admin"
        | "approve_distributions"
        | "view_all_balances"
        | "view_own_balance"
        | "view_team_balances"
        | "approve_small_distributions"
      werm_tier: "gold" | "silver" | "bronze"
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
      employee_permission: [
        "admin",
        "approve_distributions",
        "view_all_balances",
        "view_own_balance",
        "view_team_balances",
        "approve_small_distributions",
      ],
      werm_tier: ["gold", "silver", "bronze"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_credentials: {
        Row: {
          completion_date: string | null
          created_at: string | null
          credential_type: string
          description: string | null
          id: string
          institution: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          credential_type: string
          description?: string | null
          id?: string
          institution?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          credential_type?: string
          description?: string | null
          id?: string
          institution?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      candidate_profiles: {
        Row: {
          city: string | null
          created_at: string | null
          current_job_description: string | null
          current_job_duration: string | null
          current_job_title: string | null
          currently_employed: boolean | null
          department: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_completion_percentage: number | null
          profile_photo_url: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          current_job_description?: string | null
          current_job_duration?: string | null
          current_job_title?: string | null
          currently_employed?: boolean | null
          department?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          profile_photo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          current_job_description?: string | null
          current_job_duration?: string | null
          current_job_title?: string | null
          currently_employed?: boolean | null
          department?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          profile_photo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          company_description: string | null
          company_name: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          contact_phone: string | null
          created_at: string | null
          employee_benefits: string | null
          id: string
          logo_url: string | null
        }
        Insert: {
          company_description?: string | null
          company_name?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          employee_benefits?: string | null
          id: string
          logo_url?: string | null
        }
        Update: {
          company_description?: string | null
          company_name?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          employee_benefits?: string | null
          id?: string
          logo_url?: string | null
        }
        Relationships: []
      }
      Offres: {
        Row: {
          created_at: string
          "Date de début": string | null
          "Description des missions": string | null
          "Expérience requise": string | null
          id: number
          "id entreprise": string | null
          Lieu: string | null
          "Profile recherché": string | null
          "Salaire maximum": number | null
          "Salaire minimum": number | null
          Statut: string | null
          "titre du poste": string | null
        }
        Insert: {
          created_at?: string
          "Date de début"?: string | null
          "Description des missions"?: string | null
          "Expérience requise"?: string | null
          id?: number
          "id entreprise"?: string | null
          Lieu?: string | null
          "Profile recherché"?: string | null
          "Salaire maximum"?: number | null
          "Salaire minimum"?: number | null
          Statut?: string | null
          "titre du poste"?: string | null
        }
        Update: {
          created_at?: string
          "Date de début"?: string | null
          "Description des missions"?: string | null
          "Expérience requise"?: string | null
          id?: number
          "id entreprise"?: string | null
          Lieu?: string | null
          "Profile recherché"?: string | null
          "Salaire maximum"?: number | null
          "Salaire minimum"?: number | null
          Statut?: string | null
          "titre du poste"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Offres_id entreprise_fkey"
            columns: ["id entreprise"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_experiences: {
        Row: {
          company_name: string | null
          created_at: string | null
          id: string
          job_description: string | null
          job_duration: string | null
          job_title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          job_description?: string | null
          job_duration?: string | null
          job_title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          job_description?: string | null
          job_duration?: string | null
          job_title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_account: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

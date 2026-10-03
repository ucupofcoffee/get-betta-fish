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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          is_active?: boolean
          name: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessors: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          photo_path: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          photo_path?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          photo_path?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      fish_media: {
        Row: {
          alt_text: string | null
          created_at: string
          fish_id: string
          id: string
          media_type: Database["public"]["Enums"]["fish_media_type"]
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          fish_id: string
          id?: string
          media_type?: Database["public"]["Enums"]["fish_media_type"]
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          fish_id?: string
          id?: string
          media_type?: Database["public"]["Enums"]["fish_media_type"]
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "fish_media_fish_id_fkey"
            columns: ["fish_id"]
            isOneToOne: false
            referencedRelation: "fishes"
            referencedColumns: ["id"]
          },
        ]
      }
      fishes: {
        Row: {
          assessor_id: string | null
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          gbf_point: number | null
          id: string
          pattern: string | null
          price: number
          published_at: string | null
          sex: string | null
          size_cm: number | null
          slug: string
          status: Database["public"]["Enums"]["fish_status"]
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assessor_id?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gbf_point?: number | null
          id?: string
          pattern?: string | null
          price: number
          published_at?: string | null
          sex?: string | null
          size_cm?: number | null
          slug: string
          status?: Database["public"]["Enums"]["fish_status"]
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assessor_id?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gbf_point?: number | null
          id?: string
          pattern?: string | null
          price?: number
          published_at?: string | null
          sex?: string | null
          size_cm?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["fish_status"]
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fishes_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "assessors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_links: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          platform: Database["public"]["Enums"]["product_platform"]
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform: Database["public"]["Enums"]["product_platform"]
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: Database["public"]["Enums"]["product_platform"]
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_links_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_path: string | null
          name: string
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          name: string
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_path?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      water_standard_ranges: {
        Row: {
          created_at: string
          id: string
          max_value: number | null
          min_value: number | null
          parameter: Database["public"]["Enums"]["water_parameter"]
          priority: number
          status: string
          water_standard_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter: Database["public"]["Enums"]["water_parameter"]
          priority?: number
          status: string
          water_standard_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          parameter?: Database["public"]["Enums"]["water_parameter"]
          priority?: number
          status?: string
          water_standard_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_standard_ranges_water_standard_id_fkey"
            columns: ["water_standard_id"]
            isOneToOne: false
            referencedRelation: "water_standards"
            referencedColumns: ["id"]
          },
        ]
      }
      water_standards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      water_test_reference_sets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      water_test_reference_values: {
        Row: {
          created_at: string
          id: string
          lab_a: number
          lab_b: number
          lab_l: number
          parameter: Database["public"]["Enums"]["water_parameter"]
          reference_set_id: string
          sort_order: number
          unit: string | null
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          lab_a: number
          lab_b: number
          lab_l: number
          parameter: Database["public"]["Enums"]["water_parameter"]
          reference_set_id: string
          sort_order?: number
          unit?: string | null
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          lab_a?: number
          lab_b?: number
          lab_l?: number
          parameter?: Database["public"]["Enums"]["water_parameter"]
          reference_set_id?: string
          sort_order?: number
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "water_test_reference_values_reference_set_id_fkey"
            columns: ["reference_set_id"]
            isOneToOne: false
            referencedRelation: "water_test_reference_sets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_active_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      admin_role: "OWNER" | "ADMIN"
      article_status: "DRAFT" | "PUBLISHED"
      fish_media_type: "IMAGE" | "VIDEO"
      fish_status: "DRAFT" | "AVAILABLE" | "SOLD"
      product_platform: "TIKTOK_SHOP" | "TOKOPEDIA" | "SHOPEE" | "OTHER"
      product_status: "DRAFT" | "ACTIVE" | "HIDDEN"
      water_parameter: "KH" | "PH" | "GH" | "CHLORINE" | "NITRATE" | "NITRITE"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      admin_role: ["OWNER", "ADMIN"],
      article_status: ["DRAFT", "PUBLISHED"],
      fish_media_type: ["IMAGE", "VIDEO"],
      fish_status: ["DRAFT", "AVAILABLE", "SOLD"],
      product_platform: ["TIKTOK_SHOP", "TOKOPEDIA", "SHOPEE", "OTHER"],
      product_status: ["DRAFT", "ACTIVE", "HIDDEN"],
      water_parameter: ["KH", "PH", "GH", "CHLORINE", "NITRATE", "NITRITE"],
    },
  },
} as const

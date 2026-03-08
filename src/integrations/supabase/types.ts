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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blue_bills: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          invitation_id: string
          message: string | null
          person_name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id: string
          message?: string | null
          person_name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id?: string
          message?: string | null
          person_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "blue_bills_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      candles: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          invitation_id: string
          message: string | null
          person_name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id: string
          message?: string | null
          person_name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id?: string
          message?: string | null
          person_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "candles_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_admins: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          invitation_id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          invitation_id: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          invitation_id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_admins_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      dress_code_colors: {
        Row: {
          color_hex: string
          color_name: string | null
          created_at: string
          description: string | null
          id: string
          invitation_id: string
          sort_order: number
        }
        Insert: {
          color_hex: string
          color_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id: string
          sort_order?: number
        }
        Update: {
          color_hex?: string
          color_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "dress_code_colors_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          invitation_id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          invitation_id: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          invitation_id?: string
          question?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "faqs_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          invitation_id: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          invitation_id: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          invitation_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          invitation_id: string
          item_name: string
          link_label: string | null
          link_url: string | null
          sort_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id: string
          item_name: string
          link_label?: string | null
          link_url?: string | null
          sort_order?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invitation_id?: string
          item_name?: string
          link_label?: string | null
          link_url?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gift_items_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          invitation_code: string
          invitation_id: string
          max_companions: number | null
          personal_message: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          invitation_code?: string
          invitation_id: string
          max_companions?: number | null
          personal_message?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          invitation_code?: string
          invitation_id?: string
          max_companions?: number | null
          personal_message?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_pages: {
        Row: {
          created_at: string
          custom_title: string | null
          id: string
          invitation_id: string
          is_enabled: boolean
          page_type: Database["public"]["Enums"]["page_type"]
          sort_order: number
          style_variant: Database["public"]["Enums"]["style_variant"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_title?: string | null
          id?: string
          invitation_id: string
          is_enabled?: boolean
          page_type: Database["public"]["Enums"]["page_type"]
          sort_order?: number
          style_variant?: Database["public"]["Enums"]["style_variant"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_title?: string | null
          id?: string
          invitation_id?: string
          is_enabled?: boolean
          page_type?: Database["public"]["Enums"]["page_type"]
          sort_order?: number
          style_variant?: Database["public"]["Enums"]["style_variant"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_pages_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_themes: {
        Row: {
          background_opacity: number | null
          background_type: string | null
          background_value: string | null
          color_accent: string | null
          color_primary: string | null
          color_secondary: string | null
          color_text_primary: string | null
          color_text_secondary: string | null
          created_at: string
          font_body: string | null
          font_title: string | null
          glassmorphism_enabled: boolean | null
          id: string
          invitation_id: string
          music_autoplay: boolean | null
          music_loop: boolean | null
          music_url: string | null
          music_volume: number | null
          page_transition: string | null
          particle_effect: string | null
          updated_at: string
        }
        Insert: {
          background_opacity?: number | null
          background_type?: string | null
          background_value?: string | null
          color_accent?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          color_text_primary?: string | null
          color_text_secondary?: string | null
          created_at?: string
          font_body?: string | null
          font_title?: string | null
          glassmorphism_enabled?: boolean | null
          id?: string
          invitation_id: string
          music_autoplay?: boolean | null
          music_loop?: boolean | null
          music_url?: string | null
          music_volume?: number | null
          page_transition?: string | null
          particle_effect?: string | null
          updated_at?: string
        }
        Update: {
          background_opacity?: number | null
          background_type?: string | null
          background_value?: string | null
          color_accent?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          color_text_primary?: string | null
          color_text_secondary?: string | null
          created_at?: string
          font_body?: string | null
          font_title?: string | null
          glassmorphism_enabled?: boolean | null
          id?: string
          invitation_id?: string
          music_autoplay?: boolean | null
          music_loop?: boolean | null
          music_url?: string | null
          music_volume?: number | null
          page_transition?: string | null
          particle_effect?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitation_themes_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: true
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          admin_user_id: string
          celebrant_name: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          entourage_title: string | null
          event_date: string | null
          event_end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          expires_at: string | null
          id: string
          invitation_message: string | null
          is_password_protected: boolean
          is_published: boolean
          password_hash: string | null
          slug: string
          title: string
          updated_at: string
          venue_address: string | null
          venue_lat: number | null
          venue_lng: number | null
          venue_map_url: string | null
          venue_name: string | null
        }
        Insert: {
          admin_user_id: string
          celebrant_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          entourage_title?: string | null
          event_date?: string | null
          event_end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          expires_at?: string | null
          id?: string
          invitation_message?: string | null
          is_password_protected?: boolean
          is_published?: boolean
          password_hash?: string | null
          slug: string
          title: string
          updated_at?: string
          venue_address?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          venue_map_url?: string | null
          venue_name?: string | null
        }
        Update: {
          admin_user_id?: string
          celebrant_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          entourage_title?: string | null
          event_date?: string | null
          event_end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          expires_at?: string | null
          id?: string
          invitation_message?: string | null
          is_password_protected?: boolean
          is_published?: boolean
          password_hash?: string | null
          slug?: string
          title?: string
          updated_at?: string
          venue_address?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          venue_map_url?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roses: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          invitation_id: string
          person_name: string
          role_description: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id: string
          person_name: string
          role_description?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          invitation_id?: string
          person_name?: string
          role_description?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "roses_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          created_at: string
          dietary_notes: string | null
          guest_id: string
          id: string
          invitation_id: string
          is_message_approved: boolean | null
          message: string | null
          num_companions: number | null
          responded_at: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          dietary_notes?: string | null
          guest_id: string
          id?: string
          invitation_id: string
          is_message_approved?: boolean | null
          message?: string | null
          num_companions?: number | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          dietary_notes?: string | null
          guest_id?: string
          id?: string
          invitation_id?: string
          is_message_approved?: boolean | null
          message?: string | null
          num_companions?: number | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          event_time: string | null
          icon: string | null
          id: string
          invitation_id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          invitation_id: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_time?: string | null
          icon?: string | null
          id?: string
          invitation_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      treasures: {
        Row: {
          created_at: string
          gift_description: string | null
          id: string
          image_url: string | null
          invitation_id: string
          person_name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          gift_description?: string | null
          id?: string
          image_url?: string | null
          invitation_id: string
          person_name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          gift_description?: string | null
          id?: string
          image_url?: string | null
          invitation_id?: string
          person_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "treasures_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      customer_admins_public: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string | null
          invitation_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          invitation_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          invitation_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_admins_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      app_role: "admin" | "moderator" | "user"
      event_type: "debut" | "wedding" | "birthday" | "christening" | "corporate"
      page_type:
        | "cover"
        | "message"
        | "countdown"
        | "location"
        | "timeline"
        | "roses"
        | "candles"
        | "treasures"
        | "blue_bills"
        | "dress_code"
        | "gallery"
        | "gift_guide"
        | "faq"
        | "rsvp"
      rsvp_status: "pending" | "attending" | "not_attending" | "maybe"
      style_variant: "classic" | "modern" | "elegant" | "bold"
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
      app_role: ["admin", "moderator", "user"],
      event_type: ["debut", "wedding", "birthday", "christening", "corporate"],
      page_type: [
        "cover",
        "message",
        "countdown",
        "location",
        "timeline",
        "roses",
        "candles",
        "treasures",
        "blue_bills",
        "dress_code",
        "gallery",
        "gift_guide",
        "faq",
        "rsvp",
      ],
      rsvp_status: ["pending", "attending", "not_attending", "maybe"],
      style_variant: ["classic", "modern", "elegant", "bold"],
    },
  },
} as const

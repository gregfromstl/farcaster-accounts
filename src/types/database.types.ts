export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          custody_address: string
          fid: number
          private_key: string
          signer_uuid: string | null
        }
        Insert: {
          created_at?: string
          custody_address: string
          fid?: number
          private_key: string
          signer_uuid?: string | null
        }
        Update: {
          created_at?: string
          custody_address?: string
          fid?: number
          private_key?: string
          signer_uuid?: string | null
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


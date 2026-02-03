import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for server components (only use in server components)
export const createServerClient = () => {
  // This should only be called in server components
  const { cookies } = require('next/headers')
  return createServerComponentClient({ cookies })
}

// Client for client components
export const createBrowserClient = () => {
  return createClientComponentClient()
}

// Admin client with service role key (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string
          role_id: number
          parent_id: string | null
          commission_rate: number | null
          total_commission: number | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone: string
          role_id: number
          parent_id?: string | null
          commission_rate?: number | null
          total_commission?: number | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string
          role_id?: number
          parent_id?: string | null
          commission_rate?: number | null
          total_commission?: number | null
          address?: string | null
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
        }
      }
      sectors: {
        Row: {
          id: number
          name: string
          description: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          image?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          sector_id: number
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          sector_id: number
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          sector_id?: number
          image?: string | null
          updated_at?: string
        }
      }
      contents: {
        Row: {
          id: number
          title: string
          content: string
          image: string | null
          brand: string | null
          category: string | null
          sector_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          image?: string | null
          brand?: string | null
          category?: string | null
          sector_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          image?: string | null
          brand?: string | null
          category?: string | null
          sector_id?: number
          updated_at?: string
        }
      }
    }
  }
}
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
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          email: string | null
          address: string | null
          role: 'customer' | 'owner'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          role?: 'customer' | 'owner'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          role?: 'customer' | 'owner'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string | null
          customer_email: string | null
          delivery_address: string | null
          delivery_date: string
          status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          notes: string | null
          total: number
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone?: string | null
          customer_email?: string | null
          delivery_address?: string | null
          delivery_date: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          notes?: string | null
          total?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string | null
          customer_email?: string | null
          delivery_address?: string | null
          delivery_date?: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'
          notes?: string | null
          total?: number
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
      }
      working_hours: {
        Row: {
          id: string
          day_of_week: number
          open_time: string | null
          close_time: string | null
          is_closed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          open_time?: string | null
          close_time?: string | null
          is_closed?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type Customer = Database['public']['Tables']['customers']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type WorkingHour = Database['public']['Tables']['working_hours']['Row']

export type OrderStatus = Order['status']
export type UserRole = Profile['role']
